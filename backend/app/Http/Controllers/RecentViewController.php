<?php

namespace App\Http\Controllers;

use App\Models\RecentView;
use Illuminate\Http\Request;

class RecentViewController extends Controller
{
    public function index(Request $request)
    {
        $productIds = RecentView::where('user_id', $request->user()->id)
            ->orderByDesc('viewed_at')
            ->limit(4)
            ->pluck('product_id');

        return response()->json($productIds);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        RecentView::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'product_id' => $data['product_id'],
            ],
            [
                'viewed_at' => now(),
            ]
        );

        return response()->json(['message' => 'View recorded.'], 201);
    }
}
