# Proposal — league-consistency (unify identity + tame color)

> **Loại:** restraint/consistency correction — **KHÔNG phải design mới**. Sửa DRIFT khỏi `accent-system.md` §3/§5 + Áp-đầu audit (ruling `LeaderboardPodium`) + `design-restraint.md`. Ca thầy chỉ trên app thật (3 screenshot 2026-07-17): hero badge medal-vs-cúp không đồng nhất + "màu cam hỗn độn" (zone flood).
>
> **Prototype:** `.artifacts/prototypes/league-consistency/index.html` (host thật đã verify :8090). Toggle Before⇄After × 4 màn.

## FLOW (mọi surface dùng chung ngôn ngữ)
1. **Dashboard tab Cộng đồng** — 2 card preview: `LeagueCardContent` (weekly, capped top-4 + self-card) · `TopLearners` (global, top-5 + follow). Mỗi cái link → `/league`.
2. **/vi/league** (route riêng, PageHeader + ResponsiveBreadcrumb + TabsCard primary) — 2 tab:
   - **Weekly** (`WeeklyBoard`): hero (`StandingHeroCard`) + zone list (`LeagueRow`) toàn cohort.
   - **Global** (`GlobalBoard`): hero + `Podium` top-3 + rank-4+ list follow.

Shell = **cột đọc centered** `max-w-2xl` (leaderboard = browse/read job) — giữ nguyên, KHÔNG đổi.

## Quyết định thống nhất (5)

### 1. Badge hero = ART FLUENT-EMOJI BARE (cả 2 tab) — bỏ tile
- Weekly: `LeagueTierBadge` (fluent-emoji medal theo tier) — **giữ**, render bare (đang đúng).
- Global: **thay** `IconTile`+phosphor `TrophyIcon` (tile `bg-accent/20` = cam) **bằng** `<Icon icon="fluent-emoji-flat:trophy" />` bare (Iconify, y hệt cách `LeagueTierBadge` render), size ~40px. Cùng họ art → hết clash "huy chương vs cúp trong ô cam".
- **File:** `GlobalBoard/index.tsx` (badge slot). `StandingHeroCard` KHÔNG đổi (slot `badge` vẫn ReactNode).

### 2. Zone color RESTRAINT — gate + edge-marker, KHÔNG flood nền hàng
- **Gate (fix bug gốc):** chỉ vẽ zone khi `promoteCount + demoteCount < total` (2 zone rời nhau). Cohort nhỏ (degenerate, promote/demote phủ hết) → **list phẳng, không zone marker**, chỉ giữ legend nhắc luật. (Đây là ca thầy thấy: 5 người, promoteCount=10/demoteCount=5 → mọi hàng vừa promote vừa demote → `bg-danger-soft` thắng → cam hết.)
- **Khi vẽ:** thay `bg-success-soft`/`bg-danger-soft` full-row **bằng**: (a) **nhãn nhóm** "▲ Khu thăng hạng" (`text-success`, text-[11px] uppercase) / "▼ Khu rớt hạng" (`text-danger`) đặt trên mỗi nhóm; (b) **viền trái mảnh** `border-l-2 border-success`/`border-danger` trên hàng trong zone. Nền hàng = `bg-surface`. Màu chỉ là chi tiết nhỏ (design-restraint 60-30-10).
- **Sửa overlap:** 1 hàng KHÔNG bao giờ vừa `isPromote` vừa `isDemote` (gate đã chặn; thêm assert `isDemote = !isPromote && rank > demoteFrom`).
- **File:** `WeeklyBoard/index.tsx` (tính gate + group + nhãn), `LeagueRow/index.tsx` (đổi tint→edge).

### 3. Hàng "của tôi" = RING accent, bỏ fill
- `LeagueRow` isMe: `bg-primary/10` → **`ring-2 ring-accent`** + rank & điểm `text-accent`, nền `bg-surface` (accent-system §3 "của tôi"). Global list my-row (`GlobalBoard`) tương tự.
- **File:** `LeagueRow/index.tsx:91`, `GlobalBoard/index.tsx` (my-row).

### 4. Podium champion = RING + số accent, bỏ `bg-accent-soft`
- `Podium` champ step: `bg-accent-soft text-accent-soft-foreground` → **`ring-2 ring-accent` + số `text-accent`**, nền `bg-surface`, giữ height cao hơn (`h-16`). Others giữ `bg-surface-secondary`. (accent-system §5 + ruling `LeaderboardPodium`: bệ fill → bỏ.)
- **File:** `Podium/index.tsx:71-77`.

### 5. Follow QUIET trên leaderboard (thầy chốt 2026-07-17)
- `FollowButton`: thêm prop **`quiet?: boolean`** (hoặc `variant` override) → khi true dùng `variant="secondary"`/outline thay `primary`. Mặc định giữ nguyên (không phá 4 call-site kia: profile hero, WhoToFollow, DueReviewHero, PublicProfile).
- Bật `quiet` ở **leaderboard dày**: `GlobalBoard` list + `TopLearners` (dashboard). → 1 primary/màn = CTA hero.
- **File:** `FollowButton/index.tsx` (+prop), `GlobalBoard/index.tsx` + `TopLearners/index.tsx` (bật quiet).

## STATE-MATRIX + conversion lens (không đổi so với build trước, chỉ tint đổi)
- **Rỗng** (chưa vào cohort / chưa có ai): empty-state + CTA "Làm challenge để leo hạng" → `/courses` (phễu khóa). ✓ đã có.
- **1–N**: hero (goal-gradient meter số THẬT) + list. Zone gate quyết vẽ marker hay không.
- **CTA**: 1 primary = hero CTA (follow đã hạ quiet). **Link**: avatar+name → profile. **Psych**: podium (social proof) + meter (goal-gradient) — số thật.

## DATA — KHÔNG cần mở BE
Mọi thứ tính FE từ data đã fetch (`promoteCount`/`demoteCount`/`total`/`myRank`/`myPoints`/adjacent entry). Badge trophy = art tĩnh. → **build = render-là-xong**, 0 schema change.

## Files to touch (tổng)
| File | Đổi |
|---|---|
| `LeagueRow/index.tsx` | tint→edge-marker; isMe ring không fill; nhận `zoneMarker?: "up"\|"down"\|null` |
| `WeeklyBoard/index.tsx` | tính zone-disjoint gate; group promote/middle/demote + nhãn; truyền marker |
| `Podium/index.tsx` | champ ring+số accent, bỏ `bg-accent-soft` |
| `GlobalBoard/index.tsx` | bare fluent trophy (bỏ IconTile); my-row ring; follow quiet |
| `FollowButton/index.tsx` | +prop `quiet` |
| `TopLearners/index.tsx` | bật follow quiet (dashboard nhất quán) |
| `LeagueCardContent` | soi lại badge/my-row cho khớp (nếu lệch) |

## Verify plan
- `npx tsc --noEmit` (lọc PriceTag pre-existing) + `eslint` 7 file.
- Runtime: thầy tự soi `/vi/league` (2 tab) + dashboard tab Cộng đồng — dev server thầy đang chạy thật (:3000).
- Self-critique: re-check accent-system §5 KHÔNG còn fill nào (grep `bg-accent-soft`/`bg-primary/10`/`bg-danger-soft` trong league dir = 0).

## 3 lớp
- **Truth:** KHÔNG rule mới (drift khỏi accent-system §5 có sẵn). Có thể thêm 1 dòng ví dụ THẬT vào accent-system Áp-đầu list (league zone flood) — để lane feedback ghi, không phải build.
- **Story:** feature components → không story.
- **Registry:** feature components → không liệt kê.
