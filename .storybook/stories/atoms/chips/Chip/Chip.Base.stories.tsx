import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckCircleIcon, ClockIcon, LockIcon, XCircleIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Chip.Base`: the ONLY chip in the system.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — the law for the ATOM TIER). Each prop gets one leaf,
 * and that leaf renders EVERY state the prop can produce: `tone` · `icon` · colour dot
 * · `onRemove` · `isSkeleton`. Props that produce no visual (`removeLabel`, `className`,
 * `showAnatomy`, `anatPart`) get NO leaf.
 *
 * ⚠️ Don't confuse this with §14d.2 (leaf = STRUCTURE) — that law is for
 * design/block/screen. The previous version of this file split leaves by
 * "composition" (`Base`/`WithIcon`/`Removable`/`Loading`), so `tone` had nowhere to
 * render its full union, and the colour dot had no home at all.
 *
 * ⚠️ REMOVED 2026-07-26: the `Chip.Dot`, `StatusChip`, `TagChips` stories. The dot is a
 * PROP of this same chip (leaf `Dot`); `StatusChip` only hard-locked `tone`; `TagChips`
 * had real behaviour so it became `Chip.Group`, its own story.
 *
 * 🎨 Icon = Phosphor (§5.0). The atom pins both the scale (`size-3`, matching the
 * chip's text size) and the `weight` (§5.0a) — a story only picks "which glyph".
 */

/** Guide shown at the top of the autodocs page. UI copy is written in ENGLISH (teacher's call, 2026-07-26). */
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

const meta: Meta<typeof Chip.Base> = {
    title: "Atoms/Chips/Chip/Chip.Base",
    component: Chip.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: CHIP_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof Chip.Base>

/** The FULL `ChipTone` union — missing one value means that value will sprout as a stray leaf elsewhere. */
const TONES: Array<{ tone: ChipTone; text: string; hint: string }> = [
    { tone: "neutral", text: "Draft", hint: "no signal — plain token" },
    { tone: "success", text: "Passed", hint: "the good outcome" },
    { tone: "warning", text: "Needs review", hint: "not broken yet" },
    { tone: "danger", text: "Failed", hint: "the bad outcome" },
    { tone: "accent", text: "New", hint: "worth a look" },
]

/** BARE leaf — no prop turned on, to see the default look (`tone="neutral"`, no glyph, no ×). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Base"
                tier="atom"
                leaf="Bare chip"
                reason="The one chip in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                note="Defaults to tone=neutral with an empty leading slot and no remove button. The DOM is just the pill and its Label."
                code={"<Chip.Base text=\"Draft\" />"}
            >
                <Chip.Base text="Draft" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `tone` — 5 MEANINGS, render the FULL union. */
export const Tones: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Base"
                tier="atom"
                leaf="Prop `tone`"
                reason="Tone is meaning, not colour. Pick it from what the chip says — a red chip that means nothing bad is noise the reader has to learn to ignore."
                note="Every tone lands on the same soft surface, one step of opacity over its own colour. There is no solid variant on purpose: adding one would smuggle a second axis (surface) into a union that carries meaning."
                code={`<Chip.Base tone="neutral" text="Draft" />
