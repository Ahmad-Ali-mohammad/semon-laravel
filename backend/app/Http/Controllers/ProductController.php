<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        // Cache paginated products for 1 minute to reduce DB load on high traffic
        $page = request()->get('page', 1);
        
        $key = "products_index_page_{$page}";

        $result = cache()->remember($key, 60, function () {
            return Product::orderByDesc('id')->paginate(20);
        });

        return response()->json($result);
    }

    public function show(string $id)
    {
        $key = "product_{$id}";
        $product = cache()->remember($key, 60, function () use ($id) {
            return Product::findOrFail($id);
        });
        return response()->json($product);
    }

    public function store(ProductStoreRequest $request)
    {
        $product = Product::create($request->validated());
        
        // Clear product list caches when new product is added
        for ($i = 1; $i <= 10; $i++) {
            cache()->forget("products_index_page_{$i}");
        }
        
        return response()->json($product, 201);
    }

    public function update(ProductUpdateRequest $request, string $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->validated());
        
        // Clear caches
        cache()->forget("product_{$id}");
        for ($i = 1; $i <= 10; $i++) {
            cache()->forget("products_index_page_{$i}");
        }
        
        return response()->json($product);
    }

    public function toggleVisibility(string $id)
    {
        $product = Product::findOrFail($id);
        $product->is_available = !$product->is_available;
        $product->save();
        
        // Clear caches
        cache()->forget("product_{$id}");
        for ($i = 1; $i <= 10; $i++) {
            cache()->forget("products_index_page_{$i}");
        }

        return response()->json($product);
    }

    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        
        // Clear caches
        cache()->forget("product_{$id}");
        for ($i = 1; $i <= 10; $i++) {
            cache()->forget("products_index_page_{$i}");
        }

        return response()->json(['message' => 'Product deleted.']);
    }
}
