/**
 * Shared config objects used across the app.
 *
 * Holds static configuration / catalog objects imported by many places
 * (e.g. default options, feature-flag objects, static select options).
 *
 * Rules:
 * - One file per config group by feature (e.g. `ai.ts`, `upload.ts`), re-exported here.
 * - Objects must be `as const` when they are static catalogs.
 * - When importing an object/array from here INTO a component, wrap it in `useMemo(() => ..., [])`
 *   to keep a stable reference (avoids re-renders / dependency loops).
 *
 * Distinct from `resources/` (env, path, primitive constants) and a feature's `map.ts`
 * (a feature-local lookup map).
 */
export {}
