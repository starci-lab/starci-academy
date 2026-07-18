# Proposal — `ColoredLeftBorderCard` (tách block + migrate)

> Thầy đặt tên concept 2026-07-17: *"3 cái này chung khái niệm, gọi ColoredLeftBorderCard… để highlight"*.
> **Canon đã ghi:** `.claude/fe/components/card.md` §3i (gồm phân định với rule §3g 2026-07-09).
> Skill lane: `starci-fe-feedback` xác định đây là việc LỚN (nhiều call-site + đổi cấu trúc) → queue, không ôm.

## Vì sao cần block
Concept đang **hand-roll 3 nơi**, và `VerdictHeroCard` tự thú trong JSDoc là thiếu block chung:
> *"The left accent border is drawn by hand (`border-l-4` + a band color, layered on top of the card's own `border-y border-r`) rather than via `SectionCard`, **which has no asymmetric-border variant**."*

## Call-sites (đã grep xác nhận)
| Call-site | Hiện tại | Màu đến từ |
|---|---|---|
| `blocks/stats/VerdictHeroCard` | `border-l-4` + `BAND_BORDER[band]` trên `border-y border-r border-default` | band verdict (đỏ/vàng/xanh theo retention) |
| `blocks/buttons/RatingBar` | *"tier-colored edge stripe"* mỗi tile — *"the grade's ONLY color signal"* | tier SM-2 (Quên/Khó/Được/Dễ) |
| `features/dashboard/league/League/WeeklyBoard` | `border-l-2 border-success` / `border-danger` trên `SurfaceListCardItem` | zone thăng/rớt (gate `promote+demote<total`) |
| `blocks/cards/ContinueCard` hero (mock resume) | **CHƯA có** viền — dùng accent ring | — (thầy khoanh đỏ; cần hỏi: có đổi sang viền trái không, hay giữ ring?) |

## Đề xuất block
`src/components/blocks/cards/ColoredLeftBorderCard/index.tsx` — presentational, props-only:
- `tone`: semantic (`success | warning | danger | accent | neutral`) **hoặc** `bandColor?: string` (VerdictHeroCard đang dùng band tự chế) → chốt 1 trục màu lúc build.
- `width`: `2 | 4` (row marker mảnh vs hero band dày) — mặc định `4`.
- `children` + `className`.
- Base: `border-y border-r border-default bg-surface rounded-3xl` + `border-l-{width}` + tone color. (Nghiên cứu lúc build: có nên dựng trên `SectionCard` + thêm variant asymmetric-border, thay vì `<div>` mới — vì JSDoc VerdictHeroCard chỉ đúng chỗ này.)

## Migrate
1. `VerdictHeroCard` → dùng block (bỏ hand-roll border).
2. `RatingBar` → edge stripe qua block (nếu shape hợp — tile nhỏ, có thể cần `width=2`).
3. `WeeklyBoard` zone row → block (hoặc giữ `SurfaceListCardItem className` nếu block không hợp trong list — cân nhắc).
4. `ContinueCard` hero → **HỎI THẦY** trước (hiện là ring, không viền).

## ⚠️ Rủi ro / thứ tự
- **`VerdictHeroCard` đang là WIP của SESSION KHÁC** — `?? .storybook/stories/blocks/stats/VerdictHeroCard/` (story chưa commit) + `stats-insight-redesign` vừa DONE. **Đừng migrate nó khi session kia còn đang viết story** → làm sau/hỏi trước, tránh đụng nhau (memory: parallel-session worktree race).
- Migrate `RatingBar` = block dùng chung (blast radius: mọi màn ôn thẻ) → verify kỹ.

## Verify plan
- `tsc --noEmit` (lọc PriceTag) + eslint các file chạm.
- grep: 0 chỗ còn `border-l-4`/`border-l-2` + màu hand-roll ngoài block.
- Story `news` cho `ColoredLeftBorderCard` (block canonical → PHẢI có story, khác feature-comp).
- Runtime: thầy soi 3 surface (stats verdict · nút SM-2 · league zone).

## 3 lớp
- **Truth:** canon ĐÃ ghi (`card.md` §3i) — gồm phân định ❌ad-hoc-viền vs ✅viền-từ-data.
- **Story:** block canonical mới → cần story (`.storybook/stories/blocks/cards/ColoredLeftBorderCard/`), tag `news`.
- **Registry:** thêm dòng vào `.artifacts/states/registry.md` nhóm `cards` khi build xong.
