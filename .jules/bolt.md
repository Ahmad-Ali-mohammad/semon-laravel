# Bolt's Performance Journal

## 2025-05-14 - Memoization of Derived Lists in HomePage
**Learning:** Sorting and slicing large arrays (1000+ items) in every render cycle adds measurable overhead (~0.6ms per render). While seemingly small, it contributes to frame budget exhaustion when combined with other components.
**Action:** Always wrap derived list computations (sort, filter, slice) in `useMemo` when the source data comes from a context or prop that might not change every render.

## 2025-05-14 - Environment constraints and `node_modules`
**Learning:** In this sandbox, installing heavy dev dependencies like `typescript` or `vite` to run local verification can trigger "diff size unusually large" warnings and pollute the PR if not cleaned up.
**Action:** Perform manual code verification and rely on approved patterns if the local environment prevents full automated suite execution. Always `rm -rf node_modules` before submission if they were added during the session.
