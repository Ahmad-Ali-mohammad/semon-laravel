<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;
use App\Models\Article;

class CachingTest extends TestCase
{
    use RefreshDatabase;

    public function test_article_index_is_cached()
    {
        if (config('database.default') === 'sqlite') {
            $this->markTestSkipped('Skipping caching test on sqlite due to migration limitations');
        }
        // seed a couple of articles
        Article::factory()->count(3)->create();

        // ensure cache empty initially
        Cache::flush();

        $response1 = $this->getJson('/api/v1/articles');
        $response1->assertStatus(200);

        // next call should hit cache, so we modify DB and expect same result
        Article::factory()->count(2)->create();
        $response2 = $this->getJson('/api/v1/articles');
        $this->assertEquals($response1->json(), $response2->json());
    }

    public function test_article_show_cache_and_invalidation()
    {
        if (config('database.default') === 'sqlite') {
            $this->markTestSkipped('Skipping caching test on sqlite due to migration limitations');
        }
        Cache::flush();

        $article = Article::factory()->create();

        $resp1 = $this->getJson("/api/v1/articles/{$article->id}");
        $resp1->assertStatus(200);

        // update underlying record
        $article->title = 'changed';
        $article->save();

        $resp2 = $this->getJson("/api/v1/articles/{$article->id}");
        // since cache duration 60s and we didn't clear, should be old title
        $this->assertEquals($resp1->json(), $resp2->json());

        // after deleting cache manually should see update
        Cache::forget("article_{$article->id}");
        $resp3 = $this->getJson("/api/v1/articles/{$article->id}");
        $this->assertNotEquals($resp1->json(), $resp3->json());
    }
}
