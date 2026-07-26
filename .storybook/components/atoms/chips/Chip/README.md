# `Chip.Base` — khi nào dùng ICON trong chip

> Ngữ cảnh cho LLM/dev: cơ sở để QUYẾT ĐỊNH có gắn `icon` vào một chip hay không.
> Icon trong chip = **tín hiệu THÊM**, không phải trang trí. Label vẫn là nguồn
> nghĩa chính; chỉ thêm icon khi nó tải nghĩa mà label chưa nói hết hoặc cần quét nhanh.

## ✅ DÙNG icon khi

1. **Trạng thái nhị phân / valence rõ — success vs failure.**
   Icon củng cố "đúng/sai · đạt/trượt · xong/lỗi" ở mức LIẾC-là-thấy, trước cả khi
   đọc chữ. VD: `Verified` ✓ · `Passed` ✓ · `Failed` ✕ · `Rejected` ✕.
   → Đây là ca CHÍNH đáng dùng icon.

2. **Nhấn mạnh một trạng thái quan trọng** cần nổi giữa danh sách chip dày.
   VD một chip cảnh báo/nổi bật giữa nhiều chip trơn.

3. **Thực thể / brand mà LOGO là danh tính.**
   Logo GitHub/YouTube/Google… bản thân logo LÀ cái nhận diện, chữ chỉ phụ.
   VD: `GitHub` · `YouTube`.

4. **Category có icon quy ước MẠNH** đã được người dùng học (hệ gán cố định 1 icon
   cho 1 loại).

## ❌ KHÔNG dùng icon (để text-only) khi

- **Label đã đủ nghĩa** → thêm icon = thừa/nhiễu.
  VD độ khó `Beginner`/`Intermediate`/`Advanced` — chữ đủ, ĐỪNG thêm icon.
- **Icon trang trí** không map tới nghĩa nào.
- **Hàng token đồng cấp** (tags, filter) mà mỗi chip một icon khác hệ → rối thị giác;
  ưu tiên text-only cho cả hàng.
- **Scalar/đếm** (số lượng, giờ, học viên) → muted text hoặc chip-số, KHÔNG icon
  (xem canon §1: `482 học viên` không chip/không icon).

## Chọn ICON NÀO (khi đã quyết dùng)

Chỉ dùng **icon PHỔ QUÁT / common** — cái ai cũng đọc ra NGAY, không cần ngữ cảnh domain:

- ✅ `CheckCircleIcon` (✓ đạt/xong) · `XCircleIcon` (✕ lỗi/trượt) · `ClockIcon` (chờ/hạn) ·
  `LockIcon` (khoá) · `WarningIcon` (cảnh báo)… — glyph status quen mặt toàn cầu.
- ❌ **Icon SPECIFIC theo domain quá** — chỉ người trong domain hẹp mới hiểu (biểu
  tượng nghiệp vụ, viết tắt bằng hình, metaphor riêng). Người ngoài đọc không ra →
  KHÔNG nhét vào chip. Chip cần đọc-nhanh, phổ quát; khái niệm domain hãy để **CHỮ**
  (label) tải, đừng ép thành icon lạ.

Test: người chưa biết domain nhìn icon này có đoán đúng nghĩa không? Không → dùng chữ.

## Hình dạng & kỹ thuật

- **Chip = 1 size duy nhất (`md` medium).** Font do HeroUI quyết: `.chip { text-xs }` và
  `.chip--md { text-xs }` ⇒ chữ chip là **12px**.
- **Ưu tiên nét OUTLINE, KHÔNG đặc** — `CheckCircleIcon` mặc định; bản ĐẶC chỉ khi cần
  đặc/đậm có chủ đích đã chốt, và làm bằng `weight="fill"` (Phosphor không có component
  `*Fill` riêng).
- Size icon = `size-3` (12px, bằng đúng cỡ chữ 12px của chip md) — **ATOM tự ép**, caller
  không set. ⚠️ Sửa 2026-07-26: trước ghi `size-3.5` và viện "khớp `text-sm` của chip" —
  chip không hề có `text-sm`, nên icon to hơn chữ một nấc ở mọi chip của hệ.
- Tone icon = theo tone chip (`currentColor`), không sơn màu riêng.
- Bộ icon = **Phosphor** (`@phosphor-icons/react`) — MỘT bộ duy nhất cho cả cây (§5⃣0).
- **Weight theo size (§5⃣0a):** `size-5` → `regular` (mặc định) · nhỏ hơn `size-5` → `weight="bold"`
  để bù nét mảnh đi khi thu nhỏ. Icon chip là `size-3` ⇒ **`weight="bold"`**, và **ATOM tự áp** —
  caller truyền component reference, KHÔNG tự set `weight`.
- **KHÔNG cần `!important`** (khác `Button`): `chip.css` không có rule `.chip svg` nào để tranh
  specificity, nên class Tailwind thường là đủ.

## API (strict UI)

```tsx
<Chip.Base icon={CheckCircleIcon} text="Verified" tone="success" /> // icon = COMPONENT, không JSX
<Chip.Base text="Draft" />                                        // không icon → bỏ prop
<Chip.Base onRemove={fn} text="React" tone="accent" />            // filter token (×)
<Chip.Base dotClassName="text-success" text="Đang chạy" />        // chip CHẤM trạng thái
<Chip.Base dotColor="#3178c6" text="TypeScript" />                // màu ngoài bảng token
<Chip.Group items={[{ key: "ts", text: "TypeScript" }]} />        // hàng chip, tràn → +N
```

⚠️ Ô glyph dẫn đầu chỉ có MỘT chỗ: `icon` và `dotColor`/`dotClassName` loại trừ nhau (ép ở
kiểu). Chấm chỉ hiện khi caller cho nó một MÀU — chấm sinh ra để tải màu.

`icon` nhận **component reference** (`CheckCircleIcon`), KHÔNG phải `<CheckCircleIcon/>` — atom
kiểm soát render/size/weight, caller không chèn sai được.

## Tự hỏi trước khi thêm icon

1. Bỏ icon đi, chip còn hiểu không? → còn hiểu ⇒ để text-only, TRỪ khi rơi vào (1)/(2)/(3).
2. Icon này map tới đúng MỘT nghĩa (success/fail/brand/emphasis) chứ? → không ⇒ bỏ.
3. Trong hàng chip này, thêm icon làm NỔI cái cần nổi hay làm RỐI tất cả?
