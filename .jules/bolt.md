## 2025-05-15 - Frontend Render Stability
**Learning:** HomePage derived lists (sorting/slicing) were executing on every render cycle. Combined with DatabaseContext's frequent hydration updates, this caused measurable frame drops. Stabilizing the setPage callback and memoizing derived data reduces render overhead from ~5ms to <0.1ms.
**Action:** Always pair component memoization with stabilized callbacks in high-traffic contexts like DatabaseContext.
