# `Typography.*` — atom chữ (custom, KHÔNG phải HeroUI Typography)

> Ngữ cảnh cho LLM/dev: dùng atom NÀY cho MỌI chữ (§9c — một nguồn). Custom span +
> Tailwind, KHÔNG bọc HeroUI `Typography`. Tách theo CỠ thành component riêng:
> `Typography.Xs` (12px) · `.Sm` (14px) · `.Base` (16px) · `.Lg` (18px) — **mở rộng
> thêm size dễ** (factory `makeTypography("<size>")` 1 dòng). Mỗi state = 1 story.

## Màu — 2 mức (§9a)

Prop `color="default | muted | accent | success | warning | danger"`:

- **`default`** (mặc định) = foreground, chữ CHÍNH → KHÔNG khai báo.
- **`muted`** = chữ PHỤ (hint · caption · meta · timestamp) — §9a.
- **`accent | success | warning | danger`** = semantic inline (§2): nhấn · đạt · cảnh báo · lỗi.

## Xử lý chữ

- **`truncate`** = 1 dòng ellipsis (cần parent giới hạn width) · **`lineClamp={1|2|3}`** = clamp N dòng.
- **`tabularNums`** = chữ số đều bề rộng cho giá/đếm (§3 thẳng cột).
- **`iconSlide`** (§5b) = ARROW trượt khi hover (prefix ← · suffix →). CHỈ arrow, KHÔNG caret.

## Weight — 1 prop (§9b)

- **normal** (mặc định) = body dài / mô tả.
- **`weight="medium"`** = nhấn LÀM-VIỆC: nhãn · phần "value" · tiêu đề cỡ-body · từ trọng tâm.
- **`weight="bold"`** = heading / display / số lớn.
- `isItalic` = nghiêng (trích dẫn / nhấn nhẹ).
- ⚠️ **RULE: có icon → text TỰ `font-medium`** (size icon gravity fit medium-weight text) —
  KHÔNG tự set `weight` khi có icon.
- **`isLink`** = link INLINE — dùng **HeroUI `Link`** (accent + hover underline + a11y). State riêng, KHÔNG weight/icon.

## Icon (strict, tùy chọn)

- `prefixIcon` (leading) · `suffixIcon` (trailing) — nhận **COMPONENT** (`prefixIcon={CircleCheck}`,
  KHÔNG JSX). Atom ép **size = font-size**: xs→`size-3` · sm→`size-3.5` · base→`size-4`.
- Icon **inherit tone của chữ** (currentColor) — muted thì icon cũng muted.
- Icon lib = **gravity** (`@gravity-ui/icons`); gravity **KHÔNG** có `weight`.
- Khi nào gắn icon: xem cơ sở ở [[Chip README]] (success/failure · nhấn mạnh · brand;
  icon phổ quát, không domain-specific).

## `isSkeleton`

Atom TỰ vẽ **text-bar skeleton** (cao = glyph height của cỡ) — hybrid C, KHÔNG gọi `Skeleton.*`.

## API

```tsx
<Typography.Sm text="Chấm bài với model premium" />        // chữ chính
<Typography.Xs text="Nộp 15/03/2026" isMuted />            // chữ phụ
<Typography.Sm text="Đã đạt" prefixIcon={CircleCheck} />   // icon (KHÔNG weight)
<Typography.Base text="Doanh thu quý 4" weight="bold" />
<Typography.Sm text="Xem chi tiết" isLink />               // HeroUI Link
<Typography.Sm text="…" isSkeleton />
```

Content qua **`text={...}`** (thống nhất `Chip.Base` — mono/nhất-quán, KHÔNG children).

⚠️ Naming: atom `Typography` KHÁC HeroUI `Typography` — nơi nào cần bản HeroUI thì
alias `HeroTypography` (cùng kiểu `HeroChip`). Consumer đừng import lẫn.
