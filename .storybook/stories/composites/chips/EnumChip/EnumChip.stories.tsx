import type { Meta, StoryObj } from "@storybook/nextjs"
import { EnumChip } from "@sb-components/composites/chips/EnumChip/EnumChip"
import type { EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `EnumChip` — a `Chip` whose tone / label / optional tooltip / optional leading icon come
 * from a per-value lookup (`map[value]`), so a domain badge shrinks to just its map table plus
 * this delegate. Props: `value`, `map` (two halves of one lookup), `isSkeleton`,
 * `className`/`classNames`.
 */
const meta: Meta<typeof EnumChip> = {
    title: "Composites/Chips/EnumChip",
    component: EnumChip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof EnumChip>

type OrderStatus = "pending" | "paid" | "shipped" | "refunded" | "cancelled" | "verified" | "flagged"

const ORDER_STATUS_MAP: Record<OrderStatus, EnumChipEntry> = {
    pending: { label: "Awaiting confirmation" },
    paid: { color: "success", label: "Paid" },
    shipped: { color: "accent", label: "Shipping" },
    refunded: { color: "warning", label: "Refunded" },
    cancelled: { color: "danger", label: "Cancelled" },
    verified: { color: "success", label: "Verified", icon: "check" },
    flagged: { color: "danger", label: "Flagged", icon: "cross", tooltip: "Flagged for manual review by a moderator" },
}

/**
 * The two elements a resolved entry can put on screen: the `Chip` atom underneath
 * every entry, and the `Tooltip` atom wrapping it once `entry.tooltip` is set.
 * See the file-level caveat: neither ever actually appears in the Structure tab today.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Chip": { tier: "atom", role: "the chip atom this composite configures from the resolved map entry (tone/label/icon)", storyId: "atoms-chips-chip-chip--tones" },
    "Tooltip": { tier: "atom", role: "wraps the chip when the resolved map entry carries a tooltip", storyId: "atoms-overlay-tooltip-tooltip--default" },
}

/** Leaf for props `value` / `map` — the lookup that resolves a tone, label, optional icon, optional tooltip. */
export const ValueAndMap: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="EnumChip"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Props `value` / `map`"
                reason="value picks one entry out of map, and that entry's color/label/icon/tooltip flow straight into the underlying Chip. Domain badges (order status, difficulty, video host) shrink to just their own map table plus this one delegate, instead of re-implementing the lookup each time."
                states={[
                    {
                        name: "value = \"pending\" (entry has no color, falls back to the default tone)",
                        why: "The resolved entry carries no color at all, so the chip renders on the plain neutral surface. This is the shape for a status that has not yet gone anywhere, such as an order still awaiting confirmation.",
                        code: "<EnumChip<OrderStatus> value=\"pending\" map={ORDER_STATUS_MAP} />",
                        render: <EnumChip<OrderStatus> value="pending" map={ORDER_STATUS_MAP} />,
                    },
                    {
                        name: "value = \"paid\" (color = \"success\")",
                        why: "The resolved entry's color reaches the chip as the success tone. Reach for this value when the map entry itself represents the good outcome, such as an order that has been paid.",
                        code: "<EnumChip<OrderStatus> value=\"paid\" map={ORDER_STATUS_MAP} />",
                        render: <EnumChip<OrderStatus> value="paid" map={ORDER_STATUS_MAP} />,
                    },
                    {
                        name: "value = \"shipped\" (color = \"accent\")",
                        why: "The resolved entry's color reaches the chip as the accent tone, drawing the eye without claiming good or bad. This is the shape for a status worth noticing but not yet a verdict, such as an order in transit.",
                        code: "<EnumChip<OrderStatus> value=\"shipped\" map={ORDER_STATUS_MAP} />",
                        render: <EnumChip<OrderStatus> value="shipped" map={ORDER_STATUS_MAP} />,
                    },
                    {
                        name: "value = \"refunded\" (color = \"warning\")",
                        why: "The resolved entry's color reaches the chip as the warning tone, asking for attention without declaring failure. Reach for it on a status that reverses the happy path but is not itself an error, such as a refund.",
                        code: "<EnumChip<OrderStatus> value=\"refunded\" map={ORDER_STATUS_MAP} />",
                        render: <EnumChip<OrderStatus> value="refunded" map={ORDER_STATUS_MAP} />,
                    },
                    {
                        name: "value = \"cancelled\" (color = \"danger\")",
                        why: "The resolved entry's color reaches the chip as the danger tone. Reach for it only for the entry that represents the bad outcome, such as a cancelled order, so a red chip always means something actually went wrong.",
                        code: "<EnumChip<OrderStatus> value=\"cancelled\" map={ORDER_STATUS_MAP} />",
                        render: <EnumChip<OrderStatus> value="cancelled" map={ORDER_STATUS_MAP} />,
                    },
                    {
                        name: "value = \"verified\" (entry.icon = \"check\")",
                        why: "The resolved entry names the check icon, and EnumChip's own closed map (check/cross) turns that into the real icon component the chip renders leading the label. Reach for an icon entry only when the value itself is a \"universal\" verdict a reader can recognise faster as a symbol than as a word.",
                        code: "<EnumChip<OrderStatus> value=\"verified\" map={ORDER_STATUS_MAP} />",
                        render: <EnumChip<OrderStatus> value="verified" map={ORDER_STATUS_MAP} />,
                    },
                    {
                        name: "value = \"flagged\" (entry.icon = \"cross\", entry.tooltip set)",
                        why: "The resolved entry names the cross icon and also carries a tooltip, so EnumChip wraps the chip in the Tooltip atom on top of rendering the icon. This is the shape for a failed/flagged verdict that also owes the reader a reason, hoverable rather than cluttering the chip's own label.",
                        code: "<EnumChip<OrderStatus> value=\"flagged\" map={ORDER_STATUS_MAP} />",
                        render: <EnumChip<OrderStatus> value="flagged" map={ORDER_STATUS_MAP} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isSkeleton` — a co-located shimmer; EnumChip passes no icon/onRemove through, so it is always the plain bare-slot pill. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="EnumChip"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="EnumChip forwards isSkeleton straight to the Chip atom with no icon or onRemove alongside it, so the shimmer is always the plainest bare-slot pill the atom can draw, regardless of what the resolved entry would have shown once loaded."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The chip collapses to Chip's own bare shimmer pill, since EnumChip never passes an icon or a remove handler while loading. Reach for it wherever a real EnumChip will render once its value resolves, so the row does not jump width when the shimmer is replaced.",
                        code: "<EnumChip<OrderStatus> value=\"paid\" map={ORDER_STATUS_MAP} isSkeleton />",
                        render: <EnumChip<OrderStatus> value="paid" map={ORDER_STATUS_MAP} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
