import { cn } from "@heroui/react"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { resolveIdentity, type CallerIdentity } from "@sb-components/frames/_identity"
/* Appearance CSS lives here on purpose — position.md: absolute/relative belong to a named composite. */

/**
 * COMPOSITE — `LockedContentMask`: positioning context + locked-tail fade for a
 * paywalled reading body. Owns `relative`, the absolute gradient band, and
 * `select-none` when locked so pages/blocks never write those classes.
 *
 * Same fade string as EnrollGate's teaser band — the body stays mounted so
 * the reader sees the lesson continues; truncating would hide what they buy.
 * ContentPage and ContentArticle both consume this owner (do not duplicate the
 * gradient class at call sites).
 */

/** Props for {@link LockedContentMask}. */
export interface LockedContentMaskProps {
    /** Reading body (article host + content). */
    body: ComponentTypeWithSkeleton
    /**
     * `true` → selection off and the tail fades into the surface behind the
     * paywall. `false` → body only, no mask.
     */
    isLocked?: boolean
    /** Renders `body` in its skeleton state. */
    isSkeleton?: boolean
    /** Caller identity when a page/block uses this composite as its root. */
    identity?: CallerIdentity
}

/**
 * Locked reading mask. See the file header.
 *
 * @param props - {@link LockedContentMaskProps}
 */
const LockedContentMask = ({
    body: Body,
    isLocked = false,
    isSkeleton,
    identity,
}: LockedContentMaskProps) => (
    <div
        {...resolveIdentity(identity, { tier: "composite", name: "LockedContentMask" })}
        className="relative"
    >
        <div className={cn(isLocked && "select-none")}>
            <Body isSkeleton={isSkeleton} />
        </div>
        {isLocked ? (
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-surface/70 to-surface"
            />
        ) : null}
    </div>
)

export { LockedContentMask }

/** Source-level tier metadata. */
export const meta = { tier: "composite", name: "LockedContentMask" } as const
