# Audit 99 primitives theo canon ButtonGroup — 2026-07-22

> Workflow `audit-primitives-buttongroup-canon` · 99 agent Sonnet + Opus synth · 0 lỗi.
> Canon: 10 check (C1 props-roles · C2 size · C3 isSkeleton · C4 responsive · C5 §4-ownership · C6 §5-icon · C7 anatomy · C8 cluster→group · C9 nCn-test · C10 spacing).
> Per-primitive chi tiết: workflow journal `wf_7614badb-f6d/journal.jsonl`.

## A. Top 15 primitive cần sửa nhất (điểm = high·3 + med·2 + low·1)

| # | Primitive | Điểm | Gap chính |
|---|-----------|------|-----------|
| 1 | Stats/StatGridCard | 11 | C1 shape cell lặp không slot tường minh (high) · C5 icon caller set · C3/C4/C9 |
| 2 | Card/SummaryCard | 10 | C5 icon-size leak (high) · C6 chevron · C3 skeleton · C9 · C10 p-4 |
| 3 | Chip/EnumChip | 9 | C5 icon-size đẩy caller (high) · C6 · C2 size cứng · C9 |
| 4 | Chip/LanguageChip | 9 | C1 hand-roll DotChip thay vì compose (high) · C2 · C3 · C9 |
| 5 | Nav/ProgrammingLanguageTabs | 9 | C1 src drift, hand-roll Tabs thay vì ExtendedTabs (high) · C3 · C4 · C9 |
| 6 | Rendering/MarkdownContent | 9 | C9 · C3 mermaid loading · C10×3 · C6 |
| 7 | Chip/HighlightChip | 8 | C2 · C6 · C3 · C9 |
| 8 | Chip/StatusChip | 8 | C2 · C3 · C8 chip cluster itemize rời · C9 |
| 9 | Chip/TagChips | 8 | C2 · C3 · C4 · C9 |
| 10 | Layout/StickyBottomBar | 8 | C1 vai nội dung không slot (high) · C8 · C9 · C10 |
| 11 | Nav/Pagination | 8 | C2 · C3 · C9 · C6 · C10 |
| 12 | Stats/SegmentBar | 8 | C1 src hand-roll Legend, drift port (high) · C3 · C9 · C10 |
| 13 | Button/InputButtonLike | 7 | C5 icon-size leak (high) · C2 · C9 |
| 14 | Form/SchedulePicker | 7 | C1/C8 hand-roll thay vì FlexWrapButtonRadio (high) · C3 · C9 |
| 15 | Stats/StatPair | 7 | C8 story hand-roll thay vì StatRibbon (high) · C3 · C9 |

## B. Gap PHỔ BIẾN (làn sóng — số primitive dính)

| Check | Nội dung | Số | Ghi chú |
|-------|----------|----|---------|
| **C9** | thiếu ⚙ Test/play nCn | **~98/99** | Làn sóng lớn nhất (chỉ ButtonGroup có). Generator ROI cao nhất. |
| **C3** | thiếu `isSkeleton` mirror | **~52** | Toàn họ data-backed (cards/chips/stats/media/identity). |
| **C10** | spacing ngoài thang | **~43** | `p-4`/`pl-4`/`gap-1`/`px-1`/`mt-1`. Codemod được. |
| **C6** | icon-size không neo text | ~18 | Đi kèm C5. |
| **C2** | thiếu `size` | ~17 | Chủ yếu họ Chip (size cứng `sm`). |
| **C5** | icon ownership leak | ~16 | Cùng gốc C6. |
| **C1** | shape/hand-roll ngầm | ~9 | Nặng (high). |
| **C8** | cluster đồng vai rời | ~8 | Nên qua ButtonGroup/group. |
| **C4** | không xử lý hẹp | ~9 | Rải rác. |

## C. Đạt canon
**Không primitive nào 0 gap.** Gần nhất: **ButtonGroup** (1 gap C6-low: `group-hover:translate-x-1` áp cho MỌI icon thay vì riêng arrow/caret). 13 primitive "chỉ nợ C9" (đạt lõi): ElementCloseButton, FloatingActionButton, HighlightCard, Callout, ConfirmDialog, EmptyState, ErrorState, SimpleEmptyState, ImageDropzone, Logo, DragScrollArea, Spacer, RichText.

## D. Khuyến nghị batch (theo GAP, không theo primitive)
1. **Batch 1 — ⚙ Test generator (C9, ~98).** 1 generator dựng story `Test` + play cross-product từ prop-matrix → ~99% coverage debt/1 pass. Ưu tiên #1.
2. **Batch 2 — `isSkeleton` mirror (C3, ~52).** Chuẩn hoá prop + nhánh skeleton nội bộ, xoá "consumer dựng Skeleton rời". Họ data-backed.
3. **Batch 3 — spacing codemod (C10, ~43).** `4/1/1.5/5/9` → `0/2/3/6/8` (chủ yếu `p-4→p-3`). Giữ lệch có comment.
4. **Batch 4 — icon ownership (C5+C6, ~30).** Ép `[&_svg]:size-*` + map icon-theo-text nội bộ, gỡ set ở call-site. Gộp prop `size` họ Chip (C2).
5. **Batch 5 — compose-not-hand-roll (C1+C8, ~12, HIGH).** Gốc rễ, rủi ro cao: LanguageChip→DotChip · ProgrammingLanguageTabs→ExtendedTabs · SegmentBar→Legend · SchedulePicker→FlexWrapButtonRadio · StatPair/StickyBottomBar→ButtonGroup · StatGridCard→structured cell. **Làm TRƯỚC Batch 1** cho nhóm này (kẻo sinh test cho anatomy sắp thay).
