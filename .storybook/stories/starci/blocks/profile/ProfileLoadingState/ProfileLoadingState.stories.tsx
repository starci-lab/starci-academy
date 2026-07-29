import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProfileLoadingState } from "@sb-components/starci/blocks/profile/ProfileLoadingState/ProfileLoadingState"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ProfileLoadingState`: the public-profile first-load skeleton. It
 * takes no data props (see the component's own file header) so it has exactly
 * ONE leaf and ONE state — there is no prop to vary it by.
 *
 * `annotate` (flat map, not a nested `parts` tree) is the right shape here for
 * the same reason `ContinueCard`'s own `Skeleton` leaf uses it: every text/pill/
 * progress/tile spot renders through an atom's OWN `isSkeleton` branch, so the
 * DOM this leaf produces really is flat repeats of a handful of part names
 * (`Typography`, `Chip`, `Button`, `IconTile`, `Avatar`, `Skeleton`…), not a
 * meaningfully nested composition tree.
 */
const meta: Meta<typeof ProfileLoadingState> = {
    title: "StarCi/Blocks/Profile/ProfileLoadingState/ProfileLoadingState",
    component: ProfileLoadingState,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ProfileLoadingState>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Container": { tier: "frame", role: "the centered, width-capped measure the whole two-column body sits in", storyId: "frames-container-container--default" },
    "StackV": { tier: "frame", role: "the vertical rhythm used at every level of this tree — the outer identity/overview split, the hero column, and each section's own label-over-body stack", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal rows — the location/work-mode line, the icon+text meta rows, and a course row's title/percent line", storyId: "frames-stack-stackh--default" },
    "Grid": { tier: "frame", role: "the 2-col responsive grid holding the skills section's two stat cards", storyId: "frames-grid-grid--default" },
    "Typography": { tier: "atom", role: "every text line in this tree, mirrored via its own `isSkeleton` shimmer — the hero's name/role/handle/bio, the section labels, the metric card's value/label/hint, a course row's title and percent", storyId: "atoms-text-typography-typography--loading" },
    "Chip": { tier: "atom", role: "the rank pill under the hero avatar, and the work-mode status chip beside the location line", storyId: "atoms-chips-chip-chip--skeleton" },
    "Button": { tier: "atom", role: "the hero's two full-width action buttons", storyId: "atoms-buttons-button-button--skeleton" },
    "IconTile": { tier: "atom", role: "the course thumbnail leading each courses-list row", storyId: "atoms-display-icontile-icontile--skeleton" },
    "Avatar": { tier: "atom", role: "one slot of the earned-badge medal strip — `AvatarGroup` renders each visible member as its own tagged `Avatar` node, so the strip shows up here as five of these rather than one `AvatarGroup` node (the atom carries no `anatPart` of its own)", storyId: "atoms-display-avatar-avatar--skeleton" },
    "SurfaceCard": { tier: "composite", role: "the framed card face behind the job-readiness metric and each skills stat card", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "SurfaceCardList": { tier: "composite", role: "the bounded row list holding the job-readiness tracked-goal row and the two course rows — both rows pass bespoke `content` (an IconTile, progress bars), not the composite's own fixed slots", storyId: "composites-cards-surfacecard-surfacecardlist--free-form" },
    "Skeleton": { tier: "heroui", role: "the five spots with no matching atom of ours: the 128px hero avatar circle, three 20px decorative leading-icon boxes (location/meta rows), and the 160px contribution heatmap block" },
}

/** LEAF — the only shape this block has: the whole loading shell. */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="ProfileLoadingState"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            reason="Pure skeleton, no data props (see the component's own file header) — there is only ONE leaf because there is no prop to branch on. The tab strip, the identity column and all four overview sections mirror the real profile shell 1:1 so nothing shifts once the real data resolves."
            states={[
                {
                    name: "isSkeleton (always)",
                    why: "This block IS the loading state — it has no `isSkeleton` prop of its own, every atom it composes is simply always told to render its own shimmer. The tab strip reuses `Tabs`' native `isSkeleton variant=\"secondary\"` shape, the medal strip reuses `AvatarGroup`'s own overlap shimmer, and every text/pill/button/tile spot mirrors through that atom's own box so nothing here can drift out of sync with the real component it stands in for.",
                    code: "<ProfileLoadingState />",
                    render: <ProfileLoadingState anatPart="ProfileLoadingState" showAnatomy />,
                },
            ]}
        />
    ),
}
