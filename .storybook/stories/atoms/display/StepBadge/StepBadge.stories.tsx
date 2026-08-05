import type { Meta, StoryObj } from "@storybook/nextjs"
import { StepBadge } from "@sb-components/atoms/display/StepBadge/StepBadge"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `StepBadge`: the system's one numbered circle for multi-step flows.
 *
 * 1 PROP = 1 LEAF. Every prop with a shape gets its own leaf rendering every value it can
 * produce: `state` · `size` · `isSkeleton`. Props with no shape (`className`) get no leaf.
 * `number` gets no leaf — it's free-form content, not a finite union.
 *
 * `showAnatomy` (group E) tags `data-anat-part` onto the real root (`"Badge"`), the skeleton
 * root (`"Skeleton"`), and the check-icon wrapper when `state="done"` (`"Icon"`). The `States`
 * leaf turns anatomy on at the `done` cell so both `Badge` and `Icon` surface in one tree.
 *
 * `Badge` (root span) and `Icon` (wraps the passed `CheckIcon`) are plain elements, not
 * importable components, so neither is named in `annotate`. Only `Skeleton` is a real,
 * direct HeroUI import — `tier: "heroui"`, no `storyId`.
 */

/** Guidance shown at the top of the autodocs page. The on-screen text is written in ENGLISH. */
const STEP_BADGE_DOC = `
## State, not colour

A step badge marks where a step sits in a flow, not an arbitrary colour choice.

**\`done\`** swaps the number for a check — the step is behind you.
**\`active\`** is the step the reader is on right now.
**\`muted\`** is a step they have not reached yet.

There is no boolean toggle for the check mark — it only ever appears through
\`state="done"\`, so a badge can never show both a number and a check.

## Sizing

Two sizes, both fixed boxes: \`sm\` (20px) matches the original inline badge this
atom replaces; \`md\` (24px) is for a badge that needs to read at a glance inside a
bigger callout. Size never changes tone or shape, only scale.
`

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Skeleton": {
        tier: "heroui",
        role: "the resting round shimmer, drawn in place of the badge while isSkeleton is on",
    },
}

const meta: Meta<typeof StepBadge> = {
    title: "Atoms/Display/StepBadge/StepBadge",
    component: StepBadge,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: STEP_BADGE_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof StepBadge>

/** BARE leaf — no prop turned on yet, to show the default shape (`state="active"`, `size="sm"`). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StepBadge"
                tier="atom"
                leaf="Bare badge"
                annotate={ANNOTATE}
                reason="The one step badge in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                states={[
                    {
                        name: "state and size both unset",
                        why: "The badge renders at `state=\"active\"` (solid fill, the number printed inside) and `size=\"sm\"` (20px), the shape the hand-rolled badge in GithubTeamGate had before this atom existed. Neither prop is required, so the caller only ever names the value that departs from this default.",
                        code: "<StepBadge number={1} />",
                        render: <StepBadge number={1} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `state` — POSITION within the flow, renders the FULL union. */
export const States: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StepBadge"
                tier="atom"
                leaf="Prop `state`"
                annotate={ANNOTATE}
                reason="State is where the badge sits in the flow, not a colour pick. Done and active both fill solid; muted stays on the flat default surface so a row of upcoming steps reads as calm, not as another live colour competing for attention."
                states={[
                    {
                        name: "state = \"done\"",
                        why: "The number is replaced by a check mark inside the same solid-filled circle. This is the only way the check ever appears — a badge can never show both a number and a check at once.",
                        code: "<StepBadge number={1} state=\"done\" />",
                        render: <StepBadge number={1} state="done" />,
                    },
                    {
                        name: "state = \"active\"",
                        why: "The circle fills solid and prints the step number as-is. This marks the exact step the reader is standing on right now, distinct from the check that means a step is already behind them.",
                        code: "<StepBadge number={2} state=\"active\" />",
                        render: <StepBadge number={2} state="active" />,
                    },
                    {
                        name: "state = \"muted\"",
                        why: "The circle drops to the flat default surface instead of a solid fill, still printing the plain number. A step not yet reached stays visually quiet so it doesn't compete for attention with the active step.",
                        code: "<StepBadge number={3} state=\"muted\" />",
                        render: <StepBadge number={3} state="muted" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — renders the FULL union. */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StepBadge"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="Size only scales the box, the text, and the check that stands in for a done step — the state logic underneath never changes."
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "The badge draws at a 20px box. This is the default size, matching how the badge was already used inline before this atom existed.",
                        code: "<StepBadge number={2} size=\"sm\" />",
                        render: <StepBadge number={2} state="active" size="sm" />,
                    },
                    {
                        name: "size = \"md\"",
                        why: "The badge draws at a 24px box, the same circle and number just scaled up. Reach for this size when the badge sits inside a bigger callout and needs to read at a glance.",
                        code: "<StepBadge number={2} size=\"md\" />",
                        render: <StepBadge number={2} state="active" size="md" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c), mirrors {@link Sizes} only:
 * once the badge is empty, `state` carries no shape of its own, so there is
 * nothing else to shimmer differently.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StepBadge"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                reason="Whoever owns the shape owns its resting state, so the badge draws its own round shimmer instead of sharing a generic skeleton component. A done/active/muted distinction has no shape once the content is gone, so this prop only tracks size."
                states={[
                    {
                        name: "isSkeleton = true, size = \"sm\"",
                        why: "A round shimmer fills the same 20px circle the real badge would occupy at this size. No number, check, or state colour renders underneath it.",
                        code: "<StepBadge isSkeleton size=\"sm\" />",
                        render: <StepBadge isSkeleton size="sm" />,
                    },
                    {
                        name: "isSkeleton = true, size = \"md\"",
                        why: "The same round shimmer scales up to the 24px circle. Only the box grows — the shimmer shape itself is identical to the `sm` state.",
                        code: "<StepBadge isSkeleton size=\"md\" />",
                        render: <StepBadge isSkeleton size="md" />,
                    },
                ]}
            />
        </div>
    ),
}
