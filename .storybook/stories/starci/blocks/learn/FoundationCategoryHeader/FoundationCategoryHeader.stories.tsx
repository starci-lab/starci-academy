import type { Meta, StoryObj } from "@storybook/nextjs"
import { FoundationCategoryHeader } from "@sb-components/starci/blocks/learn/FoundationCategoryHeader/FoundationCategoryHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FoundationCategoryHeader` — the Foundations-hub identity cluster: a breadcrumb
 * trail above a title and description, nothing more. Sibling of `ContentHeader`
 * but thinner — a Foundations category carries no read state, reading time, or
 * outcomes, so it stops at the description. The breadcrumb slot is optional and
 * simply drops out when absent.
 */
const meta: Meta<typeof FoundationCategoryHeader> = {
    title: "StarCi/Blocks/Learn/FoundationCategoryHeader/FoundationCategoryHeader",
    component: FoundationCategoryHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationCategoryHeader>

const CRUMBS = [
    { key: "foundations", label: "Foundations", onPress: () => {} },
    { key: "category", label: "Programming Basics" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the trail above the stacked title and description, owning the type scale for both", storyId: "composites-layout-page-pageheader--full" },
    "Breadcrumbs": { tier: "atom", role: "the trail the block builds from crumb data handed down by the screen", storyId: "atoms-navigation-breadcrumbs-breadcrumbs--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the category title or its description — real or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
}

/** LEAF — trail → title → description. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationCategoryHeader"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "trail + description present",
                        why: "The reader arrived through the Foundations hub, so the trail sits above the title and a one-sentence description follows it. This is the shape every category page opens with once its data has loaded.",
                        code: `<FoundationCategoryHeader
    breadcrumbItems={crumbs}
    title="Programming Basics"
    description="Variables, data types, loops — the groundwork before moving on to a framework."
/>`,
                        render: (
                            <FoundationCategoryHeader


                                breadcrumbItems={CRUMBS}
                                title="Programming Basics"
                                description="Variables, data types, loops — the groundwork before moving on to a framework."
                            />
                        ),
                    },
                    {
                        name: "description omitted",
                        why: "Not every category needs a summary sentence. `PageHeader` already drops the description row when it is not supplied, so the block passes that through rather than inventing filler text.",
                        code: `<FoundationCategoryHeader
    breadcrumbItems={crumbs}
    title="Programming Basics"
/>`,
                        render: (
                            <FoundationCategoryHeader
                                breadcrumbItems={CRUMBS}
                                title="Programming Basics"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, so every atom swaps to its own mirror. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationCategoryHeader"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every atom the block composes swaps to its own shimmer while the category is still loading, including the trail — the flag reaches the real atoms rather than a parallel skeleton tree, which is why the header does not jump when the data lands.",
                        code: "<FoundationCategoryHeader title=\"\" isSkeleton />",
                        render: (
                            <FoundationCategoryHeader


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
