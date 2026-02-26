<?php

namespace App\Http\Controllers;

use App\Http\Requests\SupplyStoreRequest;
use App\Http\Requests\SupplyUpdateRequest;
use App\Models\Supply;

class SupplyController extends Controller
{
    public function index()
    {
        // Cache paginated supplies for 1 minute to reduce DB load
        $page = request()->get('page', 1);
        $key = "supplies_index_page_{$page}";

        $result = cache()->remember($key, 60, function () {
            return Supply::orderByDesc('id')->paginate(20);
        });

        return response()->json($result);
    }

    public function show(string $id)
    {
        $key = "supply_{$id}";
        $supply = cache()->remember($key, 60, function () use ($id) {
            return Supply::findOrFail($id);
        });
        return response()->json($supply);
    }

    public function store(SupplyStoreRequest $request)
    {
        $supply = Supply::create($request->validated());
        
        // Clear all supplies cache pages
        for ($i = 1; $i <= 10; $i++) {
            cache()->forget("supplies_index_page_{$i}");
        }

        return response()->json($supply, 201);
    }

    public function update(SupplyUpdateRequest $request, string $id)
    {
        $supply = Supply::findOrFail($id);
        $supply->update($request->validated());
        
        // Clear related caches
        cache()->forget("supply_{$id}");
        for ($i = 1; $i <= 10; $i++) {
            cache()->forget("supplies_index_page_{$i}");
        }

        return response()->json($supply);
    }

    public function toggleVisibility(string $id)
    {
        $supply = Supply::findOrFail($id);
        $supply->is_available = !$supply->is_available;
        $supply->save();
        
        // Clear related caches
        cache()->forget("supply_{$id}");
        for ($i = 1; $i <= 10; $i++) {
            cache()->forget("supplies_index_page_{$i}");
        }

        return response()->json($supply);
    }

    public function destroy(string $id)
    {
        $supply = Supply::findOrFail($id);
        $supply->delete();
        
        // Clear related caches
        cache()->forget("supply_{$id}");
        for ($i = 1; $i <= 10; $i++) {
            cache()->forget("supplies_index_page_{$i}");
        }

        return response()->json(['message' => 'Supply deleted.']);
    }
}
