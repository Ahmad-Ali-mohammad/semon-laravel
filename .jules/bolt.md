## 2025-05-14 - In-component sorting overhead
**Learning:** In this codebase, the HomePage component was performing multiple O(N log N) sorting operations on a dataset of 1000 products directly within the render body. Benchmarking showed this takes ~0.6ms to 2ms per render. While seemingly small, it contributes to frame drops during state updates in the DatabaseContext.
**Action:** Always memoize derived lists that involve sorting or filtering large datasets (>100 items) using `useMemo` to ensure render consistency.
