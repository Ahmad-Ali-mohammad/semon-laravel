<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $items = CartItem::with('product')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('updated_at')
            ->get();

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1',
        ]);

        $quantity = $data['quantity'] ?? 1;

        $item = CartItem::where('user_id', $request->user()->id)
            ->where('product_id', $data['product_id'])
            ->first();

        if ($item) {
            $item->update(['quantity' => $item->quantity + $quantity]);
        } else {
            $item = CartItem::create([
                'user_id' => $request->user()->id,
                'product_id' => $data['product_id'],
                'quantity' => $quantity,
            ]);
        }

        return response()->json($item->load('product'), 201);
    }

    public function update(Request $request, string $id)
    {
        $item = CartItem::where('user_id', $request->user()->id)->findOrFail($id);

        $data = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item->update($data);

        return response()->json($item->load('product'));
    }

    public function destroy(Request $request, string $id)
    {
        CartItem::where('user_id', $request->user()->id)->findOrFail($id)->delete();

        return response()->noContent();
    }

    public function clear(Request $request)
    {
        CartItem::where('user_id', $request->user()->id)->delete();

        return response()->noContent();
    }
}
