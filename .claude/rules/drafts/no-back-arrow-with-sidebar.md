# Layout có sidebar + breadcrumb → KHÔNG per-page back arrow (trùng escape)  (2026-06-17)

- File/§ đích: `main.md` §10 (bố cục) hoặc §14 (heuristics).
- Bài học: header trang settings (EditProfile…) có cả breadcrumb + dấu back ← + sidebar; back `onBack=về Hồ sơ`
  trùng y hệt link "Hồ sơ" của breadcrumb → thừa.
- Luật mới:
  - **Trang nằm trong layout CÓ sidebar (nav) + breadcrumb (escape) → KHÔNG thêm dấu back per-page.** Header =
    chỉ title + subtitle (`Typography`). Một escape rõ (breadcrumb/sidebar) hơn 2 thứ trùng. (Back per-page chỉ
    hợp flow tuyến tính KHÔNG sidebar, hoặc mobile khi sidebar ẩn.)
  - Nếu thật cần back: `onBack` đi tới PARENT CỐ ĐỊNH (KHÔNG `router.back()` vô định) + `aria-label` rõ
    ("Về Hồ sơ"); và bỏ breadcrumb cho khỏi trùng.
- Phụ (no-drift): `reuseable/SubPageHeader` = LEGACY hỏng rule (icon `@gravity-ui`, chữ `<div>+text-class`,
  `gap-1.5`) → thay bằng block sạch (Typography + phosphor) khi đụng; cuối cùng xoá.
