import type { Meta, StoryObj } from "@storybook/nextjs"
import { SectionHeading } from "@sb-components/nivo/blocks/landing/SectionHeading/SectionHeading"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SectionHeading` — the shared landing section header: accent eyebrow, `h2`
 * title, optional intro. `align` is the one thing that varies between the
 * centered marketing sections and a left-aligned header, so it is the leaf.
 */
const meta: Meta<typeof SectionHeading> = {
    title: "Nivo/Blocks/Landing/SectionHeading/SectionHeading",
    component: SectionHeading,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SectionHeading>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    StackV: { tier: "frame", role: "the eyebrow / title / intro stack, aligned by the leaf" },
    Typography: { tier: "atom", role: "the eyebrow, title, and intro" },
}

/** LEAF — `align`: full coverage of both members of the union. */
export const Align: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SectionHeading"
                tier="block"
                leaf="align"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. This header takes no domain data — it is app-specific copy chrome — so the one prop with a visual effect is `align`, which decides whether the eyebrow, title, and intro center (the marketing story-beat and FAQ headers) or hang to the start (a left-aligned section)."
                states={[
                    {
                        name: "align = center",
                        why: "The default for the marketing sections — the story-beat and FAQ headers sit centered above their content.",
                        code: `<SectionHeading
    eyebrow="What you can launch"
    title="Two products, one platform"
    intro={intro}
    align="center"
/>`,
                        render: (
                            <SectionHeading
                                eyebrow="What you can launch"
                                title="Two products, one platform"
                                intro="Each ships with its own pricing plans — pick the one that fits and go."
                                align="center"
                            />
                        ),
                    },
                    {
                        name: "align = start",
                        why: "For a section that wants a left-aligned header — the eyebrow, title, and intro all hang to the start edge.",
                        code: `<SectionHeading
    eyebrow="What you can launch"
    title="Two products, one platform"
    intro={intro}
    align="start"
/>`,
                        render: (
                            <SectionHeading
                                eyebrow="What you can launch"
                                title="Two products, one platform"
                                intro="Each ships with its own pricing plans — pick the one that fits and go."
                                align="start"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
