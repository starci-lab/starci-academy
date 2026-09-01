# B35 ranked clusters (overlap score)

Checkpoint: `02011807` · Source: `2026-08-10-b35-eslint-before.json` · Generated: 2026-08-08T14:33:48.722Z

## Scoring

Overlap score = distinct high-frequency architectural categories with ≥1 finding on the exported component / file family:

| Category | Rules |
|---|---|
| host | `starci-fe/no-host-element-at-sentence-tier` |
| raw-shape | `starci-fe/no-raw-shape-at-sentence-tier` |
| classname-family | `starci-fe/no-classname-at-sentence-tier`, `starci-fe/no-cn-above-vocabulary`, `starci-fe/no-public-classname-prop` |
| identity-root | `starci-fe/require-identity-root` |
| frame-self-declare | `starci-fe/require-frame-self-declare` |
| heroui | `starci-fe/no-heroui-outside-vocabulary` |
| frame-fragment | `starci-fe/no-frame-fragment-item` |
| page-two-files | `starci-fe/page-folder-two-files-only` |

Max score: **8**

## Totals

| Metric | Count |
|---|---:|
| Raw warnings | 6872 |
| Affected files | 1232 |
| Errors | 0 |
| A11y (observed) | 11 |
| StarCi messages | 6861 |
| StarCi actionable editable files | 1047 |
| Ranked families | 915 |

## Top 40 families by overlap score

### 1. `MockInterviewSession` — score **7** (raw 83) · LOCKED HOLD

- Family: `pages/MockInterviewPage/MockInterviewSession`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/MockInterviewPage/MockInterviewSession/index.tsx`

### 2. `LearnLoopScroll` — score **7** (raw 68) · LOCKED HOLD

- Family: `pages/LandingPage/LearnLoopScroll`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/LandingPage/LearnLoopScroll/index.tsx`

### 3. `Navbar` — score **7** (raw 41)

- Family: `blocks/navigation/Navbar`
- Categories: `classname-family`, `frame-fragment`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `raw-shape`
- Agents (pre-assign): navigation-shells-layouts
- Files:
  - `.storybook/components/starci/blocks/navigation/Navbar/Navbar.tsx`
  - `src/components/blocks/navigation/Navbar/index.tsx`

### 4. `MockInterviewSessionSkeleton` — score **7** (raw 34)

- Family: `pages/MockInterviewPage/MockInterviewSessionSkeleton`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/MockInterviewPage/MockInterviewSessionSkeleton/index.tsx`

### 5. `SettingsSidebarNav` — score **7** (raw 17)

- Family: `blocks/navigation/SettingsSidebarNav`
- Categories: `classname-family`, `frame-fragment`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `raw-shape`
- Agents (pre-assign): navigation-shells-layouts
- Files:
  - `.storybook/components/starci/blocks/navigation/SettingsSidebarNav/SettingsSidebarNav.tsx`
  - `src/components/blocks/navigation/SettingsSidebarNav/index.tsx`

### 6. `InterviewerPresence` — score **7** (raw 14)

- Family: `pages/MockInterviewPage/InterviewerPresence`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/MockInterviewPage/InterviewerPresence/index.tsx`

### 7. `VoiceHero` — score **7** (raw 13)

- Family: `pages/MockInterviewPage/VoiceHero`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/MockInterviewPage/VoiceHero/index.tsx`

### 8. `ProfileActivity` — score **7** (raw 13)

- Family: `pages/ProfileActivityPage/ProfileActivity`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/ProfileActivityPage/ProfileActivity/index.tsx`

### 9. `CvEditorToolbarBar` — score **7** (raw 7)

- Family: `pages/CvEditorPage/CvEditorToolbarBar`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/CvEditorPage/CvEditorToolbarBar/index.tsx`

### 10. `QuizSessionSkeleton` — score **6** (raw 30) · LOCKED HOLD

- Family: `pages/FlashcardsPage/QuizSession/QuizSessionSkeleton`
- Categories: `classname-family`, `frame-self-declare`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/FlashcardsPage/QuizSession/QuizSessionSkeleton/index.tsx`

### 11. `ProfileRedirectPage` — score **6** (raw 26)

