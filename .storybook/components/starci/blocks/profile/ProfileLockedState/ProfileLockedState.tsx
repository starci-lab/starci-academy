import React from "react"
import { LockIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { ProfileHero, type ProfileHeroUser } from "@sb-components/starci/blocks/profile/ProfileHero/ProfileHero"

/**
 * `ProfileLockedState` — the non-owner view of a profile its owner has turned
 * private. The identity hero stays visible; the tabbed activity region is
 * replaced by a single "private profile" notice with one way out (browse
 * courses instead). One leaf: the block always renders the same
 * hero-then-notice shape, so different `user` values are states.
 */

/** Props for {@link ProfileLockedState}. */
export interface ProfileLockedStateProps {
    /** The locked profile's owner — same domain shape {@link ProfileHero} itself renders. */
    user: ProfileHeroUser
    /** Fired when the visitor takes the one way forward (browse courses instead). */
    onGoCourses: () => void
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
}: ProfileLockedStateProps) => {
    return (
        <StackV
            gap={6}
            principle="block-boundary"
            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
            padding={6}
            items={[
                () => (
                    <ProfileHero
                        user={user}
                    />
                ),
                () => (
                    <SurfaceCard
                        padding={6}
                        body={() => (
                            <EmptyState
                                icon={LockIcon}
                                title="This profile is set to private"
                                description="The profile owner has hidden their public activity — you can still explore other courses."
                                body={() => (
                                    <Button
                                        label="Browse courses"
                                        variant="primary"
                                        onPress={onGoCourses}
                                    />
                                )}
                            />
                        )}
                    />
                ),
            ]}
        />
    )
}

export { ProfileLockedState }
