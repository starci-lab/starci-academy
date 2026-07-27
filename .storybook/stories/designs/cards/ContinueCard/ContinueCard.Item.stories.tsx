import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCard } from "@sb-components/designs/cards/ContinueCard/ContinueCard"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { WarningIcon } from "@phosphor-icons/react"
import { Feedback } from "@sb-components/composites/feedback/Feedback/Feedback"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

// `Feedback.Empty` takes icon as a COMPONENT ref and forces `size-8` itself (§4/§5) — Phosphor's
// `weight="duotone"` can no longer ride along, so it's wrapped as a component to KEEP the stroke style.
const WarningDuotone = (props: SVGProps<SVGSVGElement>) => <WarningIcon {...props} weight="duotone" />

/**
 * DESIGN — the `item` variant of ContinueCard: one of N "resume the in-progress
 * session" cards in a grid/list (the story shows 1 representative card, the grid is
 * the consumer's concern). A static SectionCard frame; the CTA is a real SeeMoreLink
 * on its own row.
 *
 * ANATOMY IS PER-LEAF: each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Diagram + Tree) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 *
 * MIGRATED TO `states` (2026-07-27): each leaf below renders exactly one shape, so
 * each carries a single `states[]` entry. The `mx-auto max-w-4xl` that used to wrap
 * `BlockAnatomy` itself moved into `renderClassName` — the panel now keeps its own
 * full width instead of inheriting the card's cap.
 */
const meta: Meta<typeof ContinueCard> = {
    title: "Designs/Cards/ContinueCard/ContinueCard.Item",
    component: ContinueCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContinueCard>

/** Canvas padding only — the card's own width goes through `renderClassName`. */
const frame = (node: React.ReactNode) => <div className="p-8">{node}</div>

// ⭐ 2026-07-27 (deep-scan from the `CourseContents` screen): this tree PREVIOUSLY described a
// DEAD structure — `HighlightCard` (now the `isHighlight` prop on `SurfaceCard`) · `SectionCard`
// (now `SurfaceCard`) · `Typography.Title`/`Typography.Subtitle` (now parts named `Title`/`Subtitle`).
// None of those names are still emitted by the DOM, so the panel drew a tree that NEVER
// matched what was actually rendering.
//
// `Chip.Base` STILL sits under `List.Meta` even though `List.Meta` has its own story: the chip
// is built by `ContinueCard` ITSELF and placed into the `chip` slot — a child of the PARENT, the
// DOM just happens to nest it there (§11a.1). Conversely, `List.Meta`'s own insides are NOT
// declared here.
//
// The real DOM: a FLAT `SurfaceCard` (the `.Item` version does NOT turn on `isHighlight` — it's
// one of N cards in a list, not the main character) ⊃ Title · Subtitle · SeeMoreLink.
const ITEM_PARTS: Array<AnatomyNode> = [
    {
        name: "SurfaceCard.Base",
        tier: "composite",
        role: "FLAT card surface — holds the info plus the CTA row",
        storyId: "composites-cards-surfacecard-surfacecard-base--default",
        children: [
            // ⭐ 2026-07-27: two `layouts`-tier frames are now PRESENT in the tree — before,
            // this cluster was a hand-typed `<div className="flex …">` so the panel had nothing to point at.
            {
                name: "Stack.H",
                tier: "frame",
                role: "outer row — one horizontal track (children are ARBITRARY ⇒ `Stack`, not `Cluster`, §13b)",
                storyId: "frames-stack-stack-h--default",
                children: [
                    {
                        name: "Stack.V",
                        tier: "frame",
                        role: "text column — title on top, meta/subtitle underneath",
                        storyId: "frames-stack-stack-v--default",
                        children: [
                            { name: "Typography.Base", tier: "atom", role: "the item name — medium weight, truncate", storyId: "atoms-text-typography-typography-base--plain" },
                            { name: "Typography.Base", tier: "atom", role: "the second line under the name — the subtitle (muted, truncate, shown only when there's no meta/timeLeft) real, or its mirror bar while loading", storyId: "atoms-text-typography-typography-base--plain" },
                        ],
                    },
                ],
            },
            { name: "Link.SeeMore", tier: "atom", role: "CTA \"Tiếp tục →\" on its own row — hover/click lives on the link ITSELF, not wrapping the whole card (wrapping would nest controls and steal hover)", storyId: "atoms-navigation-link-link-seemore--default" },
        ],
    },
]

// error leaf: connection drop → `Feedback.Empty` sits INSIDE the frame, the Retry button is in the `action` prop.
const ERROR_PARTS: Array<AnatomyNode> = [
    {
        name: "SurfaceCard.Base",
        tier: "composite",
        role: "the very SAME frame — an error must never make the frame disappear",
        storyId: "composites-cards-surfacecard-surfacecard-base--default",
        children: [
            {
                name: "Feedback.Empty",
                tier: "composite",
                role: "danger tone + icon + description + a Retry button",
                state: "danger",
                storyId: "composites-feedback-feedback-feedback-empty--action",
                children: [
                    { name: "Button.Base", tier: "atom", role: "retry button (secondary, inside the `action` prop — built by the STORY, so it is still declared, §11a.1)", storyId: "atoms-buttons-button-button-base--default" },
                ],
            },
        ],
    },
]

/** The loaded item card — one representative (grid is the consumer's concern). Migrated to `states` 2026-07-27. */
export const Content: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Content"
                parts={ITEM_PARTS}
                renderClassName="mx-auto max-w-4xl"
                reason={
                    "The \"item\" variant (1-of-N — the story shows 1 representative card, the grid is the consumer's concern). Each state is 1 leaf in the folder: Item (content, SeeMoreLink CTA) · Loading (Skeleton mirrors the item LAYOUT, NO progress/sweep) · Network-drop error (Feedback.Empty tone=\"danger\" inside SectionCard). Skeleton mirrors layout, no pulse/animation."
                }
                states={[
                    {
                        name: "title, subtitle, href all set (loaded)",
                        why: "The card mounts `Title`, `Subtitle`, and a `SeeMoreLink` CTA on its own row inside a flat `SurfaceCard`. This is the everyday shape shown once the caller's data has actually arrived.",
                        code: `<ContinueCard.Item
    title="Building a RESTful API with NestJS"
    subtitle="Reading"
    href="/courses/nestjs-api/lessons/5"
/>`,
                        render: (
                            <div className="w-80">
                                <ContinueCard.Item title="Building a RESTful API with NestJS" subtitle="Reading" href="/courses/nestjs-api/lessons/5" showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />,
        ),
}

/**
 * STATE isSkeleton — mirror shimmer via the component's OWN `isSkeleton` prop.
 * Same COMPOSITION as the loaded item leaf (§11f: state, not structure) — reuses
 * `ITEM_PARTS`, no hand-rolled skeleton tree. Migrated to `states` 2026-07-27.
 */
export const Skeleton: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Prop `isSkeleton`"
                parts={ITEM_PARTS}
                renderClassName="mx-auto max-w-4xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The same `SurfaceCard` ⊃ `Stack.H` ⊃ `Stack.V` tree mounts as the loaded state, but each text part renders its shimmer bar instead of real content — the composition never changes, only its state does (§11f). The layout has to hold still while data loads, which is only possible if the skeleton reuses the exact same structure as the real card.",
                        code: `<ContinueCard.Item
    title="Building a RESTful API with NestJS"
    subtitle="Reading"
    href="/courses/nestjs-api/lessons/5"
    isSkeleton
/>`,
                        render: (
                            <div className="w-80">
                                <ContinueCard.Item
                                    title="Building a RESTful API with NestJS"
                                    subtitle="Reading"
                                    href="/courses/nestjs-api/lessons/5"
                                    isSkeleton
                                    showAnatomy
                                />
                            </div>
                        ),
                    },
                ]}
            />,
        ),
}

