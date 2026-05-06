
## 2026-05-06 - [Optimizing Large List Computations]
**Learning:** Sorting and slicing arrays of ~1000 items on every render in React components adds measurable overhead (~0.40ms per render). While seemingly small, it contributes to frame drops and main thread blocking when multiple components re-render.
**Action:** Use useMemo to stabilize derived data lists and React.memo to prevent unnecessary component re-renders in list items.

## 2026-05-06 - [PR Cleanliness and Review Feedback]
**Learning:** Committing log files (e.g., vite.log) or making non-essential config renames (jest.config.js -> .cjs) is considered "noise" and can block approval even if performance wins are significant. Mandatory documentation (source comments) must be prioritized.
**Action:** Always clean up temporary artifacts and ensure all performance optimizations are explained in-source with BOLT OPTIMIZATION comments.
