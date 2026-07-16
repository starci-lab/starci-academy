# Proposal — dashboard-league-compact ("1,2,3" medal-in-list)

> Đồng bộ 2 card dashboard tab Cộng đồng với trang /league — cùng NGÔN NGỮ rank-medal, KHÁC shape (dashboard = list gọn, KHÔNG podium; thầy chốt "không podium như trang, thay bằng 1,2,3").
>
> **Prototype:** `.artifacts/prototypes/dashboard-league-compact/index.html` (host :8087 verified). Before⇄After × 3 tab.

## Surfaces (2 card, dashboard `?tab=community`)
1. **`LeagueCardContent`** (`src/components/features/dashboard/LeagueCard/LeagueCardContent/index.tsx`) — weekly cohort preview.
2. **`TopLearners`** (`src/components/features/dashboard/TopLearners/index.tsx`) — global top learners preview.

## Quyết định (thầy chốt)
1. **Top-3 = medal `🥇🥈🥉`** ở cột rank (thay số); rank 4+ giữ SỐ. Dùng `rankBadgeIconId(rank)` (đã có, cho 1→1st/2→2nd/3→3rd-place-medal) render `<Icon>` ~`size-5` khi `rank<=3`, else số. (KHÔNG trophy trong list — trophy chỉ ở hero trang khi viewer rank 4+.) Cùng art fluent-emoji với hero /league → đồng bộ.
2. **Viewer IN-PLACE, bỏ card "Hạng của bạn" tách rời** (supersede quyết định 2026-07-17). Hiện `LeagueCardContent` loại myEntry khỏi `topRows` rồi nhét vào `LabeledCard "Hạng của bạn"` riêng → list bắt đầu từ #2, giấu champion #1. → Render list top-N **BAO GỒM myEntry** (highlight accent + "· Bạn" in-place). Standing line ở header đã tóm tắt "Hạng #N" nên self-card thừa.
3. **Ngoài top-N → self-row ghim + dải `⋯ còn N người`** (giống trang /league; dùng myRank/myPoints hoặc myEntry). Chỉ khi `!shown.some(isMe)`.
4. Áp **cả 2 card** — cùng "1,2,3".

## Chi tiết build
- **`LeagueCardContent`**: 
  - `topRows` = `data.entries.slice(0, TOP_ROWS)` (KHÔNG filter myEntry nữa).
  - Row: cột rank → `entry.rank <= 3 ? <Icon icon={rankBadgeIconId(rank)} className="size-5"/> : entry.rank`. Có thể tiếp tục dùng `LeagueRow` NẾU thêm được medal — hoặc render inline (rank cell + UserCell + points + caret) như 2 board trang. **Ưu tiên: nâng `LeagueRow` nhận medal** (prop `rankMedal?: boolean` hoặc tự suy từ rank) để DÙNG CHUNG. Fallback: inline.
  - isMe row: accent value + "· Bạn" (đã có trong LeagueRow).
  - Bỏ block `LabeledCard "Hạng của bạn"` + `myEntry` self-card.
  - Nếu myEntry ngoài `TOP_ROWS` → ellipsis + self-row (LeagueRow isMe) ở cuối list.
  - `hiddenCount`/"+N others" giữ hoặc bỏ (see-more header đã có link).
- **`TopLearners`**: rows top-5 → medal cho rank 1-3; giữ follow quiet; myEntry ngoài top-5 → ellipsis + self-row.
- **Helper**: reuse `rankBadgeIconId` (rank<=3). Cân nhắc thêm `placeMedalIcon(rank): ReactNode|null` trong `rankBadge.tsx` (null khi rank>3) để cả 2 card + có thể trang dùng chung.

## DATA — 0 BE-change
myEntry/myRank/myPoints/entries đã có. Medal = art tĩnh. Render-là-xong.

## Verify
- `tsc --noEmit` (lọc PriceTag) + eslint 2 card + rankBadge.
- grep: `LeagueCardContent` KHÔNG còn `LabeledCard "Hạng của bạn"` self-card; top-3 có medal; myEntry in-list.
- Runtime: thầy soi dashboard Cộng đồng (HMR :3000).

## 3 lớp
- Truth: 0 rule mới (medal = rankBadge đã có; in-place my-row = accent-system §3). Supersede self-card-always (báo thầy, đã chốt).
- Story: feature-comp → không story.
- Registry: feature-comp không liệt kê.
