# StarCi Popover Convention

Cách dựng **Popover / PopoverContent** (chuông thông báo, menu nổi, panel nhỏ…).
Đi kèm `starci-ui.rules` (§5 Dropdown/Menu/Popover). STRICT.

## Khung chuẩn
```tsx
<Popover isOpen={isOpen} onOpenChange={setOpen}>
  <Button isIconOnly variant="tertiary" aria-label={...}>{/* trigger icon */}</Button>
  <PopoverContent placement="bottom right" className="w-[360px]">
    {/* INSET chuẩn của popover: px-2 py-1 (đây là padding DUY NHẤT được phép ở feature
        cho popover — coi như convention, không tính là vi phạm "no style") */}
    <div className="px-2 py-1">
      {/* HEADER: tiêu đề = <Header>; action phụ (vd mark-all) căn phải bằng flex */}
      <div className="flex items-center justify-between gap-3">
        <Header>{t("...title")}</Header>
        {/* optional icon action */}
      </div>

      {/* BODY: 3 nhánh state, dùng BLOCK — KHÔNG <button>/<span> style tay */}
      {isLoading ? (
        /* skeleton khớp layout (vài dòng Skeleton) */
      ) : empty ? (
        <EmptyState icon={...} title={t("...empty")} />
      ) : (
        <div className="flex max-h-[420px] flex-col overflow-y-auto">
          {items.map((it, i) => (
            <ListRow ... onPress={...} divider={i < items.length - 1} />
          ))}
        </div>
      )}
    </div>
  </PopoverContent>
</Popover>
```

## Luật
- **Inset = `px-2 py-1`** trên div bọc trong `PopoverContent` (convention popover; padding khác
  vẫn cấm ở feature).
- **Tiêu đề popover = `Header`** component (KHÔNG `<div>/<span>/Typography` thường).
- **Action ở header** (mark-all, settings…) = icon `Button variant="ghost" size="sm"` + `aria-label`,
  căn phải bằng `flex items-center justify-between`.
- **Nội dung = BLOCK**: list → `ListRow` (hoặc `FeedItem`), rỗng → `EmptyState`, loading →
  `Skeleton` khớp layout. CẤM `<button>`/`<span>` style tay trong feature.
- **Item interactive** = `ListRow onPress` (đã a11y: role/tabindex/keyboard). Unread/nhấn mạnh
  = icon `CircleIcon weight="fill" text-accent` ở `leading` (KHÔNG `bg-*`/`rounded-*` ở feature).
- **Width = `w-[...]`** (placement); cuộn = `max-h-[...] overflow-y-auto`.
- `placement="bottom right"` cho popover neo từ icon góc phải navbar.

## Tham chiếu
- Mẫu chuẩn: `features/navbar/Navbar/NotificationBell/index.tsx`.
- **Dropdown (menu chọn) ≠ Popover** → xem riêng `starci-dropdown.md` (+ `starci-ui.rules` §5).
