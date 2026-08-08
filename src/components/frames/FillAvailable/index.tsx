import { cn } from "@heroui/react"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { principleAttr, explainAttr, type ExplainReason, type PrincipleToken } from "@/components/frames/_principles"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

/**
 * FRAME — `FillAvailable`: owns parent-owned flex participation so callers never
 * write `min-w-0 flex-1` / `min-h-0 @app-*:flex-1` on the child (FRAME-10).
 *
 * Emits one deterministic principle per `at` mode:
 *   base → `flex-fill-base` (`min-w-0 flex-1`)
 *   lg   → `flex-fill` (`min-h-0 @app-lg:flex-1`)
 * Callers do not pass a principle, className, gap, padding, align, or justify.
 */

/** Container step at which flex-fill engages. */
export type FillAvailableAt = "base" | "lg"

/** Classes owned by each `at` mode — exactly one deterministic mapping. */
const FILL_AT_CLASS: Record<FillAvailableAt, string> = {
    base: "min-w-0 flex-1",
    lg: "min-h-0 @app-lg:flex-1",
}

/** Principle token emitted for each `at` mode. */
const FILL_AT_PRINCIPLE: Record<FillAvailableAt, PrincipleToken> = {
    base: "flex-fill-base",
    lg: "flex-fill",
}

/** Default explain per mode — never a restatement of the token alone. */
const FILL_AT_EXPLAIN: Record<FillAvailableAt, string> = {
    base: "Takes remaining flex space at every width so a truncated peer column can shrink without overflowing the row.",
    lg: "Takes the remaining rail column height from the named container step up so the child list can scroll inside a pinned shell.",
}

/** Props for {@link FillAvailable}. */
export interface FillAvailableProps {
    /** Body that receives the remaining flex space. */
    body: ComponentTypeWithSkeleton
    /** Container step where flex participation engages. */
    at: FillAvailableAt
    /** Forwards the shared skeleton slot contract into `body`. */
    isSkeleton?: boolean
    /**
     * Why this fill layer exists — beside the fixed mode token, never a
     * restatement of it.
     */
    explain?: ExplainReason
    /** Caller identity when a page/block uses this frame as its root. */
    identity?: CallerIdentity
}

/**
 * Fills remaining parent flex space from a named container step. See the file header.
 *
 * @param props - {@link FillAvailableProps}
 */
const FillAvailable = ({
    body: Body,
    at,
    isSkeleton,
    explain,
    identity,
}: FillAvailableProps) => (
    <div
        {...resolveIdentity(identity, { tier: "frame", name: "FillAvailable" })}
        data-principle={principleAttr(FILL_AT_PRINCIPLE[at])}
        data-explain={explainAttr(explain ?? FILL_AT_EXPLAIN[at])}
        className={cn(FILL_AT_CLASS[at])}
    >
        <Body isSkeleton={isSkeleton} />
    </div>
)

export { FillAvailable }

/** Source-level tier marker. */
export const meta = { tier: "frame", name: "FillAvailable" } as const
