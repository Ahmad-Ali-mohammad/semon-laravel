
## 2025-05-14 - React Performance Optimization
**Learning:** In-component sorting and filtering logic (e.g., O(N log N) operations) on datasets of ~1000 items adds measurable overhead (~0.4ms per render) and should be memoized using useMemo to prevent frame drops. Stabilizing callbacks with useCallback prevents cascading re-renders in optimized child components.
**Action:** Always memoize derived lists in page components and stabilize navigation callbacks passed to memoized children.
