
## no-native-internal-anchor (logged 2026-07-17, feedback lần 1)
- **Pattern bắt:** JSX `<a href="/...">` (href literal bắt đầu `/`, hoặc href là biểu thức route nội bộ) — native anchor cho route trong app = full-page reload, mất SPA state.
- **Đúng:** Next `<Link>` (client push). External/protocol (`mailto:`/`tel:`/`http`) mới dùng `<a>`.
- **Có sẵn upstream:** `@next/next/no-html-link-for-pages` (chỉ /pages) — App Router cần rule custom AST trong `eslint-plugin-starci-fe`.
- **Escalate khi:** tái phạm lần 2 (thầy lại chỉ 1 `<a href="/route">` hand-rolled trong feature).
- **Nguồn:** feedback 2026-07-17 "bấm row = router.push không phải router.replace"; fix tại `SurfaceListCard` `RowAnchor` helper.
