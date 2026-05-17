## 2025-05-22 - Memoization of Derived Product Lists
**Learning:** In-component sorting and filtering of 100+ items on every render adds measurable overhead (~0.19ms per render). Memoization with useMemo reduces this to <0.001ms.
**Action:** Always use useMemo for derived data in components that consume large context-provided arrays.

## 2025-05-22 - Image Loading Strategy for LCP
**Learning:** Setting loading="lazy" for all images in a list can negatively impact LCP if the first items are above the fold.
**Action:** Use conditional loading (eager for index < 2) to optimize LCP while maintaining lazy loading for the rest of the list.
