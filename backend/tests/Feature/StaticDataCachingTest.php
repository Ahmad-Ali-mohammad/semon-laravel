<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;
use App\Models\CompanyInfo;
use App\Models\ContactInfo;
use App\Models\ShamCashConfig;
use App\Models\Service;

class StaticDataCachingTest extends TestCase
{
    use RefreshDatabase;

    public function test_company_info_is_cached()
    {
        Cache::flush();
        CompanyInfo::create(['name' => 'First', 'name_english' => 'First', 'description' => 'x']);

        $r1 = $this->getJson('/api/company-info');
        $r1->assertStatus(200)->assertJson(['name' => 'First']);

        CompanyInfo::query()->update(['name' => 'Second']);
        $r2 = $this->getJson('/api/company-info');
        $this->assertEquals($r1->json(), $r2->json());

        Cache::forget('company_info');
        $r3 = $this->getJson('/api/company-info');
        $this->assertNotEquals($r1->json(), $r3->json());
    }

    public function test_contact_info_is_cached()
    {
        Cache::flush();
        ContactInfo::create(['email' => 'first@example.com', 'phone' => '123', 'address' => '', 'city' => '', 'country' => '', 'working_hours' => '']);
        $r1 = $this->getJson('/api/contact-info');
        $r1->assertStatus(200)->assertJson(['email' => 'first@example.com']);
        ContactInfo::query()->update(['email' => 'second@example.com']);
        $r2 = $this->getJson('/api/contact-info');
        $this->assertEquals($r1->json(), $r2->json());
        Cache::forget('contact_info');
        $r3 = $this->getJson('/api/contact-info');
        $this->assertNotEquals($r1->json(), $r3->json());
    }

    public function test_shamcash_config_is_cached()
    {
        Cache::flush();
        ShamCashConfig::create(['account_code' => '111', 'barcode_image_url' => '', 'is_active' => false, 'account_holder_name' => '', 'phone_number' => '', 'payment_instructions' => '']);
        $r1 = $this->getJson('/api/shamcash-config');
        $r1->assertStatus(200)->assertJson(['account_code' => '111']);
        ShamCashConfig::query()->update(['account_code' => '222']);
        $r2 = $this->getJson('/api/shamcash-config');
        $this->assertEquals($r1->json(), $r2->json());
        Cache::forget('shamcash_config');
        $r3 = $this->getJson('/api/shamcash-config');
        $this->assertNotEquals($r1->json(), $r3->json());
    }

    public function test_services_index_is_cached_and_invalidated()
    {
        Cache::flush();
        Service::create(['title' => 'One', 'description' => 'x', 'is_active' => true]);
        $r1 = $this->getJson('/api/services');
        $r1->assertStatus(200)->assertJsonCount(1);
        Service::create(['title' => 'Two', 'description' => 'y', 'is_active' => true]);
        $r2 = $this->getJson('/api/services');
        $this->assertEquals($r1->json(), $r2->json());

        // clear cache and check again
        Cache::forget('services_index');
        $r3 = $this->getJson('/api/services');
        $this->assertNotEquals($r1->json(), $r3->json());
    }
}
