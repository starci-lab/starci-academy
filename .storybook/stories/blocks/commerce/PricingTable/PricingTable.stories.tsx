import type { Meta, StoryObj } from "@storybook/nextjs"
import { PricingTable, PricingTableTier } from "./PricingTable"
import { blockShell } from "../../../block-anatomy"

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

const ANATOMY = {
    primitives: [
        { name: "PricingCard", role: "mỗi cột một tier (khung + tên + giá + CTA)" },
        { name: "CrossListCard", role: "danh sách tính năng — 1 list trộn dòng có (✓ success) và không có (✗ muted)" },
    ],
    reason:
        "So sánh 2–3 gói cạnh nhau cần MỖI gói là một cột đồng nhất (PricingCard) và một danh sách tính năng dùng CHUNG một khung để các dòng thẳng hàng cột-với-cột: có → CrossListItem mark=\"check\" (✓), không có → mark=\"cross\" (✗) — cùng một CrossListCard. Gộp thành một block để trang giá chỉ truyền mảng tiers, không phải tự dựng lại layout so-sánh + logic ✓/✗ ở mỗi nơi.",
}

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

export const ThreeTiersHighlighted: Story = {
    render: () => blockShell(<PricingTable tiers={threeTiers} onSelectTier={() => {}} />, ANATOMY),
}

export const TwoTiersNoHighlight: Story = {
    render: () =>
        blockShell(
            <PricingTable
                tiers={threeTiers.slice(0, 2).map((tier) => ({ ...tier, isHighlighted: false }))}
                onSelectTier={() => {}}
            />,
            ANATOMY,
        ),
}
