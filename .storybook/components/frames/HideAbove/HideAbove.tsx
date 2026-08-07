import { cn } from "@heroui/react"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { principleAttr, explainAttr, type PrincipleToken, type ExplainReason } from "@sb-components/frames/_principles"
import { resolveIdentity, type CallerIdentity } from "@sb-components/frames/_identity"

/**
 * FRAME — `HideAbove`: hides its body once the nearest `@container` reaches a
 * named step. Owns the `@app-*:hidden` visibility switch so callers never write
 * that class (FRAME-10: name the width as a prop).
 *
 * Earned by ContentPage's mobile/tablet practice nudge and LeaderboardPage's
 * category chip row — both need "show below `lg`, hide from `lg` up" without a
 * second component tree. Same step set as `ResponsiveRow.at` / `ResponsiveCluster`.
 */

/** Container step the body hides from upward — same union as `ResponsiveRow.at`. */
export type HideAboveAt = "sm" | "md" | "lg" | "xl"

/** {@link HideAboveAt} → hide-from-this-step-up class. */
const HIDE_ABOVE_CLASS: Record<HideAboveAt, string> = {
    sm: "@app-sm:hidden",
    md: "@app-md:hidden",
    lg: "@app-lg:hidden",
    xl: "@app-xl:hidden",
}

/** Props for {@link HideAbove}. */
export interface HideAboveProps {
    /** Content shown while the container is below `at`. */
    body: ComponentTypeWithSkeleton
    /** Container step at which the body becomes `hidden`. */
    at: HideAboveAt
    /** Renders `body` in its skeleton state. */
    isSkeleton?: boolean
    /** Seam token on this root, when the wrap itself is a measured principle. */
    principle?: PrincipleToken
    /** Why this layer exists — beside `principle`, never a restatement of it. */
    explain?: ExplainReason
    /** Caller identity when a page/block uses this frame as its root. */
    identity?: CallerIdentity
}

/**
 * Hides `body` from a named container step upward. See the file header.
 *
 * @param props - {@link HideAboveProps}
 */
const HideAbove = ({
    body: Body,
    at,
    isSkeleton,
    
    principle,
    explain,
    identity,
}: HideAboveProps) => (
    <div
        {...resolveIdentity(identity, { tier: "frame", name: "HideAbove" })}
        data-principle={principleAttr(principle)}
        data-explain={explainAttr(explain)}
        className={cn(HIDE_ABOVE_CLASS[at])}
    >
        <Body isSkeleton={isSkeleton} />
    </div>
)

export { HideAbove }

/** Source-level tier marker. */
export const meta = { tier: "frame", name: "HideAbove" } as const
