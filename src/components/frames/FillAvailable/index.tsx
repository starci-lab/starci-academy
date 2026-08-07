import { cn } from "@heroui/react"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { principleAttr, explainAttr, type ExplainReason } from "@/components/frames/_principles"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

/**
 * FRAME — `FillAvailable`: owns the "take remaining column space from a named
 * container step upward" placement so rails never write `min-h-0 @app-*:flex-1`
 * on the child (FRAME-10: name the width as a prop).
 *
 * Earned by LearnShellLayout content/milestone/leaderboard rails plus
 * ArchitectureRail and PracticeRail — five exact consumers of
 * `min-h-0 @app-lg:flex-1`.
 *
 * Emits fixed `data-principle="flex-fill"`. Callers do not pass a principle.
 */

/** Container step at which flex-fill engages. */
export type FillAvailableAt = "lg"

/**
 * Proven consumer class map. `lg` keeps `min-h-0` at every width (overflow
 * safety in the rail column) and adds `flex-1` from `@app-lg` up — exact match
 * to the five B29 call sites. `at="base"` is reserved until an unlocked
 * `min-h-0 flex-1` consumer exists on these targets.
 */
const FILL_AT_CLASS: Record<FillAvailableAt, string> = {
    lg: "min-h-0 @app-lg:flex-1",
}

/** Props for {@link FillAvailable}. */
export interface FillAvailableProps {
    /** Body that receives the remaining flex height. */
    body: ComponentTypeWithSkeleton
    /** Container step where flex-1 engages. */
    at: FillAvailableAt
    /** Forwards the shared skeleton slot contract into `body`. */
    isSkeleton?: boolean
    /**
     * Why this fill layer exists — beside the fixed `flex-fill` token, never a
     * restatement of it.
     */
    explain?: ExplainReason
    /** Caller identity when a page/block uses this frame as its root. */
    identity?: CallerIdentity
}

/**
 * Fills remaining parent height from a named container step. See the file header.
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
        data-principle={principleAttr("flex-fill")}
        data-explain={explainAttr(
            explain ??
                "Takes the remaining rail column height from the named container step up so the child list can scroll inside a pinned shell.",
        )}
        className={cn(FILL_AT_CLASS[at])}
    >
        <Body isSkeleton={isSkeleton} />
    </div>
)

export { FillAvailable }

/** Source-level tier marker. */
export const meta = { tier: "frame", name: "FillAvailable" } as const
