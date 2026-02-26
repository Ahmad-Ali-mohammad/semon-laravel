<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TwoFactorController extends Controller
{
    /**
     * Generate 2FA setup secret and QR code
     */
    public function getTwoFactorStatus(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json([
            'two_factor_enabled' => (bool) $user->two_factor_enabled,
        ]);
    }

    /**
     * Generate 2FA setup secret and QR code
     */
    public function setup(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Only admin/manager users can enable 2FA
        if (!in_array($user->role, ['admin', 'manager'])) {
            return response()->json(['message' => '2FA not available for your role'], 403);
        }

        // Generate secret key
        $secret = $this->generateSecretKey();
        $user->two_factor_secret = encrypt($secret);
        $user->two_factor_enabled = false;
        $user->save();

        // Generate QR code URL
        $qrUrl = $this->generateQrCodeUrl($user->email, $secret, config('app.name'));

        return response()->json([
            'secret' => $secret, // Only show once during setup
            'qr_code_url' => $qrUrl,
            'backup_codes' => $this->generateBackupCodes(),
            'instructions' => 'Scan QR code with authenticator app, then enter verification code to enable 2FA.'
        ]);
    }

    /**
     * Enable 2FA with verification code
     */
    public function enable(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string', 'digits:6'],
        ]);

        $user = $request->user();
        
        if (!in_array($user->role, ['admin', 'manager'])) {
            return response()->json(['message' => '2FA not available for your role'], 403);
        }

        if (!$user->two_factor_secret) {
            return response()->json(['message' => '2FA setup required'], 400);
        }

        $secret = decrypt($user->two_factor_secret);
        
        if (!$this->verifyCode($secret, $request->code)) {
            return response()->json(['message' => 'Invalid verification code'], 422);
        }

        $user->two_factor_enabled = true;
        $user->two_factor_backup_codes = encrypt(json_encode($this->generateBackupCodes()));
        $user->save();

        // Clear any existing 2FA sessions
        Cache::forget("2fa_{$user->id}");

        return response()->json([
            'message' => '2FA enabled successfully',
            'backup_codes_count' => 10
        ]);
    }

    /**
     * Disable 2FA
     */
    public function disable(Request $request)
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        $user = $request->user();
        
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid password'], 422);
        }

        $user->two_factor_enabled = false;
        $user->two_factor_secret = null;
        $user->two_factor_backup_codes = null;
        $user->save();

        Cache::forget("2fa_{$user->id}");

        return response()->json(['message' => '2FA disabled successfully']);
    }

    /**
     * Verify 2FA code during login
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string', 'digits:6'],
            'user_id' => ['required', 'integer'],
            'remember_token' => ['required', 'string'],
        ]);

        $user = User::find($request->user_id);
        
        if (!$user || !$user->two_factor_enabled) {
            return response()->json(['message' => 'Invalid 2FA session'], 422);
        }

        $cachedData = Cache::get("2fa_{$user->id}");
        
        if (!$cachedData || $cachedData['remember_token'] !== $request->remember_token) {
            return response()->json(['message' => 'Session expired'], 422);
        }

        $secret = decrypt($user->two_factor_secret);
        
        if (!$this->verifyCode($secret, $request->code)) {
            // Check backup codes
            $backupCodes = json_decode(decrypt($user->two_factor_backup_codes), true);
            
            if (in_array($request->code, $backupCodes)) {
                // Remove used backup code
                $backupCodes = array_diff($backupCodes, [$request->code]);
                $user->two_factor_backup_codes = encrypt(json_encode($backupCodes));
                $user->save();
                
                // Complete 2FA authentication
                Cache::forget("2fa_{$user->id}");
                $this->completeTwoFactorAuth($user);
                
                return response()->json(['message' => '2FA verified successfully using backup code']);
            }
            
            return response()->json(['message' => 'Invalid verification code'], 422);
        }

        // Complete 2FA authentication
        Cache::forget("2fa_{$user->id}");
        $this->completeTwoFactorAuth($user);

        return response()->json(['message' => '2FA verified successfully']);
    }

    /**
     * Generate secret key for 2FA
     */
    private function generateSecretKey(): string
    {
        return strtoupper(Str::random(32));
    }

    /**
     * Generate QR code URL for authenticator apps
     */
    private function generateQrCodeUrl(string $email, string $secret, string $appName): string
    {
        return "otpauth://totp/{$email}?secret={$secret}&issuer={$appName}";
    }

    /**
     * Generate backup codes
     */
    private function generateBackupCodes(): array
    {
        $codes = [];
        for ($i = 0; $i < 10; $i++) {
            $codes[] = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        }
        return $codes;
    }

    /**
     * Verify TOTP code
     */
    private function verifyCode(string $secret, string $code): bool
    {
        // Simple time-based verification (in production, use proper TOTP library)
        $timeWindow = floor(time() / 30);
        $expectedCode = $this->generateTotpCode($secret, $timeWindow);
        
        // Allow for current and previous time window (30 seconds each)
        $previousCode = $this->generateTotpCode($secret, $timeWindow - 1);
        
        return hash_equals($expectedCode, $code) || hash_equals($previousCode, $code);
    }

    /**
     * Generate TOTP code (simplified)
     */
    private function generateTotpCode(string $secret, int $timeWindow): string
    {
        // This is a simplified implementation
        // In production, use spomky-labs/otphp or similar library
        $hash = hash_hmac('sha1', $timeWindow, $secret);
        $offset = hexdec(substr($hash, -1)) & 0x0F;
        $code = (hexdec(substr($hash, $offset * 2, 8)) & 0x3FFFFFFF) % 1000000;
        
        return str_pad($code, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Complete 2FA authentication
     */
    private function completeTwoFactorAuth(User $user): void
    {
        // Log successful 2FA verification
        \App\Models\AuditLog::logAction(
            userId: $user->id,
            action: '2fa_verified',
            resourceType: 'user',
            resourceId: $user->id,
            ipAddress: request()->ip(),
            userAgent: request()->userAgent()
        );
    }
}
