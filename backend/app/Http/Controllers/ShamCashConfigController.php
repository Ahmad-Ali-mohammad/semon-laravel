<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShamCashConfigUpdateRequest;
use App\Models\ShamCashConfig;

class ShamCashConfigController extends Controller
{
    public function show()
    {
        return response()->json(
            cache()->remember('shamcash_config', 300, function () {
                return ShamCashConfig::first();
            })
        );
    }

    public function update(ShamCashConfigUpdateRequest $request)
    {
        $config = ShamCashConfig::first();
        if (!$config) {
            $config = ShamCashConfig::create($request->validated());
        } else {
            $config->update($request->validated());
        }
        cache()->forget('shamcash_config');
        return response()->json($config);
    }
}
