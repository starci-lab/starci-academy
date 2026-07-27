import type { Meta, StoryObj } from "@storybook/nextjs"
import { List } from "@sb-components/layouts/lists/List/List"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher's call, 2026-07-25): `List.Meta` is a ONE-LINE inline META
 * frame. What it produces: with/without a leading signal chip, joining `items` segments
 * with a middot, and truncating when the container is narrow. The full list row
 * (leading/title/trailing) belongs to `List.Row` — NOT repeated here.
 */
const meta: Meta<typeof List.Meta> = {
    title: "Layouts/Lists/List/List.Meta",
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
    { name: "Chip", tier: "atom", role: "The one leading signal — here a warning Chip.Base." },
    { name: "Meta", tier: "primitive", role: "muted text segments joined by a middot ·" },
]

// No chip — only the muted meta line.
const META_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Meta", tier: "primitive", role: "muted text segments joined by a middot ·" },
]

/** Leading warning `Chip.Base` (the one signal) + dot-joined muted meta segments. */
export const WithChip: Story = {
    render: () => (
        <div className="w-96 p-8">
            <BlockAnatomy
                name="List.Meta"
                tier="primitive"
                leaf="WithChip"
                parts={WITH_CHIP_PARTS}
                reason="Consolidates the middot-separated meta line that used to be hand-rolled everywhere: ONE leading signal chip (if any), then neutral meta segments joined by a middot, all muted except the chip (principles §2 color-prominence). `items` is data because the meta segments REPEAT (§13b)."
                code={`<List.Meta
  chip={<Chip.Base tone="warning" text="2 phút còn lại" />}
  items={["Question 7 / 8", "Middle"]}
/>`}
            >
                <List.Meta
                    chip={<Chip.Base tone="warning" text="2 phút còn lại" />}
                    items={["Question 7 / 8", "Middle"]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** No chip — a plain muted dot-joined meta line. */
export const MetaOnly: Story = {
    render: () => (
        <div className="w-96 p-8">
            <BlockAnatomy
                name="List.Meta"
                tier="primitive"
                leaf="MetaOnly"
                parts={META_ONLY_PARTS}
                note="Drop `chip` → only the Meta part remains, a plain muted text line."
                code={`<List.Meta
  items={["Question 2 / 8", "Middle", "40 minutes left"]}
/>`}
            >
                <List.Meta items={["Question 2 / 8", "Middle", "40 minutes left"]} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** Narrow container — the muted meta line truncates instead of wrapping/overflowing. */
export const Overflow: Story = {
    render: () => (
        <div className="w-64 p-8">
            <BlockAnatomy
                name="List.Meta"
                tier="primitive"
                leaf="Overflow"
                parts={META_ONLY_PARTS}
                note="Same composition as leaf MetaOnly — a narrow container makes Meta truncate instead of wrap/overflow."
                code={`<List.Meta
  items={["Building a scalable distributed rate limiter", "Middle", "40 minutes left"]}
/>`}
            >
                <List.Meta items={["Building a scalable distributed rate limiter", "Middle", "40 minutes left"]} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
