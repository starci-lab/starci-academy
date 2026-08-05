import { HouseIcon, UserCircleMinusIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { EmptyState } from "@/components/composites/feedback/EmptyState"
import { type CallerIdentity } from "@/components/frames/_identity"

/**
 * `ProfileNotFoundState` — the 404-style whole-route message for a profile
 * that cannot be read (not found, soft-deleted, or a failed fetch). Composes
 * `EmptyState` in its plain icon+title+description+action form. One leaf: the
 * shape never branches, so different inputs are states.
 */

/** Props for {@link ProfileNotFoundState}. */
export interface ProfileNotFoundStateProps {
    /** Headline saying the profile could not be found, localized by the caller — e.g. "Profile not found". */
    title: string
    /** Supporting sentence explaining why (removed, private, or never existed), localized by the caller. */
    description: string
    /** Fired when the reader takes the one way out: back to the home route. */
    onGoHome: () => void
    /**
     * Caller identity to wear on `EmptyState`'s root instead of its own — pass this when a
     * `block`/`layout`/`overlay`/`page` component (BLOCK-2: never draws a shape of its own) is
     * using this block AS its root element, instead of wrapping it in a raw `<div
     * data-tier=… data-component=…>`. See `_identity.ts`. Forwarded straight to `EmptyState`,
     * which is this block's own root — this block draws no shape of its own to wrap it in.
     * Omitted → `EmptyState` keeps emitting its own `data-tier="composite"
     * data-component="EmptyState"`, unchanged.
     */
    identity?: CallerIdentity
}

/**
 * Whole-route 404-style message for an unresolvable public profile. See the
 * file header for the full contract and the numeral-shell judgement call.
 *
 * @param props - {@link ProfileNotFoundStateProps}
 */
const ProfileNotFoundState = ({
    title,
    description,
    onGoHome,
    identity,
}: ProfileNotFoundStateProps) => (
    <EmptyState
        identity={identity}
        icon={UserCircleMinusIcon}
        title={title}
        description={description}
        action={() => (
            <Button
                label="Back to home"
                variant="primary"
                prefixIcon={HouseIcon}
                onPress={onGoHome}
            />
        )}
    />
)

export { ProfileNotFoundState }
