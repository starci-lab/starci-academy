import React from "react"
import { LockIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { ProfileHero, type ProfileHeroUser } from "@sb-components/starci/blocks/profile/ProfileHero/ProfileHero"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ProfileLockedState`: the non-owner view of a profile its owner has
 * turned private. Ported from
 * `src/components/features/profile/PublicProfile/ProfileLockedState/index.tsx`.
 *
 * ⭐ THE HERO STAYS, ONLY THE TABBED BODY IS WITHHELD. A recruiter (or anyone
 * else) landing on a locked profile still needs to see WHO this is — name,
 * avatar, headline — so `ProfileHero` renders exactly as it does on a public
 * profile. Only the region that would normally hold the tabbed activity
 * (overview/projects/challenges/skills/activity) is replaced by one notice.
 * This is a PRESENTATION guard mirroring the real component's own doc comment
 * ("the server also withholds the tab data, so this is a presentation guard,
 * not the security boundary") — the block never pretends to enforce privacy.
 *
 * BLOCK IMPORTS BLOCK (same justification as `ContentPaywall`/`EnrollGate`):
 * `ProfileHero` is the identity column already built for the public profile
 * screen. Re-deriving a second "name + avatar" cluster here would fork that
 * identity rendering in two places the moment either one changes copy or
 * layout.
 *
 * ⭐ JUDGEMENT CALL — `user`/`onGoCourses` are TYPED PROPS, the real component
 * reads `useRouter`/`pathConfig` itself and needs no props at all. A block may
 * not decide navigation on business grounds (a screen/layout does): the real
 * component's `router.push(pathConfig().locale(locale).course().build())` is
 * app wiring, out of scope for this tier (`onGoCourses: () => void`), and
 * `user` is the same domain shape `ProfileHero` itself takes — this block does
 * not invent a second "profile user" shape beside it.
 *
 * ⭐ ONLY `user` IS FORWARDED TO `ProfileHero`. Its full contract also takes
 * `isSelf`/`canHire`/`following`/`isFollowPending`/`onToggleFollow`/`onHire`/
 * `onEdit`/`onShare` — every one OPTIONAL. A viewer who hit a locked profile
 * is, by definition, never its owner and this block's own prop list (per
 * spec) carries no follow/hire wiring of its own, so those all fall to
 * `ProfileHero`'s own defaults (`isSelf=false`, `following=false`, no
 * handlers). The primary action still renders ("Follow") but presses do
 * nothing absent a handler — the same "declared optional, caller may not
 * have one yet" contract `ProfileHero` itself defines, not a bug this block
 * introduces. If a locked profile should also support following, that is a
 * follow-up prop threaded through here, not a change to `ProfileHero`.
 *
 * 📐 ONE LEAF. There is no state that changes this block's SHAPE — the hero is
 * always present, the notice is always the same three parts (icon, title,
 * description) plus one CTA. `showAnatomy`/`anatPart` and the two data props
 * are the only inputs; different `user` values are DATA, not a different leaf.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ProfileLockedState}. */
export interface ProfileLockedStateProps {
    /** The locked profile's owner — same domain shape {@link ProfileHero} itself renders. */
    user: ProfileHeroUser
    /** Fired when the visitor takes the one way forward (browse courses instead). */
    onGoCourses: () => void
    /** Extra classes on the root. */
    className?: string
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
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
    // No `anatPart` here (yet, deliberately): `ProfileHero` has no story of its own at
    // the time of writing, so `check-orphan-parts` treats a badge with no `storyId` to
    // point to as worse than no badge at all — declare it here the moment that story
    // lands, rather than pre-badging a link that goes nowhere.
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

                    >
                        <Button
                            label="Browse courses"
                            variant="primary"
                            onPress={onGoCourses}
                        />
                    </EmptyState>
                )}
            />
        </>
    )
    return <StackV gap={6} padding={6} className={className} body={lockedBody} />
}

export { ProfileLockedState }
