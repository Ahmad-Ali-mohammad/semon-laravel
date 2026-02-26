<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shamcash_config', function (Blueprint $table) {
            $table->id();
            $table->string('barcode_image_url')->nullable();
            $table->string('account_code')->nullable();
            $table->string('account_holder_name')->nullable();
            $table->string('phone_number')->nullable();
            $table->text('payment_instructions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shamcash_config');
    }
};
