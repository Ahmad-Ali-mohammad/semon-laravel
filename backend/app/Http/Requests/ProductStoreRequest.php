<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductStoreRequest extends FormRequest
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
            'species' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'image_url' => ['required', 'string', 'max:65535'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'is_available' => ['nullable', 'boolean'],
            'status' => ['nullable', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'care_instructions' => ['nullable', 'string'],
        ];
    }
}
