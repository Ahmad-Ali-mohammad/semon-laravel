
const products = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    rating: Math.random() * 5,
    name: `Reptile ${i}`,
    species: 'Species',
    price: Math.floor(Math.random() * 1000),
    imageUrl: 'url'
}));

const articles = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    title: `Article ${i}`,
    image: 'url'
}));

function compute() {
    const start = performance.now();
    const featured = products.find(p => p.rating >= 4.9) || products[0];
    const bestsellers = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
    const newArrivals = [...products].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 10);
    const careSheets = [...articles].slice(0, 6);
    const end = performance.now();
    return end - start;
}

const iterations = 1000;
let totalTime = 0;
for (let i = 0; i < iterations; i++) {
    totalTime += compute();
}

console.log(`Average computation time: ${(totalTime / iterations).toFixed(4)}ms`);
