// Example: SEO Implementation in Components
// This shows how to integrate SEO in your React components

import React, { useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import { seoService } from '../services/seoService';

// Example for HomePage component
const HomePage: React.FC = () => {
  // Initialize SEO for homepage
  useSEO('homepage', 'الصفحة الرئيسية - Reptile House');

  useEffect(() => {
    // Generate breadcrumbs
    const breadcrumbs = [
      { name: 'الرئيسية', url: '/' }
    ];
    seoService.generateBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <div>
      <h1>مرحباً بكم في Reptile House</h1>
      <p>متجر متخصص للزواحف والحيوانات الأليفة</p>
    </div>
  );
};

// Example for ProductPage component
const ProductPage: React.FC<{ productSlug: string }> = ({ productSlug }) => {
  // Initialize SEO for product page
  useSEO(`product/${productSlug}`, 'تفاصيل المنتج');

  useEffect(() => {
    // Generate breadcrumbs for product
    const breadcrumbs = [
      { name: 'الرئيسية', url: '/' },
      { name: 'المنتجات', url: '/products' },
      { name: 'المنتج', url: `/products/${productSlug}` }
    ];
    seoService.generateBreadcrumbs(breadcrumbs);
  }, [productSlug]);

  return (
    <div>
      <h1>تفاصيل المنتج</h1>
      {/* Product content */}
    </div>
  );
};

// Example for ArticlePage component
const ArticlePage: React.FC<{ articleSlug: string }> = ({ articleSlug }) => {
  // Initialize SEO for article page
  useSEO(`article/${articleSlug}`, 'مقال');

  return (
    <div>
      <h1>المقال</h1>
      {/* Article content */}
    </div>
  );
};

export { HomePage, ProductPage, ArticlePage };
