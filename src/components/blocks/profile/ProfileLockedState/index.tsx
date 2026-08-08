import React from "react"
import { LockIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { EmptyState } from "@/components/composites/feedback/EmptyState"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { StackV } from "@/components/frames/Stack"
import { ProfileHero, type ProfileHeroUser } from "@/components/blocks/profile/ProfileHero"
import type { CallerIdentity } from "@/components/frames/_identity"

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
     * Caller identity to wear on this block's root `StackV` instead of its own — pass this when
     * a `block`/`layout`/`overlay`/`page` component (BLOCK-2: never draws a shape of its own) is
     * using this block AS its root element, instead of wrapping it in a raw `<div data-tier=…
     * data-component=…>`. Forwarded straight to `StackV`, which forwards it to `Flex`, the frame
     * that actually renders the DOM (see `Flex`'s own `identity` doc). See `_identity.ts`.
     * Omitted → this block keeps emitting `data-tier="frame" data-component="Flex"`, unchanged.
     */
    identity?: CallerIdentity
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
    identity,
}: ProfileLockedStateProps) => {
    return (
        <StackV
            gap={6}
            principle="block-boundary"
            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
            padding={6}
            identity={identity}
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
