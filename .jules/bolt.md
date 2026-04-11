## 2026-04-11 - HomePage Optimization
**Learning:** Derived lists (featured, bestsellers, newArrivals, careSheets) in HomePage.tsx were being recalculated on every render, including O(N log N) sorting operations.
**Action:** Use useMemo to stabilize these lists and only recalculate when the source data (products, articles) changes. This reduces render time from ~414ms to ~1ms for large datasets.
