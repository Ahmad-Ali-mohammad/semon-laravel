
import React from 'react';
import { SnakeIcon, LizardIcon, TurtleIcon } from './icons';

const categories = [
  { name: 'الثعابين', icon: <SnakeIcon className="h-12 w-12 text-amber-400" />, delay: 'stagger-1' },
  { name: 'السحالي', icon: <LizardIcon className="h-12 w-12 text-amber-400" />, delay: 'stagger-2' },
  { name: 'السلاحف', icon: <TurtleIcon className="h-12 w-12 text-amber-400" />, delay: 'stagger-3' },
  { name: 'البرمائيات', icon: <LizardIcon className="h-12 w-12 text-amber-400" />, delay: 'stagger-4' },
  { name: 'المستلزمات', icon: <TurtleIcon className="h-12 w-12 text-amber-400" />, delay: 'stagger-1' },
];

const Categories: React.FC = () => {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-black text-center mb-10">استكشف فئاتنا</h2>
      <div className="flex space-x-6 space-x-reverse overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-52 h-52 flex flex-col items-center justify-center glass-light rounded-3xl cursor-pointer transition-all duration-300 hover:glass-medium hover:border-amber-400/50 hover:-translate-y-3 animate-slide-up ${category.delay}`}
          >
            <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">{category.icon}</div>
            <h3 className="text-xl font-black">{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
