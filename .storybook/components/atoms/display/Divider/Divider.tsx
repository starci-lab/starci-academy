import type { ReactNode } from "react"
import { Separator as HeroSeparator, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Divider.Base`: the ONE constrained divider atom over HeroUI Separator.
 *
 * Đường phân cách, phân biệt bằng PROP (leaf = composition):
 *   • ngang                → `<Divider.Base />` (mặc định)
 *   • dọc                   → `<Divider.Base orientation="vertical" />` (cần cha có cao)
 *   • có nhãn giữa          → `<Divider.Base label="HOẶC" />` (rule | nhãn | rule)
 *
 * HeroUI KHÔNG có `Divider` — atom bọc `Separator` (đổi tên cho ngữ vựng app). Nhãn
 * chỉ hợp lệ khi `orientation="horizontal"` (bỏ qua với vertical). Atom KHÔNG có
 * skeleton (đường kẻ tĩnh, không tải).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Divider orientation. */
export type DividerOrientation = "horizontal" | "vertical"

/** Line weight/tone (HeroUI Separator `variant`). */
export type DividerVariant = "default" | "secondary" | "tertiary"

/** Props for {@link DividerBase}. */
export interface DividerBaseProps {
    /** Orientation. Default `horizontal`. */
    orientation?: DividerOrientation
    /** Line tone. Default `default`. */
    variant?: DividerVariant
    /** Optional centered label (horizontal only) → rule · label · rule. */
    label?: ReactNode
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/**
 * The base divider atom. See file header for the orientation + label contract.
 *
 * @param props - {@link DividerBaseProps}
 */
const DividerBase = ({ orientation = "horizontal", variant = "default", label, showAnatomy = false, className }: DividerBaseProps) => {
    // A labelled divider (horizontal only): a rule on each side of centered text.
    if (label !== undefined && orientation === "horizontal") {
        return (
            <div className={cn("flex w-full items-center gap-3", className)}>
                <HeroSeparator orientation="horizontal" variant={variant} className="flex-1" data-anat-part={showAnatomy ? "Line" : undefined} />
                <span className="text-muted shrink-0 text-xs" data-anat-part={showAnatomy ? "Label" : undefined}>
                    {label}
                </span>
                <HeroSeparator orientation="horizontal" variant={variant} className="flex-1" data-anat-part={showAnatomy ? "Line" : undefined} />
            </div>
        )
    }
    return <HeroSeparator orientation={orientation} variant={variant} className={cn(className)} data-anat-part={showAnatomy ? "Line" : undefined} />
}

/**
 * `Divider.*` — the divider ATOM namespace. `Divider.Base` is the single
 * constrained divider; orientation / label are LEAVES of it (prop-driven).
 */
export const Divider = {
    Base: DividerBase,
}
