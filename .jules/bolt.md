# Bolt's Performance Journal ⚡

## 2025-05-15 - React Component and List Optimization
**Learning:** Stabilizing top-level navigation callbacks with `useCallback` is critical in custom routing systems to prevent cascading re-renders of the entire layout. For long lists, using a conditional `loading` strategy (`index < 2 ? 'eager' : 'lazy'`) significantly improves Largest Contentful Paint (LCP) while maintaining the benefits of lazy loading for off-screen content.
**Action:** Always check for unstabilized callbacks passed to Header/Footer/Nav and use memoization for components and expensive derivations in list-heavy pages.
