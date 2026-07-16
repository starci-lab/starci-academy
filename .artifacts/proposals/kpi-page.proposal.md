# Proposal — KPI page: see-more dời lên header + gộp 6 box rời thành 1 surface

**Surface:** `/vi/dashboard?tab=overview` (WeeklyGoals card) + `/vi/kpi` (Kpi editor page) · **Nguồn:** feedback lane (prototype `.artifacts/prototypes/kpi-page/` — thầy duyệt) · **Ngày chốt:** 2026-07-17

## Bối cảnh
Thầy chỉ: nút "Sửa" trên card dashboard thực chất CHÍNH LÀ điểm vào "See more" (điều hướng `/kpi`) — nhưng đang bị dựng như 1 `<Button variant="tertiary">` rời ở ĐÁY body, không dùng pattern `LabeledCard onSeeMore` mà 2 sibling cùng dashboard (`GlobalStanding`, `TopLearners`, và vừa fix hôm nay `LeagueCard`) đều đã dùng. Đồng thời tự soát trang `/kpi` phát hiện thêm 1 vi phạm canon có sẵn: 6 KPI đang render thành **6 box `border` rời xếp dọc** — vi phạm thẳng `principles/card.md` §1 *"Đừng render 2 khối bordered dính liền nhau theo chiều dọc"* (ở đây là 6, không phải 2).

## Change 1 — See-more dời lên header (LabeledCard onSeeMore)
- **File:** `src/components/features/dashboard/OverviewTab/index.tsx` — LabeledCard bọc `WeeklyGoals` (dòng ~70-74) truyền thêm `onSeeMore={() => router.push(pathConfig().locale(locale).kpi().build())}` + `seeMoreLabel={t("dashboard.kpi.edit")}` (reuse key "Sửa" có sẵn, KHÔNG đổi text — giữ đúng sắc thái "chỉnh mục tiêu", không phải "xem thêm" chung chung).
- **File:** `src/components/features/dashboard/WeeklyGoals/index.tsx` — bỏ hẳn `<Button variant="tertiary">{t("dashboard.kpi.edit")}</Button>` cuối body (dòng 176-183) + import `Button`/`useRouter`/`pathConfig` không còn dùng.
- Đồng bộ WeeklyGoals với `GlobalStanding`/`TopLearners`/`LeagueCard` — cả 4 card cộng đồng+dashboard giờ CÙNG 1 pattern header see-more.

## Change 2 — Gộp 6 box rời thành 1 SurfaceListCard (fix vi phạm card.md)
- **File:** `src/components/features/dashboard/kpi/Kpi/index.tsx` — thay wrapper `<div className="flex flex-col gap-3">` bọc 6 `<div className="... rounded-3xl border border-divider p-3">` (dòng 138-208) bằng:
  - `<SurfaceListCard bordered>` (đứng trong `centered-form-setup` shell, không phải nested-in-surface nhưng canon cho phép `bordered` khi cần đường viền rõ trên nền `bg-default` của trang standalone) làm surface DUY NHẤT.
  - Mỗi KPI = `<SurfaceListCardItem>` (free-form, KHÔNG interactive — nội dung là icon+label+current/target, progress bar, preset pills — không phải 1 press target duy nhất) — block tự lo `p-3` + divider full-bleed + tự ẩn divider hàng cuối, KHỎI tự tính `border-b`/`rounded-3xl` thủ công như hiện tại.
- Giữ NGUYÊN nội dung từng hàng (icon, label, current/target, ProgressBar khi có target, preset buttons, nút Xóa) — chỉ đổi KHUNG bọc ngoài.
- Page-header (title + composite subtitle) + shell `max-w-2xl mx-auto` GIỮ NGUYÊN — đã đúng `centered-form-setup`, không cần đổi.

## KHÔNG đổi (out of scope, đã note trong prototype)
- Debt "editor `/kpi` không có default-target như dashboard card" (`item?.target ?? null` thay vì `?? DEFAULT_KPI_TARGETS[key]`) — đã được ghi nhận CHỦ Ý ở `patterns/meter-tracks-out-of-box-default-target.md` §"FE-only default... editor sẽ hiện trống tới khi user set → ghi nợ đồng bộ". Không fix trong proposal này; hỏi thầy riêng nếu muốn đóng nợ luôn (rẻ — chỉ import `DEFAULT_KPI_TARGETS` vào `Kpi/index.tsx`).

## Files to touch
- `src/components/features/dashboard/OverviewTab/index.tsx` (change 1)
- `src/components/features/dashboard/WeeklyGoals/index.tsx` (change 1 — bỏ button + import thừa)
- `src/components/features/dashboard/kpi/Kpi/index.tsx` (change 2)

## Block canonical dùng (không hand-roll)
- `LabeledCard` (`onSeeMore` + `seeMoreLabel`, đã có sẵn API) · `SurfaceListCard bordered` + `SurfaceListCardItem` (free-form, không interactive) — cả 2 block ĐÃ TỒN TẠI, không cần dựng mới.

## Verify plan
- `tsc --noEmit` + `eslint` sạch 3 file touch.
- Runtime `/vi/dashboard?tab=overview`: "Sửa ›" nằm ở HEADER card (cạnh "Mục tiêu tuần"), không còn button rời ở đáy; click → `/kpi`.
- Runtime `/vi/kpi`: 6 KPI giờ là 1 surface liền mạch (border-seam giữa các hàng, KHÔNG 6 box rời); preset pills + Xóa vẫn hoạt động như cũ (không đổi logic `onChoose`).

## Bảng component → Storybook
| Component | Story | Mới / Sửa | State demo thêm |
|---|---|---|---|
| `LabeledCard` | `LabeledCard.stories` | không đổi | đã có `onSeeMore` story sẵn — WeeklyGoals chỉ là 1 CONSUMER thêm, không phải block mới |
| `SurfaceListCard`/`SurfaceListCardItem` | `SurfaceListCard.stories` | không đổi | free-form item với progress-bar + preset pills CHƯA có state demo — cân nhắc thêm 1 story variant sau build (hỏi thầy) |
| `WeeklyGoals`/`Kpi` | — | sửa | feature-component, không có story riêng |

## Nguồn tham khảo
- `.artifacts/states/registry.md` (dòng StatGridCard) · `.claude/fe/principles/card.md` §1 (2-card-dính) · `.claude/fe/layouts/page-shell-selection.md` + `centered-form-setup.md` (xác nhận shell hiện tại đã đúng, không đổi) · `.claude/fe/patterns/meter-tracks-out-of-box-default-target.md` (debt đã biết, out of scope) · tiền lệ THẬT vừa làm cùng ngày: `.artifacts/proposals/league-card-community-tweaks.proposal.md` (chính xác cùng Change 1) · source: `WeeklyGoals/index.tsx:176-183`, `OverviewTab/index.tsx:70-74`, `Kpi/index.tsx:138-208`, `SurfaceListCard/index.tsx`, `LabeledCard/index.tsx`.
- Prototype: `.artifacts/prototypes/kpi-page/index.html` — hosted http://127.0.0.1:8083 (2 surface, click "Sửa ›" để chuyển màn, verify marker `<title>` đã pass).
