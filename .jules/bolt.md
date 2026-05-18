## 2025-05-22 - [HomePage.tsx Memoization]
**Learning:** Derived data lists (bestsellers, arrivals, etc.) were re-sorting on every render, adding overhead to the main thread.
**Action:** Always memoize derived lists that involve sorting or filtering large datasets (O(n log n)) to preserve frame rates.
