import type { Meta, StoryObj } from "@storybook/nextjs"
import { FoundationHeader, FoundationKind } from "@sb-components/starci/blocks/learn/FoundationHeader/FoundationHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FoundationHeader` — the identity cluster at the top of a foundation resource's
 * page: breadcrumb trail, title, description, and a meta row carrying the
 * resource's kind, its recommended flag, its tags, and its author attribution.
 * Two chips (kind and "recommended") both classify the resource. Every optional
 * part — recommended chip, tag row, author line, skeleton — is a data condition
 * on the same trail → title → description → meta shape.
 */
const meta: Meta<typeof FoundationHeader> = {
    title: "StarCi/Blocks/Learn/FoundationHeader/FoundationHeader",
    component: FoundationHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationHeader>

const CRUMBS = [
    { key: "home", label: "Home", onPress: () => {} },
    { key: "course", label: "DevOps Mastery", onPress: () => {} },
    { key: "hub", label: "Foundations", onPress: () => {} },
    { key: "category", label: "Linux Basics", onPress: () => {} },
]

const TAGS = [
    { key: "linux", label: "Linux" },
    { key: "shell", label: "Shell" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the trail, title, description and meta row, owning the type scale for all four", storyId: "composites-layout-page-pageheader--full" },
    "Breadcrumbs": { tier: "atom", role: "the trail the block builds from crumb data handed down by the screen", storyId: "atoms-navigation-breadcrumbs-breadcrumbs--default" },
    "StackV": { tier: "frame", role: "the vertical frame separating the chip row from the author line, owning the seam between the two meta regions", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal frame holding the chip row, so kind/recommended/tags sit on one baseline with one seam", storyId: "frames-stack-stackh--default" },
    "EnumChip": { tier: "composite", role: "the resource-kind badge, looked up in the block's own kind → tone/label table", storyId: "composites-chips-enumchip--overview" },
    "Chip": { tier: "atom", role: "the recommended badge or a topic tag, both untoned or success-toned by the block, never by the caller", storyId: "atoms-chips-chip-chip--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the title, its description, or the author attribution — real or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
}

/** LEAF — the resource identity cluster: trail → title → description → meta row (kind + recommended + tags + author). Every difference below is a DATA condition inside this one leaf, not a structural one. */
export const Overview: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationHeader"
                tier="block"
                leaf="FoundationHeader"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "kind = document, isRecommended, with tags and author",
                        why: "Every optional field is present: the kind chip opens the row, the success-toned recommended pill follows it, then the topic tags, and the author line closes the cluster. This is the richest shape the meta row ever takes, so it is the anatomy reference.",
                        code: `<FoundationHeader
    breadcrumbItems={crumbs}
    title="Managing processes in Linux"
    description="Processes, signals, and how the shell tracks a running program."
    kind={FoundationKind.Document}
    isRecommended
    tags={tags}
    author="Rob Pike"
/>`,
                        render: (
                            <FoundationHeader


                                breadcrumbItems={CRUMBS}
                                title="Managing processes in Linux"
                                description="Processes, signals, and how the shell tracks a running program."
                                kind={FoundationKind.Document}
                                isRecommended
                                tags={TAGS}
                                author="Rob Pike"
                            />
                        ),
                    },
                    {
                        name: "kind = video, not recommended, no tags, no author",
                        why: "Only the required kind chip stays: the recommended pill drops out, the tag row is gone, and the author line does not render at all — a resource with none of the optional attribution still reads as complete, not as missing information.",
                        code: `<FoundationHeader
    breadcrumbItems={crumbs}
    title="Introduction to Docker networking"
    kind={FoundationKind.Video}
/>`,
                        render: (
                            <FoundationHeader
                                breadcrumbItems={CRUMBS}
                                title="Introduction to Docker networking"
                                kind={FoundationKind.Video}
                            />
                        ),
                    },
                    {
                        name: "kind = external_link, isSkeleton = true",
                        why: "Every atom the block composes swaps to its own shimmer while the resource is still loading — the kind chip through `EnumChip`, a placeholder recommended pill, two placeholder tag pills, and an author-line bar — keeping the exact footprint the data lands into, so nothing jumps once it resolves.",
                        code: `<FoundationHeader
    breadcrumbItems={crumbs}
    title=""
    kind={FoundationKind.ExternalLink}
    isSkeleton
/>`,
                        render: (
                            <FoundationHeader
                                breadcrumbItems={CRUMBS}
                                title=""
                                kind={FoundationKind.ExternalLink}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
