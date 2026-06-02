## 2025-05-22 - [HomePage Memoization]
**Learning:** In-component sorting and filtering logic on datasets of >100 items adds measurable overhead (~0.4ms to ~2.3ms depending on size) and should be memoized using useMemo to prevent frame drops and redundant calculations on every render.
**Action:** Always identify derived state in render loops that use array methods (sort, filter, find) and apply useMemo to stabilize these calculations.
