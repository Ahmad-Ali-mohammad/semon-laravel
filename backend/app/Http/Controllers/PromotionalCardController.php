<?php

namespace App\Http\Controllers;

use App\Models\PromotionalCard;
use Illuminate\Http\Request;

class PromotionalCardController extends Controller
{
    public function index()
    {
        return cache()->remember('promotions_index', 120, function () {
            return PromotionalCard::orderByDesc('id')->get();
        });
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'required|string',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'is_active' => 'boolean',
            'target_category' => 'nullable|string|max:255',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
        ]);

        $card = PromotionalCard::create($data);
        cache()->forget('promotions_index');
        return response()->json($card, 201);
    }

    public function update(Request $request, PromotionalCard $promotion)
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'sometimes|required|string',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'is_active' => 'boolean',
            'target_category' => 'nullable|string|max:255',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|string|max:255',
        ]);

        $promotion->update($data);
        cache()->forget('promotions_index');
        return response()->json($promotion);
    }

    public function toggleVisibility(PromotionalCard $promotion)
    {
        $promotion->is_active = !$promotion->is_active;
        $promotion->save();
        cache()->forget('promotions_index');
        return response()->json($promotion);
    }

    public function destroy(PromotionalCard $promotion)
    {
        $promotion->delete();
        cache()->forget('promotions_index');
        return response()->noContent();
    }
}
