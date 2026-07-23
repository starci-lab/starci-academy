import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCard } from "./ContinueCard"
import { SectionCard } from "../SectionCard/SectionCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { FireIcon, WarningIcon } from "@phosphor-icons/react"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Button } from "../../buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — the `hero` ContinueCard in its NO-PROGRESS shape (no `value` → no
 * ProgressMeter). Each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ContinueCard> = {
    title: "Design/Cards/ContinueCard/Hero/No progress",
    component: ContinueCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContinueCard>

/** Plain canvas — each story wraps its render in its own per-leaf BlockAnatomy. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// scenario base = shape chưa-có-tiến-độ (không truyền value → ProgressMeter không render).
const noProgressBase = {
    variant: "hero" as const,
    title: "Mock interview: Design a rate limiter",
    meta: ["Question 2 / 8", "Middle"],
    timeLeft: "40 minutes left",
    ctaLabel: "Continue",
    onPress: () => {},
}

// Base hero no-progress composition: frame + accent ring + title + meta(chip) + CTA button, NO bar.
const NO_PROGRESS_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "primitive", role: "khung surface (frame chung mọi state)" },
    { name: "HighlightCard", tier: "primitive", role: "vành arc accent quét quanh hero" },
    { name: "Typography", tier: "primitive", role: "tiêu đề phiên (weight medium, truncate)" },
    {
        name: "MetaRow",
        tier: "primitive",
        role: "hàng meta: segment muted nối · + chip time",
        children: [
            { name: "StatusChip", tier: "primitive", role: "chip time-remaining", state: "neutral" },
        ],
    },
    { name: "Button", tier: "primitive", role: "CTA chip (hero, onPress)" },
]

// With-icon leaf: same base + a decorative icon sunk behind the content as a watermark.
const WITH_ICON_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "primitive", role: "khung surface (frame chung mọi state)" },
    { name: "HighlightCard", tier: "primitive", role: "vành arc accent quét quanh hero" },
    { name: "Icon (watermark)", tier: "primitive", role: "cue momentum (streak) chìm sau nội dung, chỉ hero" },
    { name: "Typography", tier: "primitive", role: "tiêu đề phiên (weight medium, truncate)" },
    {
        name: "MetaRow",
        tier: "primitive",
        role: "hàng meta: segment muted nối · + chip time",
        children: [
            { name: "StatusChip", tier: "primitive", role: "chip time-remaining", state: "neutral" },
        ],
    },
    { name: "Button", tier: "primitive", role: "CTA chip (hero, onPress)" },
]

// Link-CTA leaf: same base but the CTA is a hand-rolled Link-as-pill (href) instead of a Button.
const LINK_CTA_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "primitive", role: "khung surface (frame chung mọi state)" },
    { name: "HighlightCard", tier: "primitive", role: "vành arc accent quét quanh hero" },
    { name: "Typography", tier: "primitive", role: "tiêu đề phiên (weight medium, truncate)" },
    {
        name: "MetaRow",
        tier: "primitive",
        role: "hàng meta: segment muted nối · + chip time",
        children: [
            { name: "StatusChip", tier: "primitive", role: "chip time-remaining", state: "neutral" },
        ],
    },
    { name: "Link", tier: "primitive", role: "CTA pill dùng href (hand-rolled Link-as-pill)" },
]

// Loading leaf: skeleton mirror of the no-progress shape (title · meta · CTA, no bar).
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "primitive", role: "khung surface (giữ đúng footprint)" },
    { name: "Skeleton.Typography", tier: "primitive", role: "mirror title + meta (2 dòng)", state: "skeleton" },
    { name: "Skeleton.Button", tier: "primitive", role: "mirror CTA chip", state: "skeleton" },
]

// Error leaf: frame stays, body swaps to a danger EmptyState + retry (no card content).
const ERROR_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "primitive", role: "khung surface" },
    {
        name: "EmptyState",
        tier: "design",
        role: "trạng thái mất kết nối (tone danger)",
        state: "danger",
        children: [
            { name: "Button", tier: "primitive", role: "nút thử lại (secondary)" },
        ],
    },
]

/** STATE loaded — chưa có tiến độ: chip time neutral, KHÔNG thanh (bỏ value). */
export const NotStarted: Story = {
    name: "Chưa có tiến độ",
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Chưa có tiến độ"
                parts={NO_PROGRESS_PARTS}
                reason="Anatomy của LEAF loaded 'Chưa có tiến độ' — CHỈ part mà leaf này dựng (KHÔNG ProgressMeter: đó là điểm SHAPE khác 'Progress'). Loading/error là leaf RIÊNG, composition riêng — KHÔNG kể ở đây."
            >
                <div className="w-96">
                    <ContinueCard {...noProgressBase} />
                </div>
            </BlockAnatomy>,
        ),
}

