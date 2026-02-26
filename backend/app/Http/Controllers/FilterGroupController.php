<?php

namespace App\Http\Controllers;

use App\Http\Requests\FilterGroupStoreRequest;
use App\Http\Requests\FilterGroupUpdateRequest;
use App\Models\FilterGroup;
use App\Models\FilterOption;

class FilterGroupController extends Controller
{
    public function index()
    {
        return response()->json(FilterGroup::with('options')->orderByDesc('id')->get());
    }

    public function store(FilterGroupStoreRequest $request)
    {
        $data = $request->validated();
        $group = FilterGroup::create($data);

        foreach ($data['options'] ?? [] as $option) {
            $group->options()->create($option);
        }

        return response()->json($group->load('options'), 201);
    }

    public function update(FilterGroupUpdateRequest $request, string $id)
    {
        $group = FilterGroup::findOrFail($id);
        $data = $request->validated();
        $group->update($data);

        if (array_key_exists('options', $data)) {
            foreach ($data['options'] ?? [] as $option) {
                if (!empty($option['id'])) {
                    $existing = FilterOption::where('filter_group_id', $group->id)
                        ->where('id', $option['id'])
                        ->first();
                    if ($existing) {
                        $existing->update($option);
                    }
                } else {
                    $group->options()->create($option);
                }
            }
        }

        return response()->json($group->load('options'));
    }

    public function toggleVisibility(string $id)
    {
        $group = FilterGroup::findOrFail($id);
        $group->is_active = !$group->is_active;
        $group->save();

        return response()->json($group->load('options'));
    }

    public function destroy(string $id)
    {
        $group = FilterGroup::findOrFail($id);
        $group->delete();

        return response()->json(['message' => 'Filter group deleted.']);
    }
}
