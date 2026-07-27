import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, type ChipGroupItem, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Chip.Group`: a ROW of chips built from `items` data, cut at `maxVisible`,
 * the overflow gathered into a `+N` chip that opens a Tooltip.
 *
 * ⚠️ STATE SCOPE (§12f): the cluster does NOT invent new meaning — it `import { ChipBase }`
 * and rebuilds. So the story here ONLY renders state BELONGING TO THE CLUSTER: `items` ·
 * `maxVisible` · cluster-level `tone` · `isSkeleton` for the whole row. State of EACH chip
 * (glyph, color dot, × button) lives in the `Chip.Base` story — NOT repeated here.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). The cluster's prop set is smaller than `Chip.Base`'s, correctly, per §12f.
 *
 * ⚠️ This is the old `TagChips` (moved 2026-07-26). The old version called HeroUI Chip
 * directly so it drifted away from the atom: chips in the row didn't follow tone, the
 * skeleton drew a different size on its own. Now every pill in the row is a real
 * `Chip.Base` — see the Deps tab.
 */
const meta: Meta<typeof Chip.Group> = {
    title: "Atoms/Chips/Chip/Chip.Group",
    component: Chip.Group,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Chip.Group>

/**
 * DEPS = the OTHER story this cluster rebuilds. Only ONE node: `Chip.Base`.
 *
 * The `+N` chip's Tooltip HAS its own story but hasn't made it into the tree yet:
 * `Tooltip.Base` currently only emits `data-anat-part="Trigger"`/`"Content"` (SLOT
 * names, not namespace names) and doesn't accept an `anatPart` for the cluster to name
 * it by. Declaring `Trigger` here would produce a node with the wrong name, so it's left
 * out for now — `Tooltip.Base` needs an `anatPart` prop added before this can be declared.
 */
const GROUP_DEPS: Record<string, AnatomyAnnotation> = {
    "Chip.Base": {
        tier: "atom",
        role: "every pill in the row, including the +N one",
        storyId: "atoms-chips-chip-chip-base--default",
    },
}

/** Sample tag row — long enough to see where the cut happens. */
const ITEMS: Array<ChipGroupItem> = [
    { key: "ts", text: "TypeScript" },
    { key: "react", text: "React" },
    { key: "node", text: "Node.js" },
    { key: "postgres", text: "PostgreSQL" },
    { key: "docker", text: "Docker" },
    { key: "k8s", text: "Kubernetes" },
]

/** Short row — fits entirely under `maxVisible` so there's no `+N` chip. */
const SHORT_ITEMS: Array<ChipGroupItem> = ITEMS.slice(0, 3)

/** One row of the tone demo table below. */
interface ToneRow {
    /** color token applied to the whole chip row */
    tone: ChipTone
    /** short caption explaining when to reach for this tone */
    hint: string
}

const TONES: Array<ToneRow> = [
    { tone: "neutral", hint: "plain tags" },
    { tone: "success", hint: "everything checked out" },
    { tone: "warning", hint: "needs a look" },
    { tone: "danger", hint: "blocking" },
    { tone: "accent", hint: "highlighted set" },
]

/** Leaf prop `items` — the cluster builds the row from DATA; a long row gathers the overflow into `+N`. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Group"
                tier="atom"
                leaf="Prop `items`"
                annotate={GROUP_DEPS}
                reason="The row is described as data, never as JSX children — so a caller cannot slip a different pill, a different tone, or a stray wrapper into the middle of it."
                note="Short rows render every item. Once the list runs past the cut, the tail collapses into a +N chip; hover it and the tooltip lists the whole set, not just the hidden part — people open it to ask 'what are all of these', not 'what is missing'."
                code={`<Chip.Group
  items={[
    { key: "ts", text: "TypeScript" },
    { key: "react", text: "React" },
    { key: "node", text: "Node.js" },
  ]}
/>`}
            >
                <div className="flex flex-col items-start gap-4">
                    <Chip.Group items={SHORT_ITEMS} showAnatomy />
                    <Chip.Group items={ITEMS} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `maxVisible` — where the row gets CUT. */
export const MaxVisible: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Group"
                tier="atom"
                leaf="Prop `maxVisible`"
                annotate={GROUP_DEPS}
                reason="The cut belongs to the row, not to the page: a tag row in a dense card can only afford two chips, the same row on a detail page can show five. Same data, one number to move."
                note="All four rows below hold the same six items. Raise the number past the list and the +N chip disappears on its own — the count never goes negative."
                code={`<Chip.Group maxVisible={2} items={[…6 items…]} />
<Chip.Group items={[…6 items…]} />          // 3 = default
<Chip.Group maxVisible={5} items={[…6 items…]} />
<Chip.Group maxVisible={8} items={[…6 items…]} />`}
            >
                <div className="flex flex-col items-start gap-4">
                    <Chip.Group maxVisible={2} items={ITEMS} showAnatomy />
                    <Chip.Group items={ITEMS} />
                    <Chip.Group maxVisible={5} items={ITEMS} />
                    <Chip.Group maxVisible={8} items={ITEMS} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `tone` — set at the CLUSTER LEVEL: a row of tokens must share one color (§12d). */
export const Tones: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Group"
                tier="atom"
                leaf="Prop `tone`"
                annotate={GROUP_DEPS}
                reason="Tone sits on the row, not on the item. A row is read as one set, so one colour; letting each item pick its own turns a tag list into a rainbow and nobody can tell which chip is trying to say something."
                note="The +N chip takes the row tone too, so the overflow does not read as a different kind of thing."
                code={`<Chip.Group tone="neutral" items={[…]} />
<Chip.Group tone="success" items={[…]} />
<Chip.Group tone="warning" items={[…]} />
<Chip.Group tone="danger" items={[…]} />
<Chip.Group tone="accent" items={[…]} />`}
            >
                <div className="flex flex-col items-start gap-4">
                    {TONES.map(({ tone }, index) => (
                        <Chip.Group key={tone} tone={tone} items={ITEMS} showAnatomy={index === 0} />
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — the cluster only PASSES the flag down, each pill draws its
 * own shimmer (§12c).
 *
 * `showAnatomy` is on for the skeleton branch too — otherwise the tree reports "0 parts"
 * and looks like the cluster draws its own shimmer — dead wrong about the source (this
 * trap already bit `Button.Group`).
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Chip.Group"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={GROUP_DEPS}
                reason="The row does not draw the resting state itself — it still builds Chip.Base, one per slot, and each pill draws its own shimmer. Two components drawing the same pill would drift apart the first time one of them changes."
                note="It holds maxVisible pills, so the row keeps the width it will have when the data lands. The pills are the bare, narrowest form because a row of tags has no leading mark and no × on it."
                code={`<Chip.Group isSkeleton items={tags} />
<Chip.Group isSkeleton maxVisible={5} items={tags} />`}
            >
                <div className="flex flex-col items-start gap-4">
                    <Chip.Group isSkeleton items={ITEMS} showAnatomy />
                    <Chip.Group isSkeleton maxVisible={5} items={ITEMS} showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
