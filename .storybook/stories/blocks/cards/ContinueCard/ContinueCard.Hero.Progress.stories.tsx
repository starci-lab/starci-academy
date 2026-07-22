import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueCard } from "./ContinueCard"
import { SectionCard } from "../SectionCard/SectionCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { ErrorState } from "../../feedback/ErrorState/ErrorState"
import type { BlockAnatomyProps } from "../../../block-anatomy"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof ContinueCard> = {
    title: "Block/Cards/ContinueCard/Hero/Progress",
    component: ContinueCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContinueCard>

const PROGRESS_ANATOMY: BlockAnatomyProps = {
    primitives: [
        { name: "SectionCard", role: "khung surface (frame chung mọi state)", tier: "primitive" },
        { name: "HighlightCard", role: "vành arc accent quét quanh hero", tier: "primitive" },
        { name: "MetaRow", role: "hàng meta: chip time + segment muted nối ·", tier: "primitive" },
        { name: "StatusChip", role: "chip time-remaining, tông neutral↔warning theo urgency", tier: "primitive" },
        { name: "ProgressMeter", role: "thanh tiến độ — ĐẶC TRƯNG của shape 'có tiến độ'", tier: "primitive" },
    ],
    reason:
        "Anatomy của LEAF loaded (Không gấp/Gấp) — CHỈ liệt kê part mà LEAF NÀY dựng nên. urgent/không-gấp cùng bộ part, chỉ khác TONE chip time (neutral ↔ warning). State loading/error là leaf RIÊNG, composition riêng (Skeleton / ErrorState) — KHÔNG kể ở đây.",
}

// scenario base = shape có-tiến-độ, không gấp. Các state nội suy bằng delta.
const progressBase = {
    variant: "hero" as const,
    title: "Mock interview: Design a rate limiter",
    meta: ["Question 2 / 8", "Middle"],
    timeLeft: "40 minutes left",
    ctaLabel: "Continue",
    onPress: () => {},
}

/** STATE không gấp — còn nhiều giờ: chip time NEUTRAL + thanh tiến độ. */
export const NotUrgent: Story = {
    name: "Không gấp",
    render: () =>
        blockShell(
            <div className="w-96">
                <ContinueCard {...progressBase} value={2} max={8} />
            </div>,
            PROGRESS_ANATOMY,
        ),
}

/** STATE gấp — sắp hết giờ: CÙNG chip time nhưng leo tông WARNING + thanh gần đầy. */
export const Urgent: Story = {
    name: "Gấp",
    render: () =>
        blockShell(
            <div className="w-96">
                <ContinueCard {...progressBase} meta={["Question 7 / 8", "Middle"]} timeLeft="2 minutes left" urgent value={7} max={8} />
            </div>,
            PROGRESS_ANATOMY,
        ),
}

/** STATE loading — skeleton mirror shape CÓ thanh (title · meta · CTA · bar). */
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
                <Skeleton.ProgressBar />
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
                <ErrorState
                    title="Mất kết nối"
                    description="Mạng có vẻ bị rớt. Kiểm tra kết nối rồi thử lại."
                    retryLabel="Thử lại"
                    onRetry={() => {}}
                />
            </SectionCard>
        </div>
    ),
}
