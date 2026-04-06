## 2025-04-06 - [Architecture] Top-level navigation re-renders
**Learning:** In this application's custom routing architecture (managed in App.tsx), the `setPage` callback is passed down to almost every component (Header, Footer, BottomNavigation, and all Pages). Without `useCallback`, any state change in `AppContent` causes `setPage` to be recreated, triggering a cascade of re-renders across the entire component tree.
**Action:** Always stabilize top-level navigation and state-setter callbacks with `useCallback` and empty dependency arrays when they are passed as props to layout components.
