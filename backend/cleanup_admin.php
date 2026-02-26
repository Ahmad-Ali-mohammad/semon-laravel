<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Address;
use App\Models\Order;
use App\Models\CartItem;
use App\Models\Wishlist;
use App\Models\RecentView;

echo "=== معلومات حسابات المسؤولين الحالية ===\n\n";

$admins = User::whereIn('role', ['admin', 'manager'])->get();

foreach ($admins as $admin) {
    echo "المعرف: {$admin->id}\n";
    echo "الاسم: {$admin->name}\n";
    echo "البريد: {$admin->email}\n";
    echo "الدور: {$admin->role}\n";
    
    // فحص البيانات المرتبطة
    $addressCount = Address::where('user_id', $admin->id)->count();
    $orderCount = Order::where('user_id', $admin->id)->count();
    $cartCount = CartItem::where('user_id', $admin->id)->count();
    $wishlistCount = Wishlist::where('user_id', $admin->id)->count();
    $recentViewCount = RecentView::where('user_id', $admin->id)->count();
    
    echo "العناوين: {$addressCount}\n";
    echo "الطلبات: {$orderCount}\n";
    echo "عناصر العربة: {$cartCount}\n";
    echo "قائمة الرغبات: {$wishlistCount}\n";
    echo "المشاهدات الأخيرة: {$recentViewCount}\n";
    echo str_repeat("-", 50) . "\n\n";
}

echo "\nهل تريد حذف جميع حسابات المسؤولين والبيانات المرتبطة بهم؟ (yes/no): ";
$confirm = trim(fgets(STDIN));

if (strtolower($confirm) === 'yes') {
    foreach ($admins as $admin) {
        echo "جاري حذف المسؤول: {$admin->email}...\n";
        
        // حذف جميع البيانات المرتبطة
        Address::where('user_id', $admin->id)->delete();
        Order::where('user_id', $admin->id)->delete();
        CartItem::where('user_id', $admin->id)->delete();
        Wishlist::where('user_id', $admin->id)->delete();
        RecentView::where('user_id', $admin->id)->delete();
        
        // حذف المستخدم
        $admin->delete();
        
        echo "✓ تم الحذف\n";
    }
    
    echo "\n=== إنشاء حساب مسؤول جديد ===\n";
    
    $newAdmin = User::create([
        'name' => 'مدير الموقع',
        'email' => 'admin@semo.com',
        'password' => bcrypt('admin123'),
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    
    echo "\n✓ تم إنشاء حساب المسؤول الجديد:\n";
    echo "البريد الإلكتروني: admin@semo.com\n";
    echo "كلمة المرور: admin123\n";
    echo "الدور: admin\n";
    
} else {
    echo "تم الإلغاء.\n";
}
