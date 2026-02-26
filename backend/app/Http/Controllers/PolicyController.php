<?php

namespace App\Http\Controllers;

use App\Models\Policy;
use Illuminate\Http\Request;

class PolicyController extends Controller
{
    public function index()
    {
        return Policy::orderByDesc('id')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'last_updated' => 'nullable|date',
            'is_active' => 'boolean',
            'icon' => 'nullable|string|max:255',
        ]);

        $policy = Policy::create($data);
        return response()->json($policy, 201);
    }

    public function update(Request $request, Policy $policy)
    {
        $data = $request->validate([
            'type' => 'sometimes|required|string|max:255',
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'last_updated' => 'nullable|date',
            'is_active' => 'boolean',
            'icon' => 'nullable|string|max:255',
        ]);

        $policy->update($data);
        return response()->json($policy);
    }

    public function toggleVisibility(Policy $policy)
    {
        $policy->is_active = !$policy->is_active;
        $policy->save();

        return response()->json($policy);
    }

    public function destroy(Policy $policy)
    {
        $policy->delete();
        return response()->noContent();
    }
}
