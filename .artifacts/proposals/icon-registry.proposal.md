# Icon registry drift — call-site lệch canonical (nợ đo được)

Nguồn: scan 303 file phosphor (3 agent Sonnet, 2026-07-17). Canonical map = `canon/fe/patterns/icon-map.md`.
Trạng thái: ✅ BURNED 2026-07-17 ("đồng hoá toàn bộ") — tsc + eslint sạch, grep residual = 0 cho MỌI concept dưới.
Chốt 4/5 quyết định: milestone=Flag · challenge-passed=Puzzle · trending=ChartLineUp · github=custom-svg.
DEFER: #2 mock-interview mic (đụng icon flashcard-quiz-mode) — chưa đụng, chờ thầy.
Carve-out GIỮ (không phải drift): flashcard MODE-picker (StudyRail study=CardsThree/quiz=MicrophoneStage · QuizSession deep=Stack) · FAQ=QuestionIcon · alias hợp lệ (`FlameIcon as FireIcon`, `BookmarkSimpleIcon as BookmarkIcon` — glyph đúng).
Ứng viên lint khi tái phạm: `starci-fe/no-noncanonical-icon` (AST bắt import icon KHÔNG canonical cho concept đã map).
Site burn thêm ngoài list gốc (grep bắt): UserStreak + BookmarkCard (FireIcon→Flame) · TalentDirectory + ProfileJobReadiness (TrendUp→ChartLineUp) · PersonalProjectDashboard + RagPlayground (GithubLogo→svg).

## Xung đột phải fix (concept → canonical, list nơi lệch)

### 1. Streak → `FlameIcon` (bỏ FireIcon)
- `dashboard/kpi/kpiMeta.tsx:4` — `FireIcon as DaysIcon` → FlameIcon
- `features/notifications/NotificationCenter/index.tsx:86,269` — FireIcon → FlameIcon
- Profile dùng `FlameIcon as FireIcon` (glyph đúng, chỉ ĐỔI ALIAS cho khỏi nhầm): `profile/UserStreak/index.tsx:59`, `profile/PublicProfile/ProfileOverviewTab/OverviewContributions/index.tsx:67`, `profile/Bookmarks/BookmarkCard/index.tsx:94`

### 2. Flashcard → `CardsIcon` (bỏ Stack/CardsThree)
- StackIcon: `dashboard/kpi/kpiMeta.tsx:7` (FlashcardIcon), `dashboard/FlashcardReview/index.tsx:16` (LayersIcon), `learn/Flashcards/QuizSession/index.tsx:924`
- CardsThreeIcon: `learn/ContentAiChat/index.tsx:105`, `learn/Flashcards/FlashcardReviewHistory/index.tsx:240`, `learn/Flashcards/FlashcardStudyRail/index.tsx:82`

### 3. Challenge (entity) → `PuzzlePieceIcon` (bỏ Question/Code)
- `dashboard/kpi/kpiMeta.tsx:5` — QuestionIcon as ChallengeIcon → Puzzle
- `learn/ContentAiChat/index.tsx:107` — CodeIcon (TOOL_RESULT_META.challenge) → Puzzle (Code chỉ cho coding)

### 4. Milestone → `FlagIcon` (bỏ FlagCheckered) ⚠️chờ chốt
- `dashboard/kpi/kpiMeta.tsx:8`, `dashboard/WeeklyGoals/map.tsx:21` — FlagCheckeredIcon → Flag

### 5. Locked → `LockIcon` (bỏ LockKey/LockSimple)
- LockKeyIcon: `learn/shared/EnrollGate/index.tsx:43`, `learn/LessonReader/PremiumPaywall/index.tsx:52`, `learn/Flashcards/FlashcardQuizResult/recapBlocks.tsx:225`
- LockSimpleIcon: `learn/LearnShell/LearnSidebar/index.tsx:130`, `modals/PaymentModal/index.tsx:726`

### 6. Bookmark → `BookmarkSimpleIcon` (bỏ BookmarkIcon)
- `dashboard/QuickActions/index.tsx:21` — BookmarkIcon → BookmarkSimpleIcon

### 7. Course entity → `GraduationCapIcon` (bỏ BookOpen cho course)
- `features/cart/CartView/CartLine/index.tsx:64` — BookOpen → GraduationCap
- `features/course/CourseDetail/CourseMobileEnrollBar/index.tsx:71` — BookOpen → GraduationCap

### 8. Mock interview → `MicrophoneStageIcon` ⚠️chờ chốt
- `learn/MockInterview/VoiceHero/index.tsx:5`, `learn/MockInterview/MockInterviewSession/index.tsx:15` — Microphone → MicrophoneStage (nếu thầy chốt Stage)

### 9. Trending metric → `ChartLineUpIcon` ⚠️chờ chốt
- `dashboard/OverviewTab/JobReadinessWidget/index.tsx:5` — TrendUpIcon → ChartLineUp

### 10. Challenge-passed activity map → khớp taxonomy ⚠️chờ chốt
- `blocks/feed/ActivityFeed/index.tsx:55` (SealCheck) vs `profile/.../CourseDayTimeline/index.tsx:51` (Puzzle) — chọn 1, sửa map còn lại

### 11. Misc (minor)
- Video: `VideoCameraIcon` (capture) vs `FilmStripIcon` (content) — chuẩn hoá theo split map (admin, thấp ưu tiên)
- GitHub: svg brand vs `GithubLogoIcon` — `features/landing/.../LearnLoopScroll/index.tsx:272` ⚠️chờ chốt
- Gear misuse: `features/admin/AdminUploadVideo/FileSelectionCard/index.tsx:173` — GearIcon cho action "process" → đổi icon khác (Gear chỉ settings)

## Split có chủ ý (KHÔNG phải drift — codify, đừng "fix")
- ChatsCircle (thread) vs ChatCircle (1 comment) · Trophy (rank) vs Crown (#1) vs Medal (badge) ·
  Clock (duration) vs ClockCounterClockwise (resume) vs ClockCountdown (due) · Gift (quà) vs Coins (số dư) ·
  Rocket (project) vs RocketLaunch (career/talent).