/**
 * STATE loaded — `icon` (momentum cue, vd streak) sunk behind nội dung như
 * watermark. Chỉ hero mới nhận icon — `item` bỏ qua prop này (no-op).
 */
export const WithIcon: Story = {
    name: "Có icon nền (streak)",
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Có icon nền (streak)"
                parts={WITH_ICON_PARTS}
                note="Thêm icon watermark chìm sau nội dung — composition khác leaf base ở đúng part icon này (chỉ hero)."
            >
                <div className="w-96">
                    <ContinueCard {...noProgressBase} icon={<FireIcon weight="duotone" />} />
                </div>
            </BlockAnatomy>,
        ),
}

/**
 * STATE loaded — CTA dạng `Link` (pill) khi có `href`, thay vì `Button
 * onPress`. Hero điều hướng thẳng bằng URL (vd trang tổng hợp session dùng
 * SSR link) thay vì tay bắt sự kiện.
 */
export const LinkCta: Story = {
    name: "CTA dạng link (href)",
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="CTA dạng link (href)"
                parts={LINK_CTA_PARTS}
                note="Có href → CTA đổi từ Button sang Link-as-pill; phần còn lại giữ nguyên composition base."
            >
                <div className="w-96">
                    <ContinueCard {...noProgressBase} href="/mock-interview/sessions/abc123" />
                </div>
            </BlockAnatomy>,
        ),
}

/** STATE loading — skeleton mirror shape KHÔNG thanh (title · meta · CTA, no bar). */
export const Loading: Story = {
    name: "Đang tải",
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Đang tải"
                parts={LOADING_PARTS}
                note="Skeleton mirror đúng footprint no-progress (title · meta · CTA), KHÔNG thanh — composition khác leaf data."
            >
                <div className="w-96 p-8">
                    <SectionCard contentClassName="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Skeleton.Typography type="body" width="2/3" />
                            <Skeleton.Typography type="body-xs" width="1/2" />
                        </div>
                        <Skeleton.Button width="w-28" />
                    </SectionCard>
                </div>
            </BlockAnatomy>,
        ),
}

/** STATE error — network drop rendered INSIDE the card frame. */
export const LoadError: Story = {
    name: "Lỗi tải (mạng rớt)",
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Lỗi tải (mạng rớt)"
                parts={ERROR_PARTS}
                note="Mạng rớt → khung SectionCard giữ nguyên, thân đổi sang EmptyState tone danger + nút thử lại (không nội dung thẻ)."
            >
                <div className="w-96 p-8">
                    <SectionCard>
                        <EmptyState
                            tone="danger"
                            icon={<WarningIcon weight="duotone" />}
                            title="Mất kết nối"
                            description="Mạng có vẻ bị rớt. Kiểm tra kết nối rồi thử lại."
                            action={
                                <Button variant="secondary" size="sm" onPress={() => {}}>
                                    Thử lại
                                </Button>
                            }
                        />
                    </SectionCard>
                </div>
            </BlockAnatomy>,
        ),
}
