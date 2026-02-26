<?php

namespace App\Http\Controllers;

use App\Http\Requests\HeroSlideStoreRequest;
use App\Http\Requests\HeroSlideUpdateRequest;
use App\Models\HeroSlide;

class HeroSlideController extends Controller
{
    public function index()
    {
        return response()->json(
            cache()->remember('hero_slides_index', 120, function () {
                return HeroSlide::where('is_active', true)
                    ->orderBy('sort_order')
                    ->get();
            })
        );
    }

    public function store(HeroSlideStoreRequest $request)
    {
        $slide = HeroSlide::create($request->validated());
        
        // Clear hero slides cache
        cache()->forget('hero_slides_index');

        return response()->json($slide, 201);
    }

    public function update(HeroSlideUpdateRequest $request, string $id)
    {
        $slide = HeroSlide::findOrFail($id);
        $slide->update($request->validated());
        
        // Clear hero slides cache
        cache()->forget('hero_slides_index');

        return response()->json($slide);
    }

    public function toggleVisibility(string $id)
    {
        $slide = HeroSlide::findOrFail($id);
        $slide->is_active = !$slide->is_active;
        $slide->save();
        
        // Clear hero slides cache
        cache()->forget('hero_slides_index');

        return response()->json($slide);
    }

    public function destroy(string $id)
    {
        $slide = HeroSlide::findOrFail($id);
        $slide->delete();
        
        // Clear hero slides cache
        cache()->forget('hero_slides_index');

        return response()->json(['message' => 'Slide deleted.']);
    }
}
