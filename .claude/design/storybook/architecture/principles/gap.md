# gap — thang seam của hệ

> Canon. Khoảng cách giữa các con là quyết định của **PARENT** (§10a), không phải con —
> con không mang margin. Mỗi seam là một KHÁI NIỆM có tên (token `patterns.mjs`), không
> phải một con số pixel.

## Thang (step → px)

| step | px | class |
|---|---|---|
| 1 | 0 | gap-0 |
| 2 | 4 | gap-1 |
| 3 | 8 | gap-2 |
| 4 | 12 | gap-3 |
| 5 | 16 | gap-4 |
| 6 | 24 | gap-6 |
| 7 | 32 | gap-8 |
| 8 | 48 | (marketing, landing) |

Frame nhận `gap` là **step** (1–8), không phải class. `Stack`/`Cluster`/`Grid`/`Split`
render class tương ứng.

## Seam có TÊN

Mỗi gap embody một token seam (xem `.storybook/test-runner/patterns.mjs`). Cùng 8px
nhưng ý đồ khác nhau → token khác nhau:
- **8px**: `flex-action` (hàng control) · `identity` (avatar+tên) · `value-row` (số
  cùng baseline) · `chip-row` (hàng chip) · `sibling-stack` (cột peer).
- **12px**: `label-field` · `content-row` (list-row) · `card-caption`.
- **16px**: `group-boundary` (2 nhóm/surface).
- **24px**: `block-boundary` (2 block/page — seam phổ biến nhất).
- **32px**: `layout-split` (2 cột, header↔content).

Frame khai token qua prop `pattern="…"` → phát `data-principles` → test-runner đo. Frame
realise seam mà không khai `pattern` = **seam hở** (không test được, gate
`check-pattern-coverage`). Xem [test-strategy](../../../test-strategy.md).
