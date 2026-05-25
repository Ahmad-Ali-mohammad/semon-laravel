## 2025-05-14 - Memoization of Derived Lists in HomePage
**Learning:** In-component sorting and filtering of data sets (e.g., 1000 products) during render adds ~2.3ms of overhead per render. In a page with multiple sections (featured, bestsellers, new arrivals), this accumulates and can consume a significant portion of the frame budget (16.6ms).
**Action:** Always memoize derived data lists that involve sorting, filtering, or heavy transformation using `useMemo` to ensure they only re-calculate when the source data changes.
