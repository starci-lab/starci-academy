/**
 * Shared config objects dùng chung toàn app.
 *
 * Đặt ở đây các object cấu hình / catalog tĩnh được nhiều nơi import
 * (vd: default options, feature flags object, static select options).
 *
 * Quy tắc:
 * - Mỗi nhóm config 1 file theo feature (vd `ai.ts`, `upload.ts`), re-export ở đây.
 * - Object phải `as const` khi là catalog tĩnh.
 * - Khi import object/array từ đây VÀO component, bọc `useMemo(() => ..., [])`
 *   để giữ tham chiếu ổn định (tránh re-render / dependency loop).
 *
 * Khác `resources/` (env, path, constants nguyên thuỷ) và `map.ts` của feature
 * (lookup map cục bộ của 1 feature).
 */
export {}
