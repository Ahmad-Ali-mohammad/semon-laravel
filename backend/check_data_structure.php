<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

echo "=== التحقق من بنية بيانات الموقع ===\n\n";

$tables = [
    'reptiles' => 'المنتجات (الزواحف)',
    'supplies' => 'المستلزمات',
    'articles' => 'المقالات',
    'services' => 'الخدمات',
    'hero_slides' => 'صور البانر',
    'team_members' => 'فريق العمل',
    'company_infos' => 'معلومات الشركة',
    'contact_infos' => 'معلومات الاتصال',
    'policies' => 'السياسات',
    'promotional_cards' => 'البطاقات الترويجية',
];

foreach ($tables as $table => $arabicName) {
    if (Schema::hasTable($table)) {
        $columns = Schema::getColumnListing($table);
        $hasUserId = in_array('user_id', $columns);
        $count = DB::table($table)->count();
        
        $status = $hasUserId ? '⚠️  مرتبط بمستخدم' : '✓ مستقل';
        
        echo "{$arabicName} ({$table}):\n";
        echo "  العدد: {$count}\n";
        echo "  الحالة: {$status}\n";
        
        if ($hasUserId) {
            $withUsers = DB::table($table)->whereNotNull('user_id')->count();
            echo "  عناصر مرتبطة بمستخدمين: {$withUsers}\n";
        }
        
        echo "\n";
    }
}

echo "\n=== البيانات الشخصية للمستخدمين ===\n\n";

$personalTables = [
    'addresses' => 'العناوين',
    'orders' => 'الطلبات',
    'cart_items' => 'عربة التسوق',
    'wishlists' => 'قائمة الرغبات',
    'recent_views' => 'المشاهدات الأخيرة',
];

foreach ($personalTables as $table => $arabicName) {
    if (Schema::hasTable($table)) {
        $count = DB::table($table)->count();
        echo "{$arabicName} ({$table}): {$count} عنصر\n";
    }
}

echo "\n=== إحصائيات المستخدمين ===\n";

$users = DB::table('users')->select('role', DB::raw('count(*) as count'))->groupBy('role')->get();
foreach ($users as $user) {
    echo "{$user->role}: {$user->count}\n";
}
