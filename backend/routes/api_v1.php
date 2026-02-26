<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SupplyController;
use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Route;

// API Version 1 Routes
// Authentication Routes
Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:auth');
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:auth');
Route::post('/auth/password/forgot', [PasswordResetController::class, 'sendResetLink'])->middleware('throttle:password-reset');
Route::post('/auth/password/reset', [PasswordResetController::class, 'reset'])->middleware('throttle:password-reset');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
});

// Public Routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/supplies', [SupplyController::class, 'index']);
Route::get('/supplies/{id}', [SupplyController::class, 'show']);
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
