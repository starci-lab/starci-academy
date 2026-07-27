import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCard } from "@sb-components/designs/cards/ContinueCard/ContinueCard"
import { SurfaceCard } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { WarningIcon } from "@phosphor-icons/react"
import { Feedback } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

// `Feedback.Empty` takes the icon as a COMPONENT ref and forces `size-8` itself
// (§4/§5) — phosphor's `weight="duotone"` can no longer ride along, so wrap it
// into a component to KEEP the stroke style.
const WarningDuotone = (props: SVGProps<SVGSVGElement>) => <WarningIcon {...props} weight="duotone" />

/**
 * DESIGN — the "resume an in-progress session" hero card with progress. Each state below
 * is its OWN leaf and carries its OWN BlockAnatomy axis (Diagram + Tree) reflecting
 * the parts THAT leaf composes — there is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ContinueCard> = {
    title: "Designs/Cards/ContinueCard/Hero/Progress",
    component: ContinueCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContinueCard>

/** Plain canvas — every leaf wraps its render in its own BlockAnatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// scenario base = the has-progress, not-urgent shape. States below interpolate by delta.
// NOTE: the title Typography IS a composed node in the trees below — ContinueCard
// writes `<Typography>{title}</Typography>` itself (not a value folded into another
// primitive's slot), so it badges like any other directly-composed part.
const progressBase = {
    title: "Mock interview: Design a rate limiter",
    meta: ["Question 2 / 8", "Middle"],
    timeLeft: "40 minutes left",
    onPress: () => {},
    showAnatomy: true,
}

// The loaded "has-progress" shape — urgent/not-urgent SHARE this composition (only the chip TONE differs).
//
// ⭐ 2026-07-27 (deep-scan from the `CourseContents` screen): this tree used to describe a DEAD
// structure — `HighlightCard` (now the `isHighlight` prop of `SurfaceCard`) ⊃ `SectionCard` (now
// `SurfaceCard`) ⊃ `Typography.Title` (now a part named `Title`). None of those names are still
// emitted by the DOM, so the panel drew a tree that NEVER matched what was actually rendering.
//
// The real DOM now: `SurfaceCard` (frame, `isHighlight` drives the hero glow) ⊃ Title ·
// List.Meta(⊃ Chip.Base) · ProgressMeter · Button.
//
// `Chip.Base` STILL sits under `List.Meta` even though `List.Meta` has its own story: the chip is
// built by `ContinueCard` ITSELF and dropped into the `chip` slot — it's a child of the parent,
// the DOM just happens to nest it there (§11a.1). Conversely, `List.Meta`'s own insides are NOT
// declared here.
const CONTENT_PARTS: Array<AnatomyNode> = [
    {
        name: "SurfaceCard",
        tier: "primitive",
        role: "card surface — `isHighlight` turns on the hero accent glow. The frame STAYS PUT across every state, so switching state never shifts the layout",
        storyId: "layouts-cards-surfacecard-surfacecard-base--default",
        children: [
            // ⭐ 2026-07-27: the two `layouts`-tier frames now SHOW UP in the tree — this
            // cluster used to be a hand-rolled `<div className="flex …">`, so the panel
            // had nothing to point at.
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
                                role: "meta row: muted fragments joined by · plus the time chip",
                                storyId: "layouts-lists-list-list-meta--with-chip",
                                children: [
                                    { name: "Chip.Base", tier: "atom", role: "time-remaining chip — tone neutral↔warning depending on urgency", state: "neutral↔warning", storyId: "atoms-chips-chip-chip-base--default" },
                                ],
                            },
                        ],
                    },
                ],
            },
            { name: "ProgressMeter", tier: "primitive", role: "progress bar — the DEFINING trait of the has-progress shape", storyId: "layouts-stats-progressmeter--half" },
            { name: "Button", tier: "atom", role: "resume CTA (onPress + ArrowRight, iconSlide)", storyId: "atoms-buttons-button-button-base--default" },
        ],
    },
]

// error leaf: connection dropped → `Feedback.Empty` SITS INSIDE the frame, the Retry button lives in the `action` prop.
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

/** STATE not urgent — plenty of time left: NEUTRAL time chip + progress bar. */
export const NotUrgent: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="NotUrgent"
                parts={CONTENT_PARTS}
                reason="Card for resuming an in-progress session. Each LEAF has a different composition: the loaded leaf bundles hero chrome + ProgressMeter; loading swaps to a Skeleton mirroring the exact footprint; error falls back to Feedback.Empty inside the frame. SectionCard acting as the shared frame keeps the frame from jumping when the state changes."
                code={`<ContinueCard.Hero
    title="Mock interview: Design a rate limiter"
    meta={["Question 2 / 8", "Middle"]}
    timeLeft="40 minutes left"
    onPress={handleResume}
    value={2}
    max={8}
/>`}
            >
                <div className="w-96">
                    <ContinueCard.Hero {...progressBase} value={2} max={8} />
                </div>
            </BlockAnatomy>,
        ),
}

/** STATE urgent — time almost up: the SAME time chip but escalated to WARNING tone + a near-full bar. */
export const Urgent: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Urgent"
                parts={CONTENT_PARTS}
                note="urgent/not-urgent share the SAME parts — only the time chip TONE differs (neutral → warning) + the bar is near-full."
                code={`<ContinueCard.Hero
    title="Mock interview: Design a rate limiter"
    meta={["Question 7 / 8", "Middle"]}
    timeLeft="2 minutes left"
    onPress={handleResume}
    urgent
    value={7}
    max={8}
/>`}
            >
                <div className="w-96">
                    <ContinueCard.Hero {...progressBase} meta={["Question 7 / 8", "Middle"]} timeLeft="2 minutes left" urgent value={7} max={8} />
                </div>
            </BlockAnatomy>,
        ),
}

/**
 * STATE isSkeleton — mirror shimmer via the component's OWN `isSkeleton` prop.
 * Same COMPOSITION as the loaded leaf (§11f: state, not structure) — reuses
 * `CONTENT_PARTS` (bar included), no hand-rolled skeleton tree.
 */
export const Skeleton: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Prop `isSkeleton`"
                parts={CONTENT_PARTS}
                code={`<ContinueCard.Hero
    title="Mock interview: Design a rate limiter"
    meta={["Question 2 / 8", "Middle"]}
    timeLeft="40 minutes left"
    onPress={handleResume}
    value={2}
    max={8}
    isSkeleton
/>`}
                note="`isSkeleton` flips STATE, not structure (§11f) — SAME parts as the loaded leaf (bar included); each one renders its shimmer instead of content."
            >
                <div className="w-96">
                    <ContinueCard.Hero {...progressBase} value={2} max={8} isSkeleton />
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
                note="Network drop → only Feedback.Empty inside the frame; NOT a part of the loaded leaf."
                code={`<SurfaceCard.Base>
    <Feedback.Empty
        tone="danger"
        title="Connection lost"
        description="The network seems to have dropped. Check your connection and try again."
        action={<Button.Base variant="secondary" label="Retry" />}
    />
</SurfaceCard.Base>`}
            >
                <div className="w-96">
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
