# Draft — Hàng ngang trong `<Card>` = plain `<div>`, KHÔNG `Card.Content` (bake flex-col); media inset = concentric radius (2026-07-02)

- File/§ đích khi `/merge`: `elements/card.md` (Gotcha render) + liên quan [[item-card-meta-inside-bounded-object]] (unlayered đè utility) · [[elements/input]] §2 (concentric radius).
- Bối cảnh: `CourseCard` layout `"line"` (course catalog list-view) render vỡ — thumbnail nằm giữa trên cùng, title/desc/giá/CTA xếp dọc căn giữa thay vì 1 hàng ngang gọn (đúng screenshot thầy gửi).

## Root cause
`Card.Content` (HeroUI `cardVariants` slot `content` → class `card__content`) bake `flex flex-1 flex-col gap-1` — **flex-COLUMN**, không phải row. Đặt `className="flex items-center gap-4"` lên `Card.Content` → `items-center` áp lên trục NGANG của 1 flex-column (căn giữa các hàng theo chiều ngang), KHÔNG đổi hướng layout thành row. Kết quả: mọi con xếp DỌC, căn giữa ngang — đúng bug "thumbnail giữa trên, chữ dồn dọc căn giữa".

## Luật (STRICT)
- **Muốn 1 HÀNG NGANG (`flex items-center` thật) bên trong `<Card>` → dùng `<div>` THƯỜNG làm container hàng, KHÔNG `Card.Content`.** `Card.Content` chỉ hợp khi layout MONG MUỐN đúng là cột (stack dọc — cover→text→footer kiểu grid card). Muốn row → tự viết `<div className="flex items-center gap-4">` trực tiếp trong `<Card>`.
- **Root `<Card>` (`.card` base slot) đã bake `p-4`** (inset quanh MỌI con). Con bên trong (`Card.Content`/plain `<div>` hàng ngang) **KHÔNG cần thêm `p-*` riêng** — cộng dồn = double-pad. Chỉ set padding trên con khi có lý do rõ (section riêng biệt trong 1 card nhiều block).
- **Media (cover/thumbnail) đặt TRONG card = "inner" — dùng radius 1 nấc dưới radius của card.** Card root = `rounded-3xl` (baked `min(32px, --radius-3xl)`). Media bên trong (inset, có padding quanh, không full-bleed) → `rounded-2xl` (nấc "inner" tiếp theo). Áp NHẤT QUÁN cho MỌI view hiển thị cùng 1 entity (grid cover + line thumbnail) — khác radius giữa 2 view = lệch, thầy sẽ bắt ("image trang grid không rounded lại như trang line").
- **Full-bleed cover (không padding, tràn sát mép card)** là lựa chọn KHÁC — chỉ dùng khi card ĐÓ có "top hero image" tràn mép (card `overflow-hidden` tự clip ảnh theo góc bo của card). Khi ảnh là 1 THUMBNAIL/media-item riêng biệt bên trong card (có margin/padding quanh, đặt cạnh text) → PHẢI có radius riêng (rounded-2xl) vì nó là 1 khối hình chữ nhật độc lập trong mắt người xem, không phải phần viền của card.

## Nguyên tắc rút ra
- **Trước khi đặt `flex items-center` lên 1 compound-component slot (`Card.Content`/`Card.Header`/`Card.Footer`), kiểm slot đó bake `flex-row` hay `flex-col`** (đọc `cardVariants`/`*.styles.js`, KHÔNG đoán) — sai hướng flex là bug render câm lặng, không lỗi TypeScript/lint.
- **Media lồng trong card = "concentric": card ngoài 1 nấc radius, media trong 1 nấc THẤP HƠN**, đồng bộ ở MỌI variant/view hiển thị cùng loại nội dung.

## Áp đầu (2026-07-02)
- `CourseCard` (`blocks/cards/CourseCard`): line layout `Card.Content` → plain `<div className="flex items-center gap-4">` (bỏ luôn `p-3` thừa — root Card đã có `p-4`); thumbnail `rounded-xl` → `rounded-2xl`. Grid layout: cover thêm `rounded-2xl` (trước không rounded, full-bleed) + bỏ `px-3` thừa ở text block (Card.Content không còn `p-0`/`p-3` riêng, dùng nguyên root `p-4`).
- `CourseCatalog` line-view skeleton: mirror đúng cấu trúc mới (plain `<div>`, `rounded-2xl`).
