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

## Caret + text (chung, mọi nơi)
Bất kỳ chỗ nào có **text + caret** (see-more, link điều hướng…):
- Đặt **sát nhau** (`gap-1`).
- **Hover → caret trượt sang phải**: bọc `group` + caret `transition-transform group-hover:translate-x-1`.
- Đây là behaviour mặc định của `LabeledCard` see-more; tái dùng cho link caret khác.

## Tham chiếu
- Block: `blocks/cards/LabeledCard`. Mẫu: `features/profile/PublicProfile/ProfileOverviewTab`.
- Card kiểu cũ (title trong) `SectionCard` = legacy, đang migrate dần sang `LabeledCard`.
