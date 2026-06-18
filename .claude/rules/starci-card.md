# StarCi Card Convention (UI 2.0)

Cách dựng một **section card** (khối nội dung có tiêu đề). Đi kèm `starci-ui.rules`.
Block: **`LabeledCard`** (`blocks/cards/LabeledCard`). STRICT.

## Hình dạng — Label NGOÀI card, content TRONG card
```tsx
<LabeledCard
  label={t("…")}                                   // tiêu đề = <Label>, NẰM NGOÀI/TRÊN card
  icon={<XxxIcon aria-hidden focusable="false" className="size-5" />}  // foreground, size-5
  onSeeMore={() => setTab("…")}                     // optional → hiện "Xem thêm ›"
  seeMoreLabel={t("publicProfile.overview.seeMore")} // override chữ (mặc định "Xem thêm")
>
  {/* content — KHÔNG tiêu đề ở đây; data PHẢI qua AsyncContent */}
</LabeledCard>
```
Render: `<section>` → hàng [icon + `Label` ……… `Link` "Xem thêm ›"] → `<Card><CardContent>`.

## Luật
- **Tiêu đề = `Label`** (HeroUI) ĐỨNG NGOÀI card (KHÔNG header trong card kiểu SectionCard cũ).
  `SectionCard` (reuseable) = LEGACY, code mới dùng `LabeledCard`.
- **Icon label**: phosphor `*Icon`, **`size-5`**, **màu foreground** (KHÔNG accent), `aria-hidden`.
- **See-more = HeroUI `Link`** (KHÔNG Button), accent, kết bằng **caret** (`CaretRightIcon`).
  Chữ override qua `seeMoreLabel` (mặc định "Xem thêm" — feature nên truyền `t(...)`).
- **Nhịp**: `Label → Card` = `gap-3`; giữa các card = `gap-6`. Card frame + padding do
  HeroUI `Card/CardContent` lo; feature KHÔNG style.
- **Data trong card PHẢI qua `AsyncContent`** (xem `starci-async.md` / `starci-ui.rules` §6).

## KHÔNG card lồng card — `LabeledCard` thường vs `frameless`
- **`LabeledCard` LUÔN có `<Card>` bên trong** → CHỈ đặt content **PHẲNG** vào (rows/bars/list/heatmap/checklist).
- **Content TỰ-LÀ-CARD** (grid resume/course cards, `PressableCard`, `SectionCard`) → **KHÔNG bọc `LabeledCard` thường**
  (sẽ card-lồng-card). Dùng **`LabeledCard frameless`** (prop): giữ label row (+icon/see-more), **bỏ `<Card>` bọc**,
  render children trực tiếp. (vd "Tiếp tục học" frameless ôm grid `ResumeCard`.)
- **Card tự-title phức tạp** (vd weekly-challenge có leaderboard) → đổi để **tự render `LabeledCard`** (label ngoài) +
  self-hide (`return null`) khi rỗng — KHÔNG dùng `SectionCard` tự-title rời (lệch pattern + double-title nếu bọc).

## Caret + text (chung, mọi nơi)
Bất kỳ chỗ nào có **text + caret** (see-more, link điều hướng…):
- Đặt **sát nhau** (`gap-2` — coupled pair; KHÔNG `gap-1`, xem `main.md` §9).
- **Hover → caret trượt sang phải**: bọc `group` + caret `transition-transform group-hover:translate-x-1`.
- Đây là behaviour mặc định của `LabeledCard` see-more; tái dùng cho link caret khác.

## Card bấm-được = block `PressableCard` (HeroUI v3 Card KHÔNG pressable)
- **HeroUI v3 `Card` = `<div>` TĨNH** — KHÔNG `isPressable`/`onPress` (khác NextUI v2); `render` prop bị khoá kiểu
  `<div>` → không render được `<button>`/`<a>`.
- **Card cả-thẻ-bấm-được = block `blocks/cards/PressableCard`** (`onPress` action / `href` navigate / `isDisabled`):
  block tự sở hữu look (`bg-surface rounded-3xl px-4 py-3` + hover tint + focus ring) trên `<button>`/`<a>` thật.
  Feature CHỈ ghép — **CẤM** hand-roll `<button className="rounded-* border bg-* p-*">`.
- **CẤM lồng `Button`/interactive trong `PressableCard`** (button-trong-button). Affordance (mũi tên…) = icon trần.
- KHÔNG có class `.card` global trong repo (`globals.css` chưa định nghĩa dù design doc nhắc) → frame tĩnh =
  HeroUI `Card`+`CardContent`; frame bấm-được = `PressableCard`.

## Indicator "đang dùng / plan hiện tại" = banner FULL-WIDTH (KHÔNG chip nhỏ)
- Trong list lựa-chọn (tier/plan), gói hiện tại render **banner full-width** (không `Chip` self-center):
  `flex w-full justify-center … bg-accent/10` (hoặc `bg-success/10`) + chữ **`text-success`** weight medium
  ("đang ở gói này"). **Bo góc banner BÁM radius CARD cha** (vd trong tier Card `rounded-3xl` → banner `rounded-3xl`),
  KHÔNG ép field-radius — con hài hoà với khối cha (xem `main.md` §9).
- **Mọi phương án trong bảng so sánh (kể cả FREE/0đ) phải NÊU RÕ thông số** (credit/limit) — đừng để card free
  trống/placeholder trong khi card trả phí liệt kê. Free base = config `systemConfig.ai.auto` (default 50/5h·500/tuần);
  card free static → hằng số mirror config + comment (đừng drift âm thầm).

## Tham chiếu
- Block: `blocks/cards/{LabeledCard,PressableCard}`. Mẫu: `features/profile/PublicProfile/ProfileOverviewTab`,
  `features/profile/AiSubscription/{FreeTierCard,TierGrid/TierCard}` (banner đang-dùng).
- Card kiểu cũ (title trong) `SectionCard` = legacy, đang migrate dần sang `LabeledCard`.