<Chip.Base tone="success" text="Passed" />
<Chip.Base tone="warning" text="Needs review" />
<Chip.Base tone="danger" text="Failed" />
<Chip.Base tone="accent" text="New" />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    {TONES.map(({ tone, text }, index) => (
                        <Chip.Base key={tone} tone={tone} text={text} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `icon` — the LEADING glyph, takes a COMPONENT, not JSX. */
export const Icon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Base"
                tier="atom"
                leaf="Prop `icon`"
                reason="An icon earns its slot when the symbol reads faster than the word — verified, failed, waiting, locked. Anything a reader has to decode belongs in the label instead."
                note="The glyph has no size prop of its own: the atom pins it to the chip's text size and picks the stroke weight, so it always sits on the same line as the label. Colour comes from the tone through currentColor — the icon never carries its own."
                code={`<Chip.Base tone="success" icon={CheckCircleIcon} text="Verified" />
<Chip.Base tone="danger" icon={XCircleIcon} text="Failed" />
<Chip.Base tone="warning" icon={ClockIcon} text="Pending review" />
<Chip.Base icon={LockIcon} text="Locked" />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <Chip.Base tone="success" icon={CheckCircleIcon} text="Verified" showAnatomy />
                    <Chip.Base tone="danger" icon={XCircleIcon} text="Failed" />
                    <Chip.Base tone="warning" icon={ClockIcon} text="Pending review" />
                    <Chip.Base icon={LockIcon} text="Locked" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * The DOT leaf — two props (`dotColor`/`dotClassName`) but ONE look: the same leading
 * glyph slot, differing only in how the colour is supplied (class token vs raw hex).
 * Splitting them into two leaves would just give two identical frames.
 *
 * Replaces the old `Chip.Dot` member (removed 2026-07-26): the dot isn't a different
 * chip shape.
 */
export const Dot: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Base"
                tier="atom"
                leaf="Props `dotColor` / `dotClassName`"
                reason="The dot carries the status so the chip does not have to. That is why these chips stay neutral: a row of live services reads as one list with coloured markers, instead of five competing pills."
                note="The dot shows up only when you give it a colour — there is no boolean to turn it on, because a dot with no colour is decoration. Use dotClassName for palette colours, dotColor for a value from outside the palette (a language colour, a partner brand). Set both and the raw value wins."
                code={`<Chip.Base dotClassName="text-success" text="Running" />
<Chip.Base dotClassName="text-warning" text="Degraded" />
<Chip.Base dotClassName="text-danger" text="Down" />
<Chip.Base dotColor="#3178c6" text="TypeScript" />
<Chip.Base dotColor="#3178c6" dotClassName="text-danger" text="Raw colour wins" />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <Chip.Base dotClassName="text-success" text="Running" showAnatomy />
                    <Chip.Base dotClassName="text-warning" text="Degraded" />
                    <Chip.Base dotClassName="text-danger" text="Down" />
                    <Chip.Base dotColor="#3178c6" text="TypeScript" />
                    <Chip.Base dotColor="#3178c6" dotClassName="text-danger" text="Raw colour wins" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `onRemove` — pass a handler and the chip grows a × at the tail. */
export const Removable: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Base"
                tier="atom"
                leaf="Prop `onRemove`"
                reason="Pass a handler and the chip grows a × — that is the whole switch. A chip the reader can dismiss is a filter or a picked value; a chip they cannot is a label."
                note="The × is a real button sized for the pill, and it borrows the chip's colour rather than owning one — the third chip here is the same button on an accent chip. Give it removeLabel so a screen reader hears what is being removed, not just 'Remove'."
                code={`<Chip.Base text="React" />
<Chip.Base text="React" onRemove={dropFilter} removeLabel="Remove the React filter" />
<Chip.Base tone="accent" text="TypeScript" onRemove={dropFilter} removeLabel="Remove the TypeScript filter" />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <Chip.Base text="React" showAnatomy />
                    <Chip.Base text="React" onRemove={() => {}} removeLabel="Remove the React filter" />
                    <Chip.Base
                        tone="accent"
                        text="TypeScript"
                        onRemove={() => {}}
                        removeLabel="Remove the TypeScript filter"
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — CO-LOCATED shimmer (§12c), width follows the actual chip's
 * SLOT COUNT.
 *
 * Renders all FOUR call shapes. The two middle pills coming out equal is CORRECT: the
 * shimmer counts slots, not which side they're on — so these aren't two duplicate
 * pills to trim.
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the chip draws its own shimmer. There is no shared skeleton component to keep in sync."
                note="Width follows how many slots the chip will have when the data lands, so the row does not jump. The two middle pills match on purpose — one leading mark and one × cost the same width; the shimmer counts slots, not sides."
                code={`<Chip.Base isSkeleton />
<Chip.Base isSkeleton icon={ClockIcon} />
<Chip.Base isSkeleton onRemove={dropFilter} />
<Chip.Base isSkeleton icon={ClockIcon} onRemove={dropFilter} />`}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <Chip.Base isSkeleton showAnatomy />
                    <Chip.Base isSkeleton icon={ClockIcon} />
                    <Chip.Base isSkeleton onRemove={() => {}} />
                    <Chip.Base isSkeleton icon={ClockIcon} onRemove={() => {}} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
