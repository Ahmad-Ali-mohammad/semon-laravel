
const products = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `Reptile ${i}`,
    rating: Math.random() * 5,
    price: Math.floor(Math.random() * 1000),
    status: 'متوفر',
    species: 'Species'
}));

const articles = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    title: `Article ${i}`,
    image: `image${i}.jpg`
}));

function benchmark() {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
        const featured = products.find(p => p.rating >= 4.9) || products[0];
        const bestsellers = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
        const newArrivals = [...products].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 10);
        const careSheets = [...articles].slice(0, 6);
    }
    const end = performance.now();
    console.log(`Time taken for 1000 iterations: ${(end - start).toFixed(4)}ms`);
    console.log(`Average time per render: ${((end - start) / 1000).toFixed(4)}ms`);
}

benchmark();
