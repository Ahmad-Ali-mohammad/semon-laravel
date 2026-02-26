<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FilterGroupStoreRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:50'],
            'applies_to' => ['required', 'string', 'max:50'],
            'is_active' => ['nullable', 'boolean'],
            'options' => ['nullable', 'array'],
            'options.*.name' => ['required_with:options', 'string', 'max:255'],
            'options.*.value' => ['required_with:options', 'string', 'max:255'],
            'options.*.is_active' => ['nullable', 'boolean'],
            'options.*.sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
