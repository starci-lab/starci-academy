# StarCi Button Rules

Khi nào dùng nút gì, màu gì, đặt cạnh nút nào. Theo **ui-ux-pro-max** §4 (`primary-action`,
`destructive-emphasis`, `loading-buttons`, `state-clarity`) + variant ngữ nghĩa HeroUI v3.
Đi kèm `starci-ui.rules`. STRICT.

## 1. Variant = NGỮ NGHĨA (không bao giờ tự tô màu className)
Màu do **variant** quyết (variant tự map token theo theme). CẤM `className` màu (`bg-*`,`text-accent`…)
để "đổi màu nút".

| Variant | Vai trò | Ví dụ |
|---|---|---|
| `primary` | Hành động CHÍNH đẩy tới — **1 cái / ngữ cảnh** | Liên hệ tuyển dụng · Lưu · Nộp bài · Ghim |
| `secondary` | Hành động thay thế ngang hàng | Follow · Chỉnh sửa · Xem tất cả (nổi) |
| `tertiary` | Low-emphasis / icon-only trong bar | gear ⚙ · chuông · avatar trigger |
| `ghost` | Nền trong, nhẹ nhất | toggle accordion · nút trong list/popover/drawer · "Xem thêm" |
| `outline` | Viền, kiểu field/chọn | bộ lọc · segmented chọn |
| `danger` | **Phá hủy** (màu danger) | Xóa · Gỡ · Đăng xuất · Hủy đăng ký |

## 2. Một `primary` / ngữ cảnh (§4 primary-action)
- Mỗi màn / mỗi cụm action **chỉ 1 nút `primary`**. Phần còn lại `secondary`/`tertiary`/`ghost`.
- Vd hero profile: **Liên hệ tuyển dụng = `primary`** → Follow = `secondary` → Share = `secondary` →
  (chủ) Edit = `secondary` + gear = `tertiary` icon-only. KHÔNG để 2 nút primary cạnh nhau.

## 3. Thứ tự & vị trí
- **Dialog / form (hàng ngang):** thứ yếu **trái** → primary **phải** (vị trí "kết thúc đọc").
  Mẫu: `[Hủy (tertiary/ghost)] … [Xác nhận (primary)]`.
- **Cột hẹp / sidebar / drawer (dọc):** primary **trên cùng**, rồi secondary, share/phụ xuống dưới;
  nút full-width (`fullWidth`).
- **Destructive tách khỏi primary** (`destructive-emphasis`): nút `danger` KHÔNG đứng sát nút primary
  (dễ bấm nhầm) — đẩy sang nhóm/đầu kia, hoặc trong overflow menu. Xóa account/logout luôn tách riêng.

## 4. Kích thước & touch
- Mặc định `size="md"` (≥44px touch). `size="sm"` cho nút phụ trong popover/row/header-action.
- Icon-only → `isIconOnly` + **`aria-label` bắt buộc** (§1 a11y). Hit-area ≥44px.
- Nút trải rộng cột → `fullWidth` (prop, không phải `w-full` className tùy tiện ở chỗ cấm).
- **Save/submit trong FORM SETTINGS rộng = NGẮN** (`className="self-start"`, width co theo chữ), **KHÔNG `fullWidth`**.
  fullWidth chỉ cho CTA chính trong cột hẹp/modal/card. Trong flex-col (stretch) phải `self-start`/`self-end`. (xem `starci-form.md` §7.)

## 5. Trạng thái (§ async)
- Nút gọi mutation/fetch → **`isPending`** (tự spinner + khóa double-submit). CẤM nút trơ không state.
- Vô hiệu hóa → `isDisabled` (KHÔNG để nút trông bấm được mà không làm gì).
- `onPress` (KHÔNG `onClick`).

## 6. Icon trong nút
- Icon = phosphor `*Icon`, `aria-hidden focusable="false"`, đặt **trước** label, `size-4`.
- Brand (GitHub…) = `@icons-pack/react-simple-icons`.

## 7. Anti-patterns (CẤM)
- Nhiều `primary` cùng màn · `danger` sát `primary` · icon-only thiếu `aria-label` ·
  tô màu nút bằng `className` thay vì variant · dựng lại Button từ `<button>` trần (dùng HeroUI `Button`) ·
  **dãy pill `Button` làm SELECTOR** (provider/mode → `Select`/`Tabs primary`, xem `starci-form.md` §4) ·
  **`fullWidth` cho save trong form settings rộng** (→ `self-start`).

## Tham chiếu
- Variant + onPress/isPending: `starci-ui.rules` §5. Async/loading nút: §7.
