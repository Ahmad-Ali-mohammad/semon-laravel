## 2025-05-13 - HomePage and Component Optimization
**Learning:** Derived lists in HomePage (sorting/filtering large datasets) can take up significant frame time (~0.5ms per render). Stabilizing navigation callbacks (setPage) and using React.memo on list items (ReptileCard) prevents cascading re-renders across the layout. Conditional lazy loading (eager for first 2 items) optimizes LCP for product lists.
**Action:** Always memoize derived sorting/filtering logic and wrap list item components in React.memo with a stable navigation callback.
