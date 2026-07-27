import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentPager } from "@sb-components/blocks/learn/ContentPager/ContentPager"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentPager`: step to the neighbouring lesson, at the foot of the
 * reading screen.
 *
 * WHY A BLOCK: it knows what a LESSON is — the cards carry a lesson title and a
 * lesson link, and the block words "Bài trước" / "Bài sau" itself. A frame would
 * only know it has two cells.
 *
 * ⚠️ ASYMMETRY IS THE POINT. The right card mirrors the left one so the pair
 * reads as a DIRECTION rather than as two identical cards, and it pins to the
 * second column only where the grid really has two — a CONTAINER query, because
 * the split is decided by the slot the block sits in, not by the window.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). Losing one of the two cards changes the shape,
 * so each edge case is its own leaf; so is the caller flipping `isSkeleton`.
 * Having no neighbour at all renders NOTHING, which is a leaf that shows the
 * block's own absence — the first and last lesson of a course are ordinary
 * cases, not errors.
 */
const meta: Meta<typeof ContentPager> = {
    title: "Blocks/Learn/ContentPager/ContentPager",
    component: ContentPager,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentPager>

const PREVIOUS = { title: "Image layer và cache hoạt động ra sao", href: "#prev" }
const NEXT = { title: "Multi-stage build: bỏ toolchain khỏi image chạy thật", href: "#next" }

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardPressableGroup": { tier: "composite", role: "the pressable card pair and the grid they sit in, owning the card box, the hover skin and the one-to-two column split", storyId: "composites-cards-surfacecard-surfacecardpressablegroup--default" },
    "StackH": { tier: "frame", role: "the horizontal frame inside one card, holding the direction caret beside the two text lines", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the vertical frame stacking the direction label above the lesson title, with no seam because the two are one unit of meaning", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "one of the card's two lines — the muted direction label, or the lesson title clamped to two lines", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — a lesson in the middle of a module: both neighbours exist. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
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
    ariaLabel="Điều hướng bài học"
    previous={{ title: "Image layer và cache hoạt động ra sao", href: prevHref }}
    next={{ title: "Multi-stage build: bỏ toolchain khỏi image chạy thật", href: nextHref }}
/>`,
                        render: (
                            <ContentPager
                                anatPart="ContentPager"
                                showAnatomy
                                ariaLabel="Điều hướng bài học"
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
        <div className="p-8">
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
    ariaLabel="Điều hướng bài học"
    next={{ title: "Multi-stage build: bỏ toolchain khỏi image chạy thật", href: nextHref }}
/>`,
                        render: (
                            <ContentPager
                                anatPart="ContentPager"
                                showAnatomy
                                ariaLabel="Điều hướng bài học"
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
        <div className="p-8">
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
    ariaLabel="Điều hướng bài học"
    previous={{ title: "Image layer và cache hoạt động ra sao", href: prevHref }}
/>`,
                        render: (
                            <ContentPager
                                anatPart="ContentPager"
                                showAnatomy
                                ariaLabel="Điều hướng bài học"
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
        <div className="p-8">
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
                        code: "<ContentPager ariaLabel=\"Điều hướng bài học\" isSkeleton />",
                        render: (
                            <ContentPager
                                anatPart="ContentPager"
                                showAnatomy
                                ariaLabel="Điều hướng bài học"
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
