## 2025-05-14 - HomePage & Component Optimization
**Learning:** In-component sorting and slicing on datasets of ~1000 items adds a measurable overhead of ~0.5ms per render. While small, this adds up in complex trees. Stabilizing high-traffic callbacks like `setPage` with `useCallback` is essential when using `React.memo` on list items to prevent cascading re-renders.
**Action:** Always memoize derived lists that involve sorting/slicing and pair `useCallback` with `React.memo` for stable child components.
