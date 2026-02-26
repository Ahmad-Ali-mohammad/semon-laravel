<?php

namespace App\Http\Controllers;

use App\Models\CustomSpecies;
use Illuminate\Http\Request;

class CustomSpeciesController extends Controller
{
    public function index()
    {
        return CustomSpecies::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:custom_species,name',
        ]);

        $species = CustomSpecies::create($data);
        return response()->json($species, 201);
    }

    public function update(Request $request, CustomSpecies $customSpecies)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:custom_species,name,' . $customSpecies->id,
        ]);

        $customSpecies->update($data);
        return response()->json($customSpecies);
    }

    public function destroy(CustomSpecies $customSpecies)
    {
        $customSpecies->delete();
        return response()->noContent();
    }
}
