import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

/** Props for {@link NavbarFrame}. */
export interface NavbarFrameProps {
    /** Caller identity when a block/layout uses this frame as its root. */
    identity?: CallerIdentity
    /** Fixed-height primary bar content. */
    primary: ComponentTypeWithSkeleton
    /** Optional region below the primary bar; does not change primary height. */
    secondary?: ComponentTypeWithSkeleton
    /** Forwards skeleton state to primary and secondary slots. */
    isSkeleton?: boolean
}

/**
 * Semantic site-navbar frame: owns the nav landmark, sticky chrome, and fixed
 * 4rem primary row. Callers own content only.
 *
 * @param props - {@link NavbarFrameProps}
 */
const NavbarFrame = ({
    identity,
    primary: Primary,
    secondary: Secondary,
    isSkeleton,
}: NavbarFrameProps) => (
    <nav
        {...resolveIdentity(identity, { tier: "frame", name: "NavbarFrame" })}
        className="sticky top-0 z-50 border-b border-default bg-surface"
    >
        <div className="h-16 min-h-16">
            <Primary isSkeleton={isSkeleton} />
        </div>
        {Secondary ? <Secondary isSkeleton={isSkeleton} /> : null}
    </nav>
)

export { NavbarFrame }

/** Source-level tier marker. */
export const meta = { tier: "frame", name: "NavbarFrame" } as const
