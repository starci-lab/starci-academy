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
  - `<SurfaceListCard>` (mặc định `shadow-surface`, KHÔNG `bordered` — `bordered` chỉ dành cho nested-in-modal/drawer theo doc chính block; top-level page dùng shadow, y hệt `CartView`) làm surface DUY NHẤT.
  - Mỗi KPI = `<SurfaceListCardItem>` (free-form, KHÔNG interactive — nội dung là icon+label+current/target, progress bar, preset pills — không phải 1 press target duy nhất) — block tự lo `p-3` + divider full-bleed + tự ẩn divider hàng cuối, KHỎI tự tính `border-b`/`rounded-3xl` thủ công như hiện tại.
- Giữ NGUYÊN nội dung từng hàng (icon, label, current/target, ProgressBar khi có target, preset buttons, nút Xóa) — chỉ đổi KHUNG bọc ngoài.
- Page-header (title + composite subtitle) + shell `max-w-2xl mx-auto` GIỮ NGUYÊN — đã đúng `centered-form-setup`, không cần đổi.

## Change 3 — PageHeader + ResponsiveBreadcrumb (thầy thêm: trang thiếu header chuẩn)
- **File:** `src/components/features/dashboard/kpi/Kpi/index.tsx` — thay khối `<div className="flex flex-col gap-2"><h1>...InfoTooltip...</h1><span muted>...</span></div>` (dòng ~116-135) bằng `<PageHeader>` (`@/components/blocks/layout/PageHeader`):
  - `breadcrumb={<ResponsiveBreadcrumb items={[{key:"home", label:t("nav.home"), onPress:()=>router.push(pathConfig().locale(locale).build())}, {key:"kpi", label:t("dashboard.kpi.title")}]} />}` — 2 crumb (Home › KPI tuần), crumb cuối read-only (không `onPress`).
  - `title={<InfoTooltip title={t("dashboard.kpi.title")} description={t("dashboard.kpi.help")}>{t("dashboard.kpi.title")}</InfoTooltip>}` (giữ nguyên tooltip hiện có, chỉ đổi wrapper `h1`→`PageHeader.title`).
  - `description={total > 0 ? t("dashboard.kpi.summary", {...}) : t("dashboard.kpi.subtitle")}` (giữ nguyên logic).
  - Ground THẬT: mirror y hệt `RewardsPage` (`src/components/features/rewards/RewardsPage/index.tsx:53-79`) — cùng họ "trang đơn, vào từ dashboard", đã dùng đúng `PageHeader`+`ResponsiveBreadcrumb` 2-crumb pattern này.
  - **Responsive tự động** — `ResponsiveBreadcrumb` tự render 2 bản (desktop `Breadcrumbs` đầy đủ / mobile 1 back-link `‹ Trang chủ`) theo `hidden sm:flex`/`sm:hidden`, KHÔNG cần code riêng (đã đúng theo `components/breadcrumb.md`).
  - **Đi kèm:** nâng khoảng cách header→content `gap-6`→`gap-10` (đúng `centered-form-setup` §Body: "gap-10 header→content rồi gap-6/gap-3 nội bộ"); container giữ `max-w-2xl` (không đổi theo `max-w-3xl` của RewardsPage — nội dung /kpi hẹp hơn, không cần rộng hơn).
  - **i18n:** không cần key mới — `nav.home` + `dashboard.kpi.title` đã tồn tại.

## KHÔNG đổi (out of scope, đã note trong prototype)
- Debt "editor `/kpi` không có default-target như dashboard card" (`item?.target ?? null` thay vì `?? DEFAULT_KPI_TARGETS[key]`) — đã được ghi nhận CHỦ Ý ở `patterns/meter-tracks-out-of-box-default-target.md` §"FE-only default... editor sẽ hiện trống tới khi user set → ghi nợ đồng bộ". Không fix trong proposal này; hỏi thầy riêng nếu muốn đóng nợ luôn (rẻ — chỉ import `DEFAULT_KPI_TARGETS` vào `Kpi/index.tsx`).

## Files to touch
- `src/components/features/dashboard/OverviewTab/index.tsx` (change 1)
- `src/components/features/dashboard/WeeklyGoals/index.tsx` (change 1 — bỏ button + import thừa)
- `src/components/features/dashboard/kpi/Kpi/index.tsx` (change 2 + change 3)

## Block canonical dùng (không hand-roll)
- `LabeledCard` (`onSeeMore` + `seeMoreLabel`, đã có sẵn API) · `SurfaceListCard bordered` + `SurfaceListCardItem` (free-form, không interactive) · `PageHeader` (`breadcrumb`/`title`/`description` slot) · `ResponsiveBreadcrumb` (2-item, mirror `RewardsPage`) — cả 4 block ĐÃ TỒN TẠI, không cần dựng mới.

## Verify plan
- `tsc --noEmit` + `eslint` sạch 3 file touch.
- Runtime `/vi/dashboard?tab=overview`: "Sửa ›" nằm ở HEADER card (cạnh "Mục tiêu tuần"), không còn button rời ở đáy; click → `/kpi`.
- Runtime `/vi/kpi`: 6 KPI giờ là 1 surface liền mạch (border-seam giữa các hàng, KHÔNG 6 box rời); preset pills + Xóa vẫn hoạt động như cũ (không đổi logic `onChoose`); breadcrumb desktop hiện "Trang chủ › KPI tuần", thu hẹp `<sm` chỉ còn "‹ Trang chủ".

## Bảng component → Storybook
| Component | Story | Mới / Sửa | State demo thêm |
|---|---|---|---|
| `LabeledCard` | `LabeledCard.stories` | không đổi | đã có `onSeeMore` story sẵn — WeeklyGoals chỉ là 1 CONSUMER thêm, không phải block mới |
| `SurfaceListCard`/`SurfaceListCardItem` | `SurfaceListCard.stories` | không đổi | free-form item với progress-bar + preset pills CHƯA có state demo — cân nhắc thêm 1 story variant sau build (hỏi thầy) |
| `WeeklyGoals`/`Kpi` | — | sửa | feature-component, không có story riêng |

## Nguồn tham khảo
- `.artifacts/states/registry.md` (dòng StatGridCard) · `.claude/fe/principles/card.md` §1 (2-card-dính) · `.claude/fe/layouts/page-shell-selection.md` + `centered-form-setup.md` (xác nhận shell hiện tại đã đúng, không đổi) · `.claude/fe/patterns/meter-tracks-out-of-box-default-target.md` (debt đã biết, out of scope) · tiền lệ THẬT vừa làm cùng ngày: `.artifacts/proposals/league-card-community-tweaks.proposal.md` (chính xác cùng Change 1) · source: `WeeklyGoals/index.tsx:176-183`, `OverviewTab/index.tsx:70-74`, `Kpi/index.tsx:138-208`, `SurfaceListCard/index.tsx`, `LabeledCard/index.tsx`.
- Prototype: `.artifacts/prototypes/kpi-page/index.html` — hosted http://127.0.0.1:8083 (2 surface, click "Sửa ›" để chuyển màn, verify marker `<title>` đã pass).
