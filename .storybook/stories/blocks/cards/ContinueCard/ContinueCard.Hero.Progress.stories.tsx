import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCard } from "./ContinueCard"
import { SectionCard } from "../SectionCard/SectionCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { WarningIcon } from "@phosphor-icons/react"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Button } from "../../buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — the "tiếp tục phiên đang dở" hero card with progress. Each state below
 * is its OWN leaf and carries its OWN BlockAnatomy axis (Sơ đồ + Cây) reflecting
 * the parts THAT leaf composes — there is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ContinueCard> = {
    title: "Design/Cards/ContinueCard/Hero/Progress",
    component: ContinueCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContinueCard>

/** Plain canvas — every leaf wraps its render in its own BlockAnatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// scenario base = shape có-tiến-độ, không gấp. Các state nội suy bằng delta.
// NOTE: the title Typography IS a composed node in the trees below — ContinueCard
// writes `<Typography>{title}</Typography>` itself (not a value folded into another
// primitive's slot), so it badges like any other directly-composed part.
const progressBase = {
    variant: "hero" as const,
    title: "Mock interview: Design a rate limiter",
    meta: ["Question 2 / 8", "Middle"],
    timeLeft: "40 minutes left",
    ctaLabel: "Continue",
    onPress: () => {},
    showAnatomy: true,
}

// Loaded shape "có tiến độ" — urgent/không-gấp SHARE this composition (chỉ khác TONE chip).
// DOM thật: HighlightCard (wrapper hero) ⊃ SectionCard (frame) ⊃ title · MetaRow(chip) · CTA · bar.
const CONTENT_PARTS: Array<AnatomyNode> = [
    {
        name: "HighlightCard",
        tier: "primitive",
        role: "wrapper hero — vành arc accent quét quanh thẻ (chỉ hero, bọc NGOÀI SectionCard)",
        children: [
            {
                name: "SectionCard",
                tier: "primitive",
                role: "khung surface (frame chung mọi state)",
                children: [
                    { name: "Typography · tiêu đề", tier: "primitive", role: "tên phiên đang tiếp tục (title, weight medium, truncate)" },
                    {
                        name: "MetaRow",
                        tier: "primitive",
                        role: "hàng meta: segment muted nối · + chip time",
                        children: [
                            { name: "StatusChip", tier: "primitive", role: "chip time-remaining, tông neutral↔warning theo urgency", state: "neutral↔warning" },
                        ],
                    },
                    { name: "Button", tier: "primitive", role: "CTA chip (hero, onPress + icon ArrowRight)" },
                    { name: "ProgressMeter", tier: "primitive", role: "thanh tiến độ — ĐẶC TRƯNG của shape 'có tiến độ'" },
                ],
            },
        ],
    },
]

// loading leaf: Skeleton mirror shape CÓ thanh (title · meta · CTA · bar), tất cả TRONG SectionCard.
// KHÔNG HighlightCard: render loading là SectionCard trần (đúng footprint, không quầng accent).
const LOADING_PARTS: Array<AnatomyNode> = [
    {
        name: "SectionCard",
        tier: "primitive",
        role: "khung surface (giữ đúng footprint)",
        children: [
            { name: "Skeleton.Typography", tier: "primitive", role: "mirror tiêu đề + meta (×2)", state: "skeleton" },
            { name: "Skeleton.Button", tier: "primitive", role: "mirror CTA", state: "skeleton" },
            { name: "Skeleton.ProgressBar", tier: "primitive", role: "mirror thanh tiến độ", state: "skeleton" },
        ],
    },
]

// error leaf: network drop → EmptyState trong khung, nút Thử lại nằm TRONG EmptyState (prop action).
const ERROR_PARTS: Array<AnatomyNode> = [
    {
        name: "SectionCard",
        tier: "primitive",
        role: "khung surface",
        children: [
            {
                name: "EmptyState",
                tier: "design",
                role: "tone danger + icon + mô tả + nút Thử lại",
                state: "danger",
                children: [
                    { name: "Button", tier: "primitive", role: "nút thử lại (secondary, trong prop action)" },
                ],
            },
        ],
    },
]

/** STATE không gấp — còn nhiều giờ: chip time NEUTRAL + thanh tiến độ. */
export const NotUrgent: Story = {
    name: "Không gấp",
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Không gấp"
                parts={CONTENT_PARTS}
                reason="Thẻ tiếp tục phiên đang dở. Mỗi LEAF composition khác nhau: leaf loaded gom hero chrome + ProgressMeter; loading swap sang Skeleton mirror đúng footprint; error rơi về EmptyState trong khung. Nhờ SectionCard làm frame chung, khung không nhảy khi đổi state."
            >
                <div className="w-96">
                    <ContinueCard {...progressBase} value={2} max={8} />
                </div>
            </BlockAnatomy>,
        ),
}

/** STATE gấp — sắp hết giờ: CÙNG chip time nhưng leo tông WARNING + thanh gần đầy. */
export const Urgent: Story = {
    name: "Gấp",
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Gấp"
                parts={CONTENT_PARTS}
                note="urgent/không-gấp CÙNG bộ part — chỉ khác TONE chip time (neutral → warning) + thanh gần đầy."
            >
                <div className="w-96">
                    <ContinueCard {...progressBase} meta={["Question 7 / 8", "Middle"]} timeLeft="2 minutes left" urgent value={7} max={8} />
                </div>
            </BlockAnatomy>,
        ),
}

/** STATE loading — skeleton mirror shape CÓ thanh (title · meta · CTA · bar). */
export const Loading: Story = {
    name: "Đang tải",
    render: () =>
        shell(
            <BlockAnatomy
                name="ContinueCard"
                tier="design"
                leaf="Đang tải"
                parts={LOADING_PARTS}
                note="Skeleton mirror shape CÓ thanh — composition khác hẳn leaf loaded (không part thật)."
            >
                <div className="w-96">
                    <SectionCard anatPart="SectionCard" contentClassName="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Skeleton.Typography type="body" width="2/3" anatPart="Skeleton.Typography" />
                            <Skeleton.Typography type="body-xs" width="1/2" anatPart="Skeleton.Typography" />
                        </div>
                        <Skeleton.Button width="w-28" anatPart="Skeleton.Button" />
                        <Skeleton.ProgressBar anatPart="Skeleton.ProgressBar" />
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
                leaf="Lỗi"
                parts={ERROR_PARTS}
                note="Mạng rớt → chỉ EmptyState trong khung; KHÔNG phải part của leaf loaded."
            >
                <div className="w-96">
                    <SectionCard anatPart="SectionCard">
                        <EmptyState
                            anatPart="EmptyState"
                            tone="danger"
                            icon={<WarningIcon weight="duotone" />}
                            title="Mất kết nối"
                            description="Mạng có vẻ bị rớt. Kiểm tra kết nối rồi thử lại."
                            action={
                                <Button variant="secondary" size="sm" onPress={() => {}} anatPart="Button">
                                    Thử lại
                                </Button>
                            }
                        />
                    </SectionCard>
                </div>
            </BlockAnatomy>,
        ),
}
