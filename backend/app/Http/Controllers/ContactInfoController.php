<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactInfoUpdateRequest;
use App\Models\ContactInfo;

class ContactInfoController extends Controller
{
    public function show()
    {
        return response()->json(
            cache()->remember('contact_info', 300, function () {
                return ContactInfo::first();
            })
        );
    }

    public function update(ContactInfoUpdateRequest $request)
    {
        $info = ContactInfo::first();
        if (!$info) {
            $info = ContactInfo::create($request->validated());
        } else {
            $info->update($request->validated());
        }
        cache()->forget('contact_info');
        return response()->json($info);
    }
}
