## 2025-05-15 - Home Page Rendering Optimization
**Learning:** In-component sorting and filtering on datasets of >100 items (e.g., HomePage bestsellers/newArrivals) adds measurable overhead (~40ms for 1000 items) and blocks the main thread on every render.
**Action:** Always memoize derived lists with useMemo and stabilize callbacks with useCallback when passing them to memoized components like ReptileCard to ensure the optimization isn't invalidated.
