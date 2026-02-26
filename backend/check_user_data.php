<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== التحقق من البيانات الشخصية ===\n\n";

// التحقق من العناوين
$addresses = DB::table('addresses')->get();
echo "العناوين:\n";
foreach ($addresses as $addr) {
    $user = DB::table('users')->where('id', $addr->user_id)->first();
    echo "  المستخدم: {$user->email} ({$user->role})\n";
    echo "  العنوان: " . json_encode($addr, JSON_UNESCAPED_UNICODE) . "\n\n";
}

// التحقق من الطلبات
$orders = DB::table('orders')->get();
echo "الطلبات:\n";
foreach ($orders as $order) {
    $user = DB::table('users')->where('id', $order->user_id)->first();
    echo "  المستخدم: {$user->email} ({$user->role})\n";
    echo "  البيانات: " . json_encode($order, JSON_UNESCAPED_UNICODE) . "\n\n";
}

// التحقق من جميع المستخدمين
echo "=== جميع المستخدمين ===\n";
$users = DB::table('users')->get();
foreach ($users as $user) {
    echo "المعرف: {$user->id}\n";
    echo "الاسم: {$user->name}\n";
    echo "البريد: {$user->email}\n";
    echo "الدور: {$user->role}\n\n";
}
