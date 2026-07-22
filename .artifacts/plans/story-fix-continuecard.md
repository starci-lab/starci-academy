# story-fix plan — ContinueCard

> Lane: `starci-fe-story-fix-block-plan` (PLAN, read-only). Ground: `.claude/fe/principles.md` §1 + §2 · component `src/components/blocks/cards/ContinueCard/index.tsx` (production, unchanged) + story-local port `.storybook/stories/blocks/cards/ContinueCard/ContinueCard.tsx` (faithful, render identical) + sub-blocks (SectionCard bordered, HighlightCard arc, SeeMoreLink accent-soft, ProgressMeter accent).
> 🔄 **Re-synced sau khi pull FE (`b9903c5 → 0ff4c2d`)**: story bị viết lại — tách `AllVariants` cũ → per-state leaves dưới `Block/Cards/ContinueCard/{Hero,Item}`. Render LOGIC không đổi → audit §2 vẫn đúng. Ca `urgent` giờ là story **Hero → "Gần hết thời gian" (AlmostOut)**: `subtitle="Question 7/8 · Middle · 2 minutes left" value=7 max=8 urgent`.
> ✅ **DOM-verified** (computed style, story `AlmostOut`): subtitle "Question 7/8 · Middle · 2 minutes left" là 1 text-node, color `oklab b*≈+0.10` = **vàng-warning tô cả dòng** (kể cả meta trung tính) · CTA bg `oklch(0.70 0.21 354)` = **accent hồng** solid · `.highlight-card-sweep` present (vành accent). → nhiều điểm nổi, **2 hue chỏi (hồng × vàng)**. (Screenshot pane vẫn `UnknownVizError` — dùng DOM-measure thay vì chụp; thầy soi mắt trên :6006.)
> Widget options: `continuecard_almostout_fix_options_v2` (before + A/B/C, đúng hue hồng/vàng thật).

## Bảng phát hiện

| verdict | vùng | lý do (neo §) |
|---|---|---|
| ✅ | item — title/subtitle/CTA | title foreground-medium · subtitle `muted` · CTA `SeeMoreLink` = 1 accent (`text-accent-soft-foreground`). Đúng §2a: 1 nổi/vùng, meta chìm. Không đổi. |
| ⚠️ | hero (không gấp) — arc + watermark + button | 3 điểm accent cùng hue: HighlightCard arc (emphasis) + icon watermark `accent-soft opacity-40` + button `bg-accent`. Ranh §2c restraint. Arc = cơ chế nhấn của 1 hero (OK); watermark có thể là nhiễu → cân nhắc bỏ. |
| ❌ | hero (gấp) — `urgent` tô CẢ subtitle warning | `urgent` → `text-warning-soft-foreground` cả dòng, sơn luôn meta trung tính "Question 5/8 · Middle". §2a: count/vị-trí = **muted**, không tô màu. Chỉ mảnh "12 minutes left" là tín hiệu. |
| ❌ | hero (gấp) — 4 điểm nổi / 2 hue | arc(accent) + subtitle(warning) + progress(accent) + button(accent) = 4 điểm, 2 hue → §2 "đúng 1 thứ nổi/vùng" + §2c "đếm điểm nổi >2 = cờ". Mắt không biết đáp vào đâu. |
| ⚠️ | hero — title chỉ `weight="medium"` | title hero ngang item; thứ loudest là button. *Đề xuất luật mới* (chưa có § tường minh): trong hero, content nên có 1 anchor rõ (title semibold). Để thầy quyết có bổ sung §2b không. |

Trọng tâm fix = 2 dòng ❌ ở **hero (gấp)** (widget `continuecard_hero_urgent_fix_options`).

## Phương án (chọn 1 hoặc trộn)

| # | Hướng | §neo | Ưu | Nhược |
|---|---|---|---|---|
| **A** | deadline = **chip warning** riêng, meta muted | §2a chip=status/badge · §2c | Warning đóng khung 1 điểm; API giữ nguyên gần như (thêm 1 slot chip) | +1 element |
| **B** | **split inline**: chỉ "12 minutes left" warning, còn lại muted | §2a (chỉ tín hiệu tô màu) | Ít element nhất; đúng §2a nhất | Đổi API: tách `deadline?` khỏi `subtitle` (bỏ `urgent` cả câu) |
| **C** | subtitle muted hết, **progress bar** đổi hue warning | §2 gom 1 nơi | Meta sạch; dùng sẵn `ProgressMeter color="warning"` | Bar warning + arc accent vẫn 2 hue; ngữ nghĩa "value carries meaning" lệch (deadline ≠ score) |

**Em nghiêng B** (đúng §2a nhất, nổi đúng mảnh tín hiệu) nếu thầy chịu tách API `deadline?`; nếu muốn giữ API tối thiểu thì **A**. C để dự phòng.

> Kèm (tuỳ chọn, low-risk): bỏ watermark icon ở hero cho gọn §2c; nâng hero title lên `font-semibold` nếu thầy chốt luật anchor.

## ✅ CHỐT (thầy duyệt 2026-07-22)

### Primitives/blocks thiếu — chốt **P1** (từ 5 widget P1–P5)
- **`MetaRow`** — **primitive** (gốc rễ). Story title `Primitives/List/MetaRow`, file `.storybook/stories/blocks/lists/MetaRow/{MetaRow.tsx, MetaRow.stories.tsx}`.
  - Props: `chip?: ReactNode` (slot signal TRÁI, tuỳ chọn) · `items: ReactNode[]` (meta muted nối `·`) · `className?`.
  - **Reuse `StatusChip tone="warning"` + icon `ClockCounterClockwiseIcon`** làm chip deadline — KHÔNG hand-roll pill.
  - Chip là slot tuỳ chọn → chỗ chỉ có meta (không gấp) bỏ trống chip.

### Fix block ContinueCard — chốt **A** (deadline = chip TRÁI) + chip-left
- API đổi: **bỏ `urgent: boolean`**; **thêm `meta?: ReactNode[]`** (segment trung tính) + **`deadline?: ReactNode`** (fact gấp → chip warning). Giữ `subtitle?` cho item (dòng muted phẳng).
- Render: có `meta`/`deadline` → `<MetaRow items={meta} chip={deadline ? <StatusChip warning clock>{deadline}</StatusChip> : undefined} />`; else `subtitle` → Typography muted như cũ. Bỏ nhánh tô cả subtitle warning.
- Hero stories: `heroBase.meta = ["Question 2 / 8","Middle","40 minutes left"]` (muted, no chip); **AlmostOut** = base + `meta:["Question 7 / 8","Middle"]` + `deadline:"2 minutes left"` + value/max (delta = tách deadline ra chip). Item KHÔNG đổi.
- Anatomy Hero += `MetaRow` (primitive) + `StatusChip` (primitive, `state:"Gần hết thời gian"`).

> Watermark icon / nâng title: KHÔNG trong scope này (thầy chưa chốt) — giữ nguyên.
> Thứ tự apply: dựng `MetaRow` (gốc rễ) TRƯỚC → sửa `ContinueCard` consume. Model: Opus spec, Sonnet 5 code.
