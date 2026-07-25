import type { Meta, StoryObj } from "@storybook/nextjs"
import { List } from "@sb-components/blocks/lists/List/List"
import { StatusChip } from "@sb-components/blocks/chips/StatusChip/StatusChip"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `List.Meta` là khung MỘT DÒNG META inline.
 * Thứ nó đẻ ra: có/không chip tín hiệu dẫn đầu, nối các đoạn `items` bằng middot, và
 * truncate khi container hẹp. Hàng danh sách đầy đủ (leading/title/trailing) là tài sản
 * của `List.Row` — KHÔNG lặp ở đây.
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
    { name: "Chip", tier: "design", role: "chip tín hiệu dẫn đầu (ví dụ StatusChip cảnh báo)" },
    { name: "Meta", tier: "primitive", role: "đoạn text mờ nối bằng middot ·" },
]

// No chip — only the muted meta line.
const META_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Meta", tier: "primitive", role: "đoạn text mờ nối bằng middot ·" },
]

/** Leading warning `StatusChip` (the one signal) + dot-joined muted meta segments. */
export const WithChip: Story = {
    render: () => (
        <div className="w-96 p-8">
            <BlockAnatomy
                name="List.Meta"
                tier="primitive"
                leaf="WithChip"
                parts={WITH_CHIP_PARTS}
                reason="Consolidate dòng meta chấm-ngăn hand-roll khắp nơi: MỘT chip tín hiệu dẫn đầu (nếu có) rồi các đoạn meta trung tính nối middot, tất cả mờ trừ chip (principles §2 color-prominence). `items` là dữ liệu vì các đoạn meta LẶP (§13b)."
                code={`<List.Meta
  chip={<StatusChip tone="warning">2 phút còn lại</StatusChip>}
  items={["Question 7 / 8", "Middle"]}
/>`}
            >
                <List.Meta
                    chip={
                        <StatusChip tone="warning">
                            2 phút còn lại
                        </StatusChip>
                    }
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
                note="Bỏ `chip` → chỉ còn part Meta, dòng text mờ đơn thuần."
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
                note="Cùng composition với leaf MetaOnly — container hẹp khiến Meta truncate thay vì wrap/overflow."
            >
                <List.Meta items={["Building a scalable distributed rate limiter", "Middle", "40 minutes left"]} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
