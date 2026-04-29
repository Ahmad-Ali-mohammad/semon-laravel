## 2025-05-14 - HomePage Memoization Strategy
**Learning:** In-component sorting and filtering logic (e.g., O(N log N) operations) on datasets of ~1000 items adds measurable overhead (~1.15ms per render) and should be memoized using useMemo to prevent frame drops during state updates.
**Action:** Always wrap derived lists in useMemo when they depend on large context data like 'products' or 'articles'.

## 2025-05-14 - Image Loading Optimization
**Learning:** For product grids, a hybrid loading strategy (eager for the first few items, lazy for the rest) significantly improves LCP without sacrificing the bandwidth benefits of lazy loading for off-screen content.
**Action:** Use `loading={index < 2 ? 'eager' : 'lazy'}` in card components that are likely to appear above the fold.
