<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $productIds = Wishlist::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->pluck('product_id');

        return response()->json($productIds);
    }

    public function toggle(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $data['product_id'])
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'action' => 'removed',
                'product_id' => (int) $data['product_id'],
            ]);
        }

        Wishlist::create([
            'user_id' => $request->user()->id,
            'product_id' => $data['product_id'],
        ]);

        return response()->json([
            'action' => 'added',
            'product_id' => (int) $data['product_id'],
        ], 201);
    }

    public function destroy(Request $request, string $productId)
    {
        Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->noContent();
    }
}
