<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class ProductionSeeder extends Seeder
{
    /**
     * Run the database seeds for production.
     */
    public function run(): void
    {
        $this->command->info('Starting production database seeding...');

        // Create admin user
        $this->createAdminUser();

        // Create sample categories
        $this->createCategories();

        // Create sample products
        $this->createSampleProducts();

        // Create company information
        $this->createCompanyInfo();

        // Create contact information
        $this->createContactInfo();

        // Create sample articles
        $this->createSampleArticles();

        // Create team members
        $this->createTeamMembers();

        $this->command->info('Production seeding completed successfully!');
    }

    /**
     * Create admin user for production
     */
    private function createAdminUser(): void
    {
        $this->command->info('Creating admin user...');

        DB::table('users')->insert([
            'name' => 'مدير النظام',
            'email' => 'admin@reptilehouse.com',
            'phone' => '+963-11-1234567',
            'password' => Hash::make('Admin@2026!'),
            'role' => 'admin',
            'status' => 'active',
            'two_factor_enabled' => false,
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $this->command->info('Admin user created successfully');
    }

    /**
     * Create product categories
     */
    private function createCategories(): void
    {
        $this->command->info('Creating product categories...');

        $categories = [
            [
                'name' => 'الزواحف',
                'slug' => 'reptiles',
                'description' => 'مجموعة متنوعة من الزواحف الأليفة',
                'image_url' => '/images/categories/reptiles.jpg',
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'الأفاعي',
                'slug' => 'snakes',
                'description' => 'أفاعي أليفة وآمنة للمبتدئين والمحترفين',
                'image_url' => '/images/categories/snakes.jpg',
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'السلاحف',
                'slug' => 'turtles',
                'description' => 'سلاحف برية ومائية متنوعة',
                'image_url' => '/images/categories/turtles.jpg',
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'الإمدادات',
                'slug' => 'supplies',
                'description' => 'جميع مستلزمات رعاية الزواحف',
                'image_url' => '/images/categories/supplies.jpg',
                'is_active' => true,
                'sort_order' => 4,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('categories')->insert($categories);
        $this->command->info('Product categories created successfully');
    }

    /**
     * Create sample products
     */
    private function createSampleProducts(): void
    {
        $this->command->info('Creating sample products...');

        $products = [
            [
                'name' => 'أفعى كورن الأحمر',
                'slug' => 'corn-snake-red',
                'description' => 'أفعى كورن حمراء جميلة وسهلة الرعاية، مثالية للمبتدئين في عالم الزواحف.',
                'price' => 150.00,
                'sale_price' => null,
                'category_id' => 2, // Snakes category
                'stock_quantity' => 5,
                'status' => 'active',
                'is_featured' => true,
                'weight' => 0.5,
                'dimensions' => '30x10x10',
                'sku' => 'CS-RED-001',
                'meta_title' => 'أفعى كورن الأحمر - Reptile House',
                'meta_description' => 'اشترِ أفعى كورن حمراء جميلة من Reptile House. زواحف أليفة مع ضمان الصحة والجودة.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'سلاحف برية صغيرة',
                'slug' => 'small-box-turtles',
                'description' => 'سلاحف برية صغيرة نشيطة وممتعة، تأتي مع جميع المستلزمات الأساسية.',
                'price' => 200.00,
                'sale_price' => 180.00,
                'category_id' => 3, // Turtles category
                'stock_quantity' => 3,
                'status' => 'active',
                'is_featured' => true,
                'weight' => 1.2,
                'dimensions' => '20x15x10',
                'sku' => 'BT-SMALL-001',
                'meta_title' => 'سلاحف برية صغيرة - Reptile House',
                'meta_description' => 'سلاحف برية صغيرة للبيع في Reptile House. حيوانات أليفة ممتعة مع ضمان الجودة.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'أقفاص زواحف كبيرة',
                'slug' => 'large-reptile-cages',
                'description' => 'أقفاص واسعة ومريحة للزواحف الكبيرة مع نظام تهوية متقدم.',
                'price' => 300.00,
                'sale_price' => null,
                'category_id' => 4, // Supplies category
                'stock_quantity' => 8,
                'status' => 'active',
                'is_featured' => false,
                'weight' => 15.0,
                'dimensions' => '100x60x80',
                'sku' => 'RC-LARGE-001',
                'meta_title' => 'أقفاص زواحف كبيرة - Reptile House',
                'meta_description' => 'أقفاص زواحف كبيرة عالية الجودة مع نظام تهوية متقدم في Reptile House.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('products')->insert($products);
        $this->command->info('Sample products created successfully');
    }

    /**
     * Create company information
     */
    private function createCompanyInfo(): void
    {
        $this->command->info('Creating company information...');

        DB::table('company_info')->insert([
            'name' => 'Reptile House',
            'description' => 'متجر متخصص للزواحف والحيوانات الأليفة في سوريا',
            'story' => 'بدأت Reptile House كشغف شخصي لرعاية الزواحف، وتطورت لتصبح الوجهة الأولى لعشاق الزواحف في المنطقة. نقدم أفضل المنتجات والخدمات مع التركيز على الصحة والجودة.',
            'vision' => 'أن نكون المتجر الأول في الشرق الأوسط للزواحف والحيوانات الأليفة، مع تقديم خدمات رعاية متخصصة وتعليمية.',
            'mission' => 'توفير بيئة آمنة وصحية للزواحف، وتقديم خدمات استشارية وتعليمية لعشاق الزواحف.',
            'logo_url' => '/images/logo.png',
            'mascot_url' => '/images/mascot.jpg',
            'established_year' => 2020,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $this->command->info('Company information created successfully');
    }

    /**
     * Create contact information
     */
    private function createContactInfo(): void
    {
        $this->command->info('Creating contact information...');

        DB::table('contact_info')->insert([
            'phone' => '+963-11-1234567',
            'email' => 'info@reptilehouse.com',
            'address' => 'دمشق، سوريا',
            'working_hours' => 'السبت - الخميس: 9:00 ص - 6:00 م',
            'facebook_url' => 'https://www.facebook.com/reptilehouse',
            'instagram_url' => 'https://www.instagram.com/reptilehouse',
            'whatsapp_number' => '+963-11-1234567',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $this->command->info('Contact information created successfully');
    }

    /**
     * Create sample articles
     */
    private function createSampleArticles(): void
    {
        $this->command->info('Creating sample articles...');

        $articles = [
            [
                'title' => 'دليل شامل لرعاية أفعى الكورن',
                'slug' => 'corn-snake-care-guide',
                'summary' => 'دليل شامل لرعاية أفعى الكورن في المنزل',
                'content' => 'أفعى الكورن هي واحدة من أفضل الزواحف الأليفة للمبتدئين...',
                'image_url' => '/images/articles/corn-snake-care.jpg',
                'author' => 'فريق Reptile House',
                'status' => 'published',
                'published_at' => Carbon::now(),
                'meta_title' => 'دليل رعاية أفعى الكورن - Reptile House',
                'meta_description' => 'تعلم كيفية رعاية أفعى الكورن في المنزل مع نصائح الخبراء في Reptile House.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'أهمية التهوية في أقفاص الزواحف',
                'slug' => 'reptile-cage-ventilation-importance',
                'summary' => 'لماذا التهوية مهمة جداً لصحة زواحفك',
                'content' => 'التهوية الجيدة ضرورية لصحة الزواحف...',
                'image_url' => '/images/articles/ventilation.jpg',
                'author' => 'د. أحمد محمد',
                'status' => 'published',
                'published_at' => Carbon::now(),
                'meta_title' => 'أهمية التهوية في أقفاص الزواحف - Reptile House',
                'meta_description' => 'اكتشف أهمية التهوية الجيدة لصحة زواحفك وكيفية اختيار نظام التهوية المناسب.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('articles')->insert($articles);
        $this->command->info('Sample articles created successfully');
    }

    /**
     * Create team members
     */
    private function createTeamMembers(): void
    {
        $this->command->info('Creating team members...');

        $teamMembers = [
            [
                'name' => 'أحمد محمد',
                'role' => 'طبيب بيطري متخصص',
                'bio' => 'دكتور بيطري متخصص في الزواحف والحيوانات الغريبة مع أكثر من 10 سنوات من الخبرة.',
                'image_url' => '/images/team/ahmed.jpg',
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'فاطمة علي',
                'role' => 'أخصائية تغذية',
                'bio' => 'أخصائية تغذية متخصصة في تغذية الزواحف والحيوانات الغريبة.',
                'image_url' => '/images/team/fatma.jpg',
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('team_members')->insert($teamMembers);
        $this->command->info('Team members created successfully');
    }
}
