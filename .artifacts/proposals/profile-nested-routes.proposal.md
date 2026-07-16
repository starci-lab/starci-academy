# Profile nested-routes + list/detail pages — brainstorm proposal

Ngày: 2026-07-17 · Nguồn: 2 deep-scan Sonnet (FE tabs/routing + BE detail-data), FE `mtp`, BE `starci-academy-backend`.
Trigger: thầy — "xóa nút Xem bài nộp, render ra trang khác `/profile/<id>/challenges/` + `/challenges/<id>`; migrate TẤT CẢ tab sang nested route; brainstorm layout cho challenges/coding/milestones".

## ★ Kết luận then chốt: DATA-CEILING chặn detail pages
`userSolvedChallenges` / `userCodingHistory` / `userCapstoneProgress` (milestones) **đều là jsonb aggregate KHÔNG có id/slug** trên list-item → không có gì để dựng route `/<tab>/<id>`. Mọi single-detail query hiện có **không public**:
- `challengeSubmission(id)` — hard-lock `user.id` của CALLER (chỉ xem bài của chính mình).
- `milestone(id)`/`task(id)` — `GraphQLMustEnrolledGuard` theo enrollment của NGƯỜI XEM (visitor chưa học khóa đó → fail).
- `codingProblem(slug)` — cần login + slug KHÔNG expose trên history; `myCodingSubmissions` hard-lock caller.
- Feedback AI (attempts + rubric `severity/location/suggestion`) **có model đầy đủ** nhưng chỉ reachable owner-only.

→ **Detail page công khai (có feedback) = phải mở BE trước:** query mới profile-scoped gated như `userSolvedChallenges` (`KeycloakOptionalAuthGraphQLGuard` + `GraphQLProfileVisibilityGuard`) + expose id/slug trên list DTO.

## Ma trận build (job × data-có-thật)
| Trang | Shell | Data | Trạng thái |
|---|---|---|---|
| Migrate 6 tab → nested route | `[username]/layout.tsx` (hero+tabsbar) · `page.tsx`=overview · `<tab>/page.tsx` | routing thuần | ✅ **render-là-xong (FE)** |
| `/challenges` LIST (bỏ cap, group theo course) | profile sub-page | `userSolvedChallenges` (đã có) | ✅ render-là-xong |
| `/projects` LIST (full milestone roadmap + pins) | profile sub-page | `userCapstoneProgress`+`userPinnedProjects` | ✅ render-là-xong |
| `/skills` LIST (full solve history) | profile sub-page | `userCodingHistory` | ✅ render-là-xong (detail yếu — list phẳng) |
| `/activity` LIST | profile sub-page | feed (đã paginate) | ✅ render-là-xong |
| `/challenges/[id]` DETAIL + feedback | profile sub-page | ❌ thiếu id + query public | 🛑 **đổi-schema BE** (id trên DTO + query `userChallengeSubmissionPublic(userId,id)` + feedback public) |
| `/projects/[courseId]` DETAIL (roadmap 1 khóa) | profile sub-page | `userCapstoneProgress` có `courseGlobalId` ✅ (nhưng milestone/task thiếu id) | ⚠️ **một phần** — route theo `courseGlobalId` được (đã có), render lại roadmap khóa đó; feedback/criteria per-task cần BE |
| `/coding/[slug]` DETAIL (đề bài + bài nộp) | profile sub-page | ❌ slug không expose + submission owner-only | 🛑 đổi-schema BE |

**Điểm sáng:** `/projects/[courseGlobalId]` khả thi NGAY (capstone list-item CÓ `courseGlobalId`) — route tới roadmap đầy đủ 1 khóa (milestones + tasks + pass-state), đúng "list→detail" tự nhiên nhất.

## Route migration (FE thuần, làm ngay)
- `[username]/layout.tsx` mới = shell (ProfileHero + đăng ký tabsbar navbar-bottom-layer + loading/locked/not-found). `page.tsx` = overview panel.
- Thêm `[username]/{projects,challenges,skills,activity}/page.tsx` (mỗi cái mount tab component tương ứng). Detail khả thi: `[username]/projects/[courseGlobalId]/page.tsx`.
- **Retire:** `useProfileTabStore` + `useProfileTabUrlSync` (dead sau migration). `ProfileTabsBar` đổi `selectedKey`/`onSelectionChange` → `<Link>` + active-segment (`usePathname`). Overview `onSeeMore setTab(x)` → `router.push(pathConfig...profile(username).<tab>())`.
- **pathConfig:** thêm builder sibling `cv()`: `.challenges()`, `.projects().course(courseGlobalId)`, `.skills()`, `.activity()`; bare `profile(username)` = overview.
- ⚠️ Precedence: static `profile/{settings,cv}` pre-empt `[username]` — tab route nest TRONG `[username]/` nên không đụng bẫy.

## Block briefs (element-aware)
- List page = `LabeledCard frameless` (label = tên tab) → `SurfaceListCard` → row hiện có (`ChallengeCourseRow` bỏ disclosure, hoặc submission rows phẳng) — mỗi row `href` tới detail khi có. Ribbon `StatRibbon` giữ ở đầu list.
- Detail (`/projects/[courseGlobalId]`): header khóa + `CourseProgressBar`/milestone `SurfaceListCard` + task `ListRow` (đã có trong `ProjectCard`, chỉ bỏ cap).
- Back affordance = `BackLink` (canon: quiet text link, arrow trượt trái).

## ✅ CHỐT 2026-07-17: FULL BUILD, 3-TIER, cả BE (thầy: "xúc hết đi… sửa backend code")
Mô hình **3 tầng** mỗi tab detail-able: `/<tab>` LIST (summary) → `/<tab>/[courseId]` **QUẢN LÝ** (search + filter + sort + paginate) → `/<tab>/[courseId]/[id]` **DETAIL** (+ feedback). Prototype: `.artifacts/prototypes/profile-nested-routes/` (9 màn).

**Stages:**
- **S1 foundation (đang chạy):** 3 BE public detail-query (challenges/coding/milestones — id/slug trên list DTO + query profile-scoped gated `KeycloakOptionalAuthGraphQLGuard`+`GraphQLProfileVisibilityGuard`) · FE routing-migration (layout.tsx shell, retire store/url-sync, TabsBar→Link, pathConfig).
- **S2 pages:** mỗi tab = list + trang-quản-lý (SearchInput+FilterChipRow+SortSelect+SurfaceListCard paginate) + detail (submission+rubric / coding problem+submission / milestone roadmap).
- **S3 verify:** tsc/eslint FE+BE, đi hết route, thầy soi :3000.

## Files to touch (Phase-1)
`src/app/[locale]/profile/[username]/layout.tsx` (mới) · `.../page.tsx` · `.../{challenges,projects,skills,activity}/page.tsx` (mới) · `.../projects/[courseGlobalId]/page.tsx` (mới) · `PublicProfile/index.tsx` (tách shell) · `ProfileTabsBar` (Link) · `useProfileTabStore`+`useProfileTabUrlSync` (xóa) · `ProfileOverviewTab` onSeeMore · `resources/path` builders · `ChallengeCourseRow` (bỏ disclosure).

## Verify plan
tsc+eslint; đi 6 route + back; browser :3000 soi (thầy). Story: không block mới (tái dùng row/card).
