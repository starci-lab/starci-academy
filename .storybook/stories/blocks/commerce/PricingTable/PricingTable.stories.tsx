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

// Feature list sub-tree — ONE CrossListCard (bordered) whose rows mix ✓ (check/success)
// and ✗ (cross/muted); shared by both leaves. CrossListItem takes `mark` + `children`
// (label) as props and renders its OWN internal Icon/Typography — those are CrossListItem
// presenting its own props, not sub-components PricingTable composes, so they are CUT here
// (no child nodes; drill into CrossListItem's own story for that anatomy).
const FEATURE_LIST: AnatomyNode = {
    name: "CrossListCard",
    tier: "design",
    role: "danh sách tính năng — 1 list trộn dòng có (✓) và không có (✗); khung bordered lồng trong thẻ",
    children: [
        {
            name: "CrossListItem",
            tier: "design",
            role: "mỗi tính năng một dòng (lặp theo features) — mark (✓/✗) + nhãn tự hiện nội bộ",
        },
    ],
}

// Content Typography that the inlined PricingCard DIRECTLY renders (its own `type`/
// `weight`/`color`, echoing tier data) — each is a badged node, same standard as the
// standalone `cards/PricingCard` block.
const NAME: AnatomyNode = { name: "Typography · tên", tier: "primitive", role: "tên gói — tiêu đề cột" }
// Price = ONE PricePoint primitive (số lớn + period). Its internal Typography are
// PricePoint's OWN anatomy (drill into PricePoint's story), NOT badged here.
const PRICE_POINT: AnatomyNode = { name: "PricePoint", tier: "primitive", role: "giá gói: số lớn + kỳ hạn (khi có) — 1 đơn vị" }
const DESC: AnatomyNode = { name: "Typography · mô tả", tier: "primitive", role: "mô tả gói — chìm (muted), chỉ tier có description" }

// Highlighted leaf: at least one tier is nổi bật → PricingCard's frame is accent and
// carries the StatusChip ribbon inline beside the tier name.
//
// NOTE (reconcile 2026-07-23): "SectionCard" is CUT from this tree — PricingCard has no
// wrapper of its own, its DOM root IS the SectionCard element (see PricingTable.tsx), so
// two tree nodes would collide on ONE emitter. Kept "PricingCard" (the composite's real
// name) as the single frame marker instead of the primitive it happens to be built on.
const HIGHLIGHTED_PARTS: Array<AnatomyNode> = [
    {
        name: "PricingCard",
        tier: "design",
        role: "mỗi cột một tier — khung (accent khi tier nổi bật)",
        children: [
            NAME,
            { name: "StatusChip", tier: "primitive", role: "ribbon \"phổ biến\" cạnh tên — chỉ tier nổi bật", state: "accent" },
            PRICE_POINT,
            DESC,
            FEATURE_LIST,
            { name: "Button", tier: "primitive", role: "CTA chọn gói — một hành động duy nhất mỗi cột" },
        ],
    },
]

// Plain leaf: no tier is highlighted → PricingCard's frame is not accent and there is NO
// StatusChip; every PricingCard is đồng cấp. Otherwise the same composition as the
// highlighted leaf. (Same "SectionCard cut" note as HIGHLIGHTED_PARTS above.)
const PLAIN_PARTS: Array<AnatomyNode> = [
    {
        name: "PricingCard",
        tier: "design",
        role: "mỗi cột một tier — khung (không accent — mọi cột đồng cấp)",
        children: [
            NAME,
            PRICE_POINT,
            DESC,
            FEATURE_LIST,
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
                <PricingTable tiers={threeTiers} onSelectTier={() => {}} showAnatomy />
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
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}
