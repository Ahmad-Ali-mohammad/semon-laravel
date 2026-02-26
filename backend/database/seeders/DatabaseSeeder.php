<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default admin account only
        User::query()->updateOrCreate(
            ['email' => 'admin@semo.com'],
            [
                'name' => 'المسؤول الرئيسي',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        // Note: All content should be added via admin dashboard
        // No demo data is seeded to ensure clean production start
    }
}
