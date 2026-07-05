## 2026-07-05 - Frontend Stabilization and Lazy Loading
**Learning:** The HomePage was performing expensive array operations (sorting/filtering) on every render. Since DatabaseContext updates frequently during hydration, this caused measurable frame drops on initial load. Native lazy loading is also highly effective for long grid displays like the reptile showcase.
**Action:** Always memoize derived data lists sourced from global contexts and utilize native image lazy loading for items likely to be below the fold (index > 2).
