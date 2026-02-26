<?php

namespace App\Http\Controllers;

use App\Http\Controllers\SeoController;
use Illuminate\Http\Request;

class FrontendController extends Controller
{
    /**
     * Serve the frontend application
     */
    public function index()
    {
        // Get SEO metadata for homepage
        $seoData = app(SeoController::class)->homepage();
        
        return view('welcome', compact('seoData'));
    }

    /**
     * Serve the products page
     */
    public function products()
    {
        // Get SEO metadata for products page
        $seoData = app(SeoController::class)->products();
        
        return view('products', compact('seoData'));
    }

    /**
     * Serve the product details page
     */
    public function product($slug)
    {
        // Get SEO metadata for product
        $seoData = app(SeoController::class)->product($slug);
        
        return view('product', compact('seoData'));
    }

    /**
     * Serve the articles page
     */
    public function articles()
    {
        // Get SEO metadata for articles page
        $seoData = app(SeoController::class)->articles();
        
        return view('articles', compact('seoData'));
    }

    /**
     * Serve the article details page
     */
    public function article($slug)
    {
        // Get SEO metadata for article
        $seoData = app(SeoController::class)->article($slug);
        
        return view('article', compact('seoData'));
    }

    /**
     * Serve the about page
     */
    public function about()
    {
        // Get SEO metadata for about page
        $seoData = app(SeoController::class)->about();
        
        return view('about', compact('seoData'));
    }

    /**
     * Serve the contact page
     */
    public function contact()
    {
        // Get SEO metadata for contact page
        $seoData = app(SeoController::class)->contact();
        
        return view('contact', compact('seoData'));
    }
}
