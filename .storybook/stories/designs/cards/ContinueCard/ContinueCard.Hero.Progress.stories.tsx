import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCard } from "@sb-components/designs/cards/ContinueCard/ContinueCard"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { WarningIcon } from "@phosphor-icons/react"
import { Feedback } from "@sb-components/composites/feedback/Feedback/Feedback"
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
 *
 * 2026-07-27: di trú toàn bộ leaf sang API `states[]` (§8/§4a); `role` viết lại
 * TIẾNG ANH theo luật B (bỏ dấu — ↔ → làm dấu nối).
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
// writes `<Typography>{title}</Typography>` itself (not a value folded into a
// lower-tier component's slot), so it badges like any other directly-composed part.
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
        name: "SurfaceCard.Base",
        tier: "composite",
        role: "The card surface; isHighlight turns on the hero accent glow, and the frame stays put across every state so switching state never shifts the layout.",
        storyId: "composites-cards-surfacecard-surfacecard-base--default",
        children: [
            // ⭐ 2026-07-27: the two `layouts`-tier frames now SHOW UP in the tree — this
            // cluster used to be a hand-rolled `<div className="flex …">`, so the panel
            // had nothing to point at.
            {
                name: "Stack.H",
                tier: "frame",
                role: "The outer row, one horizontal track; children are arbitrary, which is why this uses Stack rather than Cluster (§13b).",
                storyId: "frames-stack-stack-h--default",
                children: [
                    {
                        name: "Stack.V",
                        tier: "frame",
                        role: "The text column, title on top with the meta and subtitle underneath.",
                        storyId: "frames-stack-stack-v--default",
                        children: [
                            { name: "Typography.Base", tier: "atom", role: "The name of the session in progress, medium weight with truncate — or, while loading, a mirror bar standing in for the meta row (isSkeleton).", storyId: "atoms-text-typography-typography-base--plain" },
                            {
                                name: "List.Meta",
                                tier: "composite",
                                role: "The meta row: muted fragments joined by a middle dot, plus the time chip.",
                                storyId: "composites-lists-list-list-meta--with-chip",
                                children: [
                                    { name: "Chip.Base", tier: "atom", role: "The time-remaining chip, whose tone switches between neutral and warning depending on urgency.", state: "neutral or warning", storyId: "atoms-chips-chip-chip-base--default" },
                                ],
                            },
                        ],
                    },
                ],
            },
            { name: "ProgressMeter", tier: "composite", role: "The progress bar, the defining trait of the has-progress shape.", storyId: "composites-stats-progressmeter--half" },
            { name: "Button.Base", tier: "atom", role: "The resume CTA (onPress plus a sliding ArrowRight icon).", storyId: "atoms-buttons-button-button-base--default" },
        ],
    },
]

// error leaf: connection dropped → `Feedback.Empty` SITS INSIDE the frame, the Retry button lives in the `action` prop.
const ERROR_PARTS: Array<AnatomyNode> = [
    {
        name: "SurfaceCard.Base",
        tier: "composite",
        role: "The very same frame as the loaded leaf; an error must never make the frame itself disappear.",
        storyId: "composites-cards-surfacecard-surfacecard-base--default",
        children: [
            {
                name: "Feedback.Empty",
                tier: "composite",
                role: "The danger-tone message: icon, description, and a Retry button.",
                state: "danger",
                storyId: "composites-feedback-feedback-feedback-empty--action",
                children: [
                    { name: "Button.Base", tier: "atom", role: "The retry button (secondary), built by the story inside the action prop, so it is still declared per §11a.1.", storyId: "atoms-buttons-button-button-base--default" },
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
                renderClassName="w-96"
                reason="Card for resuming an in-progress session. Each LEAF has a different composition: the loaded leaf bundles hero chrome with ProgressMeter, loading swaps to a Skeleton mirroring the exact footprint, and error falls back to Feedback.Empty inside the frame. SurfaceCard acting as the shared frame is what keeps the frame from jumping whenever the state changes."
                states={[
                    {
                        name: "urgent = false, value = 2, max = 8",
                        why: "The time chip reads neutral and the progress bar fills to roughly a quarter, since question 2 of 8 leaves plenty of time on the clock. Not urgent is the resting shape every other state in this leaf compares against.",
                        code: `<ContinueCard.Hero
    title="Mock interview: Design a rate limiter"
    meta={["Question 2 / 8", "Middle"]}
    timeLeft="40 minutes left"
    onPress={handleResume}
    value={2}
    max={8}
/>`,
                        render: <ContinueCard.Hero {...progressBase} value={2} max={8} />,
                    },
                ]}
            />,
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
                renderClassName="w-96"
                states={[
                    {
                        name: "urgent = true, value = 7, max = 8",
                        why: "The exact same time chip switches from neutral to warning tone and the progress bar fills to near-full, on the same composition NotUrgent already uses. Urgent and not-urgent share every part on purpose, so escalating time pressure never rearranges the card, it only recolours one chip and advances the bar.",
                        code: `<ContinueCard.Hero
    title="Mock interview: Design a rate limiter"
    meta={["Question 7 / 8", "Middle"]}
    timeLeft="2 minutes left"
    onPress={handleResume}
    urgent
    value={7}
    max={8}
/>`,
                        render: <ContinueCard.Hero {...progressBase} meta={["Question 7 / 8", "Middle"]} timeLeft="2 minutes left" urgent value={7} max={8} />,
                    },
                ]}
            />,
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
                renderClassName="w-96"
                states={[
                    {
                        name: "isSkeleton = true, value = 2, max = 8",
                        why: "Every part, including the progress bar itself, renders its own shimmer instead of real content, while the composition stays exactly the parts tree the loaded leaf already declares. isSkeleton flips a state rather than the structure (§11f), which is why this leaf reuses CONTENT_PARTS instead of hand-rolling a separate skeleton tree.",
                        code: `<ContinueCard.Hero
    title="Mock interview: Design a rate limiter"
    meta={["Question 2 / 8", "Middle"]}
    timeLeft="40 minutes left"
    onPress={handleResume}
    value={2}
    max={8}
    isSkeleton
/>`,
                        render: <ContinueCard.Hero {...progressBase} value={2} max={8} isSkeleton />,
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
                tier="design"
                leaf="LoadError"
                parts={ERROR_PARTS}
                renderClassName="w-96"
                states={[
                    {
                        name: "network request failed",
                        why: "Only Feedback.Empty renders inside the SurfaceCard frame, replacing the title, meta, and progress bar entirely rather than sitting alongside them. This is not a smaller version of the loaded leaf, a dropped connection is a different branch of the card, not a missing piece of the has-progress shape.",
                        code: `<SurfaceCard.Base>
    <Feedback.Empty
        tone="danger"
        title="Connection lost"
        description="The network seems to have dropped. Check your connection and try again."
        action={<Button.Base variant="secondary" label="Retry" />}
    />
</SurfaceCard.Base>`,
                        render: (
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
                        ),
                    },
                ]}
            />,
        ),
}
