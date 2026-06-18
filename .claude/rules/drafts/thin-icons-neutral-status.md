# Draft — Icon mảnh (thin outline, KHÔNG fill) + status marker trung tính (2026-06-18)

- File/§ đích khi `/merge`: `main.md` §5 (Text & Icons).
- Bài học (thầy sửa star ở ContentMapRow): trò set `weight="fill"` + tô `text-warning` (vàng) cho star VIP → thầy
  bác: *"ngôi sao không phải màu vàng, không màu ấy và không có weight, UI thầy theo kiểu thin"*.

## Luật
- **Icon mặc định = thin/outline (KHÔNG `weight="fill"`).** UI StarCi theo phong cách mảnh — phosphor để weight
  mặc định (regular outline), **CẤM `fill`/đặc** cho icon UI thường (kể cả check/star/status). Fill chỉ khi thầy
  chốt riêng cho 1 chỗ.
- **Status marker = TRUNG TÍNH (`text-muted`), trừ màu CÓ NGHĨA.** 1 icon/trạng-thái: chỉ tô màu khi màu mang nghĩa
  semantic (vd "đã đọc" = `text-success` xanh). Các trạng thái còn lại (chưa đọc, premium/VIP star, khoá lock) =
  `text-muted`, **KHÔNG tô vàng/cam** cho "nổi bật". Phân biệt bằng HÌNH icon, không bằng màu trang trí.
- Hệ quả ContentMapRow (rail trái): 1 icon — đọc→check `text-success`; khoá→lock muted; premium→star muted (outline);
  còn lại→tròn muted. Tất cả outline, không fill.
