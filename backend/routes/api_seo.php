<?php

use App\Http\Controllers\Api\V1\SeoController;
use Illuminate\Support\Facades\Route;

// SEO API Routes
Route::prefix('seo')->group(function () {
    Route::get('/homepage', [SeoController::class, 'homepage'])->name('api.seo.homepage');
    Route::get('/products', [SeoController::class, 'products'])->name('api.seo.products');
    Route::get('/product/{slug}', [SeoController::class, 'product'])->name('api.seo.product');
    Route::get('/articles', [SeoController::class, 'articles'])->name('api.seo.articles');
    Route::get('/article/{slug}', [SeoController::class, 'article'])->name('api.seo.article');
    Route::get('/about', [SeoController::class, 'about'])->name('api.seo.about');
    Route::get('/contact', [SeoController::class, 'contact'])->name('api.seo.contact');
    Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('api.seo.sitemap');
    Route::get('/robots.txt', [SeoController::class, 'robots'])->name('api.seo.robots');
    Route::get('/structured-data', [SeoController::class, 'structuredData'])->name('api.seo.structured-data');
    Route::get('/analytics', [SeoController::class, 'analytics'])->name('api.seo.analytics');
});
