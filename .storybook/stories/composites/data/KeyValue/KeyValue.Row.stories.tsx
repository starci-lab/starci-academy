import type { Meta, StoryObj } from "@storybook/nextjs"
import { KeyValue } from "@sb-components/composites/data/KeyValue/KeyValue"
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
    title: "Composites/Data/KeyValue/KeyValue.Row",
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
    { name: "Label", tier: "atom", role: "Typography.Sm muted — the value's name (§9a SECONDARY text)", storyId: "atoms-text-typography-typography-base--colors" },
    { name: "Value", tier: "atom", role: "Typography.Sm medium + tabular-nums — an ALREADY-formatted node", storyId: "atoms-text-typography-typography-base--numeric" },
]
const HINT_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "Typography.Sm muted", storyId: "atoms-text-typography-typography-base--colors" },
    { name: "Hint", tier: "atom", role: "Typography.Xs muted — a secondary line under the label, gap-1 (§10 tight)", storyId: "atoms-text-typography-typography-base--colors" },
    { name: "Value", tier: "atom", role: "Typography.Sm medium + tabular-nums", storyId: "atoms-text-typography-typography-base--numeric" },
]
const EMPHASIS_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "Typography.Sm foreground + medium (total row's label)", storyId: "atoms-text-typography-typography-base--bold" },
    { name: "Value", tier: "atom", role: "Typography.Base BOLD + tabular-nums (a large number, §9b)", storyId: "atoms-text-typography-typography-base--numeric" },
]

/** Default — muted label left, medium value right; `justify-between` holds both edges. Migrated to `states` 2026-07-27. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.Row"
                tier="composite"
                leaf="Default"
                parts={ROW_PARTS}
                reason="The frame for one semantic unit: 'one name, one number'. It only lays out and ranks text through the Typography atom (label muted / value medium, §9), does NOT format and does NOT compute — `value` is a node the consumer hands in already formatted."
                states={[
                    {
                        name: "no hint, emphasis = false (bare pair)",
                        why: "The row renders exactly two `Typography` nodes, a muted `Label` and a medium `Value`, held apart by `justify-between`. A plain spec line — a fee, a quantity — never needs anything heavier than that.",
                        code: "<KeyValue.Row label=\"Học phí\" value=\"1.200.000 ₫\" />",
                        render: (
                            <div className="max-w-sm">
                                <KeyValue.Row showAnatomy label="Học phí" value="1.200.000 ₫" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** WithHint — `hint` is a secondary line UNDER the label (condition/unit), tight gap-1 cluster. Migrated to `states` 2026-07-27. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.Row"
                tier="composite"
                leaf="WithHint"
                parts={HINT_PARTS}
                states={[
                    {
                        name: "hint set",
                        why: "A third `Hint` node appears in a tight `gap-1` stack directly under `Label`, while `Value` still anchors `items-start` at the right edge. The hint explains a condition or unit the label alone can't carry, like the date a discount stops applying.",
                        code: `<KeyValue.Row
  label="Giảm giá"
  hint="Áp dụng đến 31/12"
  value="-200.000 ₫"
/>`,
                        render: (
                            <div className="max-w-sm">
                                <KeyValue.Row showAnatomy label="Giảm giá" hint="Áp dụng đến 31/12" value="-200.000 ₫" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Emphasis — the EMPHASIS tier for the total row: label steps up to foreground medium, value to base bold. Migrated to `states` 2026-07-27. */
export const Emphasis: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.Row"
                tier="composite"
                leaf="Emphasis"
                parts={EMPHASIS_PARTS}
                states={[
                    {
                        name: "emphasis = true",
                        why: "The same two nodes render, but `Label` steps up to foreground medium and `Value` steps up to base bold — no new node mounts. A total row needs to visually outrank the line items above it without turning into a different composition, and the number itself still comes from the consumer, never computed here.",
                        code: "<KeyValue.Row emphasis label=\"Tổng cộng\" value=\"1.000.000 ₫\" />",
                        render: (
                            <div className="max-w-sm">
                                <KeyValue.Row showAnatomy emphasis label="Tổng cộng" value="1.000.000 ₫" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
