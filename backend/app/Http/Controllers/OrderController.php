<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderStatusUpdateRequest;
use App\Http\Requests\OrderStoreRequest;
use App\Http\Requests\PaymentStatusUpdateRequest;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('items', 'address')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($orders);
    }

    public function store(OrderStoreRequest $request)
    {
        $data = $request->validated();
        $order = Order::create([
            'id' => (string) Str::uuid(),
            'user_id' => $request->user()->id,
            'address_id' => $data['address_id'] ?? null,
            'total' => $data['total'],
            'status' => 'pending',
            'payment_method' => $data['payment_method'] ?? null,
            'payment_verification_status' => 'pending',
        ]);

        foreach ($data['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'] ?? null,
                'supply_id' => $item['supply_id'] ?? null,
                'name' => $item['name'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'image_url' => $item['image_url'],
            ]);
        }

        return response()->json($order->load('items'), 201);
    }

    public function adminIndex()
    {
        // Cache admin orders for 30 seconds to reduce DB load
        $page = request()->get('page', 1);
        $key = "admin_orders_page_{$page}";

        $result = cache()->remember($key, 30, function () {
            return Order::with('items', 'user', 'address')->orderByDesc('created_at')->paginate(20);
        });

        return response()->json($result);
    }

    public function adminShow(string $id)
    {
        return response()->json(
            Order::with('items', 'user', 'address', 'paymentProofs')->findOrFail($id)
        );
    }

    public function updateStatus(OrderStatusUpdateRequest $request, string $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->validated());

        return response()->json($order);
    }

    public function updatePaymentStatus(PaymentStatusUpdateRequest $request, string $id)
    {
        $order = Order::findOrFail($id);
        $data = $request->validated();
        $status = $data['payment_verification_status'] ?? $data['status'] ?? null;

        $order->payment_verification_status = $status;
        $order->rejection_reason = $data['rejection_reason'] ?? null;
        $order->save();

        return response()->json($order);
    }

    public function destroy(string $id)
    {
        $order = Order::findOrFail($id);
        $order->items()->delete();
        $order->paymentProofs()->delete();
        $order->delete();

        return response()->json(['message' => 'Order deleted.']);
    }
}
