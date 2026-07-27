import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCardHero } from "@sb-components/blocks/learn/ContinueCard/ContinueCard"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { WarningIcon } from "@phosphor-icons/react"
import { FeedbackEmpty } from "@sb-components/composites/feedback/Feedback/Feedback"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

// `FeedbackEmpty` accepts icon as a COMPONENT ref and forces `size-8` itself (§4/§5) —
// phosphor's `weight="duotone"` can no longer tag along, so it's wrapped in a component to KEEP the artwork.
const WarningDuotone = (props: SVGProps<SVGSVGElement>) => <WarningIcon {...props} weight="duotone" />

/**
 * DESIGN — the `hero` ContinueCard in its NO-PROGRESS shape (no `value` → no
 * ProgressMeter). Each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Diagram + Tree) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ContinueCardHero> = {
    title: "Blocks/Learn/ContinueCard/Hero/No progress",
    component: ContinueCardHero,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContinueCardHero>

/** Plain canvas — each story wraps its render in its own per-leaf BlockAnatomy. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// scenario base = the no-progress-yet shape (no value passed → ProgressMeter doesn't render).
const noProgressBase = {
    title: "Mock interview: Design a rate limiter",
    meta: ["Question 2 / 8", "Middle"],
    timeLeft: "40 minutes left",
    onPress: () => {},
    showAnatomy: true,
}

// ⭐ 2026-07-27 (deep-scan from the `CourseContents` screen): this tree USED TO describe
// DEAD structure — `HighlightCard` (now the `isHighlight` prop on `SurfaceCard`) ·
// `SectionCard` (now `SurfaceCard`) · `Typography.Title`/`Typography.Subtitle` (now parts
// named `Title`/`Subtitle`). None of those names are emitted by the DOM anymore, so the
// panel drew a tree that NEVER matched what was actually rendering.
//
// `Chip` STILL sits under `ListMeta` even though `ListMeta` has its own story: the
// chip is built by `ContinueCard` ITSELF and placed into the `chip` slot — a child of the
// PARENT, the DOM just happens to nest it in (§11a.1). Conversely, the INSIDE of
// `ListMeta` is NOT declared here.
//
// Real DOM: `SurfaceCard`(isHighlight) ⊃ Title · ListMeta(⊃ Chip) · Button.
// NO `ProgressMeter` — its absence IS exactly the mark distinguishing this shape from the
// Progress version (§11f).
const NO_PROGRESS_PARTS: Array<AnatomyNode> = [
    {
        name: "SurfaceCard",
        tier: "composite",
        role: "card surface, where `isHighlight` turns on the hero accent glow. The frame stays put across every state, so switching state never shifts the layout",
        storyId: "composites-cards-surfacecard-surfacecard--default",
        children: [
            // ⭐ 2026-07-27: two frames from the `layouts` tier now APPEAR in the tree —
            // before, this cluster was a hand-typed `<div className="flex …">`, so the
            // panel had nothing to point at.
            {
                name: "StackH",
                tier: "frame",
                role: "outer row, one horizontal track (children are arbitrary, so it uses `Stack`, not `Cluster`, §13b)",
                storyId: "frames-stack-stackh--default",
                children: [
                    {
                        name: "StackV",
                        tier: "frame",
                        role: "text column, title on top and meta/subtitle underneath",
                        storyId: "frames-stack-stackv--default",
                        children: [
                            { name: "Typography", tier: "atom", role: "name of the session in progress, medium + truncate — or, while loading, a mirror bar standing in for the meta row (isSkeleton)", storyId: "atoms-text-typography-typography--plain" },
                            {
                                name: "ListMeta",
                                tier: "composite",
                                role: "meta row: muted fragments joined by ·",
                                storyId: "composites-lists-list-listmeta--with-chip",
                                children: [
                                    { name: "Chip", tier: "atom", role: "time-remaining chip, the `chip` slot that grows inside ListMeta", state: "neutral", storyId: "atoms-chips-chip-chip--default" },
                                ],
                            },
                        ],
                    },
                ],
            },
            { name: "Button", tier: "atom", role: "resume CTA (primary, onPress + ArrowRight)", storyId: "atoms-buttons-button-button--default" },
        ],
    },
]

// error leaf: network drop → `FeedbackEmpty` SITS INSIDE the frame, the Retry button is in the `action` prop.
const ERROR_PARTS: Array<AnatomyNode> = [
    {
        name: "SurfaceCard",
        tier: "composite",
        role: "the very same frame, since an error must never make the frame disappear",
        storyId: "composites-cards-surfacecard-surfacecard--default",
        children: [
            {
                name: "FeedbackEmpty",
                tier: "composite",
                role: "danger tone + icon + description + a Retry button",
                state: "danger",
                storyId: "composites-feedback-feedback-feedbackempty--action",
                children: [
                    { name: "Button", tier: "atom", role: "retry button (secondary, inside the `action` prop, built by the STORY, so it is still declared, §11a.1)", storyId: "atoms-buttons-button-button--default" },
                ],
            },
        ],
    },
]

/** STATE loaded — no progress yet: neutral time chip, NO bar (value omitted). */
export const NotStarted: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="block"
                leaf="NotStarted"
                parts={NO_PROGRESS_PARTS}
                reason="Anatomy of the loaded LEAF 'No progress': ONLY the parts this leaf composes (NO ProgressMeter, that's the SHAPE difference from 'Progress'). Loading/error are SEPARATE leaves with their own composition, not included here."
                states={[
                    {
                        name: "value not passed (no progress yet)",
                        why: "No ProgressMeter renders at all; the card stops at title, meta chip, and the resume button. The bar's absence IS the mark distinguishing a session that has not started from one already tracking a percentage.",
                        code: `<ContinueCardHero
    title="Mock interview: Design a rate limiter"
    meta={["Question 2 / 8", "Middle"]}
    timeLeft="40 minutes left"
    onPress={handleResume}
/>`,
                        render: (
                            <div className="w-96">
                                <ContinueCardHero {...noProgressBase} />
                            </div>
                        ),
                    },
                ]}
            />,
        ),
}

