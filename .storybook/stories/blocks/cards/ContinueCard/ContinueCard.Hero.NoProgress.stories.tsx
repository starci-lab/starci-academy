import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCard } from "./ContinueCard"
import { SectionCard } from "../SectionCard/SectionCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { FireIcon, WarningIcon } from "@phosphor-icons/react"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Button } from "../../buttons/Button/Button"
import type { BlockAnatomyProps } from "../../../block-anatomy"
import { blockShell } from "../../../block-anatomy"

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

const NO_PROGRESS_ANATOMY: BlockAnatomyProps = {
    primitives: [
        { name: "SectionCard", role: "khung surface (frame chung mọi state)", tier: "primitive" },
        { name: "HighlightCard", role: "vành arc accent quét quanh hero", tier: "primitive" },
        { name: "MetaRow", role: "hàng meta: chip time (neutral) + segment muted nối ·", tier: "primitive" },
        { name: "StatusChip", role: "chip time-remaining tông NEUTRAL", tier: "primitive" },
        // KHÔNG có ProgressMeter — chính là điểm SHAPE khác với scenario 'Progress'.
    ],
    reason:
        "Anatomy của LEAF loaded 'Chưa có tiến độ' — CHỈ part mà leaf này dựng (KHÔNG ProgressMeter: đó là điểm SHAPE khác 'Progress'). Loading/error là leaf RIÊNG, composition riêng — KHÔNG kể ở đây.",
}

// scenario base = shape chưa-có-tiến-độ (không truyền value → ProgressMeter không render).
const noProgressBase = {
    variant: "hero" as const,
    title: "Mock interview: Design a rate limiter",
    meta: ["Question 2 / 8", "Middle"],
    timeLeft: "40 minutes left",
    ctaLabel: "Continue",
    onPress: () => {},
}

/** STATE loaded — chưa có tiến độ: chip time neutral, KHÔNG thanh (bỏ value). */
export const NotStarted: Story = {
    name: "Chưa có tiến độ",
    render: () =>
        blockShell(
            <div className="w-96">
                <ContinueCard {...noProgressBase} />
            </div>,
            NO_PROGRESS_ANATOMY,
        ),
}

/**
 * STATE loaded — `icon` (momentum cue, vd streak) sunk behind nội dung như
 * watermark. Chỉ hero mới nhận icon — `item` bỏ qua prop này (no-op).
 */
export const WithIcon: Story = {
    name: "Có icon nền (streak)",
    render: () =>
        blockShell(
            <div className="w-96">
                <ContinueCard {...noProgressBase} icon={<FireIcon weight="duotone" />} />
            </div>,
            NO_PROGRESS_ANATOMY,
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
        blockShell(
            <div className="w-96">
                <ContinueCard {...noProgressBase} href="/mock-interview/sessions/abc123" />
            </div>,
            NO_PROGRESS_ANATOMY,
        ),
}

/** STATE loading — skeleton mirror shape KHÔNG thanh (title · meta · CTA, no bar). */
export const Loading: Story = {
    name: "Đang tải",
    render: () => (
        <div className="w-96 p-8">
            <SectionCard contentClassName="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Skeleton.Typography type="body" width="2/3" />
                    <Skeleton.Typography type="body-xs" width="1/2" />
                </div>
                <Skeleton.Button width="w-28" />
            </SectionCard>
        </div>
    ),
}

/** STATE error — network drop rendered INSIDE the card frame. */
export const LoadError: Story = {
    name: "Lỗi tải (mạng rớt)",
    render: () => (
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
    ),
}