- Family: `pages/ProfileRedirectPage`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/ProfileRedirectPage/index.tsx`

### 12. `NodeDissectionPanel` — score **6** (raw 25)

- Family: `pages/ArchitecturePage/NodeDissectionPanel`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/ArchitecturePage/NodeDissectionPanel/index.tsx`

### 13. `SurfaceListCard` — score **6** (raw 24)

- Family: `blocks/cards/SurfaceListCard`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `raw-shape`
- Agents (pre-assign): shared-consumer-chains-coordinator
- Files:
  - `src/components/blocks/cards/SurfaceListCard/index.tsx`

### 14. `ArchitectureRail` — score **6** (raw 23)

- Family: `pages/ArchitecturePage/ArchitectureRail`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/ArchitecturePage/ArchitectureRail/index.tsx`

### 15. `MockInterviewHistory` — score **6** (raw 22)

- Family: `pages/MockInterviewPage/MockInterviewHistory`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/MockInterviewPage/MockInterviewHistory/index.tsx`

### 16. `OverviewContributionsSkeleton` — score **6** (raw 19)

- Family: `pages/DashboardPage/OverviewTab/OverviewContributions/OverviewContributionsSkeleton`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/DashboardPage/OverviewTab/OverviewContributions/OverviewContributionsSkeleton/index.tsx`

### 17. `ArchitectureMobileNav` — score **6** (raw 18)

- Family: `pages/ArchitecturePage/ArchitectureRail/ArchitectureMobileNav`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/ArchitecturePage/ArchitectureRail/ArchitectureMobileNav/index.tsx`

### 18. `MockInterviewStats` — score **6** (raw 18)

- Family: `pages/MockInterviewPage/MockInterviewStats`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/MockInterviewPage/MockInterviewStats/index.tsx`

### 19. `TalentMarketplace` — score **6** (raw 17)

- Family: `pages/LandingPage/TalentMarketplace`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/LandingPage/TalentMarketplace/index.tsx`

### 20. `MockInterviewWorkspace` — score **6** (raw 16)

- Family: `pages/MockInterviewPage/MockInterviewWorkspace`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/MockInterviewPage/MockInterviewWorkspace/index.tsx`

### 21. `ProfileAchievements` — score **6** (raw 13)

- Family: `pages/ProfileActivityPage/ProfileAchievements`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/ProfileActivityPage/ProfileAchievements/index.tsx`

### 22. `MockInterviewScorecard` — score **6** (raw 12)

- Family: `pages/MockInterviewPage/MockInterviewScorecard`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/MockInterviewPage/MockInterviewScorecard/index.tsx`

### 23. `AiUsageHistory` — score **6** (raw 11)

- Family: `pages/AiUsagePage/AiUsageHistory`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/AiUsagePage/AiUsageHistory/index.tsx`

### 24. `MockInterviewDiagram` — score **6** (raw 11)

- Family: `pages/MockInterviewPage/MockInterviewDiagram`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/MockInterviewPage/MockInterviewDiagram/index.tsx`

### 25. `ProgressCockpit` — score **6** (raw 11)

- Family: `pages/PracticeHubPage/ProgressCockpit`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/PracticeHubPage/ProgressCockpit/index.tsx`

### 26. `MyVouchers` — score **6** (raw 11)

- Family: `pages/RewardsPage/MyVouchers`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/RewardsPage/MyVouchers/index.tsx`

### 27. `ProblemCatalog` — score **6** (raw 10)

- Family: `pages/PracticeHubPage/ProblemCatalog`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/PracticeHubPage/ProblemCatalog/index.tsx`

### 28. `ArchitectureMap` — score **6** (raw 8)

- Family: `pages/ArchitecturePage/ArchitectureMap`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/ArchitecturePage/ArchitectureMap/index.tsx`

### 29. `MockInterviewTrackSnapshot` — score **6** (raw 8)

- Family: `pages/MockInterviewPage/MockInterviewTrackSnapshot`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/MockInterviewPage/MockInterviewTrackSnapshot/index.tsx`

### 30. `PinnedProjectCard` — score **6** (raw 8)

