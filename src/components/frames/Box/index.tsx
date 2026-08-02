import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { principlesAttr, type PrincipleToken } from "@/components/frames/_principles"

/**
 * `Box` — the ESCAPE-HATCH primitive: a single element that takes raw `className`
 * (appearance the frames deliberately can't carry — `border`/`bg`/`rounded`/`shadow`,
 * a 3rd-party mount point like Mermaid/PDF/code-highlight) AND declares its spacing
 * via `principles` so the node is still measurable by the rendered-tree test.
 *
 * Use ONLY where a real frame can't reach: a composite wrapping a foreign library, or
 * a skin surface. Blocks/pages should NOT reach for `Box` — they compose frames +
 * atoms (`Divider` for a rule, `SurfaceCard` for a skin surface); a raw skin box in a
 * block is the sign it should be an atom/composite instead.
 */
export interface BoxProps {
    /** Layout/seam tokens this element embodies → emitted as `data-principles`. */
    principles?: Array<PrincipleToken>
    /** Raw appearance/mount classes — the reason `Box` exists over a frame. */
    className?: string
    /** The HTML element to render. */
    as?: "div" | "span" | "section" | "figure" | "article" | "aside" | "header" | "footer"
    children?: ReactNode
}

/** Source-level tier metadata. */
export const meta = { tier: "frame", name: "Box" } as const

export const Box = ({ principles, className, as: Tag = "div", children }: BoxProps) => (
    <Tag data-tier="frame" data-component="Box" data-principles={principlesAttr(principles)} className={cn(className)}>
        {children}
    </Tag>
)
