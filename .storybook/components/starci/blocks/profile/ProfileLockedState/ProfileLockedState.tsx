import React from "react"
import { LockIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { ProfileHero, type ProfileHeroUser } from "@sb-components/starci/blocks/profile/ProfileHero/ProfileHero"

/**
 * `ProfileLockedState` — the non-owner view of a profile whose owner has turned it
 * private. `ProfileHero` still renders the full identity (name, avatar, headline)
 * exactly as on a public profile; only the tabbed activity region is replaced by a
 * single notice. Presentation guard only — the server withholds the tab data.
 *
 * @param user Same identity shape `ProfileHero` takes.
 * @param onGoCourses Fired by the notice's one CTA.
 */

/** Props for {@link ProfileLockedState}. */
export interface ProfileLockedStateProps {
    /** The locked profile's owner — same domain shape {@link ProfileHero} itself renders. */
    user: ProfileHeroUser
    /** Fired when the visitor takes the one way forward (browse courses instead). */
    onGoCourses: () => void
    /** Extra classes on the root. */
    className?: string
}

/**
 * Non-owner view of a locked profile. See the file header for the full
 * contract.
 *
 * @param props - {@link ProfileLockedStateProps}
 */
const ProfileLockedState = ({
    user,
    onGoCourses,
    className,
}: ProfileLockedStateProps) => {
    const lockedBody = (
        <>
            <ProfileHero
                user={user}

            />
            <SurfaceCard
                padding={6}


                body={() => (
                    <EmptyState
                        icon={LockIcon}
                        title="This profile is set to private"
                        description="The profile owner has hidden their public activity — you can still explore other courses."
                        body={
                            <Button
                                label="Browse courses"
                                variant="primary"
                                onPress={onGoCourses}
                            />
                        }
                    />
                )}
            />
        </>
    )
    return <StackV gap={6} padding={6} className={className} body={lockedBody} />
}

export { ProfileLockedState }
