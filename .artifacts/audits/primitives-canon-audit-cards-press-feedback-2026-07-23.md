# Card audit — §7 press-feedback wave (2026-07-23)

> Scope: 9 primitive `Primitives/Card/*` (khung thầy chỉ), soi lại theo canon MỚI thêm sau đợt audit 2026-07-22 — §7 press-feedback (scale + ripple + **no-hover** + disabled-inert). PORT-only, đọc file thật.
> **Report-only** — fix đi lane `starci-fe-story-fix-block-{plan,apply}`.

## Việc làm TRƯỚC = §7 press-feedback compliance
Card *bấm được* PHẢI compose `PressableCard` (thừa hưởng scale + ripple + no-hover + native button/a + disabled-inert). Card nào tự dựng press = miss toàn bộ §7.

## ⚠️ Đính chính scope (2026-07-23) — ROW ≠ CARD (principles §7b)
Sau khi đọc kỹ: press-scale/ripple + no-hover là contract của **CARD/TILE**, KHÔNG áp cho **ROW** (list-row/nav-section — hover-tint là affordance HỢP LỆ của row, scale nhìn kỳ). Nên:
- **SurfaceListCard** = ROW (native `<button>/<a>` + `hover:bg-default` + disabled đã đúng) → **HỢP LỆ, không phải gap** (đã rút khỏi finding).
- Chỉ **MediaCard** (card thật) dính §7 card-contract; **NestedCard** dính **a11y row** (div-click).

## Finding (HIGH) — 2 case cần fix

| # | Card | Loại | Neo | Gap |
|---|---|---|---|---|
| 1 | **MediaCard** (Pressable / AsLink) | CARD | `MediaCard.tsx:133-142` | `href`→`<a>` trần, `onPress`→`<button>` trần → KHÔNG scale/no-hover/focus-ring. Fix = adopt press-contract §7a trên wrapper (không compose PressableCard vì cover full-bleed). |
| 2 | **NestedCard** (NestedCardSection) | ROW | `NestedCard.tsx:74` | Clickable bằng **`<div cursor-pointer>`** → ⚠️ **a11y** (không focus/keyboard). Fix = onPress/href → native `<button>/<a>` (§7b), KHÔNG scale (row). |

## Không dính §7 (đúng / N/A)
- `PressableCard` (nguồn §7 — vừa build scale+ripple+no-hover+disabled-inert) · `SummaryCard` (compose PressableCard ✓, đã fix caret).
- `HighlightCard` (wrapper trang trí) · `SectionCard` · `SurfaceAccordionCard` · `SurfaceCard` — không-pressable → §7 N/A.

## Batch đề xuất (1 batch HIGH)
**B-press: route pressable cards qua PressableCard press-contract.**
- SurfaceListCard / MediaCard / NestedCard: thay press hand-roll bằng **compose `PressableCard`** (hoặc tối thiểu adopt contract: bỏ `hover:bg-*`, thêm `active:scale-[0.97]` + ripple, dùng `<button>/<a>` thật, `transition-[scale]`, disabled-inert).
- NestedCard ưu tiên vì còn lỗi **a11y** (div-click → button/a).
- Lane: `starci-fe-story-fix-block-plan` (cần plan vì đổi cấu trúc render) → `-apply`.

## Follow-up waves (chưa soi lần này)
- **C-fixture skeleton-mirror**: isSkeleton của các card có content nên mirror ProfileCard (avatar+title+desc), không dot+vạch generic — HighlightCard/SectionCard/SurfaceAccordionCard/MediaCard cần check.
- **§5 caret**: SurfaceListCard/SummaryCard đã sweep; MediaCard/SectionCard recon = 0 caret (ok).
- **10-chiều cũ**: đã fix đợt 2026-07-22, chỉ re-confirm khi cần.
