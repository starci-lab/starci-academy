# Migrate 1 route → kéo CẢ domain ra khỏi layouts (legacy), đừng sót (2026-06-18)

- File/§ đích khi `/merge`: `main.md` §2 (kiến trúc 4 tầng — layouts/reuseable = LEGACY) + §14 (heuristic migrate).
- Bài học: redesign trang detail `courses/[id]` → dựng `features/course/CourseDetail`, nhưng **để sót trang list
  `/courses` vẫn ở `layouts/course/Courses`** (legacy). Thầy bắt: "sao audit 2 trang mà không copy vào features,
  layouts là legacy thôi".

## Luật (STRICT)
- **Đụng/redesign 1 route của 1 domain → migrate HẾT các trang anh em cùng domain ra khỏi `layouts/`** (vd course =
  detail + list + …). KHÔNG để 1 trang ở `features/` còn trang kia kẹt `layouts/`. `layouts/`+`reuseable/` = **legacy,
  không giữ code sống**; mục tiêu là rỗng dần.
- **Tách đúng tầng khi migrate**: phần TRÌNH BÀY tái dùng (card list…) → **block** (`blocks/cards/CourseCard`), phần
  WIRING (đọc SWR/search/pagination/state) → **feature** (`features/<domain>/<Name>`). Đừng bê nguyên cục feature-có-style.
- **Dọn sạch sau migrate**: repoint mọi importer (page + nơi nhúng như `LandingPage`) → xoá HẲN folder legacy
  (đã grep xác nhận 0 import). Component "đã thay thế" để lại = nợ + gây nhầm.
- Khi audit/khảo sát 1 trang, **liệt kê luôn các route cùng domain** để không migrate nửa vời.
