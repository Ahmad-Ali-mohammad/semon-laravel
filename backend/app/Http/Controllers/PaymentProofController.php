<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentProofStoreRequest;
use App\Http\Requests\PaymentStatusUpdateRequest;
use App\Models\Order;
use App\Models\PaymentProof;
use Illuminate\Http\Request;

class PaymentProofController extends Controller
{
    public function index()
    {
        return response()->json(PaymentProof::with('order', 'uploader')->orderByDesc('created_at')->paginate(20));
    }

    public function store(PaymentProofStoreRequest $request, string $orderId)
    {
        $order = Order::findOrFail($orderId);
        $user = $request->user();

        if ($user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json(['message' => 'Not allowed.'], 403);
        }

        $proof = PaymentProof::create([
            'order_id' => $order->id,
            'image_url' => $request->validated()['image_url'],
            'status' => 'pending',
            'uploaded_by' => $user->id,
        ]);

        $order->payment_verification_status = 'pending';
        $order->save();

        return response()->json($proof, 201);
    }

    public function updateStatus(PaymentStatusUpdateRequest $request, string $id)
    {
        $proof = PaymentProof::findOrFail($id);
        $data = $request->validated();
        $status = $data['payment_verification_status'] ?? $data['status'] ?? null;
        $proof->status = $status;
        $proof->rejection_reason = $data['rejection_reason'] ?? null;
        $proof->save();

        $proof->order->update([
            'payment_verification_status' => $status,
            'rejection_reason' => $proof->rejection_reason,
        ]);

        return response()->json($proof);
    }
}
