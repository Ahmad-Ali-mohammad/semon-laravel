<?php

namespace App\Http\Controllers;

use App\Models\Preference;
use Illuminate\Http\Request;

class PreferenceController extends Controller
{
    public function show()
    {
        $pref = Preference::query()->first();
        if (!$pref) {
            $pref = Preference::create([
                'theme' => 'dark',
                'language' => 'ar',
                'notifications_enabled' => true,
            ]);
        }
        return $pref;
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'theme' => 'sometimes|required|string',
            'language' => 'sometimes|required|string',
            'notifications_enabled' => 'boolean',
            'currency' => 'sometimes|string',
            'tax_rate' => 'sometimes|numeric',
            'shipping_fee' => 'sometimes|numeric',
            'free_shipping_threshold' => 'sometimes|numeric',
            'maintenance_mode' => 'boolean',
            'allow_guest_checkout' => 'boolean',
            'require_email_verification' => 'boolean',
            'default_user_role' => 'sometimes|string',
        ]);

        $pref = Preference::query()->first();
        if (!$pref) {
            $pref = Preference::create([
                'theme' => 'dark',
                'language' => 'ar',
                'notifications_enabled' => true,
            ]);
        }

        $pref->update($data);
        return $pref;
    }
}
