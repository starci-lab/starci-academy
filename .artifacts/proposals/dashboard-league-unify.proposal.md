# Proposal — dashboard-league-unify (1 shared render, 2 card y chang)

> 2 card dashboard Cộng đồng render Y CHANG qua 1 block dùng chung `LeaderboardListCard` (DRY-guaranteed). Standing badge rank-driven → "trên huy chương dưới cúp" tự nhiên. Thầy chốt: bỏ legend + build.
>
> **Prototype:** `.artifacts/prototypes/dashboard-league-unify/index.html` (host :8086). Before⇄After.

## Block MỚI: `LeaderboardListCard` (feature-level)
`src/components/features/dashboard/league/LeaderboardListCard/index.tsx` — presentational, props-only. Cả 2 card map data vào đây → giống hệt.
- **Props:** `title`, `onSeeMore`, `seeMoreLabel`, `standing?: {rank, primary, secondary?}`, `rows: LeaderboardRow[]`, `selfRow?: LeaderboardRow`, `ellipsisLabel?`, `meLabel?`.
- **`LeaderboardRow`:** `{key, rank, username, avatar?, valueLabel, isMe?, profileHref?, trailing?}`.
- **Render:** `LabeledCard(title+see-more) → standing line → SurfaceListCard(bordered)`:
  - **standing line** = `IconTile(rankBadgeIcon(standing.rank), tone="neutral", size="sm")` + `primary` (bold) + `secondary` (muted). Rank-driven badge = medal(1-3)/cup(4+).
  - **rows** = `SurfaceListCardItem`: `[medal top-3 / số]` · `Link>UserCell` · `valueLabel` · `trailing`. isMe → accent value + `· {meLabel}`.
  - **selfRow** (out-top) = ellipsis (`ellipsisLabel`) + pinned row.

## 2 container rút gọn
- **`LeagueCardContent`** (weekly): map `data.entries.slice(0,TOP_ROWS)` → rows (trailing = `<RankDeltaCaret delta={e.rankDelta}/>`). standing = `{rank: myEntry.rank, primary: rankLine, secondary: "{points} · Reset sau…"}`. selfRow khi myEntry ngoài slice. **BỎ:** tier-badge, LEGEND promote/demote, self-card "Hạng của bạn" (đã bỏ ở build trước). → chỉ còn `<LeaderboardListCard/>`.
  - ⚠️ Check `framed` prop: nếu còn nhánh unframed (inline /league) thì giữ; nhưng /league dùng WeeklyBoard rồi → nhiều khả năng framed luôn true. Xác nhận lúc build.
- **`TopLearners`** (global): map `data.entries.slice(0,TOP_N)` → rows (trailing = `<FollowButton quiet/>`). standing = `{rank: myRank, primary: "Hạng #{myRank} toàn nền tảng", secondary: "{myPoints} XP"}`. selfRow khi viewer ngoài top-N (đã có logic).

## Quyết định (thầy chốt)
- **BỎ legend** promote/demote khỏi dashboard League tuần → 2 card khung giống hệt. Cơ chế thăng/rớt xem ở trang /league.
- Standing badge **rank-driven** (không tier nữa ở dashboard) → League-tuần #1 = 🥇, Top-học-viên #9 = 🏆. (Supersede quyết định "giữ tier badge dashboard" 2026-07-17 — thầy vừa chốt lại rank-driven cho y chang.)
- Trailing = SLOT theo ngữ cảnh: caret (weekly) / follow (global).

## DATA — 0 BE-change
Mọi field sẵn. Medal/cup = rankBadge art. Render-là-xong.

## Verify
- `tsc` (lọc PriceTag) + eslint: LeaderboardListCard + LeagueCardContent + TopLearners.
- grep: 2 container đều render `<LeaderboardListCard/>`; legend gone; standing IconTile rank-driven cả 2.
- Runtime: thầy soi dashboard Cộng đồng (HMR :3000) — 2 card khung y chang, trên 🥇 dưới 🏆.

## 3 lớp
- Truth: 0 rule mới (IconTile §4, rankBadge, accent-system §3 sẵn). Supersede: tier-badge-dashboard + legend-dashboard (báo thầy, đã chốt).
- Story: LeaderboardListCard = feature-comp → không story. (Nếu muốn story để review, có thể thêm — nhưng feature-level thường không.)
- Registry: feature-comp không liệt kê.
