<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'فندقة الزواحف (Boarding)',
                'description' => 'سافر وأنت مطمئن. نوفر بيئة مثالية لزاحفك مع رعاية غذائية وطبية يومية تحت إشراف خبرائنا في أقفاص معقمة ومجهزة.',
                'icon' => '🏨',
                'price' => 'بدءاً من 20$ / ليلة',
                'highlight' => 'الأكثر طلباً',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'تصميم وتنفيذ التيراريوم',
                'description' => 'نصمم لك قطعة فنية من الطبيعة في منزلك. أحواض مخصصة تحاكي البيئة الأصلية لكل نوع بأحدث تقنيات الإضاءة والتهوية.',
                'icon' => '🎨',
                'price' => 'حسب المقاس والنوع',
                'highlight' => 'تصميم مخصص',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'الاستشارات الطبية والغذائية',
                'description' => 'فحص دوري ونظام غذائي مخصص لضمان صحة وطول عمر حيوانك الأليف. نقدم استشاراتنا بإشراف مختصين في صحة الزواحف.',
                'icon' => '🩺',
                'price' => '25$ للجلسة الواحدة',
                'highlight' => 'بإشراف مختصين',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'توصيل حيوي آمن للمحافظات',
                'description' => 'خدمة توصيل احترافية تضمن الحفاظ على درجة الحرارة والرطوبة المناسبة أثناء النقل لضمان وصول حيوانك بدون إجهاد.',
                'icon' => '🚚',
                'price' => 'حسب بعد المحافظة',
                'highlight' => 'شحن آمن',
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
