# Bolt's Performance Journal ⚡

## 2025-05-15 - React Render Optimizations in E-commerce Catalog

**Learning:** In-component sorting and filtering logic (O(N log N)) on datasets of ~1000 items adds measurable overhead (~1ms per render). While seemingly small, it aggregates across multiple re-renders and blocks the main thread. Stabilizing callbacks like `setPage` is crucial to prevent cascading re-renders in a custom routing system.

**Action:** Always use `useMemo` for derived data from large arrays. Use `React.memo` for list items like `ReptileCard`. Use `loading="lazy"` for images, but `eager` for the first few items to improve LCP.
