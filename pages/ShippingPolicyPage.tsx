import React from 'react';
import PolicyPage from '../components/PolicyPage';

const ShippingPolicyPage: React.FC = () => {
    return (
        <PolicyPage title="سياسة الشحن" type="shipping">
            <h2>خيارات الشحن</h2>
            <p>
                نقدم خدمات الشحن داخل دمشق وبقية المحافظات السورية. نتعامل مع شحنات الحيوانات الحية بعناية
                فائقة لضمان سلامتها ووصولها في أفضل حالة ممكنة.
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>
                    <strong>الشحن داخل دمشق:</strong> تسليم خلال 24-48 ساعة بحسب المنطقة والتنسيق المسبق.
                </li>
                <li>
                    <strong>الشحن إلى المحافظات:</strong> تسليم تقريبي خلال 2-4 أيام عمل حسب توفر شركة الشحن
                    والظروف اللوجستية.
                </li>
            </ul>
            <h2>مسؤوليات الشحن</h2>
            <p>
                يجب التأكد من صحة عنوان الاستلام وإمكانية التواصل عند التوصيل. قد تختلف المدد الزمنية في حالات
                الظروف الجوية أو التأخير اللوجستي، وسنقوم بإبلاغك بأي تحديثات فوراً.
            </p>
        </PolicyPage>
    );
};

export default ShippingPolicyPage;
