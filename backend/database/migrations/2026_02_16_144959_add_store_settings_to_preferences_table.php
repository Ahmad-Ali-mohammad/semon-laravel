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
        Schema::table('preferences', function (Blueprint $table) {
            $table->string('currency')->default('USD');
            $table->decimal('tax_rate', 5, 2)->default(10.00);
            $table->decimal('shipping_fee', 10, 2)->default(15.00);
            $table->decimal('free_shipping_threshold', 10, 2)->default(100.00);
            $table->boolean('maintenance_mode')->default(false);
            $table->boolean('allow_guest_checkout')->default(false);
            $table->boolean('require_email_verification')->default(true);
            $table->string('default_user_role')->default('user');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('preferences', function (Blueprint $table) {
            $table->dropColumn([
                'currency',
                'tax_rate',
                'shipping_fee',
                'free_shipping_threshold',
                'maintenance_mode',
                'allow_guest_checkout',
                'require_email_verification',
                'default_user_role'
            ]);
        });
    }
};
