import type { Meta, StoryObj } from "@storybook/nextjs"
import { FoundationsHeader } from "@sb-components/starci/blocks/learn/FoundationsHeader/FoundationsHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FoundationsHeader` — the category-identity cluster at the top of a foundations
 * category screen: a breadcrumb trail (home → courses → course → foundations hub →
 * this category), a title, and an optional description. Deliberately thin — a
 * foundations category is a navigational hub, so no read-state chip, meta row, or
 * secondary card. The description may drop out; `isSkeleton` swaps every composed
 * atom for its mirror.
 */
const meta: Meta<typeof FoundationsHeader> = {
    title: "StarCi/Blocks/Learn/FoundationsHeader/FoundationsHeader",
    component: FoundationsHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationsHeader>

const CRUMBS = [
    { key: "home", label: "Home", onPress: () => {} },
    { key: "courses", label: "Courses", onPress: () => {} },
    { key: "course", label: "DevOps Mastery", onPress: () => {} },
    { key: "foundations", label: "Foundations", onPress: () => {} },
    { key: "category", label: "Linux & Shell" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the trail, title and description, owning the type scale for all three", storyId: "composites-layout-page-pageheader--full" },
    "Breadcrumbs": { tier: "atom", role: "the trail the block builds from crumb data handed down by the screen", storyId: "atoms-navigation-breadcrumbs-breadcrumbs--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the category title or its description, real or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
}

/** LEAF — full set: trail → title → optional description. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationsHeader"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "with description",
                        why: "The category has a one-sentence summary, so it renders directly below the title. This is the shape most foundations categories show, since authors usually give the hub a short pitch.",
                        code: `<FoundationsHeader
    breadcrumbItems={crumbs}
    title="Linux & Shell"
    description="Master the command line, permissions, and the core system operations every engineer needs."
/>`,
                        render: (
                            <FoundationsHeader

                               
                                breadcrumbItems={CRUMBS}
                                title="Linux & Shell"
                                description="Master the command line, permissions, and the core system operations every engineer needs."
                            />
                        ),
                    },
                    {
                        name: "without description",
                        why: "No summary was authored for this category, so the description line drops out and the header ends right after the title. The trail and title keep their place regardless — only this one line is optional.",
                        code: `<FoundationsHeader
    breadcrumbItems={crumbs}
    title="Linux & Shell"
/>`,
                        render: (
                            <FoundationsHeader
                                breadcrumbItems={CRUMBS}
                                title="Linux & Shell"
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
                name="FoundationsHeader"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every atom the block composes swaps to its own shimmer while the category is still loading, keeping the exact box it will hand back. The flag reaches the real atoms rather than a parallel skeleton tree, which is why the header does not jump when the data lands.",
                        code: "<FoundationsHeader title=\"\" isSkeleton />",
                        render: (
                            <FoundationsHeader

                               
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
