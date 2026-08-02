import type { Meta, StoryObj } from "@storybook/nextjs"
import { SubmissionResultHeader } from "@sb-components/starci/blocks/learn/SubmissionResultHeader/SubmissionResultHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SubmissionResultHeader` — the identity band of a graded-result page: a way back
 * to the challenge, plus the requirement's title and description. Sibling of
 * `ContentHeader`, but a result page has left the material — no read-state chip,
 * minutes, or outcomes card, just "where am I, what is this, how do I leave". The
 * breadcrumb slot holds a `LinkBack` composed from `backLabel` + `onBack`. One
 * shape: `isSkeleton` is a state, since only the data changes.
 */
const meta: Meta<typeof SubmissionResultHeader> = {
    title: "StarCi/Blocks/Learn/SubmissionResultHeader/SubmissionResultHeader",
    component: SubmissionResultHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SubmissionResultHeader>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the back-link, title and description, owning the type scale for both", storyId: "composites-layout-page-pageheader--full" },
    "LinkBack": { tier: "atom", role: "the back-link the block builds from the caller's label + handler, dropped into PageHeader's breadcrumb slot", storyId: "atoms-navigation-link-linkback--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the requirement title or its description, real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — the one shape this block draws: back-link → title → description. */
export const Header: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SubmissionResultHeader"
                tier="block"
                leaf="Header"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "default",
                        why: "The learner has just landed on the result of a graded submission. The back-link returns to the challenge solve page (the run stays there, resumable), and the title/description repeat the requirement that was graded so the verdict below has context.",
                        code: `<SubmissionResultHeader
    backLabel="Back to solve page"
    onBack={() => {}}
    title="Normalize the orders table schema"
    description="Split the orders table into 3NF, keeping every existing foreign-key constraint intact."
/>`,
                        render: (
                            <SubmissionResultHeader

                               
                                backLabel="Back to solve page"
                                onBack={() => {}}
                                title="Normalize the orders table schema"
                                description="Split the orders table into 3NF, keeping every existing foreign-key constraint intact."
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The requirement hasn't loaded yet. `LinkBack` has no skeleton mode of its own, so the block stands a `Typography` bar in its place at the same text scale it renders at, alongside the title/description bars — every part shimmers at the box it will hand back.",
                        code: "<SubmissionResultHeader backLabel=\"\" onBack={() => {}} title=\"\" isSkeleton />",
                        render: (
                            <SubmissionResultHeader

                               
                                backLabel=""
                                onBack={() => {}}
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
