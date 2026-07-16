# Proposal — /vi/league redesign (business-standard leaderboard)

**Surface:** `/vi/league` (trang chính, click từ dashboard) · **Prototype:** `.artifacts/prototypes/league-page/` (:8082, thầy duyệt "xúc") · **Ngày:** 2026-07-17

## Shell (League/index.tsx) — fix drift + foundation
- `<h1>` trơ → **`PageHeader`** (breadcrumb responsive "Trang chủ › Bảng xếp hạng" via `ResponsiveBreadcrumb`, title) — theo `header.md` (mọi trang dùng PageHeader). gap-10 xuống content (§2).
- `<Tabs variant="secondary">` → **`TabsCard variant="primary"`** (segmented pill full-width) — theo `tabs.md §0b` (tab đổi cả panel = primary). items: Tuần này / Toàn cầu.

## Block MỚI 1 — `StandingHeroCard` (dùng chung 2 tab, câu 2 = chung)
- Hero "vị thế của MÌNH" đứng đầu mỗi board: tier/rank (weekly) hoặc rank toàn cục (global) + điểm + movement + **meter goal-gradient** ("còn X điểm nữa để thăng/lên hạng" — câu 3 = compute từ entry liền kề, KHÔNG đổi BE) + **CTA phễu về khóa** ("Làm challenge/kiếm XP →" → `pathConfig().locale(locale).course().build()`).
- Props: `tierBadge?` · `rankLabel` · `pointsLabel` · `movement?` · `progress?: {current, target, label}` · `ctaLabel` · `onCta`. `*Props extends WithClassNames`. Container feed data.
- 1 primary action/surface = cái CTA này.

## Block MỚI 2 — `Podium` (câu 1 = chỉ Global)
- Top-3 dạng bục (1 giữa cao, 2/3 hai bên): avatar + tên + điểm + hạng. Props: `entries: {rank, username, avatar, points}[]` (≤3).

## Rewrite boards
- **WeeklyBoard:** `StandingHeroCard` (tier/rank/countdown/climb) → board chia **zone band** promote(success-soft)/demote(danger-soft) nhãn rõ, reuse `LeagueRow`. Self-card "Hạng của bạn" (surface-in-surface, như dashboard). Empty → CTA khóa.
- **GlobalBoard:** `StandingHeroCard` (rank toàn cục/points/climb) → **`Podium` top-3** → list rank 4+ reuse row + **`FollowButton`** (câu 4 = giữ) → self-card "Hạng của bạn" surface-in-surface. Empty → CTA khóa.

## i18n (vi+en) — key mới
- `dashboard.league.climbCta` ("Làm challenge để leo hạng" / "Do a challenge to climb") · `dashboard.league.pointsToNext` ("Còn {points} điểm nữa để lên hạng #{rank}") · `dashboard.league.pointsToPromote` ("Còn {points} điểm nữa để vào top thăng hạng"). REUSE `yourRank`, `promote`, `demote`, `resetIn`, `points`.

## Files to touch
- `League/index.tsx` (shell) · `WeeklyBoard/index.tsx` · `GlobalBoard/index.tsx` · **mới** `blocks/.../StandingHeroCard/`, `blocks/.../Podium/` (vị trí: `components/features/dashboard/league/` hoặc `blocks/cards` — quyết khi build) · `messages/{vi,en}.json`.

## Data ceiling (đã render / chưa vẽ / compute)
- Có sẵn (render): rank, points/weekPoints, tier, rankDelta, promote/demoteCount, weekEndAt, myRank/myPoints. 
- Compute FE (không đổi BE): pointsToNext = (entry[myRank-2].points - myPoints); pointsToPromote = (entry[promoteCount-1].weekPoints - myWeekPoints).
- FollowButton: block sẵn (TopLearners dùng).
- **KHÔNG cần đổi BE.**

## Stories (news, chờ duyệt)
- `StandingHeroCard.stories` (mới — states: weekly/global/near-promote) · `Podium.stories` (mới — top-3/2-entry). Tag `news` + caption "Chờ duyệt".

## Verify plan
- tsc+eslint sạch. Runtime /vi/league: shell (PageHeader+pill tabs) · 2 tab · hero+meter+CTA · weekly zones · global podium+follow · self-card · empty states (phễu khóa).

## Phase build (checkpoint)
1. Shell (League/index.tsx). 2. StandingHeroCard block+story. 3. Podium block+story. 4. WeeklyBoard rewrite. 5. GlobalBoard rewrite. 6. i18n. 7. verify.
