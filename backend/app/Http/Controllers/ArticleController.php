<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleStoreRequest;
use App\Http\Requests\ArticleUpdateRequest;
use App\Models\Article;

class ArticleController extends Controller
{
    public function index()
    {
        // cache paginated listing for 1 minute to reduce DB load on high traffic
        $page = request()->get('page', 1);
        $key = "articles_index_page_{$page}";

        $result = cache()->remember($key, 60, function () {
            return Article::with('author')
                ->orderByDesc('published_at')
                ->paginate(20);
        });

        return response()->json($result);
    }

    public function show(string $id)
    {
        $key = "article_{$id}";
        $article = cache()->remember($key, 60, function () use ($id) {
            return Article::with('author')->findOrFail($id);
        });
        return response()->json($article);
    }

    public function store(ArticleStoreRequest $request)
    {
        $data = $request->validated();
        $data['author_id'] = $data['author_id'] ?? $request->user()?->id;

        $article = Article::create($data);
        // clear related caches
        cache()->forget('articles_index_page_1');
        cache()->forget("article_{$article->id}");

        return response()->json($article, 201);
    }

    public function update(ArticleUpdateRequest $request, string $id)
    {
        $article = Article::findOrFail($id);
        $data = $request->validated();
        if (empty($data['author_id'])) {
            unset($data['author_id']);
        }
        $article->update($data);
        cache()->forget('articles_index_page_1');
        cache()->forget("article_{$article->id}");

        return response()->json($article);
    }

    public function toggleVisibility(string $id)
    {
        $article = Article::findOrFail($id);
        $article->is_active = !$article->is_active;
        $article->save();
        cache()->forget('articles_index_page_1');
        cache()->forget("article_{$article->id}");

        return response()->json($article);
    }

    public function destroy(string $id)
    {
        $article = Article::findOrFail($id);
        $article->delete();
        cache()->forget('articles_index_page_1');
        cache()->forget("article_{$id}");

        return response()->json(['message' => 'Article deleted.']);
    }
}
