# StarCi Dropdown Convention

Cách dựng **Dropdown** (menu chọn: account menu, language, action menu…). HeroUI v3, COMPOUND.
Khác `starci-popover.md` (popover = panel nội dung tự do). Đi kèm `starci-ui.rules` §5. STRICT.

## Anatomy (v3 — KHÔNG flat `DropdownPopover/DropdownItem`)
```tsx
<Dropdown isOpen={isOpen} onOpenChange={setOpen}>
  <Button isIconOnly …/>            {/* trigger = Button ĐẶT TRỰC TIẾP làm con đầu của Dropdown */}
  <Dropdown.Popover placement="bottom right" className="w-[300px]">
    <Dropdown.Menu selectionMode? selectedKeys? onSelectionChange?>
      <Dropdown.Section>
        <Header>Tiêu đề nhóm</Header>            {/* tiêu đề = Header, KHÔNG <div>/<span> */}
        <Dropdown.Item id="x" textValue="…" onPress={…}>
          <SomeIcon className="size-5" />        {/* phosphor *Icon */}
          <Dropdown.ItemIndicator />             {/* check khi selectionMode=single */}
          <Label>Nhãn</Label>                    {/* text item = Label, KHÔNG <span> */}
          <Kbd slot="keyboard">⌘K</Kbd>          {/* optional shortcut */}
        </Dropdown.Item>
      </Dropdown.Section>
      <Separator />                              {/* chia nhóm */}
      <Dropdown.SubmenuTrigger>…</Dropdown.SubmenuTrigger>  {/* optional */}
    </Dropdown.Menu>
  </Dropdown.Popover>
</Dropdown>
```
- ⚠️ **KHÔNG bọc `Dropdown.Trigger`** quanh `Button` — ở HeroUI v3 này `Dropdown.Trigger` TỰ render 1
  `<button>`, lồng với `<button>` của `Button` → **hydration error "button cannot be descendant of button"**.
  Đặt `Button` (hoặc component trigger self-contained như `AccountTrigger`) làm **con đầu trực tiếp** của `Dropdown`.
- Single-select: `Dropdown.Menu selectionMode="single" selectedKeys={new Set([x])} onSelectionChange`.
  Check = `Dropdown.ItemIndicator` (TỰ theo selection — KHÔNG tự gắn ✓). Vd `LanguageDropdown`.

## Dropdown có HEADER TĨNH (account menu…)
Dropdown có **2 vùng**:
1. **Static header content** (avatar/summary — KHÔNG chọn được) → **div NGUYÊN ở trên cùng,
   inset `p-3`** (convention; KHÔNG bọc trong `Dropdown.Item`).
2. **Nội dung chọn được** → `Dropdown.Menu` > `Dropdown.Item`.
Ngăn 2 vùng bằng `Separator`.

## Vùng async (auth/data) → mỗi vùng bọc `AsyncContent`
- Header + Menu phụ thuộc state → **mỗi vùng 1 `AsyncContent`** (skeleton header = `Skeleton.UserCell`;
  skeleton menu = `Skeleton.Menu items={n}` = icon vuông + 1 dòng text/hàng, KHỚP item thật. KHÔNG dùng
  `Skeleton.ListBox` cho menu — nó là thanh full-width, phô và sai layout). Loading = **cờ SWR THẬT** (`isLoading && !data`), KHÔNG
  dùng `keycloak.initialized` — cờ này không bao giờ được set → skeleton kẹt mãi; và phải tự RESOLVE
  khi fail (SWR fail → `isLoading=false` → rớt về guest, không kẹt loading).
- Swap nội dung theo điều kiện: `{authenticated ? <UserSummary/> : <GuestHeader/>}` (header) và
  `{authenticated ? <AccountMenuAuthed/> : <AccountMenuGuest/>}` (menu).

## Cấu trúc & item
- Mỗi nhánh menu = **sub-component self-contained** (`AccountMenuAuthed`/`AccountMenuGuest`) nested trong
  cha, tự đọc store/điều hướng/mutation (KHÔNG nhận data props).
- Item **phá hủy** (đăng xuất…) = `Dropdown.Section` riêng + `className="text-danger"` (ngoại lệ màu §2).
- `text item = Label` · `tiêu đề nhóm = Header` · `icon = phosphor *Icon size-5` · `onPress` (không onClick).

## Tham chiếu
- Mẫu: `features/navbar/Navbar/AccountMenuDropdown/` (header tĩnh + menu auth/guest + skeleton 2 vùng) ·
  `features/navbar/Navbar/LanguageDropdown/` (single-select + ItemIndicator).
