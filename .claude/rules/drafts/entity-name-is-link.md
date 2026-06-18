# Draft — Tên entity (khóa/lesson/challenge) render trong list = LINK click vào entity  (2026-06-18)

**File/§ đích khi `/merge`:** `main.md` §6 (text-action=Link) + §14 (heuristic).

## Luật (STRICT)
- **Tên 1 ENTITY hiển thị (khóa học, lesson, challenge, project…) phải là LINK click thẳng vào entity đó**, KHÔNG
  `Typography`/text trơ. Dùng **`EntityToken`** (`globalId` → `queryResolveRoute` → navigate, render là HeroUI `Link`).
  Áp **MỌI NƠI** render tên entity (vd "Khóa học của tôi" dashboard, "Khóa học" profile Overview, feed, attempts…).
- **Card cả-thẻ bấm được** (recommended course = `PressableCard`) → KHÔNG cần link tên riêng (cả card đã navigate;
  link-trong-button = nested interactive, cấm). Chỉ list-row/text mới cần tên-là-link.

## Nợ
- `EntityToken` hiện ở `features/dashboard/EntityToken` nhưng được **profile + dashboard** import (cross-feature) →
  **nên promote thành block** `blocks/navigation/EntityToken` (nó generic: globalId→route→Link, không store/SWR cache,
  chỉ 1 API call on-press). Khi promote: merge import vào `@/components/blocks` (tránh duplicate-import ở file đã import blocks).

**Đã áp:** `MyCoursesProgress` (dashboard) + `OverviewCourses` (profile) tên khóa → `EntityToken` (link). Các nơi
khác (Feed, profile-legacy ProfileCourses/Attempts/Submissions, WeeklyChallenge, Trending) đã dùng EntityToken sẵn.
