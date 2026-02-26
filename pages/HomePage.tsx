
import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import FeaturedReptiles from '../components/FeaturedReptiles';
import SocialSection from '../components/SocialSection';
import ReptileCard from '../components/ReptileCard';
import { useDatabase } from '../contexts/DatabaseContext';

interface HomePageProps {
  setPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
  const { products, articles, loadArticles } = useDatabase();
  const featured = products.find(p => p.rating >= 4.9) || products[0];
  const bestsellers = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
  const newArrivals = [...products].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 10);
  const careSheets = [...articles].slice(0, 6);

  useEffect(() => {
    loadArticles().catch(() => undefined);
  }, [loadArticles]);

  return (
    <>
      <Hero setPage={setPage} />

      {featured && (
        <section className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-black mb-8 sm:mb-10 text-center">عرض خاص</h2>
          <ReptileCard reptile={featured} variant="featured" setPage={setPage} />
        </section>
      )}

      <section className="mb-16">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div className="text-right">
            <h2 className="text-3xl sm:text-4xl font-black">الأفضل مبيعًا</h2>
            <p className="text-gray-400 font-bold mt-2">Proven Bestsellers</p>
          </div>
          <button onClick={() => setPage('showcase')} className="shrink-0 bg-white/5 border border-white/10 hover:border-amber-500/50 text-gray-200 hover:text-white px-6 py-3 rounded-2xl font-black text-sm transition-all active:scale-95">
            عرض الكل
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
          {bestsellers.map((reptile, index) => (
            <ReptileCard key={reptile.id} reptile={reptile} index={index} setPage={setPage} />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div className="text-right">
            <h2 className="text-3xl sm:text-4xl font-black">وصل حديثًا</h2>
            <p className="text-gray-400 font-bold mt-2">New Scales, New Tails</p>
          </div>
          <button onClick={() => setPage('showcase')} className="shrink-0 bg-amber-500 text-gray-900 hover:bg-amber-400 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-xl shadow-amber-500/10 active:scale-95">
            استكشف الآن
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {newArrivals.map((reptile, index) => (
            <ReptileCard key={reptile.id} reptile={reptile} index={index} setPage={setPage} />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div className="text-right">
            <h2 className="text-3xl sm:text-4xl font-black">أوراق الرعاية</h2>
            <p className="text-gray-400 font-bold mt-2">Care Sheets</p>
          </div>
          <button onClick={() => setPage('blog')} className="shrink-0 bg-white/5 border border-white/10 hover:border-amber-500/50 text-gray-200 hover:text-white px-6 py-3 rounded-2xl font-black text-sm transition-all active:scale-95">
            المزيد
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {careSheets.map(article => (
            <button
              key={article.id}
              onClick={() => setPage(`article/${article.id}`)}
              className="text-right glass-medium rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all duration-500 shadow-2xl group active:scale-[0.99]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 right-6 left-6">
                  <h3 className="text-2xl font-black leading-tight">{article.title}</h3>
                  <div className="mt-3 inline-flex items-center gap-2 bg-amber-500 text-gray-900 px-4 py-2 rounded-full text-xs font-black">
                    اقرأ الآن
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <FeaturedReptiles reptiles={products.slice(0, 6)} setPage={setPage} />
      <SocialSection />
    </>
  );
};

export default HomePage;
