import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckCircleIcon, ClockIcon, LockIcon, XCircleIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * ATOM — `Chip`: the only chip in the system.
 *
 * One prop = one leaf, each rendering every state the prop can produce: `tone` ·
 * `icon` · colour dot · `onRemove` · `isSkeleton`. Props that produce no visual
 * (`removeLabel`, `className`, `showAnatomy`) get no leaf.
 *
 * Icon = Phosphor; the atom pins both the scale (`size-3`, matching the chip's text)
 * and the `weight`.
 */
/** Guide shown at the top of the autodocs page. UI copy is written in ENGLISH. */
const CHIP_DOC = `
## Leading slot: icon, dot, or nothing
A chip has one leading slot. Fill it only when the glyph says something the label cannot.
**Reach for an \`icon\`** when the outcome reads faster as a symbol than as a word —
verified, failed, locked, waiting. Universal glyphs only; a domain-specific icon just
makes the reader stop and decode.
**Reach for a dot** when the chip carries a live status or an identity colour (a
language colour, a lane colour). The dot holds the meaning, so the chip keeps its own
tone and the row stays calm.
**Leave it empty** for plain tokens: tags, filters, counts, difficulty labels. A row of
peers should look like one set, not a decorated list.
Icon and dot are mutually exclusive — the type blocks the combination, so a chip can
never grow two leading marks.
## Sizing
One size. The atom pins the glyph to the chip's own text size and picks the stroke
weight; stories never pass either. Pass an icon as a **component** (\`icon={ClockIcon}\`),
not as JSX.
`
const meta: Meta<typeof Chip> = {
    title: "Atoms/Chips/Chip/Chip",
    component: Chip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: CHIP_DOC } },
    },
}
export default meta
type Story = StoryObj<typeof Chip>
/**
 * HeroUI nodes this atom renders — LUAT 2: an import from `@heroui/react` that gets
 * rendered must show up in the tree as `tier: "heroui"` (no `storyId`, there's no story
 * of ours to jump to). Shared across every leaf below that renders a REAL (non-skeleton)
 * chip, since all of them build `HeroChip.Label`.
 */
