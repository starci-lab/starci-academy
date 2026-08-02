# elements — tier & source-level metadata

> Canon. Mỗi component thuộc đúng MỘT tier. Tier + tên được phát ra DOM (`data-tier`,
> `data-component`) để test/anatomy đọc, và khai ở source qua `export const meta`.

## Năm tier

| tier | là gì | ví dụ |
|---|---|---|
| **atom** | bọc 1 primitive HeroUI, constrained, `isSkeleton` co-located | Button · Typography · Avatar · Chip · Input |
| **frame** | khung layout feature-less (chỉ spacing/structure) | StackH/V · Cluster · Grid · Split · Container · RailShell |
| **composite** | ghép nhiều atom/frame thành 1 khối tái dùng, chưa mang domain | SurfaceCard · AsyncContent · List · ModalShell |
| **block** | mang FEATURE/domain (nhận entity), ghép composite | PriceTag · ContentHeader · LearnNudges · SubmissionScoreCard |
| **page** | màn hình đầy đủ, ghép block trong 1 layout | CourseContents · ContentArticle · PersonalProject |

## `data-*` phát ra

- `data-tier` — tier ở trên. Frame render qua `Flex` → luôn `data-tier="frame"`.
- `data-component` — tên component. Frame delegate `Flex` → `data-component="Flex"` (Stack
  không render element riêng nên DOM đọc "Flex", không "StackV"; identity source ở `meta`).
- `data-anat-part` — atom tự phát khi `showAnatomy` (cho panel BlockAnatomy).
- `data-principles` — token layout, **caller khai** qua `pattern` (xem [gap](../principles/gap.md)).

## `meta` — identity ở source

Mỗi file component export `export const meta = { tier, name } as const` (hoặc record
nhiều component). Gate/panel đọc `meta` để biết tier mà không đoán theo path. File có 2
public component (vd Stack: StackV/StackH) → `meta` là record.

## Anatomy

Block khai `BlockAnatomy` (cây part). Mỗi part khai báo phải CÓ mặt trong DOM (gate
`check-orphan-parts`). Node có `storyId` = CỬA (một nấc), không chuyền `showAnatomy` xuống con.

Xem [split](../split.md), [test-strategy](../../../test-strategy.md).
