# Draft — Đừng bê pattern docs-site generic vào sản phẩm của mình (2026-06-18)

- File/§ đích khi `/merge`: `main.md` §1 (triết lý: nội dung > vanity) + §14 (heuristics).
- Bài học: rail PHẢI khu Learn (`OnThisPage`) có widget **"Trang này có hữu ích không? 👍/👎"** — copy y hệt
  docs-site bên ngoài (Docusaurus/GitBook). Thầy chốt **BỎ**. Hai lý do gốc:
  1. **"Hàng của thầy mà"** — đây là sản phẩm học tập riêng, KHÔNG phải trang docs public cần thu feedback ẩn danh.
     Bê nguyên pattern generic của docs-site vào = vay mượn vô hồn, loãng, không thuộc về ngữ cảnh học.
  2. **Widget GIẢ** — vote chỉ `useState` cục bộ, KHÔNG ghi BE, không ai đọc → nút bấm cho-có (vanity), vi phạm
     "purpose trước pixel": không gọi tên được nhiệm vụ thật → cắt.

## Luật (rút ra)
- **KHÔNG dán pattern UI generic của docs-site/template** ("was this helpful?", "edit this page on GitHub",
  star-rating cho-vui, newsletter nhồi cuối trang…) vào sản phẩm StarCi chỉ vì "trang docs nào cũng có".
  Mỗi khối phải có nhiệm vụ THẬT trong ngữ cảnh học của mình.
- **CẤM widget tương tác GIẢ** (nút/vote/like chỉ `useState`, không persist BE, không ai tiêu thụ). Tương tác phải
  có đường đi dữ liệu thật (mutation → BE) hoặc đừng dựng. (Liên quan: rule discount-phải-thật, branding-first —
  cùng tinh thần "đừng làm cái rỗng cho có".)
- **Khoảng trống rail không bắt buộc phải lấp** bằng widget generic. Nếu lấp, lấp bằng thứ bám ngữ cảnh bài học
  & có dữ liệu thật (vd: flashcard của bài này qua `flashcardDecksByCourse(contentId)`, challenge liên quan,
  next/prev, tiến độ) — chốt hướng với thầy trước, đừng tự nhồi.
- Đã làm: gỡ block helpful khỏi `features/learn/OnThisPage` (giữ mục lục heading), xoá key i18n
  `onThisPage.{helpful,yes,no,thanks}` (en+vi), dọn import thừa. tsc/lint sạch (baseline 4 lỗi blog).
