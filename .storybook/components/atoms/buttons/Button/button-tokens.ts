import type { ComponentType, SVGProps } from "react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TOKEN dùng chung của họ `Button` — KHÔNG phải component.
 *
 * Tách ra file riêng để `ButtonIcon` không phải import từ `ButtonBase` chỉ để lấy
 * mấy cái bảng: hai nút là hai component NGANG HÀNG, không cái nào dựng cái nào.
 * File này không export component nào nên nó KHÔNG xuất hiện trong deps tree.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Semantic action intent → maps straight to the HeroUI fork's `variant`. */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "danger-soft"

/**
 * HeroUI KHÔNG có variant `danger-soft` — chỉ có `danger` đặc. Bản mềm phải mượn một
 * variant trung tính của HeroUI rồi đắp token `danger-soft` lên. Tách hai bảng để khi
 * HeroUI có variant thật thì chỉ xoá đúng một dòng mỗi bảng.
 *
 * Dùng cho hành động phá huỷ ở ngữ cảnh NHẸ (xoá một dòng trong danh sách) — `danger`
 * đặc dành cho nút chốt của hộp thoại xác nhận.
 */
type HeroVariant = "primary" | "secondary" | "ghost" | "danger"

export const HERO_VARIANT: Record<ButtonVariant, HeroVariant> = {
    primary: "primary",
    secondary: "secondary",
    ghost: "ghost",
    danger: "danger",
    "danger-soft": "secondary",
}

/** Class đắp thêm cho variant HeroUI không có sẵn. Rỗng = dùng nguyên variant HeroUI. */
export const VARIANT_CLS: Partial<Record<ButtonVariant, string>> = {
    "danger-soft": "bg-danger-soft text-danger-soft-foreground hover:bg-danger-soft/70",
}

/** Scale bậc thang → map THẲNG xuống HeroUI `size` (`md` = default). */
export type ButtonSize = "sm" | "md" | "lg"

/**
 * Nét icon Phosphor mà ATOM tự ép (§5.0a) — khai TẠI CHỖ, KHÔNG import kiểu `Icon`
 * của thư viện: khai chặt theo lib là khoá cả cây vào một nhà cung cấp.
 */
type IconWeight = "regular" | "bold"

/**
 * An icon passed as a COMPONENT (e.g. `PlusIcon`), rendered by the atom at button
 * scale. Prop `weight` để OPTIONAL vì atom tự truyền (§5.0a); component icon nào
 * không hiểu `weight` vẫn nhận được.
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: IconWeight }>

/**
 * ICON SCALE = FONT SCALE (luật atom-layer: size icon = size chữ — thầy chốt
 * 2026-07-25). `sm`/`md` chữ `text-sm` (14px) → `size-3.5`; `lg` chữ `text-base`
 * (16px) → `size-4`. Áp CHUNG cho cả glyph-duy-nhất (`Button.Icon`) — một luật
 * duy nhất, không có thang riêng theo box.
 *
 * ⚠️ `!` là BẮT BUỘC: HeroUI có rule `.button svg:not(…) { size-5 sm:size-4 }`
 * specificity (0,2,2) — cao hơn class Tailwind thường (0,1,1) nên không ép thì
 * icon rơi về thang HeroUI. Đặt trên SPAN bọc icon (không phải trên button) để
 * KHÔNG đụng `<Spinner>`.
 */
export const ICON_CLS: Record<ButtonSize, string> = {
    sm: "[&_svg]:!size-3.5",
    md: "[&_svg]:!size-3.5",
    lg: "[&_svg]:!size-4",
}

/**
 * WEIGHT THEO SIZE (§5.0a — thầy chốt 2026-07-26): nét Phosphor co theo cỡ, nên
 * icon NHỎ HƠN `size-5` phải `bold` mới nhìn dày BẰNG icon `size-5` regular
 * (regular 16 đơn vị vs bold 24 trên lưới 256). Cả 3 size của nút đều dưới
 * `size-5` (xem {@link ICON_CLS}) → `bold` hết; vẫn giữ map theo size để bậc nào
 * lên `size-5` thì đổi về `regular` tại đúng một chỗ.
 */
export const ICON_WEIGHT: Record<ButtonSize, IconWeight> = {
    sm: "bold",
    md: "bold",
    lg: "bold",
}

/** Skeleton box theo size — mirror đúng chiều cao nút (mobile → `@app-md` desktop). */
export const SKELETON_H: Record<ButtonSize, string> = {
    sm: "h-9 @app-md:h-8",
    md: "h-10 @app-md:h-9",
    lg: "h-11 @app-md:h-10",
}

/**
 * Bề NGANG skeleton cũng phải theo `size` — nút lớn thì padding ngang lớn hơn nên pill
 * dài hơn. Sửa 2026-07-26: trước đó dùng `w-24` CỨNG cho cả ba bậc, chỉ khác chiều cao
 * 4px ⇒ ba skeleton nhìn y hệt nhau, và footprint sai so với nút thật (layout nhảy khi
 * dữ liệu về). Bản legacy vốn có bảng này, bản live làm rơi mất.
 */
export const SKELETON_W: Record<ButtonSize, string> = {
    sm: "w-20",
    md: "w-24",
    lg: "w-28",
}

/** Skeleton VUÔNG cho nút chỉ-icon (khớp cả bề ngang iconOnly). */
export const SKELETON_SQUARE: Record<ButtonSize, string> = {
    sm: "size-9 @app-md:size-8",
    md: "size-10 @app-md:size-9",
    lg: "size-11 @app-md:size-10",
}
