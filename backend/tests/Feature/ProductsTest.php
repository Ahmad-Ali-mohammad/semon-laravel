<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Basic GET /products returns a 200 status and JSON structure.
     */
    public function test_products_endpoint_returns_success()
    {
        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/json');
    }
}
