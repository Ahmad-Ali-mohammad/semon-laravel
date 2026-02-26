
import React from 'react';
import { Reptile } from '../types';
import ReptileCard from './ReptileCard';

interface FeaturedReptilesProps {
  reptiles: Reptile[];
  setPage?: (page: string) => void;
}

const FeaturedReptiles: React.FC<FeaturedReptilesProps> = ({ reptiles, setPage }) => {
  return (
    <section className="mb-16">
      <h2 className="text-4xl font-black text-center mb-12 animate-fade-in">الزواحف المميزة</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 md:gap-10">
        {reptiles.map((reptile, index) => (
          <ReptileCard key={reptile.id} reptile={reptile} index={index} setPage={setPage} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedReptiles;