- Family: `pages/ProfileProjectsPage/ProfilePinned/PinnedProjectCard`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `identity-root`, `page-two-files`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/ProfileProjectsPage/ProfilePinned/PinnedProjectCard/index.tsx`

### 31. `FounderCard` — score **6** (raw 7)

- Family: `pages/ContactPage/ContactChannels/FounderCard`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `host`, `page-two-files`, `raw-shape`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/ContactPage/ContactChannels/FounderCard/index.tsx`

### 32. `NavLinks` — score **6** (raw 6)

- Family: `layouts/Navbar/NavLinks`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `page-two-files`, `raw-shape`
- Agents (pre-assign): navigation-shells-layouts
- Files:
  - `src/components/layouts/Navbar/NavLinks/index.tsx`

### 33. `ContentAiChat` — score **5** (raw 68) · LOCKED HOLD

- Family: `blocks/learn/ContentAiChat`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `raw-shape`
- Agents (pre-assign): learn-course-content
- Files:
  - `src/components/blocks/learn/ContentAiChat/index.tsx`

### 34. `QuizSession` — score **5** (raw 58) · LOCKED HOLD

- Family: `pages/FlashcardsPage/QuizSession`
- Categories: `classname-family`, `frame-fragment`, `frame-self-declare`, `heroui`, `page-two-files`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/FlashcardsPage/QuizSession/index.tsx`

### 35. `ContributionCalendarView` — score **5** (raw 46)

- Family: `blocks/profile/ContributionCalendarView`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `raw-shape`
- Agents (pre-assign): profile-cv-careers-consultant
- Files:
  - `src/components/blocks/profile/ContributionCalendarView/index.tsx`

### 36. `FlashcardQuizHistory` — score **5** (raw 39) · LOCKED HOLD

- Family: `pages/FlashcardsPage/QuizSession/FlashcardQuizHistory`
- Categories: `classname-family`, `frame-self-declare`, `heroui`, `identity-root`, `page-two-files`
- Agents (pre-assign): pages-and-filing
- Files:
  - `src/components/pages/FlashcardsPage/QuizSession/FlashcardQuizHistory/component.tsx`
  - `src/components/pages/FlashcardsPage/QuizSession/FlashcardQuizHistory/index.tsx`

### 37. `CourseCard` — score **5** (raw 35)

- Family: `blocks/cards/CourseCard`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `raw-shape`
- Agents (pre-assign): shared-consumer-chains-coordinator
- Files:
  - `src/components/blocks/cards/CourseCard/component.tsx`

### 38. `TaskResult` — score **5** (raw 34)

- Family: `blocks/learn/personal-project/TaskResult`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `raw-shape`
- Agents (pre-assign): learn-course-content
- Files:
  - `src/components/blocks/learn/personal-project/TaskResult/index.tsx`

### 39. `PlaygroundRagWorkspace` — score **5** (raw 32)

- Family: `blocks/learn/PlaygroundRagWorkspace`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `raw-shape`
- Agents (pre-assign): playground-practice-interview
- Files:
  - `src/components/blocks/learn/PlaygroundRagWorkspace/index.tsx`

### 40. `SitePreview` — score **5** (raw 30)

- Family: `blocks/marketing/SitePreview`
- Categories: `classname-family`, `heroui`, `host`, `identity-root`, `raw-shape`
- Agents (pre-assign): shared-consumer-chains-coordinator
- Files:
  - `src/components/blocks/marketing/SitePreview/index.tsx`

## Score histogram (families)

| Score | Families |
|---:|---:|
| 7 | 9 |
| 6 | 23 |
| 5 | 163 |
| 4 | 187 |
| 3 | 169 |
| 2 | 138 |
| 1 | 195 |
| 0 | 31 |

## Agent file counts (disjoint)

| Agent | Files |
|---|---:|
| navigation-shells-layouts | 75 |
| overlays-modals-drawers | 59 |
| learn-course-content | 181 |
| playground-practice-interview | 51 |
| commerce-account-settings | 14 |
| community-feed-blog-league | 22 |
| profile-cv-careers-consultant | 49 |
| dashboard-admin-system-architecture | 13 |
| pages-and-filing | 368 |
| shared-consumer-chains-coordinator | 215 |

overlapPass: **true**
