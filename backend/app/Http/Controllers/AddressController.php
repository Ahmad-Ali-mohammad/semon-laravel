<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddressStoreRequest;
use App\Http\Requests\AddressUpdateRequest;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            Address::where('user_id', $request->user()->id)->orderByDesc('id')->get()
        );
    }

    public function store(AddressStoreRequest $request)
    {
        $data = $request->validated();
        $userId = $request->user()->id;

        if (!empty($data['is_default']) && $data['is_default'] === true) {
            Address::where('user_id', $userId)->update(['is_default' => false]);
        }

        $address = Address::create(array_merge($data, ['user_id' => $userId]));

        return response()->json($address, 201);
    }

    public function update(AddressUpdateRequest $request, string $id)
    {
        $address = Address::where('user_id', $request->user()->id)->findOrFail($id);
        $data = $request->validated();

        if (!empty($data['is_default']) && $data['is_default'] === true) {
            Address::where('user_id', $request->user()->id)->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($data);

        return response()->json($address);
    }

    public function destroy(Request $request, string $id)
    {
        $address = Address::where('user_id', $request->user()->id)->findOrFail($id);
        $address->delete();

        return response()->json(['message' => 'Address deleted.']);
    }
}
