import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Button, Label, Typography } from "@heroui/react"
import { SurfaceCard } from "./SurfaceCard"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

const meta: Meta<typeof SurfaceCard> = {
    title: "Primitives/Cards/SurfaceCard",
    component: SurfaceCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard>

/**
 * Fixture chuẩn (C-fixture) = ProfileCard (avatar + title + description). LƯU Ý:
 * `SurfaceCard` tự vẽ khung surface (`rounded-3xl bg-surface` + shadow/border, §1a),
 * nên ở đây KHÔNG bọc thêm `Card`/`CardContent` ngoài — chỉ giữ row bên trong, tránh
 * card-in-card.
 */
const ProfileRow = () => (
    <div className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">StarCi Academy</span>
            <span className="truncate text-xs text-muted">
                Học fullstack, system design và DevOps theo lộ trình phỏng vấn.
            </span>
        </div>
    </div>
)

/** Skeleton mirror của ProfileRow — cùng khung, swap từng node sang Skeleton.*. */
const ProfileRowSkeleton = () => (
    <div className="flex items-center gap-3">
        <Skeleton.Avatar size="md" className="shrink-0" />
        <div className="flex min-w-0 grow flex-col">
            <Skeleton.Typography type="body-sm" width="1/3" />
            <Skeleton.Typography type="body-xs" width="2/3" />
        </div>
    </div>
)

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard><ProfileRow /></SurfaceCard>
        </div>
    ),
}

export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard label="Khoá của tôi"><ProfileRow /></SurfaceCard>
        </div>
    ),
}

export const SeeMore: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard label="Khoá nổi bật" onSeeMore={() => {}}><ProfileRow /></SurfaceCard>
        </div>
    ),
}

export const LabelEnd: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard label="Học phí còn lại" labelEnd="VND"><ProfileRow /></SurfaceCard>
        </div>
    ),
}

export const WithAction: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard label="Phương thức thanh toán" action={<Button variant="secondary" size="sm">Quản lý</Button>}>
                <ProfileRow />
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
                <SurfaceCard label="Hôm nay" subtleLabel><ProfileRow /></SurfaceCard>
                <SurfaceCard label="Hôm qua" subtleLabel><ProfileRow /></SurfaceCard>
                <SurfaceCard label="Tuần trước" subtleLabel><ProfileRow /></SurfaceCard>
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
                <ProfileRow />
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
            <div className="rounded-3xl bg-surface p-3 shadow-surface">
                <SurfaceCard label="Câu hỏi" bordered><ProfileRow /></SurfaceCard>
            </div>
        </div>
    ),
}

/**
 * Loading: MIRROR the real card — keep the structural nodes (the `SurfaceCard` frame
 * + shadow-surface, the section label) and swap only the BODY content for the
 * `ProfileRowSkeleton` mirror. Layout never jumps when the content resolves.
 */
export const SkeletonLoading: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceCard label="Khoá của tôi">
                <ProfileRowSkeleton />
            </SurfaceCard>
        </div>
    ),
}
