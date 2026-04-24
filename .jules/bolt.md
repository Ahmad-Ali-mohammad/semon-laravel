## 2025-04-23 - [Memoization & Lazy Loading Optimization]
**Learning:** In a product catalog with ~1000 items, redundant O(N log N) sorting operations in the render path of HomePage.tsx and un-memoized list items (ReptileCard) cause measurable UI jank. Stabilizing top-level callbacks like setPage is critical to prevent cascading re-renders in a custom routing system.
**Action:** Always use useMemo for derived data lists, React.memo for list items, and useCallback for navigation handlers passed to the entire tree.
