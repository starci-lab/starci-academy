import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProfileLockedState } from "@sb-components/starci/blocks/profile/ProfileLockedState/ProfileLockedState"
import type { ProfileHeroUser } from "@sb-components/starci/blocks/profile/ProfileHero/ProfileHero"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ProfileLockedState`: the non-owner view of a profile its owner has
 * turned private. The identity hero stays visible; the tabbed activity region
 * is replaced by a single "private profile" notice with one way out (browse
 * courses instead).
 *
 * ⚠️ `ProfileHero` IS NOT BADGED HERE (known gap, §B3 scope discipline): its
 * component landed from a sibling agent in this same run, but its own story
 * file had not, at the time of writing. `check-orphan-parts` treats a badge
 * with no `storyId` to point to as worse than no badge — so the component
 * renders it un-badged for now. Add `` on the
 * component AND a `storyId`-bearing entry here the moment its story lands.
 *
 * 📐 ONE LEAF (§14d.2). The block always renders the exact same
 * hero-then-notice shape — nothing branches the STRUCTURE, so different
 * `user` values are a state inside this one leaf, not a second leaf.
 */
const meta: Meta<typeof ProfileLockedState> = {
    title: "StarCi/Blocks/Profile/ProfileLockedState/ProfileLockedState",
    component: ProfileLockedState,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProfileLockedState>

const USER: ProfileHeroUser = {
    id: "u_locked_1",
    fullName: "Minh Tran",
    handle: "minh.tran",
    roleTitle: "Backend Engineer",
    bio: "Studying DevOps Mastery, currently working on a containerization capstone.",
    location: "Da Nang, Vietnam",
    followersCount: 8,
    joinedAt: "2025-03-01T00:00:00.000Z",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the card face holding the private-profile notice in place of the tabbed activity region", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "EmptyState": { tier: "composite", role: "the centered icon/title/description stack stating the profile is private", storyId: "composites-feedback-emptystate-emptystate--action" },
    "Button": { tier: "atom", role: "the single way out — browse courses instead of this profile's activity", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — a non-owner lands on a profile its owner has locked. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProfileLockedState"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                reason="Whoever this profile belongs to, and whatever they've done, a visitor who isn't the owner and isn't let in sees the same two things: proof of who this is, and one clear way to leave and go find a course instead."
                states={[
                    {
                        name: "user set, onGoCourses wired",
                        why: "The hero renders the SAME identity data a public profile would, so the visitor still confirms whose profile this is. The tabbed activity that would normally follow is withheld — server-side too, this is only the presentation half of that guard — and replaced by one notice with one exit.",
                        code: `<ProfileLockedState
    user={user}
    onGoCourses={() => router.push(pathConfig().locale(locale).course().build())}
/>`,
                        render: (
                            <ProfileLockedState

                               
                                user={USER}
                                onGoCourses={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
