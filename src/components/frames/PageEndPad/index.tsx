import { cn } from "@heroui/react"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { principleAttr, explainAttr, type PrincipleToken, type ExplainReason } from "@/components/frames/_principles"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

/**
 * FRAME — `PageEndPad`: trailing page-end breathing (`pb-6`) under a flush
 * cluster. The padding scale refuses single-edge pads (padding.md — fix is
 * usually gap), but a zero-gap reading∥footer∥ad track cannot take a sibling
 * seam without inventing space between reading and footer. This frame names
 * that trailing-only air so ContentPage never reaches for `Box className`.
 */

/** Props for {@link PageEndPad}. */
export interface PageEndPadProps {
    /** Content that needs trailing page-end air beneath it. */
    body: ComponentTypeWithSkeleton
    /** Renders `body` in its skeleton state. */
    isSkeleton?: boolean
    /** Seam token when the wrap itself is measured. */
    principle?: PrincipleToken
    /** Why this layer exists — beside `principle`. */
    explain?: ExplainReason
    /** Caller identity when a page/block uses this frame as its root. */
    identity?: CallerIdentity
}

/**
 * Trailing page-end pad. See the file header.
 *
 * @param props - {@link PageEndPadProps}
 */
const PageEndPad = ({
    body: Body,
    isSkeleton,
    
    principle,
    explain,
    identity,
}: PageEndPadProps) => (
    <div
        {...resolveIdentity(identity, { tier: "frame", name: "PageEndPad" })}
        data-principle={principleAttr(principle)}
        data-explain={explainAttr(explain)}
        className={cn("pb-6")}
    >
        <Body isSkeleton={isSkeleton} />
    </div>
)

export { PageEndPad }

/** Source-level tier marker. */
export const meta = { tier: "frame", name: "PageEndPad" } as const
