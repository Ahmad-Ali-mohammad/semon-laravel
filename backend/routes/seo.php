<?php

use App\Http\Controllers\Api\V1\SeoController;
use Illuminate\Support\Facades\Route;

// SEO Routes
Route::prefix('seo')->group(function () {
    Route::get('/homepage', [SeoController::class, 'homepage'])->name('seo.homepage');
    Route::get('/products', [SeoController::class, 'products'])->name('seo.products');
    Route::get('/product/{slug}', [SeoController::class, 'product'])->name('seo.product');
    Route::get('/articles', [SeoController::class, 'articles'])->name('seo.articles');
    Route::get('/article/{slug}', [SeoController::class, 'article'])->name('seo.article');
    Route::get('/about', [SeoController::class, 'about'])->name('seo.about');
    Route::get('/contact', [SeoController::class, 'contact'])->name('seo.contact');
    Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('seo.sitemap');
    Route::get('/robots.txt', [SeoController::class, 'robots'])->name('seo.robots');
    Route::get('/structured-data', [SeoController::class, 'structuredData'])->name('seo.structured-data');
    Route::get('/analytics', [SeoController::class, 'analytics'])->name('seo.analytics');
});
