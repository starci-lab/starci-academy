import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCard } from "@sb-components/designs/cards/ContinueCard/ContinueCard"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { WarningIcon } from "@phosphor-icons/react"
import { Feedback } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

// `Feedback.Empty` accepts icon as a COMPONENT ref and forces `size-8` itself (§4/§5) —
// phosphor's `weight="duotone"` can no longer tag along, so it's wrapped in a component to KEEP the artwork.
const WarningDuotone = (props: SVGProps<SVGSVGElement>) => <WarningIcon {...props} weight="duotone" />

/**
 * DESIGN — the `hero` ContinueCard in its NO-PROGRESS shape (no `value` → no
 * ProgressMeter). Each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Diagram + Tree) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ContinueCard> = {
    title: "Designs/Cards/ContinueCard/Hero/No progress",
    component: ContinueCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContinueCard>

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
// `Chip.Base` STILL sits under `List.Meta` even though `List.Meta` has its own story: the
// chip is built by `ContinueCard` ITSELF and placed into the `chip` slot — a child of the
// PARENT, the DOM just happens to nest it in (§11a.1). Conversely, the INSIDE of
// `List.Meta` is NOT declared here.
//
// Real DOM: `SurfaceCard`(isHighlight) ⊃ Title · List.Meta(⊃ Chip.Base) · Button.
// NO `ProgressMeter` — its absence IS exactly the mark distinguishing this shape from the
// Progress version (§11f).
const NO_PROGRESS_PARTS: Array<AnatomyNode> = [
    {
        name: "SurfaceCard",
        tier: "primitive",
        role: "card surface — `isHighlight` turns on the hero accent glow. The frame STAYS PUT across every state, so switching state never shifts the layout",
        storyId: "layouts-cards-surfacecard-surfacecard-base--default",
        children: [
            // ⭐ 2026-07-27: two frames from the `layouts` tier now APPEAR in the tree —
            // before, this cluster was a hand-typed `<div className="flex …">`, so the
            // panel had nothing to point at.
            {
                name: "Stack.H",
                tier: "primitive",
                role: "outer row — one horizontal track (children are ARBITRARY ⇒ `Stack`, not `Cluster`, §13b)",
                storyId: "layouts-layout-stack-stack-h--default",
                children: [
                    {
                        name: "Stack.V",
                        tier: "primitive",
                        role: "text column — title on top, meta/subtitle underneath",
                        storyId: "layouts-layout-stack-stack-v--default",
                        children: [
                            { name: "Title", tier: "atom", role: "name of the session in progress — `Typography.Base` medium + truncate", storyId: "atoms-text-typography-typography-base--plain" },
                            { name: "Skeleton.Meta", tier: "atom", role: "mirror bar standing in for the meta row while loading — `Typography.Base isSkeleton`", storyId: "atoms-text-typography-typography-base--plain" },
                            {
                                name: "List.Meta",
                                tier: "primitive",
                                role: "meta row: muted fragments joined by ·",
                                storyId: "layouts-lists-list-list-meta--with-chip",
                                children: [
                                    { name: "Chip.Base", tier: "atom", role: "time-remaining chip (the `chip` slot → it grows INSIDE List.Meta)", state: "neutral", storyId: "atoms-chips-chip-chip-base--default" },
                                ],
                            },
                        ],
                    },
                ],
            },
            { name: "Button", tier: "atom", role: "resume CTA (primary, onPress + ArrowRight)", storyId: "atoms-buttons-button-button-base--default" },
        ],
    },
]

// error leaf: network drop → `Feedback.Empty` SITS INSIDE the frame, the Retry button is in the `action` prop.
const ERROR_PARTS: Array<AnatomyNode> = [
    {
        name: "SurfaceCard",
        tier: "primitive",
        role: "the very SAME frame — an error must never make the frame disappear",
        storyId: "layouts-cards-surfacecard-surfacecard-base--default",
        children: [
            {
                name: "Feedback.Empty",
                tier: "primitive",
                role: "danger tone + icon + description + a Retry button",
                state: "danger",
                storyId: "layouts-feedback-feedback-feedback-empty--action",
                children: [
                    { name: "Button", tier: "atom", role: "retry button (secondary, inside the `action` prop — built by the STORY, so it is still declared, §11a.1)", storyId: "atoms-buttons-button-button-base--default" },
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
                tier="design"
                leaf="NotStarted"
                parts={NO_PROGRESS_PARTS}
                reason="Anatomy of the loaded LEAF 'No progress' — ONLY the parts this leaf composes (NO ProgressMeter: that's the SHAPE difference from 'Progress'). Loading/error are SEPARATE leaves with their own composition — NOT included here."
                code={`<ContinueCard.Hero
    title="Mock interview: Design a rate limiter"
    meta={["Question 2 / 8", "Middle"]}
    timeLeft="40 minutes left"
    onPress={handleResume}
/>`}
            >
                <div className="w-96">
                    <ContinueCard.Hero {...noProgressBase} />
                </div>
            </BlockAnatomy>,
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
                tier="design"
                leaf="Prop `isSkeleton`"
                parts={NO_PROGRESS_PARTS}
                code={`<ContinueCard.Hero
    title="Mock interview: Design a rate limiter"
    meta={["Question 2 / 8", "Middle"]}
    timeLeft="40 minutes left"
    onPress={handleResume}
    isSkeleton
/>`}
                note="`isSkeleton` flips STATE, not structure (§11f) — SAME parts as the loaded 'No progress' leaf; each one renders its shimmer instead of content."
            >
                <div className="w-96">
                    <ContinueCard.Hero {...noProgressBase} isSkeleton />
                </div>
            </BlockAnatomy>,
        ),
}

/** STATE error — network drop rendered INSIDE the card frame. */
export const LoadError: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="LoadError"
                parts={ERROR_PARTS}
                note="Network drop → SectionCard frame stays unchanged, body swaps to Feedback.Empty tone danger + retry button (no card content)."
                code={`<SurfaceCard.Base>
    <Feedback.Empty
        tone="danger"
        title="Connection lost"
        description="The network seems to have dropped. Check your connection and try again."
        action={<Button.Base variant="secondary" label="Retry" />}
    />
</SurfaceCard.Base>`}
            >
                <div className="w-96 p-8">
                    <SurfaceCard.Base anatPart="SurfaceCard">
                        <Feedback.Empty
                            anatPart="Feedback.Empty"
                            tone="danger"
                            icon={WarningDuotone}
                            title="Connection lost"
                            description="The network seems to have dropped. Check your connection and try again."
                            action={
                                <Button.Base variant="secondary" size="sm" label="Retry" onPress={() => {}} anatPart="Button" />
                            }
                        />
                    </SurfaceCard.Base>
                </div>
            </BlockAnatomy>,
        ),
}
