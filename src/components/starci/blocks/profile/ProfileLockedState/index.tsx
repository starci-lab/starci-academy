import React from "react"
import { LockIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { EmptyState } from "@/components/composites/feedback/EmptyState"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { StackV } from "@/components/frames/Stack"
import { ProfileHero, type ProfileHeroUser } from "@/components/starci/blocks/profile/ProfileHero"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
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
    classNames,
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
        </>
    )
    return <StackV gap={6} pattern="block-boundary" padding={6} classNames={classNames} items={[() => lockedBody]} />
}

export { ProfileLockedState }
