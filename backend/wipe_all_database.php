<?php

/**
 * ⚠️ COMPLETE DATABASE WIPE SCRIPT ⚠️
 *
 * This script will DELETE ALL DATA from the database except migrations.
 * يقوم هذا السكربت بحذف جميع البيانات من قاعدة البيانات
 *
 * ⛔ CANNOT BE UNDONE - لا يمكن التراجع عن هذا الإجراء ⛔
 */

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

define('SEPARATOR', "═══════════════════════════════════════════════════════════\n");
echo "\n";
echo SEPARATOR;
echo "⚠️  COMPLETE DATABASE WIPE - مسح كامل لقاعدة البيانات  ⚠️\n";
echo SEPARATOR;
echo "\n";
echo "⛔ ALL DATA WILL BE PERMANENTLY DELETED ⛔\n";
echo "⛔ سيتم حذف جميع البيانات بشكل دائم ⛔\n";
echo "\n";

// List of all tables to truncate (except migrations)
$tablesToWipe = [
    // Content tables
    'reptiles',
    'supplies',
    'articles',
    'services',
    'hero_slides',
    'team_members',
    'company_infos',
    'contact_infos',
    'policies',
    'promotional_cards',
    'filters',
    'filter_options',
    
    // Personal data tables
    'addresses',
    'orders',
    'order_items',
    'cart_items',
    'wishlists',
    'recent_views',
    
    // Auth tables
    'users',
    'preferences',
    'personal_access_tokens',
    
    // Session tables
    'sessions',
    'cache',
    'cache_locks',
    'job_batches',
    'jobs',
    'failed_jobs',
];

echo "📋 Tables that will be wiped:\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
foreach ($tablesToWipe as $table) {
    echo "  • $table\n";
}
echo "\n";
echo "🔒 Tables that will be PRESERVED:\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "  • migrations (database structure)\n";
echo "\n";

// Confirmation prompt
echo "⚠️  Type 'DELETE ALL' to confirm (case sensitive): ";
$handle = fopen("php://stdin", "r");
$confirmation = trim(fgets($handle));
fclose($handle);

if ($confirmation !== 'DELETE ALL') {
    echo "\n❌ Operation cancelled - لم يتم التأكيد\n\n";
    exit(0);
}

echo "\n";
echo "🔄 Starting complete database wipe...\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

try {
    DB::beginTransaction();
    
    // Disable foreign key checks
    DB::statement('SET FOREIGN_KEY_CHECKS=0');
    
    $deletedCount = 0;
    $errorCount = 0;
    
    foreach ($tablesToWipe as $table) {
        try {
            // Check if table exists
            $exists = DB::select("SHOW TABLES LIKE '$table'");
            
            if (!empty($exists)) {
                // Get count before truncate
                $count = DB::table($table)->count();
                
                // Truncate the table
                DB::statement("TRUNCATE TABLE `$table`");
                
                if ($count > 0) {
                    echo "✅ Wiped $table ($count rows deleted)\n";
                    $deletedCount++;
                } else {
                    echo "⚪ Skipped $table (already empty)\n";
                }
            } else {
                echo "⚪ Skipped $table (table doesn't exist)\n";
            }
        } catch (\Exception $e) {
            echo "❌ Error wiping $table: " . $e->getMessage() . "\n";
            $errorCount++;
        }
    }
    
    // Re-enable foreign key checks
    DB::statement('SET FOREIGN_KEY_CHECKS=1');
    
    echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    echo "🧹 Creating fresh admin account...\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    // Create fresh admin user
    $admin = DB::table('users')->insertGetId([
        'name' => 'Administrator',
        'email' => 'admin@semo.com',
        'password' => Hash::make('admin123'),
        'role' => 'admin',
        'phone' => null,
        'status' => 'active',
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    
    // Create admin preferences
    DB::table('preferences')->insert([
        'user_id' => $admin,
        'currency' => 'SYP',
        'notifications' => true,
        'language' => 'ar',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    
    DB::commit();
    
    echo "✅ Admin account created successfully!\n";
    echo "   📧 Email: admin@semo.com\n";
    echo "   🔑 Password: admin123\n";
    echo "\n";
    echo SEPARATOR;
    echo "✅ DATABASE COMPLETELY WIPED - تم مسح قاعدة البيانات ✅\n";
    echo SEPARATOR;
    echo "\n";
    echo "📊 Summary:\n";
    echo "  • Tables wiped: $deletedCount\n";
    echo "  • Errors: $errorCount\n";
    echo "  • Admin account: admin@semo.com / admin123\n";
    echo "\n";
    echo "⚠️  IMPORTANT NEXT STEPS:\n";
    echo "  1. Clear browser cookies and cache\n";
    echo "  2. Restart backend server (Ctrl+C then restart)\n";
    echo "  3. Login with: admin@semo.com / admin123\n";
    echo "\n";
    
} catch (\Exception $e) {
    DB::rollBack();
    DB::statement('SET FOREIGN_KEY_CHECKS=1');
    
    echo "\n";
    echo SEPARATOR;
    echo "❌ ERROR OCCURRED - حدث خطأ\n";
    echo SEPARATOR;
    echo "\n";
    echo "Error: " . $e->getMessage() . "\n";
    echo "\n";
    exit(1);
}
