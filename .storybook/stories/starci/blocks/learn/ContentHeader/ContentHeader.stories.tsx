import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentHeader } from "@sb-components/starci/blocks/learn/ContentHeader/ContentHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentHeader`: the LESSON-IDENTITY cluster at the top of the reading
 * screen. It answers one question, "what is this lesson", and the screen calls
 * this one block instead of holding a header frame plus loose atoms.
 *
 * SIBLING OF `CourseBrief`, NOT A COPY. Both place identity into `PageHeader`,
 * but a course brief counts modules, hours and learners, while a lesson header
 * carries read state, reading time, challenge count, and learning outcomes.
 *
 * ⚠️ ONE CHIP PER CLUSTER (`starci-fe/no-adjacent-chip`). Read state is the one
 * classifying fact, so it takes the chip; reading time and challenge count are
 * quiet facts riding as muted text with an inline icon. The `src` original gave
 * all three their own weight, which reads as three competing signals.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). `isRead` toggles a chip inside one cluster, so
 * it is a STATE. Losing the whole outcomes card, and the caller flipping
 * `isSkeleton`, each change the shape ⇒ their own leaf.
 *
 * ⛔ There is deliberately NO "no breadcrumb" leaf. A lesson is always reached
 * through its course, so the trail always exists — building that leaf would be
 * inventing a case no screen asks for (§14d.3).
 */
const meta: Meta<typeof ContentHeader> = {
    title: "StarCi/Blocks/Learn/ContentHeader/ContentHeader",
    component: ContentHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentHeader>

const CRUMBS = [
    { key: "courses", label: "Courses", onPress: () => {} },
    { key: "course", label: "DevOps Mastery", onPress: () => {} },
    { key: "modules", label: "Chapter 2 · Containerization" },
]

const OUTCOMES = [
    { key: "layer", text: "Read every layer in an image and spot which one is bloating it" },
    { key: "cache", text: "Order a Dockerfile so the cache still works after every code change" },
    { key: "multistage", text: "Use multi-stage builds to keep the toolchain out of the production image" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame separating the header proper from the outcomes card, owning the seam between the two regions", storyId: "frames-stack-stackv--default" },
    "PageHeader": { tier: "composite", role: "the header frame that lines up the trail, title, description and meta row, owning the type scale for all four", storyId: "composites-layout-page-pageheader--full" },
    "Breadcrumbs": { tier: "atom", role: "the trail the block builds from crumb data handed down by the screen", storyId: "atoms-navigation-breadcrumbs-breadcrumbs--default" },
    "StackH": { tier: "frame", role: "the horizontal frame holding the meta row, so the chip and the two quiet facts sit on one baseline with one seam", storyId: "frames-stack-stackh--default" },
    "Chip": { tier: "atom", role: "the read-state badge, the single classifying fact in the meta row and therefore the only chip in it", storyId: "atoms-chips-chip-chip--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the lesson title, its description, reading time, or challenge count — real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
    "SurfaceCardList": { tier: "composite", role: "the what-you-will-learn card, taking outcome rows as data and drawing the label, the rows and their dividers itself", storyId: "composites-cards-surfacecard-surfacecardlist--default" },
}

/** LEAF — full set: trail → title → description → meta row → outcomes card. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentHeader"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isRead = true",
                        why: "The learner has finished this lesson, so the meta row opens with the read chip and the two quiet facts follow it. This is the shape a returning reader sees, and the chip is what tells them they are re-reading rather than starting.",
                        code: `<ContentHeader
    breadcrumbItems={crumbs}
    title="Writing an optimized Dockerfile"
    description="Layers, caching, and multi-stage builds — the three things that decide whether an image is heavy or light."
    isRead
    minutesRead={12}
    challengeCount={3}
    outcomes={outcomes}
/>`,
                        render: (
                            <ContentHeader
                                anatPart="ContentHeader"
                                showAnatomy
                                breadcrumbItems={CRUMBS}
                                title="Writing an optimized Dockerfile"
                                description="Layers, caching, and multi-stage builds — the three things that decide whether an image is heavy or light."
                                isRead
                                minutesRead={12}
                                challengeCount={3}
                                outcomes={OUTCOMES}
                            />
                        ),
                    },
                    {
                        name: "isRead = false",
                        why: "Nothing has been read yet, so the chip drops out and the meta row carries only reading time and challenge count. The row keeps its place and its seam, which is why an unread lesson does not look like a lesson missing information.",
                        code: `<ContentHeader
    breadcrumbItems={crumbs}
    title="Writing an optimized Dockerfile"
    description="Layers, caching, and multi-stage builds — the three things that decide whether an image is heavy or light."
    minutesRead={12}
    challengeCount={3}
    outcomes={outcomes}
/>`,
                        render: (
                            <ContentHeader
                                breadcrumbItems={CRUMBS}
                                title="Writing an optimized Dockerfile"
                                description="Layers, caching, and multi-stage builds — the three things that decide whether an image is heavy or light."
                                minutesRead={12}
                                challengeCount={3}
                                outcomes={OUTCOMES}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the lesson states no outcomes ⇒ **loses** the whole `SurfaceCardList` node. */
export const NoOutcomes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentHeader"
                tier="block"
                leaf="No outcomes"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "outcomes = []",
                        why: "The outcomes card is not drawn at all, so the header ends at its meta row and the lesson body follows straight after. A lesson whose author never listed outcomes should say nothing there rather than show an empty card claiming a section exists.",
                        code: `<ContentHeader
    breadcrumbItems={crumbs}
    title="Quick notes on BuildKit"
    minutesRead={4}
    challengeCount={0}
/>`,
                        render: (
                            <ContentHeader
                                anatPart="ContentHeader"
                                showAnatomy
                                breadcrumbItems={CRUMBS}
                                title="Quick notes on BuildKit"
                                minutesRead={4}
                                challengeCount={0}
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
                name="ContentHeader"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every atom the block composes swaps to its own shimmer while the lesson is still loading, keeping the exact box it will hand back. The flag reaches the real atoms rather than a parallel skeleton tree, which is why the header does not jump when the data lands.",
                        code: "<ContentHeader title=\"\" isSkeleton />",
                        render: (
                            <ContentHeader
                                anatPart="ContentHeader"
                                showAnatomy
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
