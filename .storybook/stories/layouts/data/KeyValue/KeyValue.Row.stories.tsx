import type { Meta, StoryObj } from "@storybook/nextjs"
import { KeyValue } from "@sb-components/layouts/data/KeyValue/KeyValue"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (§12f/§13) — `KeyValue.Row` owns the SHAPE of ONE label–value
 * pair: label (+`hint`) left, value right, and the `emphasis` EMPHASIS tier for
 * the total row. Those three states originate from its own props → they all live
 * here.
 *
 * `divider` has NO story of its own here: the rule line is a SEAM BETWEEN two
 * rows, only meaningful when the row sits inside a list — its home is
 * `KeyValue.List` (where the list decides the last row skips the rule). This is
 * exactly the §12f test: "does this state originate from the component's OWN
 * props, or does it only make sense one level up?".
 *
 * The frame does NOT format: the `value` below is a string ALREADY formatted
 * (`"1.200.000 ₫"`), not a number for the frame to convert units on its own.
 */
const meta: Meta<typeof KeyValue.Row> = {
    title: "Layouts/Data/KeyValue/KeyValue.Row",
    component: KeyValue.Row,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KeyValue.Row>

/**
 * ANATOMY IS PER-LEAF. The row composes the `Typography.*` atom DIRECTLY (§9 —
 * text goes through the atom, not scattered `text-*`/`font-*`): `Label` (muted) ·
 * `Value` (medium, `tabular-nums`). `Hint` only exists on the leaf that actually
 * passes `hint`.
 */
const ROW_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "Typography.Sm muted — the value's name (§9a SECONDARY text)" },
    { name: "Value", tier: "atom", role: "Typography.Sm medium + tabular-nums — an ALREADY-formatted node" },
]
const HINT_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "Typography.Sm muted" },
    { name: "Hint", tier: "atom", role: "Typography.Xs muted — a secondary line under the label, gap-1 (§10 tight)" },
    { name: "Value", tier: "atom", role: "Typography.Sm medium + tabular-nums" },
]
const EMPHASIS_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "Typography.Sm foreground + medium (total row's label)" },
    { name: "Value", tier: "atom", role: "Typography.Base BOLD + tabular-nums (a large number, §9b)" },
]

/** Default — muted label left, medium value right; `justify-between` holds both edges. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.Row"
                tier="primitive"
                leaf="Default"
                parts={ROW_PARTS}
                reason="The frame for one semantic unit: 'one name, one number'. It only lays out + ranks text through the Typography atom (label muted / value medium, §9), does NOT format and does NOT compute — `value` is a node the consumer hands in already formatted."
                code={"<KeyValue.Row label=\"Học phí\" value=\"1.200.000 ₫\" />"}
            >
                <div className="max-w-sm">
                    <KeyValue.Row showAnatomy label="Học phí" value="1.200.000 ₫" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** WithHint — `hint` is a secondary line UNDER the label (condition/unit), tight gap-1 cluster. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.Row"
                tier="primitive"
                leaf="WithHint"
                parts={HINT_PARTS}
                note="`hint` belongs to the LABEL COLUMN (not the value column) so it stacks under `Label` with `gap-1` (§10b `tight`); the value still anchors `items-start` at the right edge, not pulled down to center."
                code={`<KeyValue.Row
  label="Giảm giá"
  hint="Áp dụng đến 31/12"
  value="-200.000 ₫"
/>`}
            >
                <div className="max-w-sm">
                    <KeyValue.Row showAnatomy label="Giảm giá" hint="Áp dụng đến 31/12" value="-200.000 ₫" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Emphasis — the EMPHASIS tier for the total row: label steps up to foreground medium, value to base bold. */
export const Emphasis: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.Row"
                tier="primitive"
                leaf="Emphasis"
                parts={EMPHASIS_PARTS}
                note="`emphasis` only changes the TEXT TIER (§9: label muted→foreground medium, value sm-medium→base-bold) — it does NOT change the structure, doesn't sum a total itself. The number still comes from the consumer."
                code={"<KeyValue.Row emphasis label=\"Tổng cộng\" value=\"1.000.000 ₫\" />"}
            >
                <div className="max-w-sm">
                    <KeyValue.Row showAnatomy emphasis label="Tổng cộng" value="1.000.000 ₫" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
