import { ButtonBase } from "./ButtonBase"
import { ButtonGroup } from "./ButtonGroup"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Button.*`: namespace của họ trigger. File này CHỈ gom, không có logic.
 *
 * Mỗi member một FILE riêng (tách 2026-07-26) để quan hệ giữa chúng là `import`
 * THẬT, đọc được:
 *   • `Button.Base`  → ./ButtonBase   — nút DUY NHẤT; `isIconOnly` cho nút chỉ-icon.
 *   • `Button.Group` → ./ButtonGroup  — HÀNG nút; **import ButtonBase** ⇒ component
 *     duy nhất trong họ có deps.
 *   • `./button-tokens` — bảng dùng chung (không phải component, không vào deps tree).
 *
 * ⚠️ `Button.Icon` ĐÃ XOÁ (2026-07-26): nút chỉ-icon không phải hình thái khác, nó là
 * cùng cái nút bỏ nhãn đi ⇒ `<Button.Base isIconOnly prefixIcon={X} ariaLabel="…" />`.
 * Nuôi hai component song song nghĩa là mọi luật phải sửa hai chỗ.
 *
 * Call-site bên ngoài KHÔNG đổi đường import: vẫn `.../Button/Button`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const Button = Object.assign(ButtonBase, {
    Base: ButtonBase,
    Group: ButtonGroup,
})

export type { ButtonBaseProps } from "./ButtonBase"
export type { ButtonGroupItem, ButtonGroupProps } from "./ButtonGroup"
export type { ButtonSize, ButtonVariant, IconComponent } from "./button-tokens"
