import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { SurfaceCard } from "./SurfaceCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

const meta: Meta<typeof SurfaceCard> = {
    title: "Primitives/Card/SurfaceCard",
    component: SurfaceCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard>

const body = (
    <Typography type="body-sm" color="muted">
        Nội dung của section nằm trong khung card, dưới nhãn.
    </Typography>
)

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard>{body}</SurfaceCard>
        </div>
    ),
}

export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard label="Khoá của tôi">{body}</SurfaceCard>
        </div>
    ),
}

export const SeeMore: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard label="Khoá nổi bật" onSeeMore={() => {}}>{body}</SurfaceCard>
        </div>
    ),
}

export const LabelEnd: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard label="Học phí còn lại" labelEnd="VND">{body}</SurfaceCard>
        </div>
    ),
}

export const WithAction: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard label="Phương thức thanh toán" action={<Button variant="secondary" size="sm">Quản lý</Button>}>
                {body}
            </SurfaceCard>
        </div>
    ),
}

export const SubtleLabel: Story = {
    render: () => (
        <div className="p-8">
            {/* subtleLabel = a MINOR header (eyebrow) over a block, sitting UNDER a
                primary section Label — e.g. time-buckets under "Nhật ký luyện tập". */}
            <div className="flex flex-col gap-3">
                <Label>Nhật ký luyện tập</Label>
                <SurfaceCard label="Hôm nay" subtleLabel>
                    <Typography type="body-sm" color="muted">3 phiên · 45 phút</Typography>
                </SurfaceCard>
                <SurfaceCard label="Hôm qua" subtleLabel>
                    <Typography type="body-sm" color="muted">2 phiên · 30 phút</Typography>
                </SurfaceCard>
                <SurfaceCard label="Tuần trước" subtleLabel>
                    <Typography type="body-sm" color="muted">8 phiên · 2 giờ</Typography>
                </SurfaceCard>
            </div>
        </div>
    ),
}

export const Description: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard
                label="Nhiệm vụ tuần"
                description={<Typography type="body-xs" color="muted">Hoàn thành cả 3 để nhận thưởng.</Typography>}
            >
                {body}
            </SurfaceCard>
        </div>
    ),
}

export const Bordered: Story = {
    render: () => (
        <div className="p-8">
            {/* surface-in-surface: a nested bordered card delineates with a BORDER, not a
                shadow that can render invisible against the parent surface (dark mode).
                Shown INSIDE a parent bg-surface panel so the point of `bordered` reads. */}
            <div className="rounded-3xl bg-surface p-4 shadow-surface">
                <SurfaceCard label="Câu hỏi" bordered>{body}</SurfaceCard>
            </div>
        </div>
    ),
}

/**
 * Loading: MIRROR the real card — keep the structural nodes (the `SurfaceCard` frame
 * + shadow-surface, the section label) and swap only the BODY content for `Skeleton`
 * bars sized to the real text (`Skeleton.Typography type="body-sm"` = the body glyph
 * box, last line shorter). Layout never jumps when the content resolves.
 */
export const SkeletonLoading: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard label="Khoá của tôi">
                <div className="flex flex-col gap-2">
                    <Skeleton.Typography type="body-sm" />
                    <Skeleton.Typography type="body-sm" />
                    <Skeleton.Typography type="body-sm" width="2/3" />
                </div>
            </SurfaceCard>
        </div>
    ),
}
