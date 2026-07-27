import type { Meta, StoryObj } from "@storybook/nextjs"
import { List } from "@sb-components/composites/lists/List/List"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher's call, 2026-07-25): `List.Meta` is a ONE-LINE inline META
 * frame. What it produces: with/without a leading signal chip, joining `items` segments
 * with a middot, and truncating when the container is narrow. The full list row
 * (leading/title/trailing) belongs to `List.Row` — NOT repeated here.
 */
const meta: Meta<typeof List.Meta> = {
    title: "Composites/Lists/List/List.Meta",
    component: List.Meta,
    tags: ["autodocs", "news"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof List.Meta>

// With the leading signal chip — Chip + Meta side by side.
const WITH_CHIP_PARTS: Array<AnatomyNode> = [
    { name: "Chip", tier: "atom", role: "the one leading signal, here a warning Chip.Base" },
    { name: "Meta", tier: "composite", role: "muted text segments joined by a middot" },
]

// No chip — only the muted meta line.
const META_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Meta", tier: "composite", role: "muted text segments joined by a middot" },
]

/** Leading warning `Chip.Base` (the one signal) + dot-joined muted meta segments. */
export const WithChip: Story = {
    render: () => (
        <div className="w-96 p-8">
            <BlockAnatomy
                name="List.Meta"
                tier="composite"
                leaf="WithChip"
                parts={WITH_CHIP_PARTS}
                reason="Consolidates the middot-separated meta line that used to be hand-rolled everywhere: ONE leading signal chip (if any), then neutral meta segments joined by a middot, all muted except the chip (principles §2 color-prominence). `items` is data because the meta segments REPEAT (§13b)."
                states={[
                    {
                        name: "chip set, items = 2 segments",
                        why: "The leading warning chip sits ahead of the dot-joined text segments, giving the row one prominent signal plus quiet context after it. A deadline warning needs to stand out from the rest of the meta line, not blend into it.",
                        code: `<List.Meta
  chip={<Chip.Base tone="warning" text="2 phút còn lại" />}
  items={["Question 7 / 8", "Middle"]}
/>`,
                        render: (
                            <List.Meta
                                chip={<Chip.Base tone="warning" text="2 phút còn lại" />}
                                items={["Question 7 / 8", "Middle"]}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** No chip — a plain muted dot-joined meta line. */
export const MetaOnly: Story = {
    render: () => (
        <div className="w-96 p-8">
            <BlockAnatomy
                name="List.Meta"
                tier="composite"
                leaf="MetaOnly"
                parts={META_ONLY_PARTS}
                states={[
                    {
                        name: "chip not passed, items = 3 segments",
                        why: "The `Chip` node disappears entirely and only the muted, dot-joined text line remains. Most rows carry no urgent signal, so the leading chip is an addition the caller opts into, not a default the row always draws.",
                        code: `<List.Meta
  items={["Question 2 / 8", "Middle", "40 minutes left"]}
/>`,
                        render: <List.Meta items={["Question 2 / 8", "Middle", "40 minutes left"]} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Narrow container — the muted meta line truncates instead of wrapping/overflowing. */
export const Overflow: Story = {
    render: () => (
        <div className="w-64 p-8">
            <BlockAnatomy
                name="List.Meta"
                tier="composite"
                leaf="Overflow"
                parts={META_ONLY_PARTS}
                states={[
                    {
                        name: "same composition as MetaOnly, container width = 16rem",
                        why: "The text truncates with an ellipsis instead of wrapping onto a second line or overflowing the container. The tree is identical to `MetaOnly`; only the available width changed, so this is a state of the same leaf rather than a leaf of its own.",
                        code: `<List.Meta
  items={["Building a scalable distributed rate limiter", "Middle", "40 minutes left"]}
/>`,
                        render: <List.Meta items={["Building a scalable distributed rate limiter", "Middle", "40 minutes left"]} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
