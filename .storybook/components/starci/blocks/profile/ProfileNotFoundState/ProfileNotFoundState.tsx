import { HouseIcon, UserCircleMinusIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"

/**
 * `ProfileNotFoundState` — the 404-style whole-route message shown when a public
 * profile cannot be read (not found, soft-deleted, or a failed fetch). Composes
 * `EmptyState` in its icon/title/description/action shape; renders card-free and
 * without a skeleton (a resolved-lookup terminal state).
 *
 * @param title Pre-translated heading.
 * @param description Pre-translated body.
 * @param onGoHome Fired by the CTA; the "Back to home" label is owned here.
 */

/** Props for {@link ProfileNotFoundState}. */
export interface ProfileNotFoundStateProps {
    /** Headline saying the profile could not be found, localized by the caller — e.g. "Profile not found". */
    title: string
    /** Supporting sentence explaining why (removed, private, or never existed), localized by the caller. */
    description: string
    /** Fired when the reader takes the one way out: back to the home route. */
    onGoHome: () => void
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
}: ProfileNotFoundStateProps) => (
    <div>
        <EmptyState
            icon={UserCircleMinusIcon}
            title={title}
            description={description}
            action={(
                <Button
                    label="Back to home"
                    variant="primary"
                    prefixIcon={HouseIcon}
                    onPress={onGoHome}
                />
            )}

        />
    </div>
)

export { ProfileNotFoundState }
