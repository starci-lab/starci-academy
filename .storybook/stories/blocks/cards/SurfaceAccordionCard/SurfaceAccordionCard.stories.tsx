import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Button, Chip, Label, Typography } from "@heroui/react"
import { FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceAccordionCard } from "./SurfaceAccordionCard"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"

const meta: Meta<typeof SurfaceAccordionCard> = {
    title: "Primitives/Card/SurfaceAccordionCard",
    component: SurfaceAccordionCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceAccordionCard>

/**
 * Mock-content chuẩn (C-fixture) = ProfileCard: avatar + title + description. `items[].body`
 * mở ra BÊN TRONG accordion frame (đã là 1 `bg-surface`) nên KHÔNG bọc thêm `Card` ngoài —
 * tránh card-in-card (§1a) — chỉ giữ row avatar+title+desc (neo `AsyncContent`).
 */
const panel = () => (
    <div className="flex flex-row items-center gap-3">
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

const items = [
    { id: "rest", title: "REST semantics", subtitle: "3 tài nguyên", body: panel() },
    { id: "input", title: "Input contract", subtitle: "2 tài nguyên", body: panel() },
    { id: "error", title: "Error handling", subtitle: "4 tài nguyên", body: panel() },
]

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceAccordionCard items={items} defaultExpandedKeys={new Set(["rest"])} />
        </div>
    ),
}

export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceAccordionCard label="Tài nguyên" items={items} defaultExpandedKeys={new Set(["rest"])} />
        </div>
    ),
}

export const SeeMore: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceAccordionCard label="Tài nguyên" onSeeMore={() => {}} items={items} defaultExpandedKeys={new Set(["rest"])} />
        </div>
    ),
}

export const LabelEnd: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceAccordionCard label="Tài nguyên" labelEnd="9 mục" items={items} defaultExpandedKeys={new Set(["rest"])} />
        </div>
    ),
}

export const WithAction: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceAccordionCard
                label="Tài nguyên"
                action={<Button variant="secondary" size="sm">Quản lý</Button>}
                items={items}
                defaultExpandedKeys={new Set(["rest"])}
            />
        </div>
    ),
}

export const SubtleLabel: Story = {
    render: () => (
        <div className="p-8">
            {/* subtleLabel = a MINOR header (eyebrow) over a block, sitting UNDER a
                primary section Label — e.g. topic groups under "Ôn tập theo chủ đề". */}
            <div className="flex flex-col gap-3">
                <Label>Ôn tập theo chủ đề</Label>
                <SurfaceAccordionCard label="Backend" subtleLabel items={items.slice(0, 2)} defaultExpandedKeys={new Set(["rest"])} />
                <SurfaceAccordionCard label="Vận hành" subtleLabel items={items.slice(2)} defaultExpandedKeys={new Set(["error"])} />
            </div>
        </div>
    ),
}

export const Description: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceAccordionCard
                label="Tài nguyên"
                description={<Typography type="body-xs" color="muted">Mở từng mục để xem tài liệu đính kèm.</Typography>}
                items={items}
                defaultExpandedKeys={new Set(["rest"])}
            />
        </div>
    ),
}

export const Bordered: Story = {
    render: () => (
        <div className="p-8">
            {/* surface-in-surface: the nested accordion delineates with a BORDER, not a
                shadow that can render invisible against the parent surface (dark mode). */}
            <div className="rounded-3xl bg-surface p-3 shadow-surface">
                <SurfaceAccordionCard label="Tài nguyên" bordered items={items} defaultExpandedKeys={new Set(["rest"])} />
            </div>
        </div>
    ),
}

/** `items[].titleEnd`: a node right of the title (left of the caret) — a status chip / score in the
 *  collapsed trigger. The title truncates to make room; titleEnd keeps its width. */
export const WithTitleEnd: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceAccordionCard
                label="Cột mốc"
                defaultExpandedKeys={new Set(["m2"])}
                items={[
                    { id: "m1", title: "1. Khởi tạo dự án", titleEnd: <Chip size="sm" variant="soft" color="success"><Chip.Label>Xong</Chip.Label></Chip>, body: panel() },
                    { id: "m2", title: "2. Xây API", titleEnd: <Chip size="sm" variant="soft" color="warning"><Chip.Label>Đang làm</Chip.Label></Chip>, body: panel() },
                    { id: "m3", title: "3. Triển khai", titleEnd: <Chip size="sm" variant="soft" color="default"><Chip.Label>Chưa bắt đầu</Chip.Label></Chip>, body: panel() },
                ]}
            />
        </div>
    ),
}

/** Single-open (default): opening one section collapses the other. */
export const SingleExpand: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceAccordionCard label="Chỉ mở một" items={items} defaultExpandedKeys={new Set(["rest"])} />
        </div>
    ),
}

/** Multiple-open: `allowsMultipleExpanded` keeps several sections open at once. */
export const MultipleExpand: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceAccordionCard label="Mở nhiều" allowsMultipleExpanded items={items} defaultExpandedKeys={new Set(["rest", "error"])} />
        </div>
    ),
}

/** None-open: every section starts collapsed (empty `defaultExpandedKeys`). */
export const NoneExpand: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceAccordionCard label="Đóng hết" items={items} defaultExpandedKeys={new Set()} />
        </div>
    ),
}

/** Empty: no items → the {@link EmptyState} primitive fills the surface (not a blank card). */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceAccordionCard
                label="Tài nguyên"
                items={[]}
                emptyState={
                    <EmptyState
                        icon={<FolderOpenIcon weight="duotone" />}
                        title="Chưa có tài nguyên"
                        description="Tài liệu cho chủ đề này sẽ xuất hiện ở đây."
                    />
                }
            />
        </div>
    ),
}

/** Loading: `isSkeleton` self-renders a `Skeleton.Accordion` mirror (keeps the surface shell) — no separate Skeleton dựng rời. */
export const SkeletonLoading: Story = {
    render: () => (
        <div className="p-8">
            <SurfaceAccordionCard label="Tài nguyên" items={items} isSkeleton />
        </div>
    ),
}
