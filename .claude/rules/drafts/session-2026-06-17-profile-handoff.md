# Session handoff — Public profile: Challenges + Coding tabs (2026-06-17)

> CONTEXT/handoff (KHÔNG phải rule để merge). Tóm tắt việc đã làm + trạng thái + việc tới (sửa coding problem).

## Đã build (FE: `C:\Repositories\starci-academy`)
- **Tabs hồ sơ**: thứ tự `Tổng quan · Dự án · Challenges · Kỹ năng & Lập trình · Hoạt động`; tab ⟷ query string
  (`?tab=`) qua `useProfileTabUrlSync`. Icon Challenges = `PuzzlePieceIcon`.
- **Tab Challenges** (mới): `ProfileChallengesTab/ProfileChallenges` + `ChallengeCourseRow`.
  - Metric row (MetricCard ×4): **Đã pass · XP đã nhận · Top đầu (%) · Hạng (#N)** — top-level, bỏ hero "6".
  - Card "Thống kê": SegmentBar độ khó 4 tông + `LanguageDonut` (mỏng 8px, size 128).
  - "Bài nộp": mỗi khoá 1 row gập (disclosure), bar = tiến độ theo TỔNG challenge khóa (`userCourses.challengeTotal`,
    match theo title), rows: title + (ngày trái / chip phải) + điểm màu band + repo Link.
- **Tab Coding** (`ProfileSkillsTab` → `ProfileCoding`): sibling của Challenges. Metric row (solved·points·rank·
  **percentile = placeholder "—"**), card "Thống kê" (difficulty/topic/language donut), history grid + chip.
  ⚠️ **Coding percentile chưa có data thật** — đang "—", chờ BE points/percentile spec (mirror userChallengeStrength).
- **Blocks mới**: `chips/LanguageChip` (GitHub dot+tên), `stats/LanguageDonut`, `stats/Legend`; `StatPair` +prop
  `size` (md/lg). Token `--difficulty-insane` (tím) ở globals.
- **Drafts rule đã ghi** (chờ /merge): `skeleton-mirror`, `no-run-verify-cursor`, `difficulty-color-scale`,
  `shared-legend`, `language-indicator-github`.
- **Plans**: `PublicProfile/SKILLS-TABS-UX-BRAINSTORM.md`, `PublicProfile/CHALLENGE-PERCENTILE-PLAN.md`.

## BE (`C:\Repositories\ac\starci-academy-backend`) — CQRS, KHÔNG migration
- `user_solved_challenges_projections.value` += `difficulty/score/courseTitle/strengthScore` (Σ weight
  easy10/med20/hard30/insane40/expert50).
- Query mới: **`userChallengeStrength(userId) → { percentile, rank, xp }`** (xp = SUM `xp_histories.amount`
  source='challenge'); **`userCodingRank(userId): Int`**. Mirror pattern, optional-auth + visibility guard.
- `user_coding_projections` += `domain` (history) + `byDomain`.
- **XP gain DB** (đối chiếu): challenge XP `amount`=điểm chấm attempt (ledger `xp_histories`); global `users.points`
  =flat 20/challenge; per-course `totalXp`=Σ score + lessonRead×3 + milestone×10. strengthScore là metric DẪN XUẤT
  riêng (không đụng kinh tế điểm).
- ⚠️ **BE phải chạy code mới** (restart Nest nếu không --watch) để có field/query mới.

## Seed DB (demo, docker `containers-postgresql-1`, db starci-academy)
- 2 user demo `annguyen_dev`/`minh_tran` (keycloak_id `seed-rank-an`/`seed-rank-minh`) — coding submissions +
  projection (coding rank pool) + solved-challenges projection strengthScore (230/60) để rank/percentile thật.
- starci183: challenge passes Fullstack(4)+SystemDesign(2); coding 8 solved. → strength #2, Top đầu 33%.
- Dọn demo: `delete from users where keycloak_id in ('seed-rank-an','seed-rank-minh')` (cascade).

## TIẾP THEO: "sửa coding problem"
Chưa rõ scope cụ thể — chờ thầy chỉ: sửa UI tab Coding (percentile thật?), hay sửa coding PROBLEM (nội dung/
seed/judge bài luyện code)? Cần thầy nói rõ "coding problem" = phần nào.
