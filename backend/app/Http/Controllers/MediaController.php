<?php

namespace App\Http\Controllers;

use App\Http\Requests\MediaStoreRequest;
use App\Models\MediaItem;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index()
    {
        return response()->json(MediaItem::orderByDesc('created_at')->paginate(20));
    }

    public function store(MediaStoreRequest $request)
    {
        $file = $request->file('file');
        $path = $file->store('media', 'public');
        $publicUrl = Storage::url($path);
        $absoluteUrl = str_starts_with($publicUrl, 'http')
            ? $publicUrl
            : $request->getSchemeAndHttpHost() . $publicUrl;

        $media = MediaItem::create([
            'url' => $absoluteUrl,
            'name' => $file->getClientOriginalName(),
            'size' => (string) $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'uploaded_by' => $request->user()?->id,
        ]);

        return response()->json($media, 201);
    }

    public function destroy(string $id)
    {
        $media = MediaItem::findOrFail($id);
        $url = $media->url;

        // Extract relative path from absolute URL
        $path = parse_url($url, PHP_URL_PATH);
        if ($path && str_contains($path, '/storage/')) {
            $relative = ltrim(str_replace('/storage/', '', $path), '/');
            Storage::disk('public')->delete($relative);
        }

        $media->delete();

        return response()->json(['message' => 'Media deleted.']);
    }
}
