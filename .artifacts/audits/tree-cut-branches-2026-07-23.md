# Deep-scan — nhánh cắt còn lại trong cây primitive (2026-07-23)

**Lane:** report-only. Mục tiêu: hoàn thiện cây phụ thuộc — mọi primitive lần xuống ATOM, "đổi 1 = đổi hết". Nhánh cắt = raw HeroUI / hand-roll vòng qua port → không nhận thay đổi atom → drift.

**Kết quả: 49 nhánh cắt STRONG + 25 borderline** (12 agent quét 21 family).

## STRONG (49) — gom theo atom cần nối vào

### ■ Button (23) — raw `@heroui/react` Button thay vì Button port
cards/PlaygroundCard:71 · cards/CourseCard:277,430,527 · cards/ContinueCard:152,143(hand-rolled Link-as-pill) · form/SchedulePicker:174 · form/SearchBar:110 · media/VideoRenderer/QualitySelector:91 · commerce/PricingTable:169 · marketing/TrackCard:99 · feed/Composer:114 · feed/CommunityPostCard:156 · feed/CommentThread:73 · identity/AvatarUploadButton:54 · navigation/FlexWrapButtonRadio:113 · buttons/InputButtonLike:3 · layout/SubPageHeader:46 · notifications/NotificationBell:96 · notifications/NotificationList:108 · learn/QuizCard:141 · learn/UpNextCard:109 · learn/ChatToolResult:103

### ■ StatusChip (12) — raw `<Chip>` dựng lại StatusChip (tone→color/soft/sm)
cards/RatingBar:318 · cards/PlaygroundCard:62 · cards/CourseCard:94 · cards/PricingCard:90 · rendering/MarkdownContent/map:226 · code/TestCaseResultGrid:96 · marketing/HeroBanner:81 · marketing/SectionHeading:61 · marketing/MicroservicesDiagram:193 · chips/HighlightChip:62 · chips/EnumChip:53 · grading/GradeModelDropdown:148

### ■ FieldShell (5) — form input tự dựng label/error/skeleton column
form/SchedulePicker:119 (còn dựng lại cả DatePicker compound) · form/OtpInput:100,87 · form/Dropzone:78,70

### ■ DotChip (3) — chip có dot-indicator dựng tay
chips/AiCategoryChip:69 · chips/DifficultyChip:58 · chips/LanguageChip:78

### ■ IconTile (2)
marketing/TrackCard:67 · notifications/NotificationItem:121

### ■ PressableCard + GroupPressableCard (2) — RatingBar tái dựng NGUYÊN 2 primitive
cards/RatingBar:65 (PressableCard) · cards/RatingBar:135 (GroupPressableCard)

### ■ Skeleton (1) — hand-rolled skeleton
rendering/PDFView:122

### ■ ErrorState (1) — async/ErrorContent:36 còn inline copy ErrorState → compose port

## Nhận định
- **35/49 = Button(23) + StatusChip(12)** — swap cơ học (raw → port), blast ở consumer nhưng API khớp. Ứng viên codemod/batch.
- **Nặng hơn:** RatingBar (tái dựng PressableCard+GroupPressableCard), form inputs (SchedulePicker/OtpInput/Dropzone tự dựng FieldShell) — cần compose cẩn thận, một số borderline (Dropzone là drag-box đặc thù).
- **Chip-family:** DotChip(3) = consolidate 3 chip có dot vào 1 DotChip primitive (nếu chưa có thì tạo).

## Borderline (25) — raw có lý do (opinions không khớp), để lại + ghi "intentional".
