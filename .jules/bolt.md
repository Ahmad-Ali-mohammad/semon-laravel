# Bolt's Performance Journal ⚡

## 2025-05-23 - HomePage Derived List Optimization
**Learning:** In-component sorting and filtering logic on datasets of >100 items (like products) adds measurable overhead (~0.6ms per render in this environment). While seemingly small, it scales with complexity and triggers on every parent re-render. Memoizing these lists reduces overhead to <0.002ms.
**Action:** Always use `useMemo` for derived lists that involve sorting or slicing large arrays in components that re-render frequently.

## 2025-05-23 - Jest Environment Issues
**Learning:** The current sandbox environment lacks `ts-jest` and has conflicts with ES modules in `jest.config.js`. This makes running standard Jest tests difficult without altering the environment.
**Action:** Prioritize manual benchmarking and type-checking (`tsc`) over automated Jest tests if the test runner is broken in the sandbox, to avoid "noise" changes like renaming config files.
