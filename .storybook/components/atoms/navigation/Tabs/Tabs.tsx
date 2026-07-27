import { TabsBase } from "./TabsBase"
import { TabsExtended } from "./TabsExtended"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Tabs.*`: namespace của họ tab-strip. File này CHỈ gom, không có logic.
 *
 * Gộp 2026-07-26 (thầy chốt): `ExtendedTabs` (namespace rời, đi bằng `children`)
 * nhập vào đây làm `TabsExtended` — cả hai member cùng bọc HeroUI `Tabs`, tách
 * hai namespace là giả, chỉ khác API dữ liệu (`items` vs `children`, xem header
 * `TabsExtended.tsx` — nợ §12b CHƯA gộp API ở lượt này).
 *
 * Mỗi member một FILE riêng (khuôn `Button/ButtonBase.tsx` + `ButtonGroup.tsx`):
 *   • `Tabs`     → ./TabsBase     — data-driven, `items` (§12b sạch).
 *   • `TabsExtended` → ./TabsExtended — `children` thô (§12b nợ, xem header đó).
 *
 * Call-site bên ngoài dùng `Tabs` giữ nguyên đường import cũ
 * (`.../Tabs/Tabs`). `ExtendedTabs` (thư mục riêng) đã XOÁ — xem báo cáo cho
 * danh sách file ngoài `.storybook` còn import `ExtendedTabs` (chưa sửa, ngoài
 * phạm vi lượt này).
 * ─────────────────────────────────────────────────────────────────────────────
 */
export { TabsBase as Tabs, TabsExtended }

export type { IconComponent, TabItem, TabsBaseProps } from "./TabsBase"
export type { TabsExtendedProps } from "./TabsExtended"
