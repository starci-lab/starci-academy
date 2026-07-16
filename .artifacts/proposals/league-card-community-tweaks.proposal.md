# Proposal — LeagueCard + Community-tab see-more tweaks

**Surface:** `/vi/dashboard?tab=community` · **Nguồn:** feedback lane (prototype `.artifacts/prototypes/league-card/` — thầy duyệt) · **Ngày chốt:** 2026-07-17

## Change 1 — See-more dời lên header (LabeledCard onSeeMore)
- **File:** `src/components/features/dashboard/LeagueCard/LeagueCardContent/index.tsx`
- Bỏ block cuối (Link "Xem bảng đầy đủ" ở đáy body). Giữ dòng "+N người khác".
- Truyền `onSeeMore={() => router.push(pathConfig().locale(locale).league().build())}` + `seeMoreLabel={t("dashboard.league.seeMore")}` cho `<LabeledCard>` (nhánh `framed`). Đưa League về ĐỒNG BỘ với 2 sibling (GlobalStanding/TopLearners đã dùng onSeeMore).

## Change 2 — Hàng của mình = surface-in-surface labeled list card (LUÔN tách, thầy chốt option 2)
- `myEntry` KHÔNG còn append vào list phẳng. `topRows` LỌC BỎ myEntry (không lặp).
- Render 1 card riêng SAU list: `LabeledCard subtleLabel frameless label={t("dashboard.league.yourRank")}` ("Hạng của bạn" — REUSE key sẵn có) → `SurfaceListCard bordered` → `LeagueRow` (myEntry, isMe=true, `className="rounded-none"` để fill flush trong card, separator full-bleed theo ruling mới).
- Chỉ render khi có `myEntry` (self-hide nếu user chưa vào cohort).

## Change 3 — Đồng nhất see-more label = "Xem bảng xếp hạng" (thầy thêm)
- Cả 3 widget đều navigate `.league()` → nhãn "Xem bảng xếp hạng" chính xác + nhất quán.
- **i18n value edit (không đổi component):** `dashboard.league.seeMore` "Xem bảng đầy đủ"→"Xem bảng xếp hạng" (en "See full board"→"View leaderboard"); `dashboard.community.topLearners.seeMore` "Xem toàn bộ bảng xếp hạng"→"Xem bảng xếp hạng" (en "View full leaderboard"→"View leaderboard"). `globalStanding.seeMore` đã đúng.

## Files to touch
- `LeagueCard/LeagueCardContent/index.tsx` (change 1+2)
- `src/messages/{vi,en}.json` (change 3 — 2 key mỗi lang)

## Block canonical dùng (không hand-roll)
- `LabeledCard` (onSeeMore + subtleLabel + frameless) · `SurfaceListCard bordered` · `LeagueRow` (reuse).

## Verify plan
- tsc + eslint sạch. Runtime `/vi/dashboard?tab=community`: (a) see-more ở header 3 widget đều "Xem bảng xếp hạng"; (b) hàng của mình tách ra card "Hạng của bạn" bordered; (c) không lặp myEntry; (d) self-hide khi chưa vào cohort.

## Story / UI-ref
- LeagueCard = feature-component (no story). Composition surface-in-surface labeled-list đã demo ở block story `LabeledCard/SurfaceInSurface` + `CategorizedList` → không cần story mới (báo thầy nếu muốn story riêng).
