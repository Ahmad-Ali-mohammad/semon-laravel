
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { Page } from '../App';
import { useDatabase } from '../contexts/DatabaseContext';

interface HeroProps {
  setPage: (page: Page) => void;
}

const Hero: React.FC<HeroProps> = ({ setPage }) => {
  const { heroSlides } = useDatabase();
  const [currentSlide, setCurrentSlide] = useState(0);
  const activeSlides = heroSlides.filter(s => s.active);

  const nextSlide = () => {
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const slideInterval = setInterval(nextSlide, 6000);
    return () => clearInterval(slideInterval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  return (
    <section className="relative h-[62vh] sm:h-[70vh] lg:h-[75vh] rounded-[2.25rem] sm:rounded-[3rem] overflow-hidden flex items-center justify-center text-center shadow-2xl mb-12 sm:mb-16 animate-fade-in group">
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
      ))}

      <div className="relative z-10 p-6 sm:p-8 md:p-16 max-w-4xl bg-black/20 border border-white/20 rounded-[2.25rem] sm:rounded-[3rem] shadow-2xl animate-slide-up mx-4 backdrop-blur-md">
        <div className="inline-block bg-amber-500/20 text-amber-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-amber-500/30">
          Reptile House Premium
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-white drop-shadow-2xl mb-4 sm:mb-6 leading-tight tracking-tighter">
          {activeSlides[currentSlide].title}
        </h1>
        <p className="text-base sm:text-lg md:text-2xl text-gray-100 mb-7 sm:mb-10 max-w-2xl mx-auto font-bold opacity-95 drop-shadow-lg">
          {activeSlides[currentSlide].subtitle}
        </p>
        <button
          onClick={() => setPage(activeSlides[currentSlide].link as Page)}
          className="bg-amber-500 text-gray-900 font-black py-4 sm:py-5 px-9 sm:px-12 rounded-2xl hover:bg-amber-400 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-amber-500/20 relative overflow-hidden group/btn"
        >
          <span className="relative z-10 text-base sm:text-lg">{activeSlides[currentSlide].buttonText}</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>

      {activeSlides.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 z-20 bg-white/5 p-3 sm:p-4 rounded-full hover:bg-amber-500 hover:text-gray-900 transition-all backdrop-blur-md border border-white/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100" aria-label="الشريحة السابقة">
            <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 z-20 bg-white/5 p-3 sm:p-4 rounded-full hover:bg-amber-500 hover:text-gray-900 transition-all backdrop-blur-md border border-white/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100" aria-label="الشريحة التالية">
            <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3 space-x-reverse">
            {activeSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-10 sm:w-12 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'w-3 bg-white/20 hover:bg-white/40'}`}
                aria-label={`الانتقال إلى الشريحة ${index + 1}`}
              ></button>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Hero;
