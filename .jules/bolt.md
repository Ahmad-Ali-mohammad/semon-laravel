## 2025-05-15 - [Optimization Architecture]
**Learning:** Derived lists in HomePage.tsx (featured, bestsellers, newArrivals) were being recalculated on every render due to array methods like `find`, `sort`, and `slice` being called directly in the component body. This was identified as a potential performance bottleneck for larger datasets (~1000+ items).
**Action:** Use `useMemo` for any derived data that involves sorting, filtering, or slicing large arrays. Additionally, stabilize top-level navigation callbacks with `useCallback` to prevent cascading re-renders across the entire layout.
