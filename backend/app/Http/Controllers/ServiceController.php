<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(
            cache()->remember('services_index', 300, function () {
                return Service::where('is_active', true)
                    ->orderBy('sort_order')
                    ->orderBy('id')
                    ->get();
            })
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string|max:50',
            'price' => 'nullable|string|max:255',
            'highlight' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $service = Service::create($validated);
        cache()->forget('services_index');
        return response()->json($service, 201);
    }

    public function update(Request $request, string $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'icon' => 'nullable|string|max:50',
            'price' => 'nullable|string|max:255',
            'highlight' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $service->update($validated);
        cache()->forget('services_index');
        return response()->json($service);
    }

    public function toggleVisibility(string $id)
    {
        $service = Service::findOrFail($id);
        $service->is_active = !$service->is_active;
        $service->save();
        cache()->forget('services_index');
        return response()->json($service);
    }

    public function destroy(string $id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
        cache()->forget('services_index');
        return response()->json(['message' => 'Service deleted successfully.']);
    }
}
