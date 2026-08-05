import type { CSSProperties, ReactNode } from "react"
import { cn } from "@heroui/react"
import { principlesAttr, type PrincipleToken } from "@sb-components/frames/_principles"

/**
 * ESCAPE HATCH -- the only frame allowed to take raw `className` and `children`.
 *
 * Use this solely as a foreign mount: a third-party surface (Mermaid, PDF, syntax
 * highlighter) or vendor skin that no named frame can carry. `className` is the
 * open appearance/mount string the rest of the tier forbids. `children` is the
 * foreign tree or empty mount point that library owns.
 *
 * Do not copy this exception onto any other frame. Ordinary house regions belong
 * on named buildable slots (`body` / `items`), not here. Blocks and pages should
 * not reach for `Box`; they compose frames and atoms. A raw skin box in a block
 * is a sign it should be an atom or composite instead.
 *
 * Spacing remains measurable: pass one `principles` token so the rendered-tree
 * test can still assert the seam.
 */
export interface BoxProps {
    /** Layout/seam token this element embodies -> emitted as `data-principles`. */
    principles?: PrincipleToken
    /**
     * Caller-supplied part name for the Storybook anatomy overlay. Emitted as
     * `data-anat-part`. The frame never names itself.
     */
    anatPart?: string
    /**
     * ESCAPE HATCH: raw appearance or foreign-mount classes. Forbidden on every
     * other frame. Do not treat this as a general styling door.
     */
    className?: string
    /** The HTML element to render. */
    as?: "div" | "span" | "section" | "figure" | "article" | "aside" | "header" | "footer" | "code"
    /** Inline style -- for a value that cannot be a class (a computed pixel size). */
    style?: CSSProperties
    /** Native `aria-hidden`, forwarded straight to the rendered tag. */
    "aria-hidden"?: boolean
    /**
     * ESCAPE HATCH: foreign content or an empty mount point. Not a house
     * composition slot. Do not copy `children` onto any other frame.
     */
    children?: ReactNode
}

/** Source-level tier metadata. */
export const meta = { tier: "frame", name: "Box" } as const

/**
 * Escape-hatch frame: one element with raw `className` plus measurable `principles`.
 * Use only where a named frame cannot carry appearance or a third-party mount point.
 */
export const Box = ({
    principles,
    anatPart,
    className,
    as: Tag = "div",
    style,
    "aria-hidden": ariaHidden,
    children,
}: BoxProps) => (
    <Tag
        data-tier="frame"
        data-component="Box"
        data-anat-part={anatPart}
        data-principles={principlesAttr(principles)}
        className={cn(className)}
        style={style}
        aria-hidden={ariaHidden}
    >
        {children}
    </Tag>
)
