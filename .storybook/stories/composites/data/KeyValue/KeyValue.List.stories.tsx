import type { Meta, StoryObj } from "@storybook/nextjs"
import { KeyValue } from "@sb-components/composites/data/KeyValue/KeyValue"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ⚠️ STATE SCOPE (§12f/§13) — `KeyValue.List` is a REPEATING-LIST scaffold: it only
 * owns what emerges when MULTIPLE rows stand side by side — mapping `items`, the
 * `gap` rhythm (§10), the divider BETWEEN rows (`divider`), and the summary shape
 * "N lines + 1 total line" (`emphasis` on the last item).
 *
 * The layout/type scale of ONE row (muted label · medium value · `hint`) is a state
 * of `KeyValue.Row` → lives in story `KeyValue.Row`, NOT repeated here.
 *
 * `Loading`: the scaffold has NO `isSkeleton` flag (it doesn't know what the value
 * is, and the row count is the consumer's call) — the caller MIRRORS by pouring
 * `Skeleton.Typography` into exactly the `label`/`value` cells, keeping the same
 * scaffold + row count (§8, no layout jump).
 *
 * 2026-07-27: migrated to the `states` API (§8) — each leaf below is a single
 * `states` entry, since none of them stacks more than one rendering.
 */
const meta: Meta<typeof KeyValue.List> = {
    title: "Composites/Data/KeyValue/KeyValue.List",
    component: KeyValue.List,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KeyValue.List>

/** Order summary — `value` is an ALREADY-formatted string (the scaffold doesn't convert units/currency). */
const ITEMS = [
    { key: "tuition", label: "Học phí", value: "1.200.000 ₫" },
    { key: "discount", label: "Giảm giá", hint: "Mã STARCI20", value: "-200.000 ₫" },
    { key: "vat", label: "Thuế VAT", value: "0 ₫" },
]

/**
 * ANATOMY IS PER-LEAF. The DIRECT child of the list is `KeyValue.Row` — same
 * scaffold tier (§11a: each tier only badges its direct child at the highest
 * tier). The internals of one row (`Label`/`Hint`/`Value`) are `KeyValue.Row`'s
 * own tree, see its own story.
 */
const LIST_PARTS: Array<AnatomyNode> = [
    {
        name: "KeyValue.Row",
        tier: "composite",
        role: "one `KeyValue.Row` built from `items[i]`",
        storyId: "composites-data-keyvalue-keyvalue-row--default",
    },
]
const DIVIDER_PARTS: Array<AnatomyNode> = [
    {
        name: "KeyValue.Row",
        tier: "composite",
        role: "one `KeyValue.Row` built from `items[i]`",
        storyId: "composites-data-keyvalue-keyvalue-row--default",
    },
    {
        name: "Divider.Base",
        tier: "atom",
        role: "BETWEEN two rows — the last row doesn't get a line",
        storyId: "atoms-display-divider-divider-base--default",
    },
]

/** Default — `items` is DATA (§13b forbids children); default gap `3` (vertical rows). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.List"
                tier="composite"
                leaf="Default"
                renderClassName="max-w-sm"
                parts={LIST_PARTS}
                reason="N label–value pairs of the SAME KIND ⇒ §13b requires `items`, forbids children. `gap` is TYPE-FORCED onto the §10 scale (`0·1·2·3·6·8`) so the vertical rhythm can never drift off the scale — this is why this scaffold exists instead of a hand-rolled `flex flex-col` at the call site."
                states={[
                    {
                        name: "items = 3 rows, divider unset",
                        why: "Three `KeyValue.Row` nodes stack with no line between them, spaced at the default `gap` step. This is the plain summary shape for a short list of facts the reader scans top to bottom without needing a seam between them.",
                        code: `<KeyValue.List
    items={[
        { key: "tuition", label: "Học phí", value: "1.200.000 ₫" },
        { key: "discount", label: "Giảm giá", hint: "Mã STARCI20", value: "-200.000 ₫" },
        { key: "vat", label: "Thuế VAT", value: "0 ₫" },
    ]}
/>`,
                        render: <KeyValue.List showAnatomy items={ITEMS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** WithDivider — the divider line is the SEAM between two rows: the LAST row gets no line. */
export const WithDivider: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.List"
                tier="composite"
                leaf="WithDivider"
                renderClassName="max-w-sm"
                parts={DIVIDER_PARTS}
                reason="N label–value pairs of the SAME KIND ⇒ §13b requires `items`, forbids children. `gap` is TYPE-FORCED onto the §10 scale so the vertical rhythm can never drift off it."
                states={[
                    {
                        name: "divider = true",
                        why: "A `Divider` node grows between each pair of rows, but the last row keeps no trailing line beneath it. The list decides this seam, not each row, so there is never a stray line hanging at the bottom of the block.",
                        code: "<KeyValue.List divider items={ITEMS} />",
                        render: <KeyValue.List showAnatomy divider items={ITEMS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** WithTotal — summary shape: N regular lines + a final `emphasis` line, separated by a divider. */
export const WithTotal: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.List"
                tier="composite"
                leaf="WithTotal"
                renderClassName="max-w-sm"
                parts={DIVIDER_PARTS}
                reason="The scaffold carries no arithmetic of its own (§13) — the consumer always hands in an already-computed, already-formatted total, and `emphasis` only changes how that one row looks."
                states={[
                    {
                        name: "divider = true, last item has emphasis = true",
                        why: "The final row prints in a heavier weight than the rows above it, still separated from them by the same divider seam. `emphasis` is just a flag on that one item — the list never sums the rows above it on its own.",
                        code: `<KeyValue.List
    divider
    items={[
        …ITEMS,
        { key: "total", label: "Tổng cộng", value: "1.000.000 ₫", emphasis: true },
    ]}
/>`,
                        render: (
                            <KeyValue.List
                                showAnatomy
                                divider
                                items={[...ITEMS, { key: "total", label: "Tổng cộng", value: "1.000.000 ₫", emphasis: true }]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Loading — caller MIRRORS: keeps the scaffold + row count, only pours skeleton bars into the 2 cells. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.List"
                tier="composite"
                leaf="Loading"
                renderClassName="max-w-sm"
                parts={LIST_PARTS}
                reason="The scaffold owns no `isSkeleton` flag of its own — it doesn't know what the value means, and the row count is the consumer's call, so the consumer is the one who has to mirror the resting shape."
                states={[
                    {
                        name: "label and value cells replaced with Typography.Base isSkeleton",
                        why: "Each cell that would hold real text instead holds a shimmer bar, but the scaffold, the row count, and the gap between rows stay exactly the real tree. The footprint therefore never jumps once the real label/value pairs land.",
                        code: `<KeyValue.List
    items={ITEMS.map((item) => ({
        key: item.key,
        label: <Typography size="sm" isSkeleton className="w-24" />,
        value: <Typography size="sm" isSkeleton className="w-20" />,
    }))}
/>`,
                        render: (
                            <KeyValue.List
                                showAnatomy
                                items={ITEMS.map((item) => ({
                                    key: item.key,
                                    label: <Typography size="sm" isSkeleton className="w-24" />,
                                    value: <Typography size="sm" isSkeleton className="w-20" />,
                                }))}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
