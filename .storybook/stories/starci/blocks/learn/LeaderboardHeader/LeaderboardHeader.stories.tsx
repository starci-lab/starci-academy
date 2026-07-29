import type { Meta, StoryObj } from "@storybook/nextjs"
import { LeaderboardHeader } from "@sb-components/starci/blocks/learn/LeaderboardHeader/LeaderboardHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `LeaderboardHeader`: the PAGE-IDENTITY cluster at the top of the
 * leaderboard screen — trail, title, subtitle, nothing else.
 *
 * SIBLING OF `ContentHeader`/`ModuleHeader`, NOT A COPY. Every ported screen
 * wraps `PageHeader` in its own domain-named block rather than the screen
 * touching the composite directly (rule 1). Leaderboard keeps that shape even
 * though its real header carries no meta chips — no read-state, no tier, no
 * count fact rides here, because rank and score live in the list below.
 *
 * ⚠️ ONLY ONE LEAF. Unlike `ContentHeader` (whose outcomes card is a whole
 * extra node that can be absent), `LeaderboardHeader` has nothing left that
 * changes SHAPE once the trail and title are drawn — a missing subtitle is a
 * data condition on the same three-part cluster, not a different structure.
 * That is also why this block was flagged for a second look against
 * `check-passthrough-block`: see the file header on the component for the
 * judgement call left open there.
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
    { key: "home", label: "Trang chủ", onPress: () => {} },
    { key: "leaderboard", label: "Bảng xếp hạng" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the trail and the title/description column", storyId: "composites-layout-page-pageheader--full" },
    "Breadcrumbs": { tier: "atom", role: "the trail the block builds from crumb data handed down by the screen", storyId: "atoms-navigation-breadcrumbs-breadcrumbs--default" },
    "Typography": { tier: "atom", role: "the block's own title/description text, or its skeleton mirror while loading", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — the whole header: trail → title → optional subtitle. */
export const Header: Story = {
    render: () => (
        <div className="p-8">
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
    title="Bảng xếp hạng"
    description="Xếp hạng theo tổng điểm luyện tập trong tháng này"
/>`,
                        render: (
                            <LeaderboardHeader
                                anatPart="LeaderboardHeader"
                                showAnatomy
                                breadcrumbItems={CRUMBS}
                                title="Bảng xếp hạng"
                                description="Xếp hạng theo tổng điểm luyện tập trong tháng này"
                            />
                        ),
                    },
                    {
                        name: "description omitted",
                        why: "A returning reader who already knows what the leaderboard measures does not need the sentence repeated on every visit, so the caller may drop it — the title alone still reads as a complete page identity.",
                        code: `<LeaderboardHeader
    breadcrumbItems={crumbs}
    title="Bảng xếp hạng"
/>`,
                        render: (
                            <LeaderboardHeader
                                breadcrumbItems={CRUMBS}
                                title="Bảng xếp hạng"
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
