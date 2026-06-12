const products = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `Reptile ${i}`,
    rating: Math.random() * 5,
    price: Math.floor(Math.random() * 1000)
}));

const articles = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    title: `Article ${i}`
}));

console.time('Calculations');
for (let i = 0; i < 100; i++) {
    const featured = products.find(p => p.rating >= 4.9) || products[0];
    const bestsellers = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
    const newArrivals = [...products].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 10);
    const careSheets = [...articles].slice(0, 6);
}
console.timeEnd('Calculations');
