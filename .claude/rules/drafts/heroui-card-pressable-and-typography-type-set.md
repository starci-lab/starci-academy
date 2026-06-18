# HeroUI v3 Card không pressable + Typography type-set + block PressableCard (2026-06-18)

Phát hiện khi audit code-pattern toàn `/profile` (full refactor). File/§ đích: main.md §6 (HeroUI) + §5
(Typography) + §13 (Card index `starci-card.md`).

## Luật (STRICT)
- **HeroUI v3 `Card` = `<div>` TĨNH, KHÔNG có `isPressable`/`onPress`** (khác NextUI v2). `Card` chỉ nhận
  `render` prop (custom render) nhưng bị KHOÁ kiểu về `<div>` → KHÔNG render được `<button>`/`<a>`.
  → **Card cả-thẻ-bấm-được = block `blocks/cards/PressableCard`** (`onPress` action / `href` navigate /
  `isDisabled`). Block tự sở hữu look card (`bg-surface rounded-3xl px-4 py-3` + hover tint + focus ring)
  trên `<button>`/`<a>` thật. Feature CHỈ ghép, KHÔNG hand-roll `<button className="rounded-* border bg-* p-*">`.
  - KHÔNG có class `.card` global trong repo (design doc nhắc nhưng `globals.css` chưa định nghĩa) → đừng
    bám `className="card"`. Frame tĩnh = HeroUI `Card`+`CardContent`; frame bấm-được = `PressableCard`.
  - CẤM lồng `Button`/interactive trong `PressableCard` (button-trong-button). Affordance (mũi tên…) = icon trần.
- **`Typography` `type` chỉ có:** `body | body-sm | body-xs | code | h1 | h2 | h3 | h4 | h5 | h6`.
  KHÔNG tồn tại `body-lg/body-md/body-base/caption/button/label`. `color` chỉ `default|muted`; `weight` =
  `normal|medium|semibold|bold`. Map text class: `text-3xl/2xl bold`→`h3`(H1 trang→`h2`) · `text-xl bold`→`h4` ·
  `text-lg semibold`→`h5` · `text-base semibold` (nhãn mục con trong card)→**`Label`** · `text-sm`→`body-sm` ·
  `text-xs/text-[10px]`→`body-xs` · `font-mono`→`type="code"`. Màu nhấn (accent/success/warning/danger) = giữ
  `className="text-{token}"` trên Typography (ngoại lệ màu duy nhất ở feature).
- **Sidebar nav ROW = HeroUI `Link` (text-có-action → Link), KHÔNG per-row `ListBox`** (thầy CHỐT/SỬA 2026-06-18,
  override `SidebarNavItem`). Lý do gốc: 1-item `ListBox` kéo theo hover/focus/**selected grey chrome** riêng của
  HeroUI → đá nhau với highlight active mong muốn. Active = CHỈ `bg-accent/10 text-accent`; hover = tint nhạt;
  focus = ring; KHÔNG fill nào khác. (Guidance "sidebar = ListBox" chỉ đúng cho list CHỌN nhiều mục thật, KHÔNG
  cho hàng nav.) Vùng cuộn nav vẫn `ScrollShadow` (giữ).
  - **Collapsed rail = state qua context** `CollapsibleSidebar/context` (`useSidebarCollapsed`): row tự đọc →
    collapsed thì icon-only (`justify-center gap-0`, bỏ label, `aria-label` giữ a11y). Block tự quản, feature chỉ ghép.

## Gotcha rule nội tại (chờ thầy phân xử)
- **§9 vs §14 mâu thuẫn `gap-1`:** §9 chốt thang `0/2/3/4/6` (suy ra cấm `gap-1`), nhưng §14 lại nêu ví dụ
  cụm meta `·` dùng `flex items-center gap-1`. PublicProfile còn ~11 chỗ `gap-1` (đa số là cụm meta/caret-link).
  Chưa churn — chờ thầy chốt: meta cluster được `gap-1` hay ép `gap-2`.
