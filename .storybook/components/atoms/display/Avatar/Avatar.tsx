import { AvatarBase } from "./AvatarBase"
import { AvatarGroup } from "./AvatarGroup"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Avatar.*`: namespace của họ avatar. File này CHỈ gom, không có logic.
 *
 * Mỗi member một FILE riêng (tách 2026-07-26, gộp `UserAvatar` — xem header của
 * `AvatarBase.tsx`) để quan hệ giữa chúng là `import` THẬT, đọc được:
 *   • `Avatar.Base`  → ./AvatarBase   — avatar DUY NHẤT; chuỗi fallback ảnh →
 *     ảnh sinh (DiceBear) → initials → icon, status-dot, leaf skeleton.
 *   • `Avatar.Group` → ./AvatarGroup  — HÀNG avatar chồng mép; **import
 *     AvatarBase** ⇒ component duy nhất trong họ có deps.
 *
 * ⚠️ `UserAvatar` (block `identity/UserAvatar`) ĐÃ XOÁ (2026-07-26): năng lực
 * DiceBear + xử lý ảnh lỗi của nó chuyển hết vào `Avatar.Base` (mặc định
 * `fallback="generated"`) — không còn hai atom làm cùng một việc.
 *
 * Call-site bên ngoài KHÔNG đổi đường import: vẫn `.../Avatar/Avatar`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const Avatar = Object.assign(AvatarBase, {
    Base: AvatarBase,
    Group: AvatarGroup,
})

export type { AvatarBaseProps, AvatarFallback, AvatarColor, AvatarSize, AvatarStatus, IconComponent, IconWeight } from "./AvatarBase"
export type { AvatarGroupItem, AvatarGroupProps } from "./AvatarGroup"
