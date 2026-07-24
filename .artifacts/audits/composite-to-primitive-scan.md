# Storybook composite → primitive — scan (report-only)

Ngày: 2026-07-24 · Nguồn: workflow `storybook-composite-scan` (12 lô Sonnet đọc file thật + Opus dedupe) · 24 ứng viên thô → dedupe cross-lane.

Luật nền: *composite lặp lại (cụm ≥2 primitive/element = 1 khái niệm, hand-roll rải) → GOM thành 1 primitive có tên*. Neo `feedback-semantic-unit-primitive-and-vertical-rhythm`.

---

## STRONG — nên gom ngay

| # | Primitive đề xuất | Khái niệm | Recurrence | Bằng chứng drift |
|---|---|---|---|---|
| 1 | **TitledText** | title (foreground medium/semibold) + optional subtitle muted, xếp dọc | **16** (≥6 lô) | 5 tên khác nhau (TitleSubtitle/TitledText/TitleDescription/StackedTextLabel); RewardItemCard dùng raw `<span>` (vi phạm §9); skeleton mirror cũng lặp |
| 2 | **InlineIconLabel** | leading icon size-4 shrink-0 + text inline | **15** (5 lô) | GradeModelDropdown lặp 4× nội bộ; CourseCard 4× (real+skeleton); mỗi nơi tự set cỡ icon (vi phạm §5 icon-ownership) |
| 3 | **LineItemRow** | nhãn trái · giá trị phải (justify-between), biến thể border-t tổng + tone | 4 | PriceTag popover: 4 call-site liên tiếp lặp y hệt |
| 4 | **ToneStatValue** | số lớn tô màu theo band (danger/warning/success) + unit muted | 4 | map band-color khai báo lại verbatim 3 file; VerdictHeroCard tự ghi comment *"Same tone pairing the Score block uses"* |
| 5 | **VideoControlButton** | nút icon overlay video (trắng, hover translucent, 8×8/icon-5) | 4 | classString lặp verbatim 3× + QualitySelector phải hand-roll `<div>` vì Button port thiếu tone |
| 6 | **EntityResultRow `isSkeleton`** | skeleton mirror 3-thanh của EntityResultRow | 2 | §6b — ChatToolResult + RelatedContentList tự dựng lại mirror vì primitive thiếu isSkeleton |

## MEDIUM — rõ concept nhưng recurrence 2, cần thầy chốt tầng trừu-tượng

| Primitive | Khái niệm | Ghi chú |
|---|---|---|
| **MediaCell** | leading media (avatar/icon-tile) + title + meta — sibling non-person của UserCell | feed (avatar+name+founder+time) + marketing (icon-tile+title+meta); UserCell bị bó cứng person-semantics |
| **OptionRow** | option 2 dòng trong dropdown (label + desc muted) | SearchAutocomplete + MultiSelect; compose TitledText #1 + wiring ListBoxItem |
| **ListboxStatus** | trạng thái popover rỗng/loading (text muted center + spinner) | SearchAutocomplete + MultiSelect; đối chiếu EmptyState trước |
| **InputLeadingIcon** | input có leading icon absolute + pl-9 | TextField + SearchAutocomplete |
| **MetaCountButton** | pill count nén interactive (icon + số, hover muted) | CommunityPostCard + ReactionBar; in-source NOTE tự nhận trùng; né Button vì sm quá nặng |
| **MediaPlaceholderFrame** | khung dashed center + text muted (media empty/invalid) | Youtube + VideoRenderer; đối chiếu EmptyState/CoverImage trước |

## REJECTED — loại (đã có primitive / one-off)

| Đề xuất | Lý do loại |
|---|---|
| SectionHeading | ĐÃ là primitive — reuse-gap ở HeroBanner (thêm prop level+eyebrow rồi compose, không tạo mới) |
| DistributionLegendRow | one-off (chỉ LanguageDonut) + đã có Legend — mở rộng Legend thêm cột value/share |
| StatText | gộp vào **TitledText #1** (biến thể size lớn nhất); standalone one-off |
| NoticeLine | biến thể tone của **InlineIconLabel #2**; standalone recurrence 1 (PhaseScarcityNote) |
| StackedTextLabel (BrandLockup) | wordmark thương hiệu one-off (small-caps riêng) — để atom |

---

## Quan sát chốt
- **2 composite thống trị** (#1 TitledText, #2 InlineIconLabel) chiếm 31/xx call-site — gom 2 cái này là đòn bẩy lớn nhất, phủ chéo nhiều lô.
- Nhiều medium **compose lên strong** (OptionRow→TitledText, NoticeLine→InlineIconLabel) → nên gom strong TRƯỚC, medium tự nhẹ đi.
- 3 gap "self-admitted" trong source (PhaseScarcityNote docblock "should-be-Primitive", VerdictHeroCard comment, CommunityPostCard NOTE) → drift đã được chính code thừa nhận.
