import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundHubHeader } from "@sb-components/starci/blocks/learn/PlaygroundHubHeader/PlaygroundHubHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PlaygroundHubHeader` — the hub-identity cluster at the top of the
 * Docker/Kubernetes exercise grid: a title and an optional one-sentence purpose
 * line. Sibling of `ContentHeader`/`FoundationsHeader` but thinnest — no breadcrumb,
 * meta row, or secondary card. One shape: `isSkeleton` only swaps which state the
 * `Typography` renders inside the same `PageHeader`.
 */
const meta: Meta<typeof PlaygroundHubHeader> = {
    title: "StarCi/Blocks/Learn/PlaygroundHubHeader/PlaygroundHubHeader",
    component: PlaygroundHubHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundHubHeader>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the title and description, owning the type scale for both", storyId: "composites-layout-page-pageheader--full" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the hub title or its purpose line, real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — the only shape this block has: title + optional purpose line. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundHubHeader"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "real",
                        why: "The hub data has loaded, so the title and purpose line render as plain text. This is the shape every learner sees the moment they open the playground hub for their course.",
                        code: `<PlaygroundHubHeader
    title="Playground"
    description="Hands-on Docker and Kubernetes exercises. You type real commands on your own machine, with step-by-step guidance."
/>`,
                        render: (
                            <PlaygroundHubHeader

                               
                                title="Playground"
                                description="Hands-on Docker and Kubernetes exercises. You type real commands on your own machine, with step-by-step guidance."
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The hub list is still loading, so both text lines swap to their own shimmer while keeping the exact box they will hand back. The flag reaches the real atoms rather than a parallel skeleton tree, which is why the header does not jump when the data lands.",
                        code: "<PlaygroundHubHeader title=\"\" isSkeleton />",
                        render: (
                            <PlaygroundHubHeader
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
