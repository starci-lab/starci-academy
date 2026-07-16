# Proposal — league-unify (một khung · IconTile badge · bỏ Podium)

> **Loại:** relayout ĐỒNG BỘ 2 board + ground vào **block canonical Storybook** (registry `.artifacts/states/registry.md`).
> Sửa 2 drift tôi tự tạo ở `league-page`/`league-consistency`: (a) badge bare-emoji **vi phạm `icon.md §4`** (hero/entity → IconTile); (b) hand-roll meter + list thay vì dùng `ProgressMeter`/`SurfaceListCard`; (c) Podium decoration lạc quẻ.
>
> **Prototype:** `.artifacts/prototypes/league-unify/index.html` (host :8080 verified). Toggle Before⇄After × 2 tab.

## Nguồn ground (Storybook thật)
- **registry.md** — block canonical + luật: `IconTile ✎` (icon.md §4) · `ProgressMeter` (meter) · `SurfaceListCard ✎` (ranked list, row full-bleed divider, leading+title+meta) · `PageHeader` · `TabsCard` · `MetricCard`/`StatPair` (stat concept) · `NotificationList` = "SurfaceListCard rows leading IconTile" (mẫu list y hệt cần).
- **icon.md §4** — "Entity / empty / **hero** / avatar → block `IconTile`, KHÔNG icon trơ" + "1 row tối đa 1 icon leading".
- **accent-system §3/§5** — "của tôi" = accent value trong list (không ring/fill trong bordered) · accent ở hero focal bounded OK.

## Khung THỐNG NHẤT (cả 2 tab GIỐNG HỆT)
```
PageHeader (ResponsiveBreadcrumb + "Bảng xếp hạng")
TabsCard variant="primary"  (Tuần này | Toàn cầu)
┌ StandingHeroCard ───────────────────────────────┐
│ [IconTile badge]  rankLabel                       │
│                   meta                             │
│ ProgressMeter  (goal-gradient, label trên)        │
│ Button primary  "Làm challenge để leo hạng →"     │
└───────────────────────────────────────────────────┘
[legend ● thăng ● rớt]            ← WEEKLY only
┌ SurfaceListCard (ranked rows) ───────────────────┐
│ rank · UserCell(avatar+name) · points · [trailing]│  trailing = RankDeltaCaret (weekly) / FollowButton quiet (global)
│ …  zone left-edge (weekly) · my-row accent value  │
└───────────────────────────────────────────────────┘
```
**Global = hero + SurfaceListCard, KHÔNG Podium** → cấu trúc y hệt weekly.

## Quyết định (thầy chốt — refinement 2026-07-17)
1. **Badge = block `IconTile` CÓ BG, RANK-DRIVEN, cả 2 tab** (icon.md §4). size `sm` (48px), **tone `default`** (bg-default trung tính — thầy chốt, hết warm), rounded theo tile (rounded-xl mặc định IconTile).
   - **Art = GIỮ NGUYÊN logo cup/medal gốc của lib** = `@iconify/react` set **`fluent-emoji-flat`** (multicolor, đang dùng ở `LeagueTierBadge`). KHÔNG phosphor mono.
   - **Map theo HẠNG người xem (KHÔNG theo tier nữa — đây là gốc lỗi: viewer rank-5 weekly hiện huy-chương-đồng vì tier=bronze, lệch pha global cúp):**
     - rank **1** → `fluent-emoji-flat:1st-place-medal` · rank **2** → `2nd-place-medal` · rank **3** → `3rd-place-medal`
     - rank **4+** → `fluent-emoji-flat:trophy` (cúp)
   - Áp **Y HỆT** cả weekly (viewer weekly rank) lẫn global (viewer global rank) → 1 quy tắc, đồng bộ tuyệt đối. `<Icon>` truyền vào `IconTile.icon` (KHÔNG set width/height — để `[&_svg]:size-6` của tile lo). Multicolor art không bị tone recolor.
   - Helper `rankBadgeIcon(rank)` dùng chung (đặt cạnh board hoặc util league).
   - **Bỏ** hướng cũ "weekly=tier-art / global=trophy / tone=accent".
