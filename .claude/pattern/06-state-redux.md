# 06 — State: Redux Toolkit

`src/redux/` — client state toàn cục.

## Files
- `store.ts` — cấu hình store + reducers.
- `hooks.ts` — `useAppDispatch()`, `useAppSelector()` (typed). **Luôn dùng 2 hook này**, không dùng raw `useDispatch/useSelector`.
- `ReduxProvider.tsx` — bọc app (ráp trong layout).
- `slices/` — ~30 slice.

## Slices (sample)
`course, content, challenge, module, milestone, lession-video, livestream-session, personal-project-task, submission-attempt, submission-feedback` (domain);
`keycloak, user` (auth); `ai-models` (AI catalog); `job, socketio` (realtime); `modal, sidebar, tabs, search, state` (UI); `cv-*, template-cvs` (CV); `foundation, headhunter, public-content, admin`.

## Luồng dữ liệu
1. Core SWR hook (xem 05) fetch xong → `dispatch(setXxx(data))` vào slice.
2. Component đọc qua `useAppSelector((s) => s.<slice>.<field>)`.
3. UI-only state (modal open, tab, sidebar) cũng để ở slice tương ứng.

## Thêm slice
Tạo `slices/<name>.ts` (createSlice) → export ở `slices/index.ts` → đăng ký reducer trong `store.ts`.

## Sync effects (`src/hooks/effects/` — URL → Redux)
Các `useSyncRedux*` đồng bộ URL param vào Redux, mount 1 lần qua `UseEffects.tsx`. RULE để **minimal deps** + tránh loop:

- **MỘT CHIỀU URL → Redux** là mặc định. URL là nguồn sự thật; effect chỉ `dispatch(setX(param))`. Reducer set giá trị bằng nhau → Redux Toolkit bỏ qua, nên dispatch **idempotent**, không gây render loop.
- **Dep array = đúng biến đọc trong effect, không hơn**: nếu chỉ dùng `params.courseId` thì deps = `[params.courseId]`. KHÔNG thêm `pathname` nếu không đọc `pathname` (thừa → effect chạy 2 lần khi điều hướng). `dispatch` từ `useAppDispatch` ổn định — có thể bỏ khỏi deps, nhưng **thống nhất 1 kiểu trong cả thư mục** (có hoặc không, đừng lẫn lộn).
- **Cần 2 chiều** (vd search box ↔ redux) → BẮT BUỘC guard chống ping-pong: so sánh trước khi ghi (`if (current === next) return`) ở CẢ hai chiều. Mẫu đúng: `useGlobalSearchFormik` (guard `if (formik.values.query === query) return`). KHÔNG để ref guard "set mà không bao giờ đọc" (code chết, mầm bug).
- **Guard "chạy 1 lần"**: KHÔNG dùng `mountRef` boolean cứng (hỏng StrictMode + không re-trigger khi input đổi sau render đầu). Dùng guard **idempotent theo giá trị** (lưu giá trị đã xử lý vào ref, so sánh trước khi chạy lại).

## Effect/memo discipline (RULE — minimal & stable deps)
- `useEffect/useMemo/useCallback`: dep array = **đúng** biến dùng bên trong (không thiếu → stale closure; không thừa → chạy lại vô ích).
- ❌ KHÔNG đưa **object/array tạo mới mỗi render** (vd `formik.errors`, `{...}`, `[...]` literal, hàm inline) vào dep array → effect chạy mỗi render. Đưa primitive ổn định thay thế (`formik.isValid` thay `formik.errors`).
- `debounce`/`throttle`: tạo **1 lần** qua `useMemo`/`useRef`, KHÔNG tạo mới trong thân `useEffect` (tạo trong effect = mỗi lần là instance mới → debounce vô tác dụng). Cleanup gọi `.cancel()`.
- Effect có subscription/listener/interval/socket → **luôn cleanup** trong return. setState bất đồng bộ (sau `await`) → guard bằng `mountedRef` để tránh set sau unmount.
