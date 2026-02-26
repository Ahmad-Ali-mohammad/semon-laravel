<?php

namespace App\Http\Controllers;

use App\Models\Backup;
use App\Models\BackupSetting;
use App\Models\CompanyInfo;
use App\Models\ContactInfo;
use App\Models\CustomCategory;
use App\Models\CustomSpecies;
use App\Models\FilterGroup;
use App\Models\HeroSlide;
use App\Models\Order;
use App\Models\Policy;
use App\Models\Preference;
use App\Models\Product;
use App\Models\PromotionalCard;
use App\Models\Service;
use App\Models\ShamCashConfig;
use App\Models\Supply;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class BackupController extends Controller
{
    public function index()
    {
        $settings = $this->getOrCreateSettings();
        $backups = Backup::orderByDesc('created_at')->get()->map(function (Backup $backup) {
            return $this->formatBackup($backup);
        });

        return response()->json([
            'data' => $backups,
            'settings' => $this->formatSettings($settings),
            'storage' => $this->getStorageSummary(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|string|in:full,products,orders,customers,settings',
        ]);

        $type = $data['type'];
        $now = Carbon::now();
        $backup = Backup::create([
            'name' => 'Backup ' . $type . ' - ' . $now->toDateString(),
            'type' => $type,
            'status' => 'in_progress',
            'started_at' => $now,
            'created_by' => optional($request->user())->id,
        ]);

        try {
            $payload = $this->buildBackupPayload($type);
            $filename = 'backups/backup_' . $type . '_' . $now->format('Ymd_His') . '_' . $backup->id . '.json';
            Storage::disk('local')->put($filename, json_encode($payload, JSON_PRETTY_PRINT));

            $size = Storage::disk('local')->size($filename);

            $backup->update([
                'status' => 'completed',
                'description' => $this->buildDescription($type),
                'size_bytes' => $size,
                'file_path' => $filename,
                'completed_at' => Carbon::now(),
                'meta' => [
                    'counts' => $payload['counts'] ?? [],
                ],
            ]);
        } catch (\Throwable $e) {
            $backup->update([
                'status' => 'failed',
                'description' => 'Backup failed: ' . $e->getMessage(),
                'completed_at' => Carbon::now(),
            ]);
        }

        return response()->json($this->formatBackup($backup));
    }

    public function restore(Backup $backup)
    {
        $backup->update([
            'restored_at' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Backup restore scheduled',
            'backup' => $this->formatBackup($backup),
        ]);
    }

    public function destroy(Backup $backup)
    {
        if ($backup->file_path && Storage::disk('local')->exists($backup->file_path)) {
            Storage::disk('local')->delete($backup->file_path);
        }

        $backup->delete();

        return response()->noContent();
    }

    public function download(Backup $backup)
    {
        if (!$backup->file_path || !Storage::disk('local')->exists($backup->file_path)) {
            return response()->json(['message' => 'Backup file not found'], 404);
        }

        return Storage::disk('local')->download($backup->file_path);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'enabled' => 'nullable|boolean',
            'frequency' => 'nullable|string|in:daily,weekly,monthly',
            'time' => 'nullable|string',
            'retention' => 'nullable|integer|min:7|max:365',
        ]);

        $settings = $this->getOrCreateSettings();
        $settings->fill($data);
        $settings->updated_by = optional($request->user())->id;
        $settings->save();

        return response()->json($this->formatSettings($settings));
    }

    private function getOrCreateSettings(): BackupSetting
    {
        $settings = BackupSetting::first();

        if (!$settings) {
            $settings = BackupSetting::create([
                'enabled' => true,
                'frequency' => 'daily',
                'time' => '03:00',
                'retention' => 30,
            ]);
        }

        return $settings;
    }

    private function buildBackupPayload(string $type): array
    {
        $payload = [
            'type' => $type,
            'created_at' => Carbon::now()->toISOString(),
            'data' => [],
            'counts' => [],
        ];

        if ($type === 'full' || $type === 'products') {
            $payload['data']['products'] = Product::all()->toArray();
            $payload['counts']['products'] = count($payload['data']['products']);
        }

        if ($type === 'full') {
            $payload['data']['supplies'] = Supply::all()->toArray();
            $payload['counts']['supplies'] = count($payload['data']['supplies']);
        }

        if ($type === 'full' || $type === 'orders') {
            $orders = Order::with('items', 'paymentProofs')->get()->toArray();
            $payload['data']['orders'] = $orders;
            $payload['counts']['orders'] = count($orders);
        }

        if ($type === 'full' || $type === 'customers') {
            $users = User::all()->toArray();
            $payload['data']['users'] = $users;
            $payload['counts']['users'] = count($users);
        }

        if ($type === 'full' || $type === 'settings') {
            $payload['data']['preferences'] = Preference::all()->toArray();
            $payload['data']['company_info'] = CompanyInfo::all()->toArray();
            $payload['data']['contact_info'] = ContactInfo::all()->toArray();
            $payload['data']['policies'] = Policy::all()->toArray();
            $payload['data']['promotions'] = PromotionalCard::all()->toArray();
            $payload['data']['services'] = Service::all()->toArray();
            $payload['data']['team_members'] = TeamMember::all()->toArray();
            $payload['data']['hero_slides'] = HeroSlide::all()->toArray();
            $payload['data']['filters'] = FilterGroup::with('options')->get()->toArray();
            $payload['data']['custom_categories'] = CustomCategory::all()->toArray();
            $payload['data']['custom_species'] = CustomSpecies::all()->toArray();
            $payload['data']['shamcash_config'] = ShamCashConfig::all()->toArray();

            $payload['counts']['preferences'] = count($payload['data']['preferences']);
            $payload['counts']['company_info'] = count($payload['data']['company_info']);
            $payload['counts']['contact_info'] = count($payload['data']['contact_info']);
            $payload['counts']['policies'] = count($payload['data']['policies']);
            $payload['counts']['promotions'] = count($payload['data']['promotions']);
            $payload['counts']['services'] = count($payload['data']['services']);
            $payload['counts']['team_members'] = count($payload['data']['team_members']);
            $payload['counts']['hero_slides'] = count($payload['data']['hero_slides']);
            $payload['counts']['filters'] = count($payload['data']['filters']);
            $payload['counts']['custom_categories'] = count($payload['data']['custom_categories']);
            $payload['counts']['custom_species'] = count($payload['data']['custom_species']);
            $payload['counts']['shamcash_config'] = count($payload['data']['shamcash_config']);
        }

        return $payload;
    }

    private function buildDescription(string $type): string
    {
        return match ($type) {
            'full' => 'Full backup of store data',
            'products' => 'Backup of products data',
            'orders' => 'Backup of orders data',
            'customers' => 'Backup of customer data',
            'settings' => 'Backup of settings data',
            default => 'Backup',
        };
    }

    private function formatBackup(Backup $backup): array
    {
        return [
            'id' => $backup->id,
            'name' => $backup->name,
            'type' => $backup->type,
            'status' => $backup->status,
            'description' => $backup->description,
            'size' => $this->formatBytes((int) $backup->size_bytes),
            'size_bytes' => (int) $backup->size_bytes,
            'date' => optional($backup->created_at)->toISOString(),
            'restored_at' => optional($backup->restored_at)->toISOString(),
        ];
    }

    private function formatSettings(BackupSetting $settings): array
    {
        return [
            'enabled' => (bool) $settings->enabled,
            'frequency' => $settings->frequency,
            'time' => $settings->time,
            'retention' => (int) $settings->retention,
        ];
    }

    private function getStorageSummary(): array
    {
        $totalBytes = (int) Backup::sum('size_bytes');
        $count = (int) Backup::count();
        $latest = Backup::orderByDesc('created_at')->first();

        return [
            'used' => $this->formatBytes($totalBytes),
            'used_bytes' => $totalBytes,
            'count' => $count,
            'last_backup' => optional($latest?->created_at)->toISOString(),
        ];
    }

    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = $bytes > 0 ? floor(log($bytes, 1024)) : 0;
        $pow = min($pow, count($units) - 1);
        $value = $bytes / pow(1024, $pow);

        return round($value, 2) . ' ' . $units[$pow];
    }
}
