import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChipEnum, ChipHighlight, ChipRemovable } from "@sb-components/composites/chips/Chip/Chip"
import type { EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Chip.*` — a compound namespace gathering the composite-tier chips under one root (same
 * pattern as `Skeleton.*`). The base HeroUI pill uses the alias `HeroChip`; design-tier chips
 * (Difficulty/AiCategory/Language) do not live here. `Chip.tsx` re-exports three composites
 * under new names: `EnumChip`→`ChipEnum`, `HighlightChip`→`ChipHighlight`, `RemovableToken`→`ChipRemovable`.
 */
const meta: Meta = {
    title: "Composites/Chips/Chip",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj

type OrderStatus = "pending" | "paid"
const ORDER_STATUS_MAP: Record<OrderStatus, EnumChipEntry> = {
    pending: { label: "Pending" },
    paid: { color: "success", label: "Paid" },
}

/** The `Chip` atom every member here composes on top of, EXCEPT `ChipRemovable` (built on `Typography` + `Button` instead — see its own leaf below). */
const ANNOTATE_CHIP: Record<string, AnatomyAnnotation> = {
    "Chip": { tier: "atom", role: "the one chip atom this member configures", storyId: "atoms-chips-chip-chip--default" },
}

/** Leaf for member `ChipEnum` — the alias for `EnumChip` (Composites/Chips/EnumChip), the enum-driven chip. */
export const Enum: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Chip"
                tier="composite"
                annotate={ANNOTATE_CHIP}
                leaf="Member `ChipEnum`"
                reason="ChipEnum aliases EnumChip: the composite that resolves a Chip's tone/label/icon/tooltip from a per-value map. Renamed on the way in so a caller reaching for any composite-tier chip only ever imports Chip, the same convention already used for Skeleton.*. Its full prop-by-prop coverage (value/map/isSkeleton) lives at its own story, Composites/Chips/EnumChip, not here."
                states={[
                    {
                        name: "value = \"paid\" (maps to a success-toned entry)",
                        why: "The alias resolves \"paid\" against the shared status map and renders exactly the chip its entry describes, success tone included. Reach for the alias over importing EnumChip directly once more than one composite-tier chip shows up at the same call site, so every one of them reads from the same Chip.* namespace.",
                        code: "<ChipEnum<OrderStatus> value=\"paid\" map={ORDER_STATUS_MAP} />",
                        render: <ChipEnum<OrderStatus> value="paid" map={ORDER_STATUS_MAP} />,
                    },
                    {
                        name: "value = \"pending\" (maps to a default-toned entry)",
                        why: "The same map resolves a different key to the neutral default tone, confirming the alias tracks whatever the underlying EnumChip would render for that value — nothing added, nothing lost by going through the compound.",
                        code: "<ChipEnum<OrderStatus> value=\"pending\" map={ORDER_STATUS_MAP} />",
                        render: <ChipEnum<OrderStatus> value="pending" map={ORDER_STATUS_MAP} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for member `ChipHighlight` — the alias for `HighlightChip` (Composites/Chips/HighlightChip), the value+label stat pill. */
export const Highlight: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Chip"
                tier="composite"
                annotate={ANNOTATE_CHIP}
                leaf="Member `ChipHighlight`"
                reason="ChipHighlight aliases HighlightChip: the soft-tinted pill pairing a bold value with a label, e.g. a module count in a course's meta row. Grouped here for the same reason as ChipEnum. Its full prop-by-prop coverage (tone/icon/isSkeleton) lives at its own story, Composites/Chips/HighlightChip, not here."
                states={[
                    {
                        name: "value = 24, label = \"Module\"",
                        why: "The alias renders the same figure pill HighlightChip itself would, value bolded ahead of its label on the default neutral tone. Reach for it once a screen already imports Chip.Enum or Chip.Removable and a highlight figure joins the same row.",
                        code: "<ChipHighlight value={24} label=\"Module\" />",
                        render: <ChipHighlight value={24} label="Module" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for member `ChipRemovable` — the alias for `RemovableToken` (Composites/Chips/RemovableToken), the bordered selected-item row. */
export const Removable: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Chip"
                tier="composite"
                leaf="Member `ChipRemovable`"
                reason="ChipRemovable aliases RemovableToken: a bordered selected-item row with an optional edit/remove affordance. The one member here NOT built on the Chip atom (it composes Typography + Button instead) — it still lives in this namespace because it is a composite-tier chip-shaped token, the same tier discipline that keeps DESIGN-tier chips out. Its full prop-by-prop coverage (icon/onEdit/onRemove/isDisabled/isSkeleton) lives at its own story, Composites/Chips/RemovableToken, not here."
                states={[
                    {
                        name: "label = \"Acme Corp\", no affordance",
                        why: "The alias renders the same bordered token row RemovableToken itself would, a plain read-only pick with neither edit nor remove wired up. Reach for it once a picked-item row joins the same screen as an enum or highlight chip, so all three read from one namespace.",
                        code: "<ChipRemovable label=\"Acme Corp\" />",
                        render: <ChipRemovable label="Acme Corp" />,
                    },
                ]}
            />
        </div>
    ),
}
