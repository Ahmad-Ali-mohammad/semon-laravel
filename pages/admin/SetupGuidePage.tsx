import React, { useEffect, useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';

const SetupGuidePage: React.FC = () => {
  const {
    products,
    heroSlides,
    companyInfo,
    contactInfo,
    services,
    articles,
    teamMembers,
    shamCashConfig,
    loadArticles,
    loadTeamMembers
  } = useDatabase();

  useEffect(() => {
    loadArticles().catch(() => undefined);
    loadTeamMembers().catch(() => undefined);
  }, [loadArticles, loadTeamMembers]);

  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  const getPriorityClasses = (priority: string) => {
    if (priority === 'عالية') return 'bg-red-500/20 text-red-400 border border-red-500/30';
    if (priority === 'متوسطة') return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  };

  const getStepBorderClasses = (step: any) => {
    if (step.completed) return 'border-green-500/30 bg-green-500/5';
    if (step.priority === 'عالية') return 'border-red-500/30 bg-red-500/5';
    return 'border-white/10';
  };

  const setupSteps = [
    {
      id: 'company-info',
      title: 'معلومات الشركة الأساسية',
      description: 'أضف اسم الشركة، الشعار، القصة، الرؤية والرسالة',
      completed: !!companyInfo?.name,
      route: '/admin/company-info',
      priority: 'عالية',
      icon: '🏢'
    },
    {
      id: 'contact-info',
      title: 'معلومات الاتصال',
      description: 'أضف رقم الهاتف، البريد الإلكتروني، العنوان، وروابط السوشيال ميديا',
      completed: !!contactInfo?.phone && !!contactInfo?.email,
      route: '/admin/contact-info',
      priority: 'عالية',
      icon: '📞'
    },
    {
      id: 'hero-slides',
      title: 'شرائح العرض الرئيسية',
      description: 'أضف 2-4 شرائح لعرض المحتوى الرئيسي في الصفحة الرئيسية',
      completed: heroSlides.filter(s => s.active).length >= 2,
      route: '/admin/hero',
      priority: 'عالية',
      icon: '🎬'
    },
    {
      id: 'products',
      title: 'المنتجات (الزواحف)',
      description: 'أضف المنتجات الأولى للمتجر مع الأسعار والصور',
      completed: products.filter(p => p.isVisible).length >= 3,
      route: '/admin/products',
      priority: 'عالية',
      icon: '🦎'
    },
    {
      id: 'services',
      title: 'الخدمات',
      description: 'أضف خدمات مثل الفندقة، الاستشارات، تصميم التيراريوم',
      completed: services.filter(s => s.isActive).length >= 2,
      route: '/admin/services',
      priority: 'متوسطة',
      icon: '🛠️'
    },
    {
      id: 'shamcash',
      title: 'إعدادات الدفع (Sham Cash)',
      description: 'أضف معلومات حساب Sham Cash لاستقبال الدفعات',
      completed: !!shamCashConfig?.accountCode,
      route: '/admin/shamcash',
      priority: 'عالية',
      icon: '💳'
    },
    {
      id: 'articles',
      title: 'مقالات المدونة',
      description: 'أضف مقالات تعليمية وأوراق عناية بالزواحف',
      completed: articles.filter(a => a.isActive).length >= 2,
      route: '/admin/blog',
      priority: 'متوسطة',
      icon: '📝'
    },
    {
      id: 'team',
      title: 'فريق العمل',
      description: 'أضف أعضاء الفريق مع أدوارهم وصورهم',
      completed: teamMembers.filter(t => t.isActive).length >= 1,
      route: '/admin/team',
      priority: 'منخفضة',
      icon: '👥'
    }
  ];

  const completedSteps = setupSteps.filter(step => step.completed).length;
  const totalSteps = setupSteps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  const highPriorityIncomplete = setupSteps.filter(
    step => step.priority === 'عالية' && !step.completed
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-medium rounded-3xl p-8 border border-white/10">
        <h1 className="text-4xl font-black mb-3 text-right">🚀 دليل الإعداد الأولي</h1>
        <p className="text-gray-400 text-lg text-right">
          مرحباً بك في لوحة إدارة Reptile House! اتبع هذه الخطوات لإعداد موقعك بشكل كامل.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="glass-medium rounded-3xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-right">تقدم الإعداد</h2>
          <div className="text-left">
            <span className="text-4xl font-black text-amber-500">{completedSteps}</span>
            <span className="text-2xl text-gray-500">/{totalSteps}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-6 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000 ease-out"
            ref={(el) => { if (el) el.style.width = `${progressPercentage}%`; }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-black text-white drop-shadow-lg">
              {progressPercentage}% مكتمل
            </span>
          </div>
        </div>

        {progressPercentage === 100 && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-center">
            <p className="text-green-400 font-bold text-lg">
              🎉 تهانينا! أكملت جميع خطوات الإعداد الأساسية!
            </p>
          </div>
        )}

        {highPriorityIncomplete.length > 0 && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
            <p className="text-red-400 font-bold mb-2 text-right">
              ⚠️ خطوات ذات أولوية عالية لم تكتمل:
            </p>
            <ul className="space-y-1 text-right">
              {highPriorityIncomplete.map(step => (
                <li key={step.id} className="text-red-300 text-sm">
                  • {step.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Setup Steps */}
      <div className="space-y-4">
        {setupSteps.map((step) => (
          <div
            key={step.id}
            className={`glass-medium rounded-2xl border transition-all ${getStepBorderClasses(step)}`}
          >
            <button
              onClick={() => setExpandedSection(expandedSection === step.id ? null : step.id)}
              className="w-full p-6 flex items-start gap-4 text-right"
            >
              <div className="text-4xl">{step.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black mb-1 flex items-center gap-3">
                      {step.title}
                      {step.completed && (
                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${getPriorityClasses(step.priority)}`}>
                      {step.priority}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        step.completed ? 'text-green-400' : 'text-gray-500'
                      }`}
                    >
                      {step.completed ? 'مكتمل ✓' : 'غير مكتمل'}
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {expandedSection === step.id && (
              <div className="px-6 pb-6 space-y-4 border-t border-white/10 pt-4 animate-fade-in">
                {step.id === 'company-info' && (
                  <div className="space-y-3 text-right">
                    <p className="text-gray-300 font-bold">✅ ما يجب إضافته:</p>
                    <ul className="space-y-2 text-gray-400 text-sm mr-6">
                      <li>• اسم الشركة بالعربي والإنجليزي</li>
                      <li>• شعار الشركة (Logo) والتميمة (Mascot)</li>
                      <li>• وصف مختصر عن الشركة</li>
                      <li>• قصة تأسيس الشركة</li>
                      <li>• الرؤية والرسالة</li>
                      <li>• سنة التأسيس</li>
                    </ul>
                    <p className="text-amber-400 text-sm">
                      💡 هذه المعلومات ستظهر في صفحة "من نحن" والفوتر
                    </p>
                  </div>
                )}

                {step.id === 'contact-info' && (
                  <div className="space-y-3 text-right">
                    <p className="text-gray-300 font-bold">✅ ما يجب إضافته:</p>
                    <ul className="space-y-2 text-gray-400 text-sm mr-6">
                      <li>• رقم الهاتف الأساسي</li>
                      <li>• البريد الإلكتروني</li>
                      <li>• العنوان الكامل (الشارع، المدينة، البلد)</li>
                      <li>• ساعات العمل</li>
                      <li>• روابط السوشيال ميديا (فيسبوك، انستغرام، واتساب...)</li>
                    </ul>
                    <p className="text-amber-400 text-sm">
                      💡 ستظهر في صفحة الاتصال والفوتر
                    </p>
                  </div>
                )}

                {step.id === 'hero-slides' && (
                  <div className="space-y-3 text-right">
                    <p className="text-gray-300 font-bold">✅ ما يجب إضافته:</p>
                    <ul className="space-y-2 text-gray-400 text-sm mr-6">
                      <li>• 2-4 شرائح بصور عالية الجودة (1920x1080 على الأقل)</li>
                      <li>• عنوان رئيسي وعنوان فرعي لكل شريحة</li>
                      <li>• نص الزر والرابط (مثلاً: "تسوق الآن" → showcase)</li>
                      <li>• ترتيب الشرائح حسب الأهمية</li>
                    </ul>
                    <p className="text-amber-400 text-sm">
                      💡 الشرائح النشطة فقط ستظهر في الصفحة الرئيسية
                    </p>
                  </div>
                )}

                {step.id === 'products' && (
                  <div className="space-y-3 text-right">
                    <p className="text-gray-300 font-bold">✅ ما يجب إضافته:</p>
                    <ul className="space-y-2 text-gray-400 text-sm mr-6">
                      <li>• 3-10 منتجات للبداية (زواحف)</li>
                      <li>• صورة واضحة لكل منتج</li>
                      <li>• الاسم، النوع، السعر، الوصف</li>
                      <li>• تعليمات العناية</li>
                      <li>• حالة التوفر والمخزون</li>
                      <li>• الفئة (أفاعي، سحالي، سلاحف...)</li>
                    </ul>
                    <p className="text-amber-400 text-sm">
                      💡 فعّل "مرئي" لإظهار المنتج في المتجر
                    </p>
                  </div>
                )}

                {step.id === 'services' && (
                  <div className="space-y-3 text-right">
                    <p className="text-gray-300 font-bold">✅ أمثلة على الخدمات:</p>
                    <ul className="space-y-2 text-gray-400 text-sm mr-6">
                      <li>• فندقة الزواحف (Boarding)</li>
                      <li>• تصميم وتنفيذ التيراريوم</li>
                      <li>• الاستشارات الطبية والغذائية</li>
                      <li>• توصيل حيوي آمن</li>
                    </ul>
                    <p className="text-amber-400 text-sm">
                      💡 ستظهر في صفحة الخدمات
                    </p>
                  </div>
                )}

                {step.id === 'shamcash' && (
                  <div className="space-y-3 text-right">
                    <p className="text-gray-300 font-bold">✅ ما يجب إضافته:</p>
                    <ul className="space-y-2 text-gray-400 text-sm mr-6">
                      <li>• رقم الحساب (Account Code)</li>
                      <li>• اسم صاحب الحساب</li>
                      <li>• رقم الهاتف المرتبط</li>
                      <li>• صورة الباركود (Barcode)</li>
                      <li>• تعليمات الدفع للعميل</li>
                    </ul>
                    <p className="text-amber-400 text-sm">
                      💡 ضروري لاستقبال دفعات العملاء
                    </p>
                  </div>
                )}

                {step.id === 'articles' && (
                  <div className="space-y-3 text-right">
                    <p className="text-gray-300 font-bold">✅ أمثلة على المقالات:</p>
                    <ul className="space-y-2 text-gray-400 text-sm mr-6">
                      <li>• دليل العناية بالأفاعي للمبتدئين</li>
                      <li>• كيفية اختيار السلحفاة المناسبة</li>
                      <li>• إعداد التيراريوم المثالي</li>
                      <li>• أمراض الزواحف الشائعة وعلاجها</li>
                    </ul>
                    <p className="text-amber-400 text-sm">
                      💡 تحسن SEO وتزيد ثقة العملاء
                    </p>
                  </div>
                )}

                <a
                  href={step.route}
                  className="inline-block bg-amber-500 hover:bg-amber-400 text-gray-900 font-black px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95"
                >
                  {step.completed ? 'تعديل' : 'إضافة الآن'} →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="glass-medium rounded-3xl p-8 border border-amber-500/30 bg-amber-500/5">
        <h2 className="text-2xl font-black mb-4 text-right text-amber-400">💡 نصائح مهمة</h2>
        <ul className="space-y-3 text-right text-gray-300">
          <li className="flex items-start gap-3">
            <span className="text-amber-500 font-black">1.</span>
            <span>ابدأ بالخطوات ذات الأولوية العالية أولاً (معلومات الشركة، الاتصال، المنتجات)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-500 font-black">2.</span>
            <span>استخدم صور عالية الجودة لتحسين تجربة المستخدم</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-500 font-black">3.</span>
            <span>اكتب أوصافاً تفصيلية للمنتجات والخدمات لزيادة المبيعات</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-500 font-black">4.</span>
            <span>فعّل فقط المحتوى الذي تريد إظهاره للعملاء</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-500 font-black">5.</span>
            <span>جميع التغييرات تظهر فوراً في الموقع الرئيسي</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SetupGuidePage;
