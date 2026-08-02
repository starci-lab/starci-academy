import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCardHero } from "@sb-components/starci/blocks/learn/ContinueCard/ContinueCard"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { WarningIcon } from "@phosphor-icons/react"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { BlockAnatomy, type AnatomyAnnotation, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

// `EmptyState` takes the icon as a COMPONENT ref and forces `size-8` itself
// (§4/§5) — phosphor's `weight="duotone"` can no longer ride along, so wrap it
// into a component to KEEP the stroke style.
const WarningDuotone = (props: SVGProps<SVGSVGElement>) => <WarningIcon data-tier="fixture" {...props} weight="duotone" />

/**
 * The "resume an in-progress session" hero card with progress. Each state below
 * is its own leaf and carries its own `BlockAnatomy` axis (Diagram + Tree)
 * reflecting the parts that leaf composes; there is no consolidated Anatomy
 * story.
 */
const meta: Meta<typeof ContinueCardHero> = {
    title: "StarCi/Blocks/Learn/ContinueCard/Hero/Progress",
    component: ContinueCardHero,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContinueCardHero>

/** Plain canvas — every leaf wraps its render in its own BlockAnatomy panel. */
const shell = (node: React.ReactNode) => <div data-tier="fixture" className="p-8">{node}</div>

// scenario base = the has-progress, not-urgent shape. States below interpolate by delta.
// NOTE: the title Typography IS a composed node in the trees below — ContinueCard
// writes `<Typography>{title}</Typography>` itself (not a value folded into a
// lower-tier component's slot), so it badges like any other directly-composed part.
const progressBase = {
    title: "Mock interview: Design a rate limiter",
    meta: ["Question 2 / 8", "Middle"],
    timeLeft: "40 minutes left",
    onPress: () => {},
}

// The loaded "has-progress" shape — urgent/not-urgent SHARE this composition (only the chip TONE differs).
//
// The real DOM: `SurfaceCard` (frame, `isHighlight` drives the hero glow) ⊃ Title ·
// ListMeta(⊃ Chip) · ProgressMeter · Button.
//
// `Chip` STILL sits under `ListMeta` even though `ListMeta` has its own story: the chip is
// built by `ContinueCard` ITSELF and dropped into the `chip` slot — it's a child of the parent,
// the DOM just happens to nest it there. Conversely, `ListMeta`'s own insides are NOT
// declared here.
const CONTENT_PARTS: Array<AnatomyNode> = [
    {
        name: "SurfaceCard",
        tier: "composite",
        role: "The card surface; isHighlight turns on the hero accent glow, and the frame stays put across every state so switching state never shifts the layout.",
        storyId: "composites-cards-surfacecard-surfacecard--default",
        children: [
            // The two `layouts`-tier frames SHOW UP in the tree.
            {
                name: "StackH",
                tier: "frame",
                role: "The outer row, one horizontal track; children are arbitrary, which is why this uses Stack rather than Cluster (§13b).",
                storyId: "frames-stack-stackh--default",
                children: [
                    {
                        name: "StackV",
                        tier: "frame",
                        role: "The text column, title on top with the meta and subtitle underneath.",
                        storyId: "frames-stack-stackv--default",
                        children: [
                            { name: "Typography", tier: "atom", role: "The name of the session in progress, medium weight with truncate — or, while loading, a mirror bar standing in for the meta row (isSkeleton).", storyId: "atoms-text-typography-typography--plain" },
                            {
                                name: "ListMeta",
                                tier: "composite",
                                role: "The meta row: muted fragments joined by a middle dot, plus the time chip.",
                                storyId: "composites-lists-list-listmeta--with-chip",
                                children: [
                                    { name: "Chip", tier: "atom", role: "The time-remaining chip, whose tone switches between neutral and warning depending on urgency.", state: "neutral or warning", storyId: "atoms-chips-chip-chip--default" },
                                ],
                            },
                        ],
                    },
                ],
            },
            { name: "ProgressMeter", tier: "composite", role: "The progress bar, the defining trait of the has-progress shape.", storyId: "composites-stats-progressmeter--half" },
            { name: "Button", tier: "atom", role: "The resume CTA (onPress plus a sliding ArrowRight icon).", storyId: "atoms-buttons-button-button--default" },
        ],
    },
]

// error leaf: connection dropped → `EmptyState` SITS INSIDE the frame, the Retry button lives in the `action` prop.
const ERROR_PARTS: Array<AnatomyNode> = [
    {
        name: "SurfaceCard",
        tier: "composite",
        role: "The very same frame as the loaded leaf; an error must never make the frame itself disappear.",
        storyId: "composites-cards-surfacecard-surfacecard--default",
        children: [
            {
                name: "EmptyState",
                tier: "composite",
                role: "The danger-tone message: icon, description, and a Retry button.",
                state: "danger",
                storyId: "composites-feedback-feedback-feedbackempty--action",
                children: [
                    { name: "Button", tier: "atom", role: "The retry button (secondary), built by the story inside the action prop, so it is still declared per §11a.1.", storyId: "atoms-buttons-button-button--default" },
                ],
            },
        ],
    },
]

/**
 * The `isSkeleton` leaf's own whitelist — hand-flattened from `CONTENT_PARTS` (same
 * composition, only DIFFERENT because `ProgressMeter` has no `isSkeleton` shape of its own
 * yet, so `CardBody` builds the track's shimmer bar directly with raw HeroUI `Skeleton`).
 *
 * A `tier: "heroui"` entry only registers with
 * `scripts/check-orphan-parts.mjs` (and only ADMITS into the panel's tree, per
 * `BlockAnatomy`'s own `storyId || tier === "heroui"` rule) as a flat `"Name": { … }`
 * record — the exact shape `annotate` uses everywhere else in this codebase for a raw
 * HeroUI import. Nesting `{ name: "Skeleton", tier: "heroui" }` INSIDE the `parts` array
 * renders fine at runtime, but the gate's regex can't see
 * it, so it stays invisible in the tree with no error anywhere. `parts={CONTENT_PARTS}` is switched to `annotate={SKELETON_ANNOTATE}` for
 * JUST this one leaf — the two other leaves in this file (`NotUrgent`/`Urgent`) keep the
 * nested `parts` tree unchanged, since they never render the raw `Skeleton` bar.
 */
const SKELETON_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "The card surface; isHighlight turns on the hero accent glow, and the frame stays put across every state so switching state never shifts the layout.", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackH": { tier: "frame", role: "The outer row, one horizontal track; children are arbitrary, which is why this uses Stack rather than Cluster (§13b).", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "The text column, title on top with the meta and subtitle underneath.", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "The name of the session in progress, medium weight with truncate — or, while loading, a mirror bar standing in for the meta row (isSkeleton).", storyId: "atoms-text-typography-typography--plain" },
    "Skeleton": { tier: "heroui", role: "The loading mirror standing in for the progress bar — ProgressMeter has no `isSkeleton` shape of its own yet, so CardBody builds this shimmer bar directly, matching the real track's height." },
    "Button": { tier: "atom", role: "The resume CTA (onPress plus a sliding ArrowRight icon).", storyId: "atoms-buttons-button-button--default" },
}

/** STATE not urgent — plenty of time left: NEUTRAL time chip + progress bar. */
export const NotUrgent: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="block"
                leaf="NotUrgent"
                parts={CONTENT_PARTS}
                renderClassName="w-96"
                reason="Card for resuming an in-progress session. Each LEAF has a different composition: the loaded leaf bundles hero chrome with ProgressMeter, loading swaps to a Skeleton mirroring the exact footprint, and error falls back to EmptyState inside the frame. SurfaceCard acting as the shared frame is what keeps the frame from jumping whenever the state changes."
                states={[
                    {
                        name: "urgent = false, value = 2, max = 8",
                        why: "The time chip reads neutral and the progress bar fills to roughly a quarter, since question 2 of 8 leaves plenty of time on the clock. Not urgent is the resting shape every other state in this leaf compares against.",
                        code: `<ContinueCardHero
    title="Mock interview: Design a rate limiter"
    meta={["Question 2 / 8", "Middle"]}
    timeLeft="40 minutes left"
    onPress={handleResume}
    value={2}
    max={8}
/>`,
                        render: <ContinueCardHero {...progressBase} value={2} max={8} />,
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
                tier="block"
                leaf="Urgent"
                parts={CONTENT_PARTS}
                renderClassName="w-96"
                states={[
                    {
                        name: "urgent = true, value = 7, max = 8",
                        why: "The exact same time chip switches from neutral to warning tone and the progress bar fills to near-full, on the same composition NotUrgent already uses. Urgent and not-urgent share every part on purpose, so escalating time pressure never rearranges the card, it only recolours one chip and advances the bar.",
                        code: `<ContinueCardHero
    title="Mock interview: Design a rate limiter"
    meta={["Question 7 / 8", "Middle"]}
    timeLeft="2 minutes left"
    onPress={handleResume}
    urgent
    value={7}
    max={8}
/>`,
                        render: <ContinueCardHero {...progressBase} meta={["Question 7 / 8", "Middle"]} timeLeft="2 minutes left" urgent value={7} max={8} />,
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
                tier="block"
                leaf="Prop `isSkeleton`"
                annotate={SKELETON_ANNOTATE}
                renderClassName="w-96"
                states={[
                    {
                        name: "isSkeleton = true, value = 2, max = 8",
                        why: "Every part, including the progress bar itself, renders its own shimmer instead of real content, while the composition stays exactly the same shape the loaded leaf already declares — only the progress bar swaps `ProgressMeter` for a raw HeroUI `Skeleton` mirror, since `ProgressMeter` has no `isSkeleton` shape of its own yet. isSkeleton flips a state rather than the structure (§11f), which is why this leaf reuses that same composition instead of hand-rolling a separate skeleton tree.",
                        code: `<ContinueCardHero
    title="Mock interview: Design a rate limiter"
    meta={["Question 2 / 8", "Middle"]}
    timeLeft="40 minutes left"
    onPress={handleResume}
    value={2}
    max={8}
    isSkeleton
/>`,
                        render: <ContinueCardHero {...progressBase} value={2} max={8} isSkeleton />,
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
                renderClassName="w-96"
                states={[
                    {
                        name: "network request failed",
                        why: "Only EmptyState renders inside the SurfaceCard frame, replacing the title, meta, and progress bar entirely rather than sitting alongside them. This is not a smaller version of the loaded leaf, a dropped connection is a different branch of the card, not a missing piece of the has-progress shape.",
                        code: `<SurfaceCard
    body={() => (
        <EmptyState
            tone="danger"
            title="Connection lost"
            description="The network seems to have dropped. Check your connection and try again."
            action={<Button variant="secondary" label="Retry" />}
        />
    )}
/>`,
                        render: (
                            <SurfaceCard

                                body={() => (
                                    <EmptyState

                                        tone="danger"
                                        icon={WarningDuotone}
                                        title="Connection lost"
                                        description="The network seems to have dropped. Check your connection and try again."
                                        action={() => (
                                            <Button variant="secondary" size="sm" label="Retry" onPress={() => {}} />
                                        )}
                                    />
                                )}
                            />
                        ),
                    },
                ]}
            />,
        ),
}
