// Complete SEO Integration Example
import React, { useEffect } from 'react';
import { useSEO, useSEOUpdate } from '../hooks/useSEO';
import { seoService } from '../services/seoService';

// Example: Complete HomePage with SEO
const HomePage: React.FC = () => {
  // Initialize SEO for homepage
  useSEO('homepage', 'الصفحة الرئيسية - Reptile House');

  const { updateMetadata, generateBreadcrumbs } = useSEOUpdate();

  useEffect(() => {
    // Update additional metadata if needed
    updateMetadata({
      'og:title': 'Reptile House - متجر متخصص للزواحف',
      'og:description': 'أفضل متجر للزواحف والحيوانات الأليفة في السعودية',
      'twitter:title': 'Reptile House - زواحف وحيوانات أليفة',
      'twitter:description': 'متجر متخصص للزواحف والحيوانات الأليفة',
    });

    // Generate breadcrumbs
    generateBreadcrumbs([
      { name: 'الرئيسية', url: '/' }
    ]);
  }, [updateMetadata, generateBreadcrumbs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Page content with proper SEO structure */}
      <header className="text-center py-20">
        <h1 className="text-5xl font-black text-gray-900 mb-6">
          مرحباً بكم في <span className="text-amber-600">Reptile House</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          متجركم الأول للزواحف والحيوانات الأليفة في السعودية
        </p>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* SEO optimized content */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">ما نقدمه</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-amber-600 mb-4">منتجات عالية الجودة</h3>
              <p className="text-gray-600">أفضل المنتجات لزواحفكم الأليفة</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-amber-600 mb-4">خدمات رعاية</h3>
              <p className="text-gray-600">استشارات ونصائح من الخبراء</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-amber-600 mb-4">شحن سريع</h3>
              <p className="text-gray-600">توصيل سريع لجميع أنحاء السعودية</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Example: Product Page with SEO
const ProductPage: React.FC<{ productSlug: string }> = ({ productSlug }) => {
  useSEO(`product/${productSlug}`, 'تفاصيل المنتج');

  const { updateMetadata, generateBreadcrumbs } = useSEOUpdate();

  useEffect(() => {
    // Custom metadata for product
    updateMetadata({
      title: `اسم المنتج - Reptile House`,
      description: 'وصف شامل للمنتج مع كلمات مفتاحية محسنة للبحث',
      'og:image': '/images/product-image.jpg',
      'product:price:amount': '299',
      'product:price:currency': 'SAR',
      'product:availability': 'in stock'
    });

    // Breadcrumbs for product navigation
    generateBreadcrumbs([
      { name: 'الرئيسية', url: '/' },
      { name: 'المنتجات', url: '/products' },
      { name: 'المنتج', url: `/products/${productSlug}` }
    ]);
  }, [productSlug, updateMetadata, generateBreadcrumbs]);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        {/* Breadcrumb navigation will be generated automatically */}
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <img
            src="/images/product-placeholder.jpg"
            alt="اسم المنتج"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">اسم المنتج</h1>
          <p className="text-2xl font-bold text-amber-600 mb-6">299 ريال سعودي</p>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            وصف شامل للمنتج يحتوي على معلومات مفيدة للعملاء ومحركات البحث
          </p>

          <button className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-700 transition-colors">
            أضف إلى السلة
          </button>
        </div>
      </div>
    </div>
  );
};

// Example: Article Page with SEO
const ArticlePage: React.FC<{ articleSlug: string }> = ({ articleSlug }) => {
  useSEO(`article/${articleSlug}`, 'مقال متخصص');

  const { updateMetadata, generateBreadcrumbs } = useSEOUpdate();

  useEffect(() => {
    updateMetadata({
      title: 'عنوان المقال - Reptile House',
      description: 'مقال متخصص حول رعاية الزواحف مع نصائح عملية',
      'og:image': '/images/article-image.jpg',
      'article:published_time': '2026-02-17T10:00:00Z',
      'article:author': 'فريق Reptile House'
    });

    generateBreadcrumbs([
      { name: 'الرئيسية', url: '/' },
      { name: 'المقالات', url: '/articles' },
      { name: 'المقال', url: `/articles/${articleSlug}` }
    ]);
  }, [articleSlug, updateMetadata, generateBreadcrumbs]);

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
          عنوان المقال المحسن لمحركات البحث
        </h1>
        <div className="text-gray-500 text-lg">
          بواسطة <span className="font-semibold">فريق Reptile House</span> |
          17 فبراير 2026
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-600 mb-8">
          مقدمة جذابة للمقال تحتوي على الكلمات المفتاحية الرئيسية
        </p>

        <h2>عنوان فرعي جذاب</h2>
        <p>محتوى مفيد وغني بالمعلومات حول رعاية الزواحف...</p>

        <h2>نصائح عملية</h2>
        <ul>
          <li>نصيحة مهمة رقم 1</li>
          <li>نصيحة مهمة رقم 2</li>
          <li>نصيحة مهمة رقم 3</li>
        </ul>

        <h2>الخاتمة</h2>
        <p>خاتمة شاملة تلخص النقاط الرئيسية وتشجع على التفاعل</p>
      </div>
    </article>
  );
};

export { HomePage, ProductPage, ArticlePage };
