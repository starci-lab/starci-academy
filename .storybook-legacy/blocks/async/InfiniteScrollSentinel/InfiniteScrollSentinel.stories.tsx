import type { Meta, StoryObj } from "@storybook/nextjs"
import { InfiniteScrollSentinel } from "@/components/blocks/async/InfiniteScrollSentinel"

const meta: Meta<typeof InfiniteScrollSentinel> = {
    title: "Legacy/Blocks/Async/InfiniteScrollSentinel",
    component: InfiniteScrollSentinel,
}
export default meta
type Story = StoryObj<typeof InfiniteScrollSentinel>

/**
 * Only use when the list lives in its OWN scroll container (modal · panel · rail) with nothing below it —
 * the user just browses, they aren't hunting for "page 3". If the list sits in the page's MAIN COLUMN with a
 * footer below it → use a "Load more" BUTTON (auto-scroll hijacks the scroll and the user never reaches the
 * footer). If the list is FINITE and the user needs to find or return to an item → use a pager (compose
 * AsyncContent + a pagination control). While loading more: render a SKELETON MIRROR of 1-2 items right at
 * the sentinel (gated by isLoadingMore) — don't use a "Loading..." label and don't stay silent. When there
 * are no more pages, show nothing at all.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Only use when the list lives in its OWN scroll container (modal · panel · rail) with nothing below it — " +
            "the user just browses, they aren't hunting for \"page 3\". If the list sits in the page's MAIN COLUMN with a footer below → " +
            "use a \"Load more\" BUTTON (auto-scroll hijacks the scroll and the user never reaches the footer). If the list is " +
            "FINITE and the user needs to find or return to an item → use a pager (compose AsyncContent + a pagination control). " +
            "While loading more: render a SKELETON MIRROR of 1-2 items right at the sentinel (gated by isLoadingMore) — don't use a " +
            "\"Loading...\" label and don't stay silent. When there are no more pages, show nothing at all.",
    },
    render: () => (
        <div className="w-64 border border-dashed border-default-300 p-3">
            <p className="mb-2 text-sm text-default-500">Course list...</p>
            <InfiniteScrollSentinel onReach={() => {}} />
        </div>
    ),
}
