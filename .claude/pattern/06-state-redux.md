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
