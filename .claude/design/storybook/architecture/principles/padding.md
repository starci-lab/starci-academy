# padding — inset của một surface

> Canon. Padding là khoảng trống BÊN TRONG track/surface. Frame nhận `padding` là
> **step** (house-scale, KHÁC số tailwind), không phải class.

## Thang (step → px → class)

| step | px | class |
|---|---|---|
| 1 | 0 | p-0 |
| 2 | 4 | p-1 |
| 3 | 8 | p-2 |
| 4 | 12 | p-3 |
| 5 | 16 | p-4 |
| 6 | 24 | p-6 |

⚠️ **House-scale ≠ số tailwind**: `padding={4}` = `p-3`, `padding={5}` = `p-4`. Đọc
`PADDING_CLASS` trong `.storybook/components/frames/_spacing.ts` — đừng map `p-3→padding={3}`.

## Bất đối xứng (px ≠ py)

Dạng phổ biến nhất trong hệ (247 site). Truyền `padding={{ x: <step>, y: <step> }}`.

## Token seam (patterns.mjs)

- Đối xứng: `cell-pad` (p-3, inner surface dày) · `card-padding` (p-4, card/modal/drawer,
  set global trên `.card`/`.modal__dialog`) · `page-pad` (p-6, measure ngoài cùng).
- Bất đối xứng: `control-pad` (px-3 py-2, pill/badge/input) · `row-pad` (px-4 py-3, list
  row) · `pill-pad` (px-4 py-2, CTA/chip có trọng lượng).

Xem [gap](gap.md), [test-strategy](../../../test-strategy.md).
