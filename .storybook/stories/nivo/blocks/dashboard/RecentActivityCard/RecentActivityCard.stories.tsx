import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    RecentActivityCard,
    type RecentActivityCardLabels,
    type RecentActivityItem,
} from "@sb-components/nivo/blocks/dashboard/RecentActivityCard/RecentActivityCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `RecentActivityCard` — the account's cross-domain activity feed: an
 * invoice getting paid, a lead landing on the expert site, a domain nearing
 * expiry, a support reply. Two DATA states of the single shape: `empty` and
 * `with-rows`.
 */
const meta: Meta<typeof RecentActivityCard> = {
    title: "Nivo/Blocks/Dashboard/RecentActivityCard/RecentActivityCard",
    component: RecentActivityCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof RecentActivityCard>

const LABELS: RecentActivityCardLabels = {
    title: "Recent activity",
    emptyTitle: "Nothing yet",
    emptyDescription: "Invoices, leads, domain renewals, and support replies will show up here.",
}

const ITEMS: Array<RecentActivityItem> = [
    { id: "act-1", kind: "invoice", message: "Invoice #INV-1042 has been paid — nivo AI Agent · Pro", timeLabel: "2 hours ago" },
    { id: "act-2", kind: "lead", message: "New lead Minh Tran left their details on the expert site", timeLabel: "5 hours ago" },
    { id: "act-3", kind: "domain", message: "Domain anhducstudio.vn expires in 12 days", timeLabel: "1 day ago" },
    { id: "act-4", kind: "support", message: "Support request #TCK-88 has been answered", timeLabel: "2 days ago" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCardList: { tier: "composite", role: "the bounded list, its rows, and its empty branch" },
    Typography: { tier: "atom", role: "each entry's message and relative time" },
    EmptyState: { tier: "composite", role: "the empty branch when nothing has happened yet" },
}

/** LEAF — `items`: an empty feed versus one mixing all four activity sources. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-xl p-8">
            <BlockAnatomy
                name="RecentActivityCard"
                tier="block"
                leaf="items"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. Which icon leads a row is a lookup on `kind`, never a caller choice — the feed owns what each domain source means. An empty feed is a state of the same shape, not a separate leaf: the card renders its own intentional empty branch instead of a blank panel."
                states={[
                    {
                        name: "items = []",
                        why: "A brand-new account: nothing has happened yet, so the card shows its intentional empty state instead of a blank panel.",
                        code: "<RecentActivityCard items={[]} labels={labels} />",
                        render: <RecentActivityCard items={[]} labels={LABELS} />,
                    },
                    {
                        name: "items populated",
                        why: "The four real sources folded into one feed: a paid invoice, a new lead, a domain nearing expiry, and an answered support ticket.",
                        code: "<RecentActivityCard items={activity} labels={labels} />",
                        render: <RecentActivityCard items={ITEMS} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The feed's own first fetch hasn't resolved yet — a fixed count of activity-shaped rows shimmer in place.",
                        code: "<RecentActivityCard items={[]} labels={labels} isSkeleton />",
                        render: <RecentActivityCard items={[]} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
