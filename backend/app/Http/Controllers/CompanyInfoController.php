<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyInfoUpdateRequest;
use App\Models\CompanyInfo;

class CompanyInfoController extends Controller
{
    public function show()
    {
        return response()->json(
            cache()->remember('company_info', 300, function () {
                return CompanyInfo::first();
            })
        );
    }

    public function update(CompanyInfoUpdateRequest $request)
    {
        $info = CompanyInfo::first();
        if (!$info) {
            $info = CompanyInfo::create($request->validated());
        } else {
            $info->update($request->validated());
        }
        cache()->forget('company_info');
        return response()->json($info);
    }
}
