<?php

namespace App\Http\Controllers;

use App\Models\CustomCategory;
use Illuminate\Http\Request;

class CustomCategoryController extends Controller
{
    public function index()
    {
        return CustomCategory::orderBy('label')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'value' => 'required|string|max:255|unique:custom_categories,value',
            'label' => 'required|string|max:255',
        ]);

        $category = CustomCategory::create($data);
        return response()->json($category, 201);
    }

    public function update(Request $request, CustomCategory $customCategory)
    {
        $data = $request->validate([
            'value' => 'sometimes|required|string|max:255|unique:custom_categories,value,' . $customCategory->id,
            'label' => 'sometimes|required|string|max:255',
        ]);

        $customCategory->update($data);
        return response()->json($customCategory);
    }

    public function destroy(CustomCategory $customCategory)
    {
        $customCategory->delete();
        return response()->noContent();
    }
}