2. **GIỮ Podium — CẢ 2 board** (thầy chốt ngược 2026-07-17: đồng bộ = cả weekly LẪN global đều có podium top-3, KHÔNG phải bỏ). Podium ở trên, list = **rank 4+** (top-3 lên bục, không lặp trong list). `Podium` giữ nguyên (learn/Leaderboard cũng dùng).
   - **Viewer TRONG podium (rank 1/2/3):** đánh dấu cột của viewer = **avatar `ring-2 ring-accent`** + tên `text-accent` + hậu tố "· Bạn" (accent-system §3 "của tôi" = ring + value accent, không fill bệ). Viewer KHÔNG xuất hiện lại ở list (đã lên bục). Hero vẫn hiện standing (badge = medal theo rank).
   - **Podium prop:** thêm `meId?` (userGlobalId) để Podium biết cột nào là viewer → ring + "Bạn".
3. **List = `SurfaceListCard` cả 2 tab** (was: weekly free-floating rows). LeagueRow render trong SurfaceListCard (`rounded-none`, để card lo frame+divider). Zone = `border-l` trên row + legend trên (bỏ label-row chèn — gọn trong list card). "Của tôi" = accent value (nhất quán trong bordered list; ring biến mất vì giờ luôn là list).
4. **Meter = block `ProgressMeter`** — StandingHeroCard thay `<div meter>` hand-roll bằng `ProgressMeter value/max/label` (fill accent).

## Files to touch
| File | Đổi |
|---|---|
| `StandingHeroCard/index.tsx` | meter hand-roll → `ProgressMeter`; badge slot giữ ReactNode (caller truyền IconTile) |
| `WeeklyBoard/index.tsx` | badge = `IconTile` src=tier png; rows bọc trong `SurfaceListCard`; giữ zone edge + legend |
| `GlobalBoard/index.tsx` | badge = `IconTile` TrophyIcon (re-add IconTile); **bỏ `Podium`**; list rank 1+ (bỏ slice(3)); follow quiet giữ; my-row accent giữ |
| `Podium/index.tsx` | **retire** (xoá nếu 0 importer) |
| `LeagueRow/index.tsx` | thêm khả năng render `rounded-none` trong SurfaceListCard (className đã hỗ trợ); zone border-l giữ |
| `LeagueCardContent` + `TopLearners` (dashboard) | headline badge → `IconTile` (tier art / trophy) cho khớp trang; list đã SurfaceListCard |

## DATA — 0 BE-change
Mọi field sẵn (`tier`/`promoteCount`/`demoteCount`/`myRank`/`myPoints`/`weekPoints`/`points`/adjacent). IconTile src = MinIO badge png (đã có ở LeagueTierBadge). → **render-là-xong**.

## State-matrix + conversion (không đổi)
- Rỗng → empty + CTA "Làm challenge" → `/courses` (phễu khóa). ✓
- 1–N → hero (ProgressMeter goal-gradient số THẬT) + SurfaceListCard. Zone gate `promote+demote<total` giữ (fix cohort nhỏ).
- 1 primary = hero CTA (follow quiet). Link = UserCell → profile. Psych = leaders trong list (social proof, không cần podium).
- **NGOÀI TOP (Global only, thầy chốt 2026-07-17):** viewer rank > số entry tải về → **ghim 1 self-row ở đáy SurfaceListCard**, ngăn bằng dải `⋯ còn {N} người` (`total - entries.length` nếu có total, hoặc bỏ số). Self-row dùng `myRank`+`myPoints` (BE trả sẵn) + avatar/tên từ redux `me`; accent value (không fill). Chỉ render khi `!entries.some(e => e.rank === myRank)`. Weekly KHÔNG có (list uncapped → luôn thấy mình; chưa xếp nhóm → empty). Ellipsis-row = 1 `<div>` non-item trong card (không separator riêng).
- **Rank-delta caret (tăng/giảm xen kẽ):** `RankDeltaCaret` sẵn — ▲success/▼danger/—muted, `size-3.5`+`text-xs` trailing; list xen kẽ đọc được (glyph nhỏ, không flood). Không cần đổi gì.

## Verify plan
- `tsc --noEmit` (lọc PriceTag) + eslint các file chạm.
- grep self-critique: `Podium` 0 importer sau retire; badge = IconTile cả 2 board; 0 `bg-*-soft` fill sót.
- Runtime: thầy soi `/vi/league` 2 tab + dashboard Cộng đồng (HMR :3000).

## 3 lớp
- **Truth:** 0 rule mới (drift khỏi icon.md §4 + accent-system + concept SurfaceListCard/ProgressMeter đã có).
- **Story:** IconTile/ProgressMeter/SurfaceListCard đã có story; feature comp (StandingHeroCard/WeeklyBoard/GlobalBoard/LeagueRow) không story. Podium retire → xoá story nếu có (không có).
- **Registry:** feature comp không liệt kê; block dùng lại y nguyên.
