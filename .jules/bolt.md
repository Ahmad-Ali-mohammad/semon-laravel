## 2025-05-14 - HomePage & Component Rendering Optimization
**Learning:** In-component sorting and slicing of datasets (even small ones like ~1000 items) adds measurable overhead (~0.4ms) to every render. Combining this with unstabilized callbacks and non-memoized child components (like ReptileCard) creates a cascading re-render effect that degrades performance.
**Action:** Always pair `useMemo` for data processing with `useCallback` for navigation/action handlers and `React.memo` for the consumer components to ensure the optimization "sticks" throughout the render tree.
