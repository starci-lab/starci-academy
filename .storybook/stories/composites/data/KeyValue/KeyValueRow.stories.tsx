import type { Meta, StoryObj } from "@storybook/nextjs"
import { KeyValueRow } from "@sb-components/composites/data/KeyValue/KeyValue"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (§12f/§13) — `KeyValueRow` owns the SHAPE of ONE label–value
 * pair: label (+`hint`) left, value right, and the `emphasis` EMPHASIS tier for
 * the total row. Those three states originate from its own props → they all live
 * here.
 *
 * `divider` has NO story of its own here: the rule line is a SEAM BETWEEN two
 * rows, only meaningful when the row sits inside a list — its home is
 * `KeyValueList` (where the list decides the last row skips the rule). This is
 * exactly the §12f test: "does this state originate from the component's OWN
 * props, or does it only make sense one level up?".
 *
 * The frame does NOT format: the `value` below is a string ALREADY formatted
 * (`"1.200.000 ₫"`), not a number for the frame to convert units on its own.
 */
const meta: Meta<typeof KeyValueRow> = {
    title: "Composites/Data/KeyValue/KeyValueRow",
    component: KeyValueRow,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KeyValueRow>

/**
 * ANATOMY IS PER-LEAF. The row composes the `Typography.*` atom DIRECTLY (§9 —
 * text goes through the atom, not scattered `text-*`/`font-*`): `Label` (muted) ·
 * `Value` (medium, `tabular-nums`). `Hint` only exists on the leaf that actually
 * passes `hint`.
 */
const ROW_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "atom", role: "label (Sm muted, §9a SECONDARY text) and value (Sm medium + tabular-nums, an ALREADY-formatted node)", storyId: "atoms-text-typography-typography--colors" },
]
const HINT_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "atom", role: "label (Sm muted) · hint (Xs muted, a secondary line under the label, gap-1 §10 tight) · value (Sm medium + tabular-nums)", storyId: "atoms-text-typography-typography--colors" },
]
const EMPHASIS_PARTS: Array<AnatomyNode> = [
    { name: "Typography", tier: "atom", role: "label (Sm foreground + medium, total row's label) and value (Base BOLD + tabular-nums, a large number, §9b)", storyId: "atoms-text-typography-typography--bold" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "heroui", role: "raw HeroUI `Skeleton` bars the row draws itself: a label bar (+ a second bar when `hint` is set) on the left, one value bar on the right" },
]

/** Default — muted label left, medium value right; `justify-between` holds both edges. Migrated to `states` 2026-07-27. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValueRow"
                tier="composite"
                leaf="Default"
                parts={ROW_PARTS}
                reason="The frame for one semantic unit: 'one name, one number'. It only lays out and ranks text through the Typography atom (label muted / value medium, §9), does NOT format and does NOT compute — `value` is a node the consumer hands in already formatted."
                states={[
                    {
                        name: "no hint, emphasis = false (bare pair)",
                        why: "The row renders exactly two `Typography` nodes, a muted `Label` and a medium `Value`, held apart by `justify-between`. A plain spec line — a fee, a quantity — never needs anything heavier than that.",
                        code: "<KeyValueRow label=\"Học phí\" value=\"1.200.000 ₫\" />",
                        render: (
                            <div className="max-w-sm">
                                <KeyValueRow showAnatomy label="Học phí" value="1.200.000 ₫" />
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
                name="KeyValueRow"
                tier="composite"
                leaf="WithHint"
                parts={HINT_PARTS}
                states={[
                    {
                        name: "hint set",
                        why: "A third `Hint` node appears in a tight `gap-1` stack directly under `Label`, while `Value` still anchors `items-start` at the right edge. The hint explains a condition or unit the label alone can't carry, like the date a discount stops applying.",
                        code: `<KeyValueRow
  label="Giảm giá"
  hint="Áp dụng đến 31/12"
  value="-200.000 ₫"
/>`,
                        render: (
                            <div className="max-w-sm">
                                <KeyValueRow showAnatomy label="Giảm giá" hint="Áp dụng đến 31/12" value="-200.000 ₫" />
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
                name="KeyValueRow"
                tier="composite"
                leaf="Emphasis"
                parts={EMPHASIS_PARTS}
                states={[
                    {
                        name: "emphasis = true",
                        why: "The same two nodes render, but `Label` steps up to foreground medium and `Value` steps up to base bold — no new node mounts. A total row needs to visually outrank the line items above it without turning into a different composition, and the number itself still comes from the consumer, never computed here.",
                        code: "<KeyValueRow emphasis label=\"Tổng cộng\" value=\"1.000.000 ₫\" />",
                        render: (
                            <div className="max-w-sm">
                                <KeyValueRow showAnatomy emphasis label="Tổng cộng" value="1.000.000 ₫" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the row draws its own shimmer (label bar + optional hint bar + value bar) instead of a caller faking it with an unrelated atom (§12g.0a). */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValueRow"
                tier="composite"
                leaf="Prop `isSkeleton`"
                parts={SKELETON_PARTS}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The row mirrors its own loaded shape: a label bar (plus a second, shorter bar when `hint` is set) sits left, a value bar sits right, held apart by the same `justify-between` the loaded row uses — so a column of skeleton rows already sits at the loaded rows' rhythm.",
                        code: "<KeyValueRow isSkeleton hint=\"Áp dụng đến 31/12\" />",
                        render: (
                            <div className="max-w-sm">
                                <KeyValueRow isSkeleton hint="Áp dụng đến 31/12" anatPart="KeyValueRow" showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
