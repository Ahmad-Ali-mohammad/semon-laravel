<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Article;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SeoController extends Controller
{
    /**
     * Get SEO metadata for the homepage
     */
    public function homepage()
    {
        $meta = [
            'title' => 'Reptile House - متجر متخصص للزواحف والحيوانات الأليفة',
            'description' => 'متجر Reptile House يقدم أفضل المنتجات والخدمات للزواحف والحيوانات الأليفة في السعودية. اكتشف مجموعات متنوعة من الزواحف، الأفاعي، الإمدادات، وخدمات الرعاية.',
            'keywords' => 'متجر زواحف, حيوانات أليفة, زواحف, أفاعي, إمدادات, رعاية حيوانات, السعودية, Reptile House',
            'canonical' => url('/'),
            'robots' => 'index, follow',
            'og:title' => 'Reptile House - متجر متخصص للزواحف والحيوانات الأليفة',
            'og:description' => 'متجر Reptile House يقدم أفضل المنتجات والخدمات للزواحف والحيوانات الأليفة في السعودية. اكتشف مجموعات متنوعة من الزواحف، الأفاعي، الإمدادات، وخدمات الرعاية.',
            'og:type' => 'website',
            'og:url' => url('/'),
            'og:image' => asset('images/og-homepage.jpg'),
            'twitter:card' => 'summary_large_image',
            'twitter:title' => 'Reptile House - متجر متخصص للزواحف والحيوانات الأليفة',
            'twitter:description' => 'متجر Reptile House يقدم أفضل المنتجات والخدمات للزواحف والحيوانات الأليفة في السعودية.',
            'twitter:image' => asset('images/og-homepage.jpg'),
        ];

        return response()->json($meta);
    }

    /**
     * Get SEO metadata for products page
     */
    public function products()
    {
        $meta = [
            'title' => 'المنتجات - Reptile House',
            'description' => 'تصفح مجموعتنا الواسعة من منتجات الزواحف والحيوانات الأليفة عالية الجودة. أسعار تنافسية وشحن سريع لجميع أنحاء السعودية.',
            'keywords' => 'منتجات زواحف, منتجات حيوانات, زواحف للبيع, أفاعي, إمدادات زواحف, ملحقات, السعودية',
            'canonical' => url('/products'),
            'robots' => 'index, follow',
            'og:title' => 'المنتجات - Reptile House',
            'og:description' => 'تصفح مجموعتنا الواسعة من منتجات الزواحف والحيوانات الأليفة عالية الجودة. أسعار تنافسية وشحن سريع لجميع أنحاء السعودية.',
            'og:type' => 'website',
            'og:url' => url('/products'),
            'og:image' => asset('images/og-products.jpg'),
            'twitter:card' => 'summary_large_image',
            'twitter:title' => 'المنتجات - Reptile House',
            'twitter:description' => 'تصفح مجموعتنا الواسعة من منتجات الزواحف والحيوانات الأليفة عالية الجودة.',
            'twitter:image' => asset('images/og-products.jpg'),
        ];

        return response()->json($meta);
    }

    /**
     * Get SEO metadata for single product
     */
    public function product($slug)
    {
        $product = $this->resolveProductBySlugOrId($slug);

        $meta = [
            'title' => $product->name . ' - Reptile House',
            'description' => Str::limit($product->description ?? $product->name, 160),
            'keywords' => $product->name . ', ' . ($product->category ?? '') . ', زواحف, حيوانات أليفة, السعودية',
            'canonical' => url("/products/{$product->id}"),
            'robots' => 'index, follow',
            'og:title' => $product->name . ' - Reptile House',
            'og:description' => Str::limit($product->description ?? $product->name, 160),
            'og:type' => 'product',
            'og:url' => url("/products/{$product->id}"),
            'og:image' => $this->absoluteUrl($product->image_url) ?: asset('images/default-product.jpg'),
            'product:price:amount' => $product->price,
            'product:price:currency' => 'SAR',
            'product:availability' => $product->is_available ? 'in stock' : 'out of stock',
            'twitter:card' => 'summary_large_image',
            'twitter:title' => $product->name . ' - Reptile House',
            'twitter:description' => Str::limit($product->description ?? $product->name, 160),
            'twitter:image' => $this->absoluteUrl($product->image_url) ?: asset('images/default-product.jpg'),
        ];

        return response()->json($meta);
    }

    /**
     * Get SEO metadata for articles page
     */
    public function articles()
    {
        $meta = [
            'title' => 'المقالات والمعلومات - Reptile House',
            'description' => 'اقرأ أفضل المقالات والمعلومات حول رعاية الزواحف والحيوانات الأليفة. نصائح الخبراء ومرشدات مفيدة للمبتدئين والهواة.',
            'keywords' => 'مقالات زواحف, رعاية الزواحف, معلومات حيوانات, نصائح, مرشدات, السعودية',
            'canonical' => url('/articles'),
            'robots' => 'index, follow',
            'og:title' => 'المقالات والمعلومات - Reptile House',
            'og:description' => 'اقرأ أفضل المقالات والمعلومات حول رعاية الزواحف والحيوانات الأليفة. نصائح الخبراء ومرشدات مفيدة للمبتدئين والهواة.',
            'og:type' => 'website',
            'og:url' => url('/articles'),
            'og:image' => asset('images/og-articles.jpg'),
            'twitter:card' => 'summary_large_image',
            'twitter:title' => 'المقالات والمعلومات - Reptile House',
            'twitter:description' => 'اقرأ أفضل المقالات والمعلومات حول رعاية الزواحف والحيوانات الأليفة.',
            'twitter:image' => asset('images/og-articles.jpg'),
        ];

        return response()->json($meta);
    }

    /**
     * Get SEO metadata for single article
     */
    public function article($slug)
    {
        $article = $this->resolveArticleBySlugOrId($slug);

        $meta = [
            'title' => $article->title . ' - Reptile House',
            'description' => Str::limit($article->excerpt ?? $article->content, 160),
            'keywords' => $article->title . ', مقالات, زواحف, حيوانات, رعاية, السعودية',
            'canonical' => url("/articles/{$article->id}"),
            'robots' => 'index, follow',
            'og:title' => $article->title . ' - Reptile House',
            'og:description' => Str::limit($article->excerpt ?? $article->content, 160),
            'og:type' => 'article',
            'og:url' => url("/articles/{$article->id}"),
            'og:image' => $this->absoluteUrl($article->image_url) ?: asset('images/default-article.jpg'),
            'article:published_time' => ($article->published_at ?? $article->created_at)->toISOString(),
            'article:author' => $article->author?->name ?? 'Reptile House Team',
            'twitter:card' => 'summary_large_image',
            'twitter:title' => $article->title . ' - Reptile House',
            'twitter:description' => Str::limit($article->excerpt ?? $article->content, 160),
            'twitter:image' => $this->absoluteUrl($article->image_url) ?: asset('images/default-article.jpg'),
        ];

        return response()->json($meta);
    }

    /**
     * Get SEO metadata for about page
     */
    public function about()
    {
        $meta = [
            'title' => 'من نحن - Reptile House',
            'description' => 'تعرف على Reptile House، متجركم الأول للزواحف والحيوانات الأليفة في السعودية. نقدم منتجات عالية الجودة وخدمات رعاية موثوقة.',
            'keywords' => 'من نحن, Reptile House, عن المتجر, زواحف, حيوانات, السعودية',
            'canonical' => url('/about'),
            'robots' => 'index, follow',
            'og:title' => 'من نحن - Reptile House',
            'og:description' => 'تعرف على Reptile House، متجركم الأول للزواحف والحيوانات الأليفة في السعودية. نقدم منتجات عالية الجودة وخدمات رعاية موثوقة.',
            'og:type' => 'website',
            'og:url' => url('/about'),
            'og:image' => asset('images/og-about.jpg'),
            'twitter:card' => 'summary_large_image',
            'twitter:title' => 'من نحن - Reptile House',
            'twitter:description' => 'تعرف على Reptile House، متجركم الأول للزواحف والحيوانات الأليفة في السعودية.',
            'twitter:image' => asset('images/og-about.jpg'),
        ];

        return response()->json($meta);
    }

    /**
     * Get SEO metadata for contact page
     */
    public function contact()
    {
        $meta = [
            'title' => 'اتصل بنا - Reptile House',
            'description' => 'تواصل مع فريق Reptile House للاستفسار عن المنتجات أو طلب المساعدة في رعاية حيواناتك الأليفة. رقم الهاتف والبريد الإلكتروني.',
            'keywords' => 'اتصل بنا, تواصل, Reptile House, زواحف, حيوانات, السعودية',
            'canonical' => url('/contact'),
            'robots' => 'index, follow',
            'og:title' => 'اتصل بنا - Reptile House',
            'og:description' => 'تواصل مع فريق Reptile House للاستفسار عن المنتجات أو طلب المساعدة في رعاية حيواناتك الأليفة. رقم الهاتف والبريد الإلكتروني.',
            'og:type' => 'website',
            'og:url' => url('/contact'),
            'og:image' => asset('images/og-contact.jpg'),
            'twitter:card' => 'summary_large_image',
            'twitter:title' => 'اتصل بنا - Reptile House',
            'twitter:description' => 'تواصل مع فريق Reptile House للاستفسار عن المنتجات أو طلب المساعدة في رعاية حيواناتك الأليفة.',
            'twitter:image' => asset('images/og-contact.jpg'),
        ];

        return response()->json($meta);
    }

    /**
     * Generate sitemap
     */
    public function sitemap()
    {
        $urls = [];

        // Static pages
        $urls[] = [
            'url' => url('/'),
            'lastmod' => now()->toISOString(),
            'changefreq' => 'weekly',
            'priority' => '1.0'
        ];

        $urls[] = [
            'url' => url('/products'),
            'lastmod' => now()->toISOString(),
            'changefreq' => 'weekly',
            'priority' => '0.8'
        ];

        $urls[] = [
            'url' => url('/articles'),
            'lastmod' => now()->toISOString(),
            'changefreq' => 'weekly',
            'priority' => '0.7'
        ];

        $urls[] = [
            'url' => url('/about'),
            'lastmod' => now()->toISOString(),
            'changefreq' => 'monthly',
            'priority' => '0.6'
        ];

        $urls[] = [
            'url' => url('/contact'),
            'lastmod' => now()->toISOString(),
            'changefreq' => 'monthly',
            'priority' => '0.5'
        ];

        // Products
        Product::where('is_available', true)->chunk(1000, function ($products) use (&$urls) {
            foreach ($products as $product) {
                $urls[] = [
                    'url' => url("/products/{$product->id}"),
                    'lastmod' => $product->updated_at->toISOString(),
                    'changefreq' => 'weekly',
                    'priority' => '0.8'
                ];
            }
        });

        // Articles
        Article::where('is_active', true)->chunk(1000, function ($articles) use (&$urls) {
            foreach ($articles as $article) {
                $urls[] = [
                    'url' => url("/articles/{$article->id}"),
                    'lastmod' => $article->updated_at->toISOString(),
                    'changefreq' => 'weekly',
                    'priority' => '0.7'
                ];
            }
        });

        return response()->view('seo.sitemap', compact('urls'))
            ->header('Content-Type', 'application/xml')
            ->header('Cache-Control', 'public, max-age=3600');
    }

    /**
     * Generate robots.txt
     */
    public function robots()
    {
        $content = "User-agent: *\n";
        $content .= "Allow: /\n";
        $content .= "Allow: /products\n";
        $content .= "Allow: /articles\n";
        $content .= "Allow: /about\n";
        $content .= "Allow: /contact\n";
        $content .= "Disallow: /admin\n";
        $content .= "Disallow: /api\n";
        $content .= "Disallow: /storage\n";
        $content .= "Disallow: /vendor\n";
        $content .= "\n";
        $sitemapPath = request()->is('api/*') ? '/api/seo/sitemap.xml' : '/seo/sitemap.xml';
        $content .= "Sitemap: " . url($sitemapPath) . "\n";

        return response($content)
            ->header('Content-Type', 'text/plain')
            ->header('Cache-Control', 'public, max-age=86400');
    }

    /**
     * Get structured data for homepage
     */
    public function structuredData()
    {
        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => 'Reptile House',
            'url' => url('/'),
            'description' => 'متجر متخصص للزواحف والحيوانات الأليفة في السعودية',
            'potentialAction' => [
                [
                    '@type' => 'SearchAction',
                    'target' => url('/products?search={search_term}'),
                    'query-input' => 'required name=search_term'
                ]
            ],
            'sameAs' => [
                'https://www.facebook.com/reptilehouse',
                'https://twitter.com/reptilehouse',
                'https://www.instagram.com/reptilehouse'
            ]
        ];

        return response()->json($data);
    }

    /**
     * Get SEO analytics data
     */
    public function analytics()
    {
        $data = Cache::remember('seo_analytics', 3600, function () {
            $totalProducts = Product::where('is_available', true)->count();
            $totalArticles = Article::where('is_active', true)->count();
            $totalUsers = User::count();

            $popularProducts = Product::withCount('orderItems')
                ->where('is_available', true)
                ->orderBy('order_items_count', 'desc')
                ->limit(5)
                ->get(['id', 'name', 'order_items_count']);

            $recentArticles = Article::where('is_active', true)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(['id', 'title', 'created_at']);

            return [
                'total_products' => $totalProducts,
                'total_articles' => $totalArticles,
                'total_users' => $totalUsers,
                'popular_products' => $popularProducts,
                'recent_articles' => $recentArticles,
                'last_updated' => now()->toISOString()
            ];
        });

        return response()->json($data);
    }

    private function resolveProductBySlugOrId(string $slugOrId): Product
    {
        $candidate = urldecode($slugOrId);
        if (ctype_digit($candidate)) {
            return Product::findOrFail((int) $candidate);
        }

        $byName = Product::where('name', $candidate)->first();
        if ($byName) {
            return $byName;
        }

        $slugName = str_replace('-', ' ', $candidate);
        return Product::where('name', $slugName)->firstOrFail();
    }

    private function resolveArticleBySlugOrId(string $slugOrId): Article
    {
        $candidate = urldecode($slugOrId);
        if (ctype_digit($candidate)) {
            return Article::findOrFail((int) $candidate);
        }

        $byTitle = Article::where('title', $candidate)->first();
        if ($byTitle) {
            return $byTitle;
        }

        $slugTitle = str_replace('-', ' ', $candidate);
        return Article::where('title', $slugTitle)->firstOrFail();
    }

    private function absoluteUrl(?string $path): string
    {
        if (!$path) return '';
        return str_starts_with($path, 'http') ? $path : url($path);
    }
}
