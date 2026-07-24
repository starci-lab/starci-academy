# Step 2 (diff vs Storybook, REUSE-first): CourseContents

> Đối chiếu cây step 1 với `.storybook/stories/blocks/**`. **Nguyên tắc: ưu tiên TÁI DÙNG để đồng nhất tree; chỉ tạo mới nếu CHỨC NĂNG khác.** Prototype đối chiếu từng cái: `CourseContents.step2.html`. Pull FE @ `1783ee63`.

## Phản biện — mỗi đề xuất new/extract bị soi lại

| Node | Đề xuất đầu | **Phản biện** | Lý do |
|---|---|---|---|
| **LessonRow** | NEW design | **REUSE `ListRow`** | ListRow = `leading`(Play/Check/Circle) · `title` · `subtitle`(phút) · `meta`(DifficultyChip+Lock) · `onPress`. Icon-trạng-thái chỉ là node vào `leading`, không phải chức năng khác. |
| **NudgeRow** | NEW design | **REUSE `ListRow`** | `leading`=icon · `title`=label · `meta`=count · `trailing`=arrow · `href`. Cùng khuôn LessonRow → tách 2 = phân mảnh tree. |
| **KeepGoingPath** | EXTRACT block | **REUSE `SurfaceListCard`+`ListRow`** | SurfaceListCard có prop `label` (section header baked-in) + children ListRow. Chỉ là list-có-nhãn, không chức năng mới. |
| **ContinuePanel** | EXTRACT block | **REUSE `ContinueCard` + PROP** | Cùng chức năng (tiếp tục + progress + CTA). Khác duy nhất: dashboard **flat, no frame** (spine trang) + eyebrow + stat. → §6b thêm `variant="plain"` (frameless) + `eyebrow` vào ContinueCard, KHÔNG đẻ block. Giữ 1 "continue" thống nhất. |
| **GithubTeamGate** (warning) | ADD-STORY riêng | **REUSE `Callout`** | src dùng HeroUI `Alert`+IconTile = đúng khuôn Callout port (feedback/Callout). Logic join-team là feature-only. |

## Kết quả sau phản biện
- **NEW: 2 → 0** · **EXTRACT: 2 → 0** (thành reuse-composition).
- **MODIFY: 1** — `ContinueCard`: thêm `variant="plain"` (frameless) + `eyebrow`.
- **ADD-STORY (component có src, chức năng THẬT SỰ khác):** `TrialConversionStrip` (conversion: IconTile+PriceTag+PhaseScarcityNote+Button) · `HighlightChip` · `LearnBreadcrumb`.
- **LearnNudges:** feature container (đọc SWR); phần hình = `SurfaceListCard`+`ListRow` → không primitive mới; story (nếu muốn) chỉ ghép reuse.
- **REUSE nguyên:** ListRow · SurfaceListCard · ContinueCard · Callout · PageHeader · ProgressMeter · DifficultyChip · IconTile · PriceTag · PhaseScarcityNote · EmptyContent · ErrorContent · Typography · Button · Skeleton.

→ **0 component mới, chỉ 1 prop thêm.** Tree đồng nhất: mọi "row"=ListRow · mọi "continue"=ContinueCard · mọi cảnh báo=Callout.

## Thứ tự dựng (step 3, sau khi thầy duyệt)
1. **MODIFY** ContinueCard: `variant="plain"` + `eyebrow`.
2. **ADD-STORY** HighlightChip · LearnBreadcrumb.
3. **ADD-STORY** TrialConversionStrip (phủ states ẩn/loading/hiện).
4. Ráp story trang CourseContents = ContinueCard(plain) · Callout · SurfaceListCard+ListRow · TrialStrip · EmptyContent(state ★).

## Chờ thầy phản biện tiếp
- Đồng ý ContinuePanel = **ContinueCard + prop `plain`** (không đẻ block)? Hay flat-spine là chức năng đủ khác để tách?
- LearnNudges: giữ ghép reuse tại chỗ, hay muốn 1 story riêng cho container?
