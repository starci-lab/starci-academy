import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { resolveIdentity, type CallerIdentity } from "@sb-components/frames/_identity"

/**
 * FRAME — `NavigationRail`: owns the semantic `<nav>` landmark and the column
 * flex-fill shell (`flex min-h-0 flex-1 flex-col`) so callers never write those
 * classes on a raw host (FRAME-10). Earned by CollapsibleSidebar's nav body —
 * Wave B migrates that consumer.
 *
 * Named frame: no public principle, className, gap, padding, align, justify,
 * children, or ReactNode body. Intrinsic ownership lives on this host only.
 */

/** Props for {@link NavigationRail}. */
export interface NavigationRailProps {
    /** Caller identity when a block/layout uses this frame as its root. */
    identity?: CallerIdentity
    /** Navigation body mounted inside the landmark. */
    body: ComponentTypeWithSkeleton
    /** Forwards skeleton state to the body. */
    isSkeleton?: boolean
}

/**
 * Semantic navigation-rail frame. See the file header.
 *
 * @param props - {@link NavigationRailProps}
 */
const NavigationRail = ({
    identity,
    body: Body,
    isSkeleton,
}: NavigationRailProps) => (
    <nav
        {...resolveIdentity(identity, { tier: "frame", name: "NavigationRail" })}
        className="flex min-h-0 flex-1 flex-col"
    >
        <Body isSkeleton={isSkeleton} />
    </nav>
)

export { NavigationRail }

/** Source-level tier marker. */
export const meta = { tier: "frame", name: "NavigationRail" } as const
