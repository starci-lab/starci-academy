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
        name: "Row",
        tier: "composite",
        role: "one `KeyValue.Row` built from `items[i]`",
        storyId: "composites-data-keyvalue-keyvalue-row--default",
    },
]
const DIVIDER_PARTS: Array<AnatomyNode> = [
    {
        name: "Row",
        tier: "composite",
        role: "one `KeyValue.Row` built from `items[i]`",
        storyId: "composites-data-keyvalue-keyvalue-row--default",
    },
    { name: "Divider", tier: "atom", role: "`Divider.Base` BETWEEN two rows — the last row doesn't get a line" },
]

/** Default — `items` is DATA (§13b forbids children); default gap `3` (vertical rows). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.List"
                tier="composite"
                leaf="Default"
                parts={LIST_PARTS}
                reason="N label–value pairs of the SAME KIND ⇒ §13b requires `items`, forbids children. `gap` is TYPE-FORCED onto the §10 scale (`0·1·2·3·6·8`) so the vertical rhythm can never drift off the scale — this is why this scaffold exists instead of a hand-rolled `flex flex-col` at the call site."
                code={`<KeyValue.List
  items={[
    { key: "tuition", label: "Học phí", value: "1.200.000 ₫" },
    { key: "discount", label: "Giảm giá", hint: "Mã STARCI20", value: "-200.000 ₫" },
    { key: "vat", label: "Thuế VAT", value: "0 ₫" },
  ]}
/>`}
            >
                <div className="max-w-sm">
                    <KeyValue.List showAnatomy items={ITEMS} />
                </div>
            </BlockAnatomy>
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
                parts={DIVIDER_PARTS}
                note="The LIST decides the divider line, not the row — so there's never a stray line hanging at the bottom. The space above/below the line SHARES the list's `gap` ⇒ the rhythm always balances (§10a: one seam, one owner)."
                code={"<KeyValue.List divider items={ITEMS} />"}
            >
                <div className="max-w-sm">
                    <KeyValue.List showAnatomy divider items={ITEMS} />
                </div>
            </BlockAnatomy>
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
                parts={DIVIDER_PARTS}
                note="The total line is just an item with `emphasis` — the scaffold does NOT sum on its own (carries no logic, §13). The consumer hands in an already-computed, already-formatted number."
                code={`<KeyValue.List
  divider
  items={[
    …ITEMS,
    { key: "total", label: "Tổng cộng", value: "1.000.000 ₫", emphasis: true },
  ]}
/>`}
            >
                <div className="max-w-sm">
                    <KeyValue.List
                        showAnatomy
                        divider
                        items={[...ITEMS, { key: "total", label: "Tổng cộng", value: "1.000.000 ₫", emphasis: true }]}
                    />
                </div>
            </BlockAnatomy>
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
                parts={LIST_PARTS}
                note="The scaffold doesn't own loading state (no `isSkeleton`): row count and each cell's meaning belong to the consumer. The mirror keeps the EXACT real tree — still `KeyValue.Row`, just swapping `label`/`value` for `Skeleton.Typography` so the footprint doesn't jump when data lands."
                code={`<KeyValue.List
  items={ITEMS.map((item) => ({
    key: item.key,
    label: <Typography size="sm" isSkeleton className="w-24" />,
    value: <Typography size="sm" isSkeleton className="w-20" />,
  }))}
/>`}
            >
                <div className="max-w-sm">
                    <KeyValue.List
                        showAnatomy
                        items={ITEMS.map((item) => ({
                            key: item.key,
                            label: <Typography size="sm" isSkeleton className="w-24" />,
                            value: <Typography size="sm" isSkeleton className="w-20" />,
                        }))}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