const CHIP_LABEL_DEP: Record<string, AnatomyAnnotation> = {
    "Chip.Label": { tier: "heroui", role: "the chip's own text label, HeroUI's `Chip.Label`" },
}
/** Same idea, for the `isSkeleton` leaf: the outer shell rendered there IS HeroUI's `Chip`, just in its loading look. */
const CHIP_SKELETON_DEP: Record<string, AnatomyAnnotation> = {
    "Chip": { tier: "heroui", role: "the chip shell itself, HeroUI's `Chip`, in its loading look" },
}
/** BARE leaf — no prop turned on, to see the default look (`tone="default"`, no glyph, no ×). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Chip"
                tier="atom"
                leaf="Bare chip"
                annotate={CHIP_LABEL_DEP}
                reason="The one chip in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                states={[
                    {
                        name: "no prop turned on (tone = default, empty leading slot, no remove)",
                        why: "The DOM is just the pill and its Label, nothing leading and no × trailing. This is the plainest shape the chip can take, the baseline every other leaf differs from by exactly one prop.",
                        code: "<Chip text=\"Draft\" />",
                        render: <Chip text="Draft" />,
                    },
                ]}
            />
        </div>
    ),
}
/** Leaf prop `tone` — 5 MEANINGS, render the FULL union. */
export const Tones: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Chip"
                tier="atom"
                leaf="Prop `tone`"
                annotate={CHIP_LABEL_DEP}
                reason="Tone is meaning, not colour. Pick it from what the chip says; a red chip that means nothing bad is noise the reader has to learn to ignore."
                states={[
                    {
                        name: "tone = \"default\"",
                        why: "The chip renders on the plain default soft surface with no colour signal at all. Reach for default on tokens that carry no verdict, such as a draft label, so the reader does not hunt for a meaning that is not there.",
                        code: "<Chip tone=\"default\" text=\"Draft\" />",
                        render: <Chip tone="default" text="Draft" />,
                    },
                    {
                        name: "tone = \"success\"",
                        why: "The chip renders on the success soft surface, one step of opacity over the success colour. Reach for it only for the good outcome, such as a check that passed, so the colour keeps its weight everywhere else it appears.",
                        code: "<Chip tone=\"success\" text=\"Passed\" />",
                        render: <Chip tone="success" text="Passed" />,
                    },
                    {
                        name: "tone = \"warning\"",
                        why: "The chip renders on the warning soft surface, a colour that asks for attention without declaring failure. Reach for it on a state that is not broken yet, such as something still awaiting review.",
                        code: "<Chip tone=\"warning\" text=\"Needs review\" />",
                        render: <Chip tone="warning" text="Needs review" />,
                    },
                    {
                        name: "tone = \"danger\"",
                        why: "The chip renders on the danger soft surface, one step of opacity over the danger colour. Reach for it only for the bad outcome, such as a check that failed, so a red chip always means something is actually wrong.",
                        code: "<Chip tone=\"danger\" text=\"Failed\" />",
                        render: <Chip tone="danger" text="Failed" />,
                    },
                    {
                        name: "tone = \"accent\"",
                        why: "The chip renders on the accent soft surface, a colour that draws the eye without claiming good or bad. Reach for it when something is merely worth a look, such as a newly added item.",
                        code: "<Chip tone=\"accent\" text=\"New\" />",
                        render: <Chip tone="accent" text="New" />,
                    },
                ]}
            />
        </div>
    ),
}
/** Leaf prop `icon` — the LEADING glyph, takes a COMPONENT, not JSX. */
export const Icon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Chip"
                tier="atom"
                leaf="Prop `icon`"
                annotate={CHIP_LABEL_DEP}
                reason="An icon earns its slot when the symbol reads faster than the word, such as verified, failed, waiting, locked. Anything a reader has to decode belongs in the label instead."
                states={[
                    {
                        name: "icon = CheckCircleIcon, tone = \"success\"",
                        why: "A check-circle glyph grows before the label, sized off the chip's own text and coloured through currentColor rather than a colour of its own. Reach for it when a verified outcome should read faster as a symbol than as the word.",
                        code: "<Chip tone=\"success\" icon={CheckCircleIcon} text=\"Verified\" />",
                        render: <Chip tone="success" icon={CheckCircleIcon} text="Verified" />,
                    },
                    {
                        name: "icon = XCircleIcon, tone = \"danger\"",
                        why: "A cross-circle glyph grows before the label, borrowing the chip's own danger colour instead of one of its own. Reach for it when a failed outcome must stop the reader before they even get to the word.",
                        code: "<Chip tone=\"danger\" icon={XCircleIcon} text=\"Failed\" />",
                        render: <Chip tone="danger" icon={XCircleIcon} text="Failed" />,
                    },
                    {
                        name: "icon = ClockIcon, tone = \"warning\"",
                        why: "A clock glyph grows before the label on the warning tone, reading as a wait rather than a break. Reach for it when the result has not landed yet and the chip must say pending without sounding like an error.",
                        code: "<Chip tone=\"warning\" icon={ClockIcon} text=\"Pending review\" />",
                        render: <Chip tone="warning" icon={ClockIcon} text="Pending review" />,
                    },
                    {
                        name: "icon = LockIcon, tone not set (default \"default\")",
                        why: "A lock glyph grows before the label while the chip keeps its default neutral tone, since the glyph alone already carries the meaning. Reach for it when the state is about access rather than an outcome, so no success or danger colour is warranted.",
                        code: "<Chip icon={LockIcon} text=\"Locked\" />",
                        render: <Chip icon={LockIcon} text="Locked" />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * The DOT leaf — two props (`dotColor`/`dotClassName`) but ONE look: the same leading
 * glyph slot, differing only in how the colour is supplied (class token vs raw hex).
 * Splitting them into two leaves would just give two identical frames.
 *
 * The dot isn't a different chip shape, so it is not a separate member.
 */
export const Dot: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Chip"
                tier="atom"
                leaf="Props `dotColor` / `dotClassName`"
                annotate={CHIP_LABEL_DEP}
                reason="The dot carries the status so the chip does not have to. That is why these chips stay neutral: a row of live services reads as one list with coloured markers, instead of five competing pills."
                states={[
                    {
                        name: "dotClassName set (palette colour)",
                        why: "A row of three chips shows the dot coloured through a Tailwind class, each service keeping the chip's own neutral tone while only the dot carries the status. This is how a live status row is meant to read, one calm list with the colour living entirely in the marker.",
                        code: `<Chip dotClassName="text-success" text="Running" />
<Chip dotClassName="text-warning" text="Degraded" />
<Chip dotClassName="text-danger" text="Down" />`,
                        render: (
                            <div data-tier="fixture" className="flex flex-wrap items-center gap-3">
                                <span><Chip dotClassName="text-success" text="Running" /></span>
                                <span><Chip dotClassName="text-warning" text="Degraded" /></span>
                                <span><Chip dotClassName="text-danger" text="Down" /></span>
                            </div>
                        ),
                    },
                    {
                        name: "dotColor set (raw hex outside the palette)",
                        why: "A single chip shows the dot coloured by a raw hex value rather than a Tailwind class, through the same currentColor mechanism the class-based dot uses. Reach for it when the colour is tied to an identity outside the app's own palette, such as a language colour.",
                        code: "<Chip dotColor=\"#3178c6\" text=\"TypeScript\" />",
                        render: <Chip dotColor="#3178c6" text="TypeScript" />,
                    },
                    {
                        name: "both dotColor and dotClassName set (dotColor wins)",
                        why: "A single chip sets both dotColor and dotClassName at once, and the dot renders in the raw dotColor value rather than the palette class. This precedence lets a caller pass a shared default class while still overriding it once a specific identity colour is known.",
                        code: "<Chip dotColor=\"#3178c6\" dotClassName=\"text-danger\" text=\"Raw colour wins\" />",
                        render: <Chip dotColor="#3178c6" dotClassName="text-danger" text="Raw colour wins" />,
                    },
                ]}
            />
        </div>
    ),
}
/** Leaf prop `onRemove` — pass a handler and the chip grows a × at the tail. */
export const Removable: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Chip"
                tier="atom"
                leaf="Prop `onRemove`"
                annotate={CHIP_LABEL_DEP}
                reason="Pass a handler and the chip grows a ×, that is the whole switch. A chip the reader can dismiss is a filter or a picked value; a chip they cannot is a label."
                states={[
                    {
                        name: "onRemove not set",
                        why: "The chip renders as a plain pill with nothing at its tail, since no handler was given to grow a ×. This is the resting shape of a label the reader cannot dismiss, the baseline the removable shape below differs from by exactly one prop.",
                        code: "<Chip text=\"React\" />",
                        render: <Chip text="React" />,
                    },
                    {
                        name: "onRemove set (× grows at the tail)",
                        why: "A row of two chips each grow a × at the tail once onRemove is given, one on the default tone and one on accent, sized for the pill and borrowing the chip's own colour rather than owning one. Give it removeLabel so a screen reader hears what is being removed rather than just \"Remove\", the shape an applied-filter row actually takes.",
                        code: `<Chip text="React" onRemove={dropFilter} removeLabel="Remove the React filter" />
<Chip tone="accent" text="TypeScript" onRemove={dropFilter} removeLabel="Remove the TypeScript filter" />`,
                        render: (
                            <div data-tier="fixture" className="flex flex-wrap items-center gap-3">
                                <span><span><Chip text="React" onRemove={() => {}} removeLabel="Remove the React filter" /></span></span>
                                <span>
                                    <Chip
                                        tone="accent"
                                        text="TypeScript"
                                        onRemove={() => {}}
                                        removeLabel="Remove the TypeScript filter"
                                    />
                                </span>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf prop `isSkeleton` — CO-LOCATED shimmer (§12c), width follows the actual chip's
 * SLOT COUNT.
 *
 * FOUR states, one per call shape. The two middle states coming out the same width is
 * CORRECT: the shimmer counts slots, not which side they sit on, so a leading icon and
 * a trailing × cost the same one unit of width.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Chip"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={CHIP_SKELETON_DEP}
                reason="Whoever owns the shape owns its resting state, so the chip draws its own shimmer. There is no shared skeleton component to keep in sync."
                states={[
                    {
                        name: "isSkeleton = true, no leading or trailing slot",
                        why: "The shimmer pill renders as narrow as a bare label, the same width the real chip takes with neither an icon nor a remove button. This is the loading placeholder for the plainest call shape the chip supports.",
                        code: "<Chip isSkeleton />",
                        render: <Chip isSkeleton />,
                    },
                    {
                        name: "isSkeleton = true, with a leading icon slot",
                        why: "The shimmer pill grows one extra block for the leading glyph slot even though no real icon is drawn yet, matching the width the chip will take once data lands. Reserving that width up front keeps the row from jumping the moment the real icon appears.",
                        code: "<Chip isSkeleton icon={ClockIcon} />",
                        render: <Chip isSkeleton icon={ClockIcon} />,
                    },
                    {
                        name: "isSkeleton = true, with a trailing remove slot",
                        why: "The shimmer pill grows the matching extra block on the × side instead of the icon side, and it comes out the same width as the leading-icon state on purpose. The shimmer counts slots rather than which side they sit on, so either slot costs the same one unit of width.",
                        code: "<Chip isSkeleton onRemove={dropFilter} />",
                        render: <Chip isSkeleton onRemove={() => {}} />,
                    },
                    {
                        name: "isSkeleton = true, with both a leading and trailing slot",
                        why: "The shimmer pill grows to its widest shape, one block for the leading glyph and one for the trailing ×, matching a chip that will render both once data lands. This is the loading placeholder for the busiest call shape the chip supports.",
                        code: "<Chip isSkeleton icon={ClockIcon} onRemove={dropFilter} />",
                        render: <Chip isSkeleton icon={ClockIcon} onRemove={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}