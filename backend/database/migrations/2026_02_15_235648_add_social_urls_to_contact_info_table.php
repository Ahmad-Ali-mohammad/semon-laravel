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
        Schema::table('contact_info', function (Blueprint $table) {
            // Note: facebook, instagram, whatsapp, telegram already exist
            // Adding new URL fields for better management
            $table->string('facebook_url', 500)->nullable()->after('telegram');
            $table->string('instagram_url', 500)->nullable()->after('facebook_url');
            $table->string('whatsapp_url', 500)->nullable()->after('instagram_url');
            $table->string('telegram_url', 500)->nullable()->after('whatsapp_url');
            $table->string('twitter_url', 500)->nullable()->after('telegram_url');
            $table->string('youtube_url', 500)->nullable()->after('twitter_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_info', function (Blueprint $table) {
            $table->dropColumn(['facebook_url', 'instagram_url', 'whatsapp_url', 'telegram_url', 'twitter_url', 'youtube_url']);
        });
    }
};
