import type { Meta, StoryObj } from "@storybook/nextjs"
import { TrialConversionStrip, type TrialConversionStripPrice } from "./TrialConversionStrip"
import { PricingPhase } from "../PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the trial → enroll conversion strip on the content-home. Bundles a
 * loss-aversion line (free lessons remaining), the real price (+ phase-scarcity
 * note), and an enroll CTA. `src` is STORE-COUPLED (SWR price fetch + zustand
 * payment overlay) — this port takes the SAME data as PLAIN PROPS (`price`,
 * `isPriceLoading`, `onEnroll`) so it renders standalone. Leaves differ by
 * SHAPE: price loading (skeleton mirror) vs price landed (PriceTag +
 * PhaseScarcityNote), and by content (free lessons remaining vs none left).
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof TrialConversionStrip> = {
    title: "Block/Commerce/TrialConversionStrip",
    component: TrialConversionStrip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TrialConversionStrip>

/** Frame each leaf's anatomy panel with breathing room, capped to the strip's real width. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-xl p-8">{node}</div>

/** Sample landed price preview — early-bird phase, 22% off, 12 seats left before it rises. */
const SAMPLE_PRICE: TrialConversionStripPrice = {
    discountedPriceVnd: 1_990_000,
    originalPriceVnd: 2_990_000,
    phasePriceVnd: 2_490_000,
    discountPercent: 20,
    currentPhase: PricingPhase.EarlyBird,
    seatsRemainingInCurrentPhase: 12,
    nextPhasePriceVnd: 2_490_000,
}

// Header cluster — IconTile + a two-line Typography pair — is SHARED by every leaf below
// (only the price section + CTA differ), so it is one constant reused across the parts trees.
const HEADER_PARTS: Array<AnatomyNode> = [
    { name: "IconTile", tier: "design", role: "khoá — icon khoá, tone accent, size sm", state: "accent" },
    { name: "Typography.Title", tier: "primitive", role: "tiêu đề dòng chuyển đổi" },
    { name: "Typography.Description", tier: "primitive", role: "mô tả — đổi câu theo còn/hết bài miễn phí" },
]

// LOADING shape — price section mirrors the eventual PriceTag + PhaseScarcityNote box with
// two Skeleton.Typography bars (h4 + body-xs) so layout never shifts once the price lands.
const LOADING_PARTS: Array<AnatomyNode> = [
    ...HEADER_PARTS,
    { name: "Skeleton.Typography.Price", tier: "design", role: "mirror dòng giá (h4, 1/3 width)" },
    { name: "Skeleton.Typography.Seats", tier: "design", role: "mirror dòng suất (body-xs, 1/2 width)" },
    { name: "Button", tier: "primitive", role: "CTA mở khoá — luôn render, không chờ giá" },
]

// LOADED shape — price landed: PriceTag owns the discount, PhaseScarcityNote sits as a
// sibling below owning scarcity (orthogonal urgency, per PhaseScarcityNote's own doc).
const LOADED_PARTS: Array<AnatomyNode> = [
    ...HEADER_PARTS,
    { name: "PriceTag", tier: "design", role: "giá phải trả + giá gốc gạch + chip tiết kiệm" },
    { name: "PhaseScarcityNote", tier: "design", role: "còn N suất giai đoạn hiện tại + giá tăng sau đó" },
    { name: "Button", tier: "primitive", role: "CTA mở khoá toàn bộ khoá học" },
]

/** Price fetch in flight, no price landed yet — the price section mirrors via Skeleton.Typography. */
export const PriceLoading: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrialConversionStrip"
                tier="block"
                leaf="Loading"
                parts={LOADING_PARTS}
                reason="Dòng chuyển đổi gộp 3 đòn bẩy trung thực trên đúng mặt học viên đang đứng: mất-mát (còn N bài miễn phí), khan hiếm (PhaseScarcityNote — suất + giá tăng thật), và CTA mở khoá. Header (IconTile + tiêu đề/mô tả) render NGAY vì không phụ thuộc giá; chỉ khối giá mirror bằng Skeleton.Typography (h4 + body-xs, đúng box PriceTag/PhaseScarcityNote sẽ chiếm) để layout không nhảy khi giá về. Button luôn render — CTA không chờ giá."
            >
                <TrialConversionStrip
                    freeLessonsRemaining={3}
                    isPriceLoading
                    onEnroll={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Price landed, free lessons still remaining — the main "keep going" leaf. */
export const PriceLoadedWithFreeLeft: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrialConversionStrip"
                tier="block"
                leaf="PriceLoadedWithFreeLeft"
                parts={LOADED_PARTS}
                note="Giá đã về (PriceTag + PhaseScarcityNote thay chỗ 2 Skeleton.Typography) — mô tả dùng câu 'Còn N bài miễn phí chưa đọc' (loss-aversion)."
            >
                <TrialConversionStrip
                    freeLessonsRemaining={3}
                    price={SAMPLE_PRICE}
                    onEnroll={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Price landed, no free lessons left — description switches to the generic pitch. */
export const PriceLoadedNoFreeLeft: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrialConversionStrip"
                tier="block"
                leaf="PriceLoadedNoFreeLeft"
                parts={LOADED_PARTS}
                note="freeLessonsRemaining = 0 → Typography · mô tả đổi sang câu chốt chung (đã đọc hết miễn phí), CÙNG composition với leaf trên."
            >
                <TrialConversionStrip
                    freeLessonsRemaining={0}
                    price={SAMPLE_PRICE}
                    onEnroll={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}
