<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShamCashConfigUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'barcode_image_url' => ['nullable', 'string', 'max:2048'],
            'account_code' => ['required_if:is_active,true', 'nullable', 'string', 'max:255'],
            'account_holder_name' => ['nullable', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:50', 'regex:/^[\+]?[0-9\s\-\(\)]{10,20}$/'],
            'payment_instructions' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
