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
                reason="The row is described as data, never as JSX children, so a caller cannot slip a different pill, a different tone, or a stray wrapper into the middle of it."
                states={[
                    {
                        name: "items = 3 tags (under maxVisible)",
                        why: "Every item renders as its own chip and no `+N` chip appears, because the row never crosses the cut. This is the everyday shape for a short tag list.",
                        code: `<Chip.Group
  items={[
    { key: "ts", text: "TypeScript" },
    { key: "react", text: "React" },
    { key: "node", text: "Node.js" },
  ]}
/>`,
                        render: <Chip.Group items={SHORT_ITEMS} showAnatomy />,
                    },
                    {
                        name: "items = 6 tags (past maxVisible)",
                        why: "Once the list runs past the cut, the tail collapses into a `+N` chip, and hovering it opens a tooltip listing the whole set rather than only the hidden part. Readers open that tooltip to ask what all of these are, not what is missing, so it repeats the full list on purpose.",
                        code: `<Chip.Group
  items={[
    { key: "ts", text: "TypeScript" },
    { key: "react", text: "React" },
    { key: "node", text: "Node.js" },
    { key: "postgres", text: "PostgreSQL" },
    { key: "docker", text: "Docker" },
    { key: "k8s", text: "Kubernetes" },
  ]}
/>`,
                        render: <Chip.Group items={ITEMS} />,
                    },
                ]}
            />
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
                reason="The cut belongs to the row, not to the page: a tag row in a dense card can only afford two chips, while the same row on a detail page can show five, and moving the cut is a single number regardless of how much data sits behind it."
                states={[2, undefined, 5, 8].map((maxVisible) => ({
                    name: maxVisible === undefined ? "maxVisible unset (defaults to 3)" : `maxVisible = ${maxVisible}`,
                    why: "Six items hold steady across every value of this prop, only the count kept visible before the row folds the rest into a `+N` chip changes. Raising the number past the length of the list makes the `+N` chip disappear on its own, since the count never goes negative.",
                    code: maxVisible === undefined
                        ? "<Chip.Group items={[…6 items…]} />          // 3 = default"
                        : `<Chip.Group maxVisible={${maxVisible}} items={[…6 items…]} />`,
                    render: maxVisible === undefined
                        ? <Chip.Group items={ITEMS} showAnatomy />
                        : <Chip.Group maxVisible={maxVisible} items={ITEMS} showAnatomy />,
                }))}
            />
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
                reason="Tone sits on the row, not on the item: a row is read as one set, so it carries one color, and letting each item pick its own would turn a tag list into a rainbow that nobody can read as a single message."
                states={TONES.map(({ tone, hint }) => ({
                    name: `tone = "${tone}"`,
                    why: `Every chip in the row, including the overflow \`+N\` chip, takes this one color, so the whole set reads as a single message rather than a mix of unrelated pills. Reach for \`${tone}\` for ${hint}.`,
                    code: `<Chip.Group tone="${tone}" items={[…]} />`,
                    render: <Chip.Group tone={tone} items={ITEMS} showAnatomy />,
                }))}
            />
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — the cluster only PASSES the flag down, each pill draws its
 * own shimmer (§12c).
 *
 * `showAnatomy` is on for the skeleton branch too — otherwise the tree reports "0 parts"
 * and looks like the cluster draws its own shimmer, dead wrong about the source (this
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
                reason="The row does not draw the resting state itself: it still builds Chip.Base, one per slot, and each pill draws its own shimmer, so two components never end up drawing the same pill and drifting apart the first time one of them changes."
                states={[
                    {
                        name: "isSkeleton = true, maxVisible unset",
                        why: "The row holds three shimmering pills, the width it will have once the default cut of data lands. The pills are the bare, narrowest form because a row of tags has no leading mark and no × button on it.",
                        code: "<Chip.Group isSkeleton items={tags} />",
                        render: <Chip.Group isSkeleton items={ITEMS} showAnatomy />,
                    },
                    {
                        name: "isSkeleton = true, maxVisible = 5",
                        why: "The row holds five shimmering pills instead of three, matching the width it will occupy once five real tags land under this cut. Only the count of pills changes; each one is still the same bare, narrowest shape.",
                        code: "<Chip.Group isSkeleton maxVisible={5} items={tags} />",
                        render: <Chip.Group isSkeleton maxVisible={5} items={ITEMS} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
