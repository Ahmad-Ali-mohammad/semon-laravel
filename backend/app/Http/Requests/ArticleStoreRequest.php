<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArticleStoreRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['required', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'author_id' => ['nullable', 'integer', 'exists:users,id'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
