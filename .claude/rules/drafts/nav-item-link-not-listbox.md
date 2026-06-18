# Draft: nav/menu item = pressable Link, KHÔNG 1-item-ListBox

**File-§ đích:** `main.md` (mindset nav/state) hoặc `starci-dropdown.md`/element nav — chọn khi `/merge`.

**Bài học (2026-06-17):** sidebar Cài đặt dựng mỗi dòng nav = **1 `ListBox selectionMode="single"` bọc đúng 1
`ListBox.Item`**. HeroUI `ListBox.Item` tự mang **hover/focus/selected state (nền xám `bg-default`)** → 1 item bị
focus/hover (vd "Gói AI") hiện nền xám đua với highlight active (accent). Nhóm khác trông sạch chỉ vì không item
nào focus → ngụy nhất quán. Thầy bắt audit "nhóm xanh lá dựa nhóm xanh dương".

**Luật mới:**
- **Item điều hướng (nav/menu/sidebar row) = HeroUI `Link`** (`onPress` cho client-route, hoặc `href`) — đúng rule
  "text có action = Link". **KHÔNG** dùng `ListBox`/`ListBox.Item` cho 1 dòng đơn, **KHÔNG** mỗi-dòng-1-ListBox.
  (Cần listbox thật cho 1 danh sách chọn → 1 `ListBox` bọc TẤT CẢ item + `Section`, KHÔNG xé lẻ mỗi dòng 1 listbox.)
- **CHỈ 1 trạng thái được TÔ NỀN = `isActive`** (`bg-accent/10 text-accent`). Hover = tint mờ (`hover:bg-default/40`);
  **focus = ring** (`focus-visible:outline`), KHÔNG fill. Đừng để component primitive (ListBox/Select) tự thêm
  nền selected/focus đè lên active chủ đích.
- **Nguyên nhân gốc:** chọn sai primitive kéo theo "chrome" trạng thái riêng của nó → nhiều highlight đua nhau.
  Một dòng nav chỉ là link đổi route → Link là đúng bản chất + nhẹ + a11y (role=link, ring).

**Phụ (group fragmentation):** group nav **1-item** mà vẫn lĩnh `divider` riêng = vụn. Gộp các item lẻ vào 1 group
trailing (vd bookmarks + membership) thay vì mỗi cái 1 group + 1 đường kẻ.

**Đã áp:** `blocks/navigation/SidebarNavItem` (ListBox→Link, chỉ active tô) + `Settings/nav.tsx` (gộp
content+membership). Block `SidebarNavItem` chỉ settings-nav dùng nên đổi an toàn.
