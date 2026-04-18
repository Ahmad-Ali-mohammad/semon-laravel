## 2024-05-20 - [React Performance Optimizations]
**Learning:** Derived lists (filter/sort) in the render body of a component can be a significant bottleneck as data grows. Memoizing these calculations with `useMemo` and stabilizing top-level callbacks with `useCallback` prevents cascading re-renders and unnecessary computations.
**Action:** Always check for expensive array operations (O(N log N)) in components that handle datasets and memoize them.

**Learning:** Largest Contentful Paint (LCP) can be improved by eagerly loading above-the-fold images while lazy-loading the rest.
**Action:** Implement conditional `loading` props for list-based image components: `loading={index < 2 ? 'eager' : 'lazy'}`.
