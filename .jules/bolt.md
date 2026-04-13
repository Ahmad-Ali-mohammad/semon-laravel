## 2025-05-22 - [Project Initial State]
**Learning:** The application uses a custom routing system where 'setPage' is passed down to many components. Lack of stability in this callback can cause unnecessary re-renders across the entire component tree. Derived data in HomePage.tsx is calculated on every render, which becomes expensive as the dataset grows.
**Action:** Stabilize top-level callbacks with useCallback and memoize expensive derived data with useMemo.
