import type { Meta, StoryObj } from "@storybook/nextjs"
import { BookOpenIcon } from "@phosphor-icons/react"
import { HighlightChip } from "@sb-components/composites/chips/HighlightChip/HighlightChip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof HighlightChip> = {
    title: "Composites/Chips/HighlightChip",
    component: HighlightChip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof HighlightChip>

/** Neutral (default): value + label, no leading icon — the plain figure pill. */
export const ValueAndLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="rounded-2xl border p-8">
            <HighlightChip value={24} label="Module" />
        </div>
    ),
}

/** WithIcon: an optional leading Phosphor icon before the bold value. */
export const WithIcon: Story = {
    render: () => (
        <div data-tier="fixture" className="rounded-2xl border p-8">
            <HighlightChip icon={BookOpenIcon} value={276} label="Exercises" />
        </div>
    ),
}

/** Neutral: the default tone — undetermined / plain figure. */
export const Neutral: Story = {
    render: () => (
        <div data-tier="fixture" className="rounded-2xl border p-8">
            <HighlightChip tone="default" value={24} label="Module" />
        </div>
    ),
}

/** Success: a positive figure — e.g. completed count. */
export const Success: Story = {
    render: () => (
        <div data-tier="fixture" className="rounded-2xl border p-8">
            <HighlightChip tone="success" value={128} label="Completed" />
        </div>
    ),
}

/** Warning: a figure that needs attention — e.g. items due soon. */
export const Warning: Story = {
    render: () => (
        <div data-tier="fixture" className="rounded-2xl border p-8">
            <HighlightChip tone="warning" value={5} label="Expiring soon" />
        </div>
    ),
}

/** Danger: a negative figure — e.g. failed / cancelled count. */
export const Danger: Story = {
    render: () => (
        <div data-tier="fixture" className="rounded-2xl border p-8">
            <HighlightChip tone="danger" value={2} label="Failed" />
        </div>
    ),
}

/** Accent: a highlighted figure that draws attention. */
export const Accent: Story = {
    render: () => (
        <div data-tier="fixture" className="rounded-2xl border p-8">
            <HighlightChip tone="accent" value={12} label="New" />
        </div>
    ),
}

/** Annotation for the bar shimmer — HeroUI `Skeleton` stands in for the whole pill (§12g.0a). */
const ANNOTATE_SKELETON: Record<string, AnatomyAnnotation> = {
    "Skeleton": { tier: "heroui", role: "the pill-shaped shimmer bar standing in for the whole chip while `isSkeleton`" },
}

/** LEAF — the caller flips `isSkeleton`; a pill-shaped shimmer bar stands in for the whole chip, since a soft-tinted stat pill has no icon/value/label to show yet. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="HighlightChip"
                tier="composite"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE_SKELETON}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The chip collapses to a single `h-6 w-20 rounded-full` shimmer bar matching the pill's own footprint — there is no icon/value/label distinction yet, so the placeholder draws one shape instead of three.",
                        code: "<HighlightChip isSkeleton />",
                        render: <HighlightChip isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
