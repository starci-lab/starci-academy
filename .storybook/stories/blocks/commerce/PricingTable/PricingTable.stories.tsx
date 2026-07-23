import type { Meta, StoryObj } from "@storybook/nextjs"
import { PricingTable, PricingTableTier } from "./PricingTable"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the pricing comparison REGION: 2–3 tier columns side by side (columns
 * on desktop, stacked on mobile). Each column is a PricingCard; a highlighted tier
 * carries a StatusChip ribbon.
 *
 * ANATOMY IS PER-LEAF: each scenario below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof PricingTable> = {
    title: "Block/Commerce/PricingTable",
    component: PricingTable,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PricingTable>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

/** Three plans sharing one feature set so the labels line up across columns. */
const threeTiers: PricingTableTier[] = [
    {
        id: "free",
        name: "Free",
        price: "0₫",
        description: "Dùng thử và làm quen với nền tảng.",
        ctaLabel: "Bắt đầu miễn phí",
        features: [
            { label: "Truy cập bài học nhập môn", included: true },
            { label: "Chấm bài với model nội bộ", included: true },
            { label: "Chấm bài với model premium", included: false },
            { label: "Phỏng vấn thử không giới hạn", included: false },
            { label: "Hỗ trợ email ưu tiên", included: false },
        ],
    },
    {
        id: "pro",
        name: "Professional",
        price: "299.000₫",
        period: "/tháng",
        description: "Cho người học nghiêm túc muốn lên trình nhanh.",
        ctaLabel: "Chọn Professional",
        isHighlighted: true,
        features: [
            { label: "Truy cập bài học nhập môn", included: true },
            { label: "Chấm bài với model nội bộ", included: true },
            { label: "Chấm bài với model premium", included: true },
            { label: "Phỏng vấn thử không giới hạn", included: true },
            { label: "Hỗ trợ email ưu tiên", included: false },
        ],
    },
    {
        id: "team",
        name: "Team",
        price: "899.000₫",
        period: "/tháng",
        description: "Cho nhóm học hoặc doanh nghiệp nhỏ.",
        ctaLabel: "Liên hệ sales",
        features: [
            { label: "Truy cập bài học nhập môn", included: true },
            { label: "Chấm bài với model nội bộ", included: true },
            { label: "Chấm bài với model premium", included: true },
            { label: "Phỏng vấn thử không giới hạn", included: true },
            { label: "Hỗ trợ email ưu tiên", included: true },
        ],
    },
]

// Highlighted leaf: at least one tier is nổi bật → its PricingCard carries the StatusChip ribbon.
const HIGHLIGHTED_PARTS: Array<AnatomyNode> = [
    {
        name: "PricingCard",
        tier: "design",
        role: "mỗi cột một tier (khung + tên + giá + CTA)",
        children: [
            { name: "StatusChip", tier: "primitive", role: 'nhãn "phổ biến" trên tier nổi bật', state: "accent" },
            { name: "CrossListCard", tier: "design", role: "danh sách tính năng — 1 list trộn dòng có (✓ success) và không có (✗ muted)" },
            { name: "Button", tier: "primitive", role: "CTA chọn gói — một hành động duy nhất mỗi cột" },
        ],
    },
]

// Plain leaf: no tier is highlighted → NO StatusChip; every PricingCard is đồng cấp.
const PLAIN_PARTS: Array<AnatomyNode> = [
    {
        name: "PricingCard",
        tier: "design",
        role: "mỗi cột một tier (khung + tên + giá + CTA)",
        children: [
            { name: "CrossListCard", tier: "design", role: "danh sách tính năng — 1 list trộn dòng có (✓ success) và không có (✗ muted)" },
            { name: "Button", tier: "primitive", role: "CTA chọn gói — một hành động duy nhất mỗi cột" },
        ],
    },
]

/** DATA (highlighted) — 3 gói cạnh nhau, gói Professional nổi bật với ribbon StatusChip. */
export const ThreeTiersHighlighted: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PricingTable"
                tier="block"
                leaf="Có gói nổi bật"
                parts={HIGHLIGHTED_PARTS}
                reason={
                    "So sánh 2–3 gói cạnh nhau cần MỖI gói là một cột đồng nhất (PricingCard) và một danh sách tính năng dùng CHUNG một khung để các dòng thẳng hàng cột-với-cột: có → CrossListItem mark=\"check\" (✓), không có → mark=\"cross\" (✗) — cùng một CrossListCard. Gộp thành một block để trang giá chỉ truyền mảng tiers, không phải tự dựng lại layout so-sánh + logic ✓/✗ ở mỗi nơi."
                }
            >
                <PricingTable tiers={threeTiers} onSelectTier={() => {}} />
            </BlockAnatomy>,
        ),
}

/** DATA (no highlight) — 2 gói đồng cấp, không tier nào nổi bật → KHÔNG có StatusChip. */
export const TwoTiersNoHighlight: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PricingTable"
                tier="block"
                leaf="Không gói nổi bật"
                parts={PLAIN_PARTS}
                note="Không tier nào isHighlighted → mọi PricingCard đồng cấp, bỏ ribbon StatusChip (khác leaf 'Có gói nổi bật')."
            >
                <PricingTable
                    tiers={threeTiers.slice(0, 2).map((tier) => ({ ...tier, isHighlighted: false }))}
                    onSelectTier={() => {}}
                />
            </BlockAnatomy>,
        ),
}
