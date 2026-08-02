import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentPager } from "@sb-components/starci/blocks/learn/ContentPager/ContentPager"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ContentPager` — step to the neighbouring lesson at the foot of the reading
 * screen. It owns the "previous lesson" / "next lesson" labels and the lesson
 * title + link on each card. The right card mirrors the left so the pair reads
 * as a direction, pinning to a second column only where the grid has two (a
 * container query). Losing either card, and `isSkeleton`, are each their own
 * leaf; having no neighbour renders nothing.
 */
const meta: Meta<typeof ContentPager> = {
    title: "StarCi/Blocks/Learn/ContentPager/ContentPager",
    component: ContentPager,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentPager>

const PREVIOUS = { title: "How image layers and cache actually work", href: "#prev" }
const NEXT = { title: "Multi-stage builds: stripping the toolchain out of the runtime image", href: "#next" }

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardPressableGroup": { tier: "composite", role: "the pressable card pair and the grid they sit in, owning the card box, the hover skin and the one-to-two column split", storyId: "composites-cards-surfacecard-surfacecardpressablegroup--default" },
    "StackH": { tier: "frame", role: "the horizontal frame inside one card, holding the direction caret beside the two text lines", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the vertical frame stacking the direction label above the lesson title, with no seam because the two are one unit of meaning", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "one of the card's two lines — the muted direction label, or the lesson title clamped to two lines", storyId: "atoms-text-typography-typography--overview" },
}

/** LEAF — a lesson in the middle of a module: both neighbours exist. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentPager"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "previous set, next set",
                        why: "Both cards render and the pair splits into two columns, the back card reading left-to-right and the forward card mirrored against the right edge. This is the shape for any lesson in the middle of a module, which is most of them.",
                        code: `<ContentPager
    ariaLabel="Go to previous or next content"
    previous={{ title: "How image layers and cache actually work", href: prevHref }}
    next={{ title: "Multi-stage builds: stripping the toolchain out of the runtime image", href: nextHref }}
/>`,
                        render: (
                            <ContentPager

                               
                                ariaLabel="Go to previous or next content"
                                previous={PREVIOUS}
                                next={NEXT}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the FIRST lesson ⇒ **loses** the back card, and the forward card holds the right column alone. */
export const NextOnly: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentPager"
                tier="block"
                leaf="Next only"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "previous = undefined",
                        why: "The back card is not drawn and the forward card still holds the right column, so the empty left half reads as the start of the module rather than as a card that failed to load. Pinning is what makes the gap legible: a forward card sliding left would look like an ordinary single card.",
                        code: `<ContentPager
    ariaLabel="Go to previous or next content"
    next={{ title: "Multi-stage builds: stripping the toolchain out of the runtime image", href: nextHref }}
/>`,
                        render: (
                            <ContentPager

                               
                                ariaLabel="Go to previous or next content"
                                next={NEXT}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the LAST lesson ⇒ **loses** the forward card. */
export const PreviousOnly: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentPager"
                tier="block"
                leaf="Previous only"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "next = undefined",
                        why: "Only the back card remains, sitting in the left column where it always sits. The learner has reached the end of the module, and the block says so by leaving the forward half empty instead of offering a dead control.",
                        code: `<ContentPager
    ariaLabel="Go to previous or next content"
    previous={{ title: "How image layers and cache actually work", href: prevHref }}
/>`,
                        render: (
                            <ContentPager

                               
                                ariaLabel="Go to previous or next content"
                                previous={PREVIOUS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, so the group draws its own card mirror. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentPager"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The group draws the shimmer itself, keeping the same two card boxes and the same column split the real pager will take. The flag reaches the composite that owns the box rather than a parallel skeleton tree, so nothing shifts when the neighbours arrive.",
                        code: "<ContentPager ariaLabel=\"Go to previous or next content\" isSkeleton />",
                        render: (
                            <ContentPager

                               
                                ariaLabel="Go to previous or next content"
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
