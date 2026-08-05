import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProgressRing } from "@sb-components/composites/stats/ProgressRing/ProgressRing"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof ProgressRing> = {
    title: "Composites/Stats/ProgressRing",
    component: ProgressRing,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ProgressRing>

/** Story: small size variant. */
export const SizeSmall: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ProgressRing value={68} size="sm" />
        </div>
    ),
}

/** Story: medium size variant. */
export const SizeMedium: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ProgressRing value={68} size="md" />
        </div>
    ),
}

/** Story: large size variant. */
export const SizeLarge: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ProgressRing value={68} size="lg" />
        </div>
    ),
}

/** Story: ring at zero progress. */
export const Zero: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ProgressRing value={0} size="lg" caption="Not started" />
        </div>
    ),
}

/** Story: ring at full progress. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ProgressRing value={100} size="lg" tone="success" caption="Completed" />
        </div>
    ),
}

/** Story: accent tone variant. */
export const ToneAccent: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ProgressRing value={68} tone="accent" caption="Course progress" />
        </div>
    ),
}

/** Story: success tone variant. */
export const ToneSuccess: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ProgressRing value={92} tone="success" caption="Test score" />
        </div>
    ),
}

/** Story: warning tone variant. */
export const ToneWarning: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ProgressRing value={45} tone="warning" caption="This week's progress" />
        </div>
    ),
}

/** Story: danger tone variant. */
export const ToneDanger: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ProgressRing value={18} tone="danger" caption="Completion rate" />
        </div>
    ),
}

/** Story: ring with caption copy. */
export const WithCaption: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ProgressRing value={68} size="lg" caption="Course progress" />
        </div>
    ),
}

/** Custom label overrides the centered percentage with a fraction when the count reads clearer. */
export const CustomLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ProgressRing value={90} size="lg" tone="success" label="9/10" caption="Lessons completed" />
        </div>
    ),
}

/** Story: ring without caption copy. */
export const WithoutCaption: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ProgressRing value={68} size="lg" />
        </div>
    ),
}

/** Annotation for the ring/caption shimmer — the same HeroUI `Skeleton` for both the ring and the caption bar. */
const ANNOTATE_SKELETON: Record<string, AnatomyAnnotation> = {
    "Skeleton": {
        tier: "heroui",
        role: "The circular ring shimmer (diameter mirrors SIZE_MAP for the current `size`) or the optional caption bar underneath it.",
    },
}

/** LEAF — the caller flips `isSkeleton`; a circular ring shimmer stands in for the real ring, sized off the SAME `SIZE_MAP` the real ring reads so nothing jumps once `value` lands. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProgressRing"
                tier="composite"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE_SKELETON}
                states={[
                    {
                        name: "isSkeleton = true, size = \"sm\", caption unset",
                        why: "The ring shimmer renders at `size-16`, the exact diameter `SIZE_MAP.sm.ring` gives the real ring — per §12g.0 the skeleton follows the size axis the caller already picked, so the layout doesn't jump once `value` lands. No caption bar exists, since no `caption` was passed.",
                        code: "<ProgressRing isSkeleton size=\"sm\" />",
                        render: <ProgressRing isSkeleton size="sm" />,
                    },
                    {
                        name: "isSkeleton = true, size = \"md\" (default), caption unset",
                        why: "The ring shimmer grows to `size-24`, matching `SIZE_MAP.md.ring` — the default size most stat rows use.",
                        code: "<ProgressRing isSkeleton />",
                        render: <ProgressRing isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, size = \"lg\", caption unset",
                        why: "The ring shimmer reaches its largest diameter, `size-32`, matching `SIZE_MAP.lg.ring` — the scale a hero stat anchoring a page would use.",
                        code: "<ProgressRing isSkeleton size=\"lg\" />",
                        render: <ProgressRing isSkeleton size="lg" />,
                    },
                    {
                        name: "isSkeleton = true, size = \"lg\", caption set",
                        why: "A second, shorter bar appears below the ring, mirroring where the caption text would sit once real data lands — the component only checks whether `caption` is passed, not what it says, so the shimmer bar's presence tracks that prop directly.",
                        code: "<ProgressRing isSkeleton size=\"lg\" caption=\"Course progress\" />",
                        render: <ProgressRing isSkeleton size="lg" caption="Course progress" />,
                    },
                ]}
            />
        </div>
    ),
}
