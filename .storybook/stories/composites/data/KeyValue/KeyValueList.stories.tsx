import type { Meta, StoryObj } from "@storybook/nextjs"
import { KeyValueList } from "@sb-components/composites/data/KeyValue/KeyValue"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (§12f/§13) — `KeyValueList` is a REPEATING-LIST scaffold: it only
 * owns what emerges when MULTIPLE rows stand side by side — mapping `items`, the
 * `gap` rhythm (§10), the divider BETWEEN rows (`divider`), and the summary shape
 * "N lines + 1 total line" (`emphasis` on the last item).
 *
 * The layout/type scale of ONE row (muted label · medium value · `hint`) is a state
 * of `KeyValueRow` → lives in story `KeyValueRow`, NOT repeated here.
 *
 * `label`/`value` are `string` (COMPOSITE-8 — "the same trap one level in"): the
 * scaffold owns its own loading state via `isSkeleton`/`skeletonRows` (see the
 * `Skeleton` leaf below), so a caller never hand-builds a shimmer pair into `items`.
 *
 * 2026-07-27: migrated to the `states` API (§8) — each leaf below is a single
 * `states` entry, since none of them stacks more than one rendering.
 */
const meta: Meta<typeof KeyValueList> = {
    title: "Composites/Data/KeyValue/KeyValueList",
    component: KeyValueList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KeyValueList>

/** Order summary — `value` is an ALREADY-formatted string (the scaffold doesn't convert units/currency). */
const ITEMS = [
    { key: "tuition", label: "Tuition", value: "$49.00" },
    { key: "discount", label: "Discount", hint: "Code STARCI20", value: "-$8.00" },
    { key: "vat", label: "VAT", value: "$0.00" },
]

/**
 * ANATOMY IS PER-LEAF. The DIRECT child of the list is `KeyValueRow` — same
 * scaffold tier (§11a: each tier only badges its direct child at the highest
 * tier). The internals of one row (`Label`/`Hint`/`Value`) are `KeyValueRow`'s
 * own tree, see its own story.
 */
const LIST_PARTS: Array<AnatomyNode> = [
    {
        name: "KeyValueRow",
        tier: "composite",
        role: "one `KeyValueRow` built from `items[i]`",
        storyId: "composites-data-keyvalue-keyvaluerow--default",
    },
]
const DIVIDER_PARTS: Array<AnatomyNode> = [
    {
        name: "KeyValueRow",
        tier: "composite",
        role: "one `KeyValueRow` built from `items[i]`",
        storyId: "composites-data-keyvalue-keyvaluerow--default",
    },
    {
        name: "Divider",
        tier: "atom",
        role: "BETWEEN two rows — the last row doesn't get a line",
        storyId: "atoms-display-divider-divider--default",
    },
]

/** Default — `items` is DATA (§13b forbids children); default gap `3` (vertical rows). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="KeyValueList"
                tier="composite"
                leaf="Default"
                renderClassName="max-w-sm"
                parts={LIST_PARTS}
                reason="N label–value pairs of the SAME KIND ⇒ §13b requires `items`, forbids children. `gap` is TYPE-FORCED onto the §10 scale (`0·1·2·3·6·8`) so the vertical rhythm can never drift off the scale — this is why this scaffold exists instead of a hand-rolled `flex flex-col` at the call site."
                states={[
                    {
                        name: "items = 3 rows, divider unset",
                        why: "Three `KeyValueRow` nodes stack with no line between them, spaced at the default `gap` step. This is the plain summary shape for a short list of facts the reader scans top to bottom without needing a seam between them.",
                        code: `<KeyValueList
    items={[
        { key: "tuition", label: "Tuition", value: "$49.00" },
        { key: "discount", label: "Discount", hint: "Code STARCI20", value: "-$8.00" },
        { key: "vat", label: "VAT", value: "$0.00" },
    ]}
/>`,
                        render: <KeyValueList showAnatomy items={ITEMS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** WithDivider — the divider line is the SEAM between two rows: the LAST row gets no line. */
export const WithDivider: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="KeyValueList"
                tier="composite"
                leaf="WithDivider"
                renderClassName="max-w-sm"
                parts={DIVIDER_PARTS}
                reason="N label–value pairs of the SAME KIND ⇒ §13b requires `items`, forbids children. `gap` is TYPE-FORCED onto the §10 scale so the vertical rhythm can never drift off it."
                states={[
                    {
                        name: "divider = true",
                        why: "A `Divider` node grows between each pair of rows, but the last row keeps no trailing line beneath it. The list decides this seam, not each row, so there is never a stray line hanging at the bottom of the block.",
                        code: "<KeyValueList divider items={ITEMS} />",
                        render: <KeyValueList showAnatomy divider items={ITEMS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** WithTotal — summary shape: N regular lines + a final `emphasis` line, separated by a divider. */
export const WithTotal: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="KeyValueList"
                tier="composite"
                leaf="WithTotal"
                renderClassName="max-w-sm"
                parts={DIVIDER_PARTS}
                reason="The scaffold carries no arithmetic of its own (§13) — the consumer always hands in an already-computed, already-formatted total, and `emphasis` only changes how that one row looks."
                states={[
                    {
                        name: "divider = true, last item has emphasis = true",
                        why: "The final row prints in a heavier weight than the rows above it, still separated from them by the same divider seam. `emphasis` is just a flag on that one item — the list never sums the rows above it on its own.",
                        code: `<KeyValueList
    divider
    items={[
        …ITEMS,
        { key: "total", label: "Total", value: "$41.00", emphasis: true },
    ]}
/>`,
                        render: (
                            <KeyValueList
                                showAnatomy
                                divider
                                items={[...ITEMS, { key: "total", label: "Total", value: "$41.00", emphasis: true }]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the scaffold generates `skeletonRows` placeholder `KeyValueRow` nodes itself (§12g.0a, added 2026-07-29). `label`/`value` are `string` (COMPOSITE-8), so loading is never hand-mirrored into `items` — this flag is the only path. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="KeyValueList"
                tier="composite"
                leaf="Prop `isSkeleton`"
                parts={LIST_PARTS}
                renderClassName="max-w-sm"
                states={[
                    {
                        name: "isSkeleton = true, default skeletonRows",
                        why: "Three shimmer `KeyValueRow` nodes stack at the list's own `gap`, standing in for `items` before the real label–value pairs are known — the count comes from `skeletonRows` (default `3`), not from an `items` array the caller no longer has to fake.",
                        code: "<KeyValueList items={items} isSkeleton />",
                        render: <KeyValueList items={[]} showAnatomy isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