/**
 * STATE isSkeleton — mirror shimmer via the component's OWN `isSkeleton` prop.
 * Same COMPOSITION as the loaded leaf (§11f: state, not structure) — reuses
 * `NO_PROGRESS_PARTS`, no hand-rolled skeleton tree.
 */
export const Skeleton: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={NO_PROGRESS_PARTS}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every node from the loaded 'No progress' leaf renders its own shimmer in place of content, the exact same parts, none added or removed. isSkeleton flips state, not structure (§11f), which is what keeps the layout from jumping once the real content lands.",
                        code: `<ContinueCardHero
    title="Mock interview: Design a rate limiter"
    meta={["Question 2 / 8", "Middle"]}
    timeLeft="40 minutes left"
    onPress={handleResume}
    isSkeleton
/>`,
                        render: (
                            <div className="w-96">
                                <ContinueCardHero {...noProgressBase} isSkeleton />
                            </div>
                        ),
                    },
                ]}
            />,
        ),
}

/** STATE error — network drop rendered INSIDE the card frame. */
export const LoadError: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="block"
                leaf="LoadError"
                parts={ERROR_PARTS}
                states={[
                    {
                        name: "load fails (network drop)",
                        why: "The card's own frame stays unchanged while its body swaps to FeedbackEmpty tone danger with a retry button, dropping every other card node. An error must never make the frame itself disappear, so the reader always sees the same card outline, just with a different message inside it.",
                        code: `<SurfaceCard>
    <FeedbackEmpty
        tone="danger"
        title="Connection lost"
        description="The network seems to have dropped. Check your connection and try again."
        action={<Button variant="secondary" label="Retry" />}
    />
</SurfaceCard>`,
                        render: (
                            <div className="w-96 p-8">
                                <SurfaceCard anatPart="SurfaceCard">
                                    <FeedbackEmpty
                                        anatPart="FeedbackEmpty"
                                        tone="danger"
                                        icon={WarningDuotone}
                                        title="Connection lost"
                                        description="The network seems to have dropped. Check your connection and try again."
                                        action={
                                            <Button variant="secondary" size="sm" label="Retry" onPress={() => {}} anatPart="Button" />
                                        }
                                    />
                                </SurfaceCard>
                            </div>
                        ),
                    },
                ]}
            />,
        ),
}
