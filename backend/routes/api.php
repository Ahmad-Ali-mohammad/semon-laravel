<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\CompanyInfoController;
use App\Http\Controllers\ContactInfoController;
use App\Http\Controllers\FilterGroupController;
use App\Http\Controllers\HeroSlideController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentProofController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\PreferenceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PromotionalCardController;
use App\Http\Controllers\CustomCategoryController;
use App\Http\Controllers\CustomSpeciesController;
use App\Http\Controllers\ShamCashConfigController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SupplyController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\RecentViewController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// Health Check
Route::get('/health', function () {
    return ['status' => 'ok', 'version' => 'v1'];
});

// API Versioning
Route::prefix('v1')->group(function () {
    require __DIR__.'/api_v1.php';
});

// Legacy Routes (for backward compatibility - will be deprecated)
Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:auth');
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:auth');
Route::post('/auth/password/forgot', [PasswordResetController::class, 'sendResetLink'])->middleware('throttle:password-reset');
Route::post('/auth/password/reset', [PasswordResetController::class, 'reset'])->middleware('throttle:password-reset');

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/supplies', [SupplyController::class, 'index']);
Route::get('/supplies/{id}', [SupplyController::class, 'show']);
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::get('/hero-slides', [HeroSlideController::class, 'index']);
Route::get('/company-info', [CompanyInfoController::class, 'show']);
Route::get('/contact-info', [ContactInfoController::class, 'show']);
Route::get('/team', [TeamMemberController::class, 'index']);
Route::get('/filters', [FilterGroupController::class, 'index']);
Route::get('/shamcash-config', [ShamCashConfigController::class, 'show']);
Route::get('/promotions', [PromotionalCardController::class, 'index']);
Route::get('/policies', [PolicyController::class, 'index']);
Route::get('/custom-categories', [CustomCategoryController::class, 'index']);
Route::get('/custom-species', [CustomSpeciesController::class, 'index']);
Route::get('/preferences', [PreferenceController::class, 'show']);
Route::get('/services', [ServiceController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/orders/{order}/payment-proof', [PaymentProofController::class, 'store']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);

    // Recent Views
    Route::get('/recent-views', [RecentViewController::class, 'index']);
    Route::post('/recent-views', [RecentViewController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'admin', 'audit'])->prefix('admin')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);

    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::patch('/products/{id}/toggle-visibility', [ProductController::class, 'toggleVisibility']);

    Route::post('/supplies', [SupplyController::class, 'store']);
    Route::put('/supplies/{id}', [SupplyController::class, 'update']);
    Route::delete('/supplies/{id}', [SupplyController::class, 'destroy']);
    Route::patch('/supplies/{id}/toggle-visibility', [SupplyController::class, 'toggleVisibility']);

    Route::get('/orders', [OrderController::class, 'adminIndex']);
    Route::get('/orders/{id}', [OrderController::class, 'adminShow']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::patch('/orders/{id}/payment-status', [OrderController::class, 'updatePaymentStatus']);
    Route::delete('/orders/{id}', [OrderController::class, 'destroy']);

    Route::get('/payment-proofs', [PaymentProofController::class, 'index']);
    Route::patch('/payment-proofs/{id}/status', [PaymentProofController::class, 'updateStatus']);

    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
    Route::patch('/articles/{id}/toggle-visibility', [ArticleController::class, 'toggleVisibility']);

    Route::post('/hero-slides', [HeroSlideController::class, 'store']);
    Route::put('/hero-slides/{id}', [HeroSlideController::class, 'update']);
    Route::delete('/hero-slides/{id}', [HeroSlideController::class, 'destroy']);
    Route::patch('/hero-slides/{id}/toggle-visibility', [HeroSlideController::class, 'toggleVisibility']);

    Route::put('/company-info', [CompanyInfoController::class, 'update']);
    Route::put('/contact-info', [ContactInfoController::class, 'update']);

    Route::post('/team', [TeamMemberController::class, 'store']);
    Route::put('/team/{id}', [TeamMemberController::class, 'update']);
    Route::delete('/team/{id}', [TeamMemberController::class, 'destroy']);
    Route::patch('/team/{id}/toggle-visibility', [TeamMemberController::class, 'toggleVisibility']);

    Route::post('/filters', [FilterGroupController::class, 'store']);
    Route::put('/filters/{id}', [FilterGroupController::class, 'update']);
    Route::delete('/filters/{id}', [FilterGroupController::class, 'destroy']);
    Route::patch('/filters/{id}/toggle-visibility', [FilterGroupController::class, 'toggleVisibility']);

    Route::put('/shamcash-config', [ShamCashConfigController::class, 'update']);

    Route::get('/media', [MediaController::class, 'index']);
    Route::post('/media', [MediaController::class, 'store']);
    Route::delete('/media/{id}', [MediaController::class, 'destroy']);

    Route::post('/promotions', [PromotionalCardController::class, 'store']);
    Route::put('/promotions/{promotion}', [PromotionalCardController::class, 'update']);
    Route::delete('/promotions/{promotion}', [PromotionalCardController::class, 'destroy']);
    Route::patch('/promotions/{promotion}/toggle-visibility', [PromotionalCardController::class, 'toggleVisibility']);

    Route::post('/policies', [PolicyController::class, 'store']);
    Route::put('/policies/{policy}', [PolicyController::class, 'update']);
    Route::delete('/policies/{policy}', [PolicyController::class, 'destroy']);
    Route::patch('/policies/{policy}/toggle-visibility', [PolicyController::class, 'toggleVisibility']);

    Route::post('/custom-categories', [CustomCategoryController::class, 'store']);
    Route::put('/custom-categories/{customCategory}', [CustomCategoryController::class, 'update']);
    Route::delete('/custom-categories/{customCategory}', [CustomCategoryController::class, 'destroy']);

    Route::post('/custom-species', [CustomSpeciesController::class, 'store']);
    Route::put('/custom-species/{customSpecies}', [CustomSpeciesController::class, 'update']);
    Route::delete('/custom-species/{customSpecies}', [CustomSpeciesController::class, 'destroy']);

    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
    Route::patch('/services/{id}/toggle-visibility', [ServiceController::class, 'toggleVisibility']);

    Route::put('/preferences', [PreferenceController::class, 'update']);

    // API keys
    Route::get('/api-keys', [ApiKeyController::class, 'index']);
    Route::post('/api-keys', [ApiKeyController::class, 'store']);
    Route::put('/api-keys/{apiKey}', [ApiKeyController::class, 'update']);
    Route::patch('/api-keys/{apiKey}', [ApiKeyController::class, 'update']);
    Route::post('/api-keys/{apiKey}/regenerate', [ApiKeyController::class, 'regenerate']);
    Route::delete('/api-keys/{apiKey}', [ApiKeyController::class, 'destroy']);

    // Backups
    Route::get('/backups', [BackupController::class, 'index']);
    Route::post('/backups', [BackupController::class, 'store']);
    Route::post('/backups/{backup}/restore', [BackupController::class, 'restore']);
    Route::delete('/backups/{backup}', [BackupController::class, 'destroy']);
    Route::get('/backups/{backup}/download', [BackupController::class, 'download']);
    Route::put('/backups/settings', [BackupController::class, 'updateSettings']);

    // Reports
    Route::get('/reports', [ReportController::class, 'index']);
});

// Include SEO routes
require __DIR__.'/api_seo.php';

// Include Security routes
require __DIR__.'/api_security.php';
