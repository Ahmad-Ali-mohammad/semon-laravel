<?php

namespace App\Http\Controllers;

use App\Http\Requests\TeamMemberStoreRequest;
use App\Http\Requests\TeamMemberUpdateRequest;
use App\Models\TeamMember;

class TeamMemberController extends Controller
{
    public function index()
    {
        return response()->json(
            TeamMember::where('is_active', true)
                ->orderBy('sort_order')
                ->get()
        );
    }

    public function store(TeamMemberStoreRequest $request)
    {
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('team', 'public');
            $data['image_url'] = '/storage/' . $path;
        }
        $member = TeamMember::create($data);

        return response()->json($member, 201);
    }

    public function update(TeamMemberUpdateRequest $request, string $id)
    {
        $member = TeamMember::findOrFail($id);
        $data = $request->validated();
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('team', 'public');
            $data['image_url'] = '/storage/' . $path;
        }
        $member->update($data);

        return response()->json($member);
    }

    public function toggleVisibility(string $id)
    {
        $member = TeamMember::findOrFail($id);
        $member->is_active = !$member->is_active;
        $member->save();

        return response()->json($member);
    }

    public function destroy(string $id)
    {
        $member = TeamMember::findOrFail($id);
        $member->delete();

        return response()->json(['message' => 'Team member deleted.']);
    }
}
