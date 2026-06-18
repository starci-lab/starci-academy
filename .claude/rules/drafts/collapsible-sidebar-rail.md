# CollapsibleSidebar: rail icon-only + group = Separator full (không label)  (2026-06-17)

- File/§ đích: `starci-*.md` (sidebar/navigation) hoặc `main.md` §6.
- Bài học: thầy chốt cho sidebar Cài đặt — bỏ label nhóm, ngăn nhóm bằng separator full, collapse giữ icon.
- Luật mới (block `CollapsibleSidebar` family):
  - **Collapse = rail ICON-ONLY** (luôn render nav, KHÔNG unmount): item bỏ label, giữ icon căn giữa,
    `aria-label` giữ a11y. Trạng thái collapse chia sẻ xuống row qua **React context block-family**
    (`CollapsibleSidebar/context` → `useSidebarCollapsed`) — chrome nội bộ, KHÔNG phải store (vẫn hợp rule).
  - **Nhóm ngăn bằng `Separator` FULL-WIDTH** (`SidebarNavGroup divider`), KHÔNG dùng label nhóm
    (uppercase caption) làm dải phân cách. Label nhóm = optional, ẩn khi collapse.
  - Rail width đủ chứa icon căn giữa (≥4rem), padding co lại khi collapse (`pr-2` vs `pr-6`).
  - **Item collapse = `p-0!`** (override padding recipe HeroUI `list-box-item` để icon căn giữa khít —
    recipe cùng specificity nên cần important; Tailwind v4 = hậu tố `!`).
  - Vẫn: co/giãn TẠI CHỖ bằng framer (KHÔNG Drawer), tôn trọng `useReducedMotion`, persist localStorage.
