## 2025-04-20 - Memoization of HomePage Derived Data
**Learning:** In-component sorting and filtering logic (e.g., O(N log N) operations) on datasets of ~1000 items adds measurable overhead (~0.57ms per render) and should be memoized using useMemo to prevent frame drops.
**Action:** Always wrap derived list logic in useMemo when dealing with product catalogs or similar collections.

## 2025-04-20 - Stabilizing Navigation Callbacks
**Learning:** Top-level navigation callbacks (like setPage) must be stabilized with useCallback(..., []) to prevent cascading re-renders of the entire layout and navigation components in the custom routing system.
**Action:** Use useCallback for all functions passed down from App.tsx to major layout components.
