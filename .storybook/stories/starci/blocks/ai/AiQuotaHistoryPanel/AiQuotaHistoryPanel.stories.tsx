import type { Meta, StoryObj } from "@storybook/nextjs"
import { AiQuotaHistoryPanel, type AiQuotaHistoryChartPoint, type AiQuotaHistoryChargeItem } from "@sb-components/starci/blocks/ai/AiQuotaHistoryPanel/AiQuotaHistoryPanel"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AiQuotaHistoryPanel` — the "History" tab body inside `AiQuotaModal`: a 7-day
 * usage bar chart plus a scrollable, bordered list of recent AI charges.
 * `isLoading` swaps the whole `ChargesList` region for its shimmer mirror; an
 * empty `items` array renders the list's own empty state. The chart draws from
 * `chartPoints` regardless of either.
 */
const meta: Meta<typeof AiQuotaHistoryPanel> = {
    title: "StarCi/Blocks/Ai/AiQuotaHistoryPanel/AiQuotaHistoryPanel",
    component: AiQuotaHistoryPanel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AiQuotaHistoryPanel>

const CHART_POINTS: Array<AiQuotaHistoryChartPoint> = [
    { day: "22/07", credits: 3 },
    { day: "23/07", credits: 0 },
    { day: "24/07", credits: 7 },
    { day: "25/07", credits: 2 },
    { day: "26/07", credits: 5 },
    { day: "27/07", credits: 1 },
    { day: "28/07", credits: 4 },
]

const CHARGES: Array<AiQuotaHistoryChargeItem> = [
    { key: "c1", model: "gpt-4.1-mini", surface: "grade", occurredAt: "2026-07-28T09:20:00", credits: 2 },
    { key: "c2", surface: "chatbot", occurredAt: "2026-07-28T08:05:00", credits: 1 },
    { key: "c3", model: "claude-haiku", surface: "interview", occurredAt: "2026-07-27T21:40:00", credits: 4 },
    { key: "c4", surface: "grade", occurredAt: "2026-07-27T14:12:00", credits: -1 },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track separating the chart region from the charges-list region, and — inside each — the caption above its content", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "the chart caption or the charges-list caption", storyId: "atoms-text-typography-typography--plain" },
    "SurfaceCard": { tier: "composite", role: "the bordered box holding the chart, surface-in-surface (no shadow, since it sits inside the modal's own face)", storyId: "composites-cards-surfacecard-surfacecard--variant" },
    "SurfaceCardList": { tier: "composite", role: "the bounded, bordered row list — dividers, row box, and its own row-for-row mirror while loading; the block only hands it charge rows as data", storyId: "composites-cards-surfacecard-surfacecardlist--default" },
    "Chip": { tier: "atom", role: "the trailing credit-delta badge on each row, or its shimmer mirror while loading", storyId: "atoms-chips-chip-chip--tones" },
    "AsyncContentEmpty": { tier: "composite", role: "the empty message when no charge has ever landed", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
}

/** LEAF — the region once loading has finished: populated list, or the empty message (both are DATA, R0). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AiQuotaHistoryPanel"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="isLoading = false — the only prop left to vary is `items`, DATA (R0), so it renders as states of this one leaf."
                states={[
                    {
                        name: "items.length = 4 — mixed models, purposes, and credit signs",
                        why: "The usual shape: some charges name a specific model, one falls back to the auto-model label; purposes span all three surfaces; one row's delta is negative, showing the different chip tone. The chart draws its own 7-day bars regardless.",
                        code: `<AiQuotaHistoryPanel
    chartPoints={chartPoints}
    items={charges}
    isLoading={false}
/>`,
                        render: (
                            <AiQuotaHistoryPanel

                               
                                chartPoints={CHART_POINTS}
                                items={CHARGES}
                                isLoading={false}
                            />
                        ),
                    },
                    {
                        name: "items = []",
                        why: "No AI charge has ever landed on this account, so the region shows one quiet message and no row box at all — the chart above still draws its (all-zero) 7-day plot, since it never reads `items`.",
                        code: `<AiQuotaHistoryPanel
    chartPoints={chartPoints}
    items={[]}
    isLoading={false}
/>`,
                        render: (
                            <AiQuotaHistoryPanel
                                chartPoints={CHART_POINTS}
                                items={[]}
                                isLoading={false}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the charges-list fetch is in flight; only that region swaps for a row-shaped mirror. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AiQuotaHistoryPanel"
                tier="block"
                leaf="Prop `isLoading`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "isLoading = true",
                        why: "The charges list's own fetch hasn't resolved yet, so `SurfaceCardList` draws its fixed 3-row mirror — title/subtitle shimmer plus a shimmer chip in the meta slot — instead of either the empty message or real rows. The chart is unaffected: it is never loading/empty-aware.",
                        code: "<AiQuotaHistoryPanel chartPoints={chartPoints} isLoading />",
                        render: (
                            <AiQuotaHistoryPanel

                               
                                chartPoints={CHART_POINTS}
                                isLoading
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
