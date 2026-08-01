import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProfileNotFoundState } from "@sb-components/starci/blocks/profile/ProfileNotFoundState/ProfileNotFoundState"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ProfileNotFoundState`: the 404-style whole-route message for a
 * profile that cannot be read (not found, soft-deleted, or a failed fetch).
 *
 * ⚠️ Deliberately NOT the `src` app's numeral-hero shell (`ErrorPageState`,
 * a big "404" above the title) — that shape has no other consumer anywhere in
 * this design system, so this block composes `EmptyState` in its plain
 * icon+title+description+action form instead of inventing a one-off numeral
 * frame. See the component file header for the full reasoning.
 *
 * 📐 ONE LEAF (§14d.2). The block always renders the exact same
 * icon/title/description/action shape — there is no branch that adds or
 * removes a node, so there is nothing here for a second leaf to structurally
 * differ on.
 */
const meta: Meta<typeof ProfileNotFoundState> = {
    title: "StarCi/Blocks/Profile/ProfileNotFoundState/ProfileNotFoundState",
    component: ProfileNotFoundState,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProfileNotFoundState>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "EmptyState": { tier: "composite", role: "the centered icon/title/description/action stack — the same shape every other empty spot in this codebase uses", storyId: "composites-feedback-emptystate-emptystate--action" },
    "Button": { tier: "atom", role: "the single way out, back to the home route — its label is owned by this block, not passed in by the caller", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — the requested profile could not be resolved. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProfileNotFoundState"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="Every profile URL that resolves to nothing — deleted, never existed, or a failed fetch — reads the same: an icon saying 'no such profile', the caller's explanation, and one way back to the home route."
                states={[
                    {
                        name: "title/description set, onGoHome wired",
                        why: "The headline and description come from the caller/i18n, already resolved copy about WHY this profile can't be shown. The CTA label itself is NOT a prop — 'back to the home route' is the one and only exit a 404 state ever offers, so the block owns that word itself rather than opening it up to the caller.",
                        code: `<ProfileNotFoundState
    title="Profile not found"
    description="This profile doesn't exist or has been removed."
    onGoHome={goHome}
/>`,
                        render: (
                            <ProfileNotFoundState
                                anatPart="ProfileNotFoundState"
                                showAnatomy
                                title="Profile not found"
                                description="This profile doesn't exist or has been removed."
                                onGoHome={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
