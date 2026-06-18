# StarCi Navigation & Shell Rules (sidebar · settings shell · nav rows)

Cách dựng sidebar nav, settings shell (sidebar + content), nav row, breadcrumb/back. Đi kèm `main.md`. STRICT.
**Panel co/giãn (sidebar collapse, accordion) = animate TẠI CHỖ bằng framer-motion, KHÔNG Drawer** (Drawer chỉ cho
overlay tách ngữ cảnh che nội dung); nội dung xung quanh reflow, áp mọi breakpoint, tôn trọng `useReducedMotion`.

## 1. Nav row = `Link`, KHÔNG 1-item `ListBox`
- **Mỗi dòng nav/menu/sidebar = HeroUI `Link`** (`onPress` cho client-route / `href`) — đúng rule "text-có-action = Link".
  **CẤM** bọc mỗi dòng trong `ListBox selectionMode="single"` + 1 `ListBox.Item`.
- **Nguyên nhân gốc:** `ListBox.Item` tự mang hover/focus/**selected grey chrome** (`bg-default`) của HeroUI → 1 item
  bị focus/hover hiện nền xám **đua** với highlight active (accent) → "ngụy nhất quán" (nhóm sạch chỉ vì chưa focus).
  Chọn sai primitive = kéo theo chrome trạng thái riêng của nó.
- **CHỈ 1 trạng thái được TÔ NỀN = `isActive`** (`bg-accent/10 text-accent`). Hover = tint mờ (`hover:bg-default/40`);
  focus = **ring** (`focus-visible:outline`), KHÔNG fill. Đừng để primitive (ListBox/Select) tự thêm nền selected/focus.
- `ListBox` thật chỉ cho **1 danh sách CHỌN nhiều mục** → 1 `ListBox` bọc TẤT CẢ item (+`Section`), KHÔNG xé lẻ mỗi-dòng-1-listbox.
- Block: `blocks/navigation/SidebarNavItem` (Link, chỉ active tô).

## 2. Collapsible sidebar = rail icon-only (block `CollapsibleSidebar`)
- **Collapse = rail ICON-ONLY** (LUÔN render nav, KHÔNG unmount): item bỏ label, giữ icon căn giữa, `aria-label`
  giữ a11y. Item collapse = `p-0!` (override padding recipe HeroUI `list-box-item` để icon căn khít — cùng
  specificity nên cần `!`, Tailwind v4 hậu tố `!`).
- **State collapse chia sẻ xuống row qua React context block-family** (`CollapsibleSidebar/context` →
  `useSidebarCollapsed`) — chrome nội bộ block, KHÔNG phải store (vẫn hợp rule). Row tự đọc → collapsed thì
  `justify-center gap-0`, bỏ label.
- **Nhóm ngăn bằng `Separator` FULL-WIDTH** (`SidebarNavGroup divider`), KHÔNG dùng label nhóm (uppercase caption)
  làm dải phân cách. Label nhóm = optional, ẩn khi collapse.
- **Group 1-item KHÔNG lĩnh divider riêng** (vụn) → gộp các item lẻ vào 1 group trailing (vd bookmarks + membership).
- Rail width đủ icon căn giữa (≥4rem); padding co khi collapse (`pr-2` vs `pr-6`).
- Co/giãn TẠI CHỖ bằng **framer** (KHÔNG Drawer), tôn trọng `useReducedMotion`, persist localStorage.

## 3. Shell "sidebar + content" = MỘT scroll context + sidebar STICKY
- **1 trang = 1 scroll context = body/page.** App-shell (`InnerLayout`) đã cho body tự scroll → **CẤM** dựng
  vùng khoá-viewport (`h-[calc(100dvh-…)] overflow-hidden`) + pane `overflow-y-auto` lồng trong. 2 scroll container
  lồng nhau = overscroll-chain / jitter (đặc biệt trackpad), body dư cao = scrollbar thừa.
- **Sidebar = `position: sticky`, KHÔNG own-scroll cả vùng:** `shrink-0 md:sticky md:top-16 md:h-[calc(100dvh-4rem)]`
  (dính dưới navbar 4rem). Content `flex-1` **trôi trong page scroll** (KHÔNG `overflow` riêng). Nav DÀI hơn viewport
  → cho cuộn NỘI BỘ riêng phần nav bằng `ScrollShadow`, KHÔNG khóa cả trang. (GitHub/Linear settings pattern.)
- Nguyên tắc gốc: chỉ tạo scroll container riêng khi THỰC SỰ cần pane độc lập; mặc định body cuộn + sticky cái cần ghim.

## 4. KHÔNG per-page back arrow khi đã có sidebar + breadcrumb
- Trang trong layout **CÓ sidebar (nav) + breadcrumb (escape) → KHÔNG thêm dấu back ← per-page.** Header = chỉ
  title + subtitle (`Typography`). Một escape rõ hơn 2 thứ trùng (back `về Hồ sơ` ≡ link "Hồ sơ" của breadcrumb).
- Back per-page chỉ hợp flow tuyến tính KHÔNG sidebar (hoặc mobile khi sidebar ẩn). Nếu thật cần: `onBack` đi tới
  **PARENT CỐ ĐỊNH** (KHÔNG `router.back()` vô định) + `aria-label` rõ; và bỏ breadcrumb cho khỏi trùng.
- `reuseable/SubPageHeader` = LEGACY hỏng rule (`@gravity-ui`, `<div>+text-class`, `gap-1.5`) → thay block sạch khi đụng, cuối cùng xoá.

## Tham chiếu
- Blocks: `blocks/navigation/{SidebarNavItem,CollapsibleSidebar}`. Mẫu shell: `features/profile/Settings` + `SettingsLayout`.
