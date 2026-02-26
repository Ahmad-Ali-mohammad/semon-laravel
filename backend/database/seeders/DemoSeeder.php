<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Article;
use App\Models\CompanyInfo;
use App\Models\ContactInfo;
use App\Models\FilterGroup;
use App\Models\FilterOption;
use App\Models\HeroSlide;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ShamCashConfig;
use App\Models\Supply;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@example.com')->first();
        $user = User::where('email', 'user@example.com')->first();

        // Products
        if (Product::count() === 0) {
            Product::insert([
                [
                    'name' => 'Royal Python',
                    'species' => 'Python regius',
                    'description' => 'Docile python ideal للمبتدئين، ألوان جميلة وحجم متوسط.',
                    'price' => 250.00,
                    'image_url' => '/assets/photo_2026-02-04_07-13-35.jpg',
                    'rating' => 4.7,
                    'is_available' => true,
                    'status' => 'available',
                    'category' => 'snake',
                    'care_instructions' => 'دفء 28-31°C، رطوبة 50-60%, مخبأ مناسب وطعام من الفئران المجمدة.'
                ],
                [
                    'name' => 'Leopard Gecko',
                    'species' => 'Eublepharis macularius',
                    'description' => 'وزغة سهلة العناية بعيون جميلة ونمط مرقط.',
                    'price' => 120.00,
                    'image_url' => '/assets/photo_2026-02-04_07-13-35.jpg',
                    'rating' => 4.5,
                    'is_available' => true,
                    'status' => 'available',
                    'category' => 'lizard',
                    'care_instructions' => 'درجة حرارة 24-30°C، أماكن للاختباء، كالسيوم وفيتامين D3.'
                ],
                [
                    'name' => 'Red-Eared Slider',
                    'species' => 'Trachemys scripta elegans',
                    'description' => 'سلحفاة مائية نشيطة، تحتاج حوض مائي وحجر basking.',
                    'price' => 90.00,
                    'image_url' => '/assets/photo_2026-02-04_07-13-35.jpg',
                    'rating' => 4.3,
                    'is_available' => true,
                    'status' => 'available',
                    'category' => 'turtle',
                    'care_instructions' => 'حوض بفلترة جيدة، basking lamp، نظام غذائي متنوع.'
                ],
            ]);
        }

        // Supplies
        if (Supply::count() === 0) {
            Supply::insert([
                [
                    'name' => 'Terrarium Heat Lamp',
                    'category' => 'heating',
                    'description' => 'مصباح حرارة بقدرة 75W مع حماية حرارية.',
                    'price' => 45.00,
                    'image_url' => '/assets/photo_2026-02-04_07-13-35.jpg',
                    'rating' => 4.6,
                    'is_available' => true,
                    'status' => 'available',
                ],
                [
                    'name' => 'Reptile Calcium Powder',
                    'category' => 'health',
                    'description' => 'بودرة كالسيوم مع فيتامين D3 لدعم العظام.',
                    'price' => 18.50,
                    'image_url' => '/assets/photo_2026-02-04_07-13-35.jpg',
                    'rating' => 4.8,
                    'is_available' => true,
                    'status' => 'available',
                ],
            ]);
        }

        // Hero slides
        if (HeroSlide::count() === 0) {
            HeroSlide::insert([
                [
                    'image_url' => '/assets/photo_2026-02-04_07-13-35.jpg',
                    'title' => 'أهلاً بك في Reptile House',
                    'subtitle' => 'أفضل الزواحف والإكسسوارات مع شحن سريع.',
                    'button_text' => 'تسوق الآن',
                    'link' => 'showcase',
                    'is_active' => true,
                    'sort_order' => 1,
                ],
                [
                    'image_url' => '/assets/photo_2026-02-04_07-13-35.jpg',
                    'title' => 'إثبات الدفع سهل وسريع',
                    'subtitle' => 'حمّل إيصال الدفع وتابع حالة الطلب لحظياً.',
                    'button_text' => 'تتبع الطلب',
                    'link' => 'orders',
                    'is_active' => true,
                    'sort_order' => 2,
                ],
            ]);
        }

        // Articles
        if (Article::count() === 0 && $admin) {
            Article::insert([
                [
                    'title' => 'دليل العناية بالأفاعي للمبتدئين',
                    'excerpt' => 'خطوات أساسية لتهيئة الحوض والحرارة والتغذية.',
                    'content' => 'ابدأ بضبط الحرارة، وفر مخبأين، وقدّم فئراناً مجمدة ذات حجم مناسب.',
                    'category' => 'O¦O1U,USU.US',
                    'author_id' => $admin->id,
                    'image_url' => '/assets/photo_2026-02-04_07-13-35.jpg',
                    'published_at' => now(),
                ],
                [
                    'title' => 'كيف تختار السلحفاة المناسبة لك',
                    'excerpt' => 'اعتبارات المساحة، الإضاءة UVB، والنظام الغذائي.',
                    'content' => 'تأكد من وجود مساحة كافية للماء ومنطقة basking مع UVB.',
                    'category' => 'OœOrO\"OOñ',
                    'author_id' => $admin->id,
                    'image_url' => '/assets/photo_2026-02-04_07-13-35.jpg',
                    'published_at' => now(),
                ],
            ]);
        }

        // Company info
        if (CompanyInfo::count() === 0) {
            CompanyInfo::create([
                'name' => 'Reptile House',
                'name_english' => 'Reptile House',
                'description' => 'متجر متخصص بزواحف وإكسسوارات موثوقة مع دعم فني.',
                'founded_year' => 2020,
                'mission' => 'توفير حيوانات أليفة صحية وتجارب شراء آمنة.',
                'vision' => 'أن نكون الوجهة الأولى لعشاق الزواحف في المنطقة.',
                'story' => 'بدأنا كهواة زواحف ثم طورنا متجرًا رقمياً شاملاً.',
                'logo_url' => '/assets/photo_2026-02-04_07-13-35.jpg',
                'mascot_url' => '/assets/photo_2026-02-04_07-13-35.jpg',
            ]);
        }

        // Contact info
        if (ContactInfo::count() === 0) {
            ContactInfo::create([
                'phone' => '+963 999 888 777',
                'email' => 'info@reptilehouse.sy',
                'address' => 'شارع الزواحف',
                'city' => 'دمشق',
                'country' => 'سوريا',
                'working_hours' => 'من 9 صباحاً حتى 8 مساءً',
                'facebook' => 'https://facebook.com/reptilehouse',
                'instagram' => 'https://instagram.com/reptilehouse',
            ]);
        }

        // Team
        if (TeamMember::count() === 0) {
            TeamMember::create([
                'name' => 'Sara',
                'role' => 'أخصائية رعاية زواحف',
                'image_url' => '/assets/photo_2026-02-04_07-13-35.jpg',
                'bio' => 'خبرة 5 سنوات في تربية الزواحف وأنظمتها البيئية.',
                'is_active' => true,
            ]);
        }

        // Filters
        if (FilterGroup::count() === 0) {
            $group = FilterGroup::create([
                'name' => 'الفئة',
                'type' => 'category',
                'applies_to' => 'products',
                'is_active' => true,
            ]);
            FilterOption::insert([
                ['filter_group_id' => $group->id, 'name' => 'أفاعي', 'value' => 'snake', 'is_active' => true, 'sort_order' => 1],
                ['filter_group_id' => $group->id, 'name' => 'سحالي', 'value' => 'lizard', 'is_active' => true, 'sort_order' => 2],
                ['filter_group_id' => $group->id, 'name' => 'سلاحف', 'value' => 'turtle', 'is_active' => true, 'sort_order' => 3],
            ]);
        }

        // ShamCash config
        if (ShamCashConfig::count() === 0) {
            ShamCashConfig::create([
                'barcode_image_url' => '0000000000',
                'account_code' => '123456789',
                'account_holder_name' => 'Reptile House',
                'phone_number' => '+963 999 888 777',
                'payment_instructions' => "أرسل المبلغ عبر ShamCash ثم حمّل صورة الإيصال ليتم التحقق.",
                'is_active' => true,
            ]);
        }

        // Address + Order demo
        if ($user && Order::count() === 0) {
            $address = Address::create([
                'user_id' => $user->id,
                'label' => 'المنزل',
                'street' => 'حارة 12',
                'city' => 'دمشق',
                'country' => 'سوريا',
                'is_default' => true,
            ]);

            $product = Product::first();
            $orderId = (string) Str::uuid();

            Order::create([
                'id' => $orderId,
                'user_id' => $user->id,
                'address_id' => $address->id,
                'total' => $product ? $product->price : 120,
                'status' => 'pending',
                'payment_method' => 'shamcash',
                'payment_verification_status' => 'pending',
            ]);

            if ($product) {
                OrderItem::create([
                    'order_id' => $orderId,
                    'product_id' => $product->id,
                    'supply_id' => null,
                    'name' => $product->name,
                    'quantity' => 1,
                    'price' => $product->price,
                    'image_url' => $product->image_url,
                ]);
            }
        }
    }
}