/** Network drop — error rendered INSIDE the card frame (not a blank card). Migrated to `states` 2026-07-27. */
export const LoadError: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="LoadError"
                parts={ERROR_PARTS}
                renderClassName="mx-auto max-w-4xl"
                states={[
                    {
                        name: "network request for this card failed",
                        why: "`Title`/`Subtitle`/`SeeMoreLink` disappear and `Feedback.Empty` mounts in their place, danger-toned, with a Retry button inside the same `SurfaceCard` frame. The frame itself must never vanish on error, so the reader still sees a card-shaped region instead of a hole in the grid.",
                        code: `<SurfaceCard.Base>
    <Feedback.Empty
        tone="danger"
        title="Connection lost"
        description="The network seems to have dropped. Check your connection and try again."
        action={<Button.Base variant="secondary" label="Retry" />}
    />
</SurfaceCard.Base>`,
                        render: (
                            <div className="w-80">
                                <SurfaceCard.Base anatPart="SurfaceCard.Base">
                                    <Feedback.Empty
                                        anatPart="Feedback.Empty"
                                        tone="danger"
                                        icon={WarningDuotone}
                                        title="Connection lost"
                                        description="The network seems to have dropped. Check your connection and try again."
                                        action={
                                            <Button.Base variant="secondary" size="sm" label="Retry" onPress={() => {}} anatPart="Button.Base" />
                                        }
                                    />
                                </SurfaceCard.Base>
                            </div>
                        ),
                    },
                ]}
            />,
        ),
}
