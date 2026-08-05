import type { Meta, StoryObj } from "@storybook/nextjs"
import { LeaderboardHeader } from "@sb-components/starci/blocks/learn/LeaderboardHeader/LeaderboardHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LeaderboardHeader` — the page-identity cluster at the top of the leaderboard
 * screen: trail, title, subtitle, nothing else. Wraps `PageHeader` in a
 * domain-named block; it carries no meta chips because rank and score live in the
 * list below. A missing subtitle is a data condition on the same three-part cluster.
 */
const meta: Meta<typeof LeaderboardHeader> = {
    title: "StarCi/Blocks/Learn/LeaderboardHeader/LeaderboardHeader",
    component: LeaderboardHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LeaderboardHeader>

const CRUMBS = [
    { key: "home", label: "Home", onPress: () => {} },
    { key: "leaderboard", label: "Leaderboard" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the trail and the title/description column", storyId: "composites-layout-page-pageheader--full" },
    "Breadcrumbs": { tier: "atom", role: "the trail the block builds from crumb data handed down by the screen", storyId: "atoms-navigation-breadcrumbs-breadcrumbs--default" },
    "Typography": { tier: "atom", role: "the block's own title/description text, or its skeleton mirror while loading", storyId: "atoms-text-typography-typography--overview" },
}

/** LEAF — the whole header: trail → title → optional subtitle. */
export const Header: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LeaderboardHeader"
                tier="block"
                leaf="Header"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "description present",
                        why: "The full identity cluster: trail, title, and a one-sentence subtitle explaining what the ranking measures. This is what a reader sees the first time they open the leaderboard, before they know the rules of the ranking.",
                        code: `<LeaderboardHeader
    breadcrumbItems={crumbs}
    title="Leaderboard"
    description="Ranked by total practice points earned this month"
/>`,
                        render: (
                            <LeaderboardHeader


                                breadcrumbItems={CRUMBS}
                                title="Leaderboard"
                                description="Ranked by total practice points earned this month"
                            />
                        ),
                    },
                    {
                        name: "description omitted",
                        why: "A returning reader who already knows what the leaderboard measures does not need the sentence repeated on every visit, so the caller may drop it — the title alone still reads as a complete page identity.",
                        code: `<LeaderboardHeader
    breadcrumbItems={crumbs}
    title="Leaderboard"
/>`,
                        render: (
                            <LeaderboardHeader
                                breadcrumbItems={CRUMBS}
                                title="Leaderboard"
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The trail and the title/description swap to their own shimmer while the leaderboard's identity data is still loading, keeping the exact box each will hand back. The flag reaches the real atoms rather than a parallel skeleton tree, which is why the header does not jump when the data lands.",
                        code: "<LeaderboardHeader breadcrumbItems={[]} title=\"\" isSkeleton />",
                        render: (
                            <LeaderboardHeader
                                breadcrumbItems={[]}
                                title=""
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
