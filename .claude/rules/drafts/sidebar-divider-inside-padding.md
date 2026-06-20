# Draft — Sidebar divider nằm TRONG padding (ngang item), 1 wrapper padding duy nhất (2026-06-19)

- File/§ đích khi `/merge`: `starci-navigation.md` §2 (CollapsibleSidebar) — sửa câu "Separator FULL-WIDTH".

## Bài học (sự cố settings sidebar)
- Thầy nói "separator ngang không full" → trò hiểu NHẦM = kéo edge-to-edge tới `border-r`, rồi đẻ ra `-mx-6` break-out
  (bị `ScrollShadow overflow-y-auto` ép `overflow-x:auto` → CLIP, vô dụng) + tách padding ra từng item. Sai hướng + churn.
- Ý THẬT của thầy: divider **kéo dài TRONG khoảng padding** = full-width của vùng-đã-padded = **thẳng hàng với các row**,
  KHÔNG chạm mép/`border-r`. Lỗi cũ chỉ là divider **lệch** vì padding bất đối xứng (chỉ `pr-6`, không `pl`), nhìn như "không full".

## Luật (STRICT)
- **Sidebar = 1 WRAPPER PADDING DUY NHẤT** trên box `CollapsibleSidebar`: `p-6` (expanded) / **`px-3 py-6`** (collapsed).
  Header + rows + **divider** đều nằm trong padding đó. KHÔNG tách padding xuống item, KHÔNG padding ở header riêng.
- **Divider = `Separator` (HeroUI) bình thường, full-width của container đã-padded** → tự inset đối xứng = ngang row.
  CẤM ép edge-to-edge: KHÔNG `-mx-*` break-out, KHÔNG thay bằng `<div w-full>` chạm `border-r`. "Separator không sai."
- **`border-r` nằm trên BOX** (padding nằm trong) → border vẫn flush full-height từ navbar xuống mép; padding chỉ đẩy NỘI DUNG vào.
- Gotcha kỹ thuật: `ScrollShadow`/vùng `overflow-y-auto` ép `overflow-x:auto` → mọi negative-margin tràn ngang bị CLIP →
  đừng dùng break-out để "full" trong vùng scroll. Muốn divider rộng/hẹp = chỉnh PADDING của wrapper, không chỉnh divider.
- Nguyên tắc tổng: "không full" của thầy thường = **lệch/bất đối xứng**, không phải đòi edge-to-edge. Hỏi/nhìn kỹ trước khi quất.
