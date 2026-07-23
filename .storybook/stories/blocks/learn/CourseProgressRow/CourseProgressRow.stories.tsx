import type { Meta, StoryObj } from "@storybook/nextjs"
import { BookOpenIcon } from "@phosphor-icons/react"
import { CourseProgressRow } from "./CourseProgressRow"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof CourseProgressRow> = {
    title: "Design/Learn/CourseProgressRow",
    component: CourseProgressRow,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CourseProgressRow>

const ANATOMY = {
    primitives: [
        { name: "IconTile", tier: "primitive" as const, role: "tile 48px (size sm) — ảnh bìa khóa học, thiếu → icon fallback" },
        { name: "StatusChip", tier: "primitive" as const, role: "chip 'Học thử' (tone warning) — CHỈ khi trialLabel được truyền" },
        { name: "SegmentBar", tier: "primitive" as const, role: "track 2 sắc (đã xong/còn lại) hideLegend — % đọc trực tiếp bên cạnh" },
        { name: "Typography ×2/3", tier: "primitive" as const, role: "tiêu đề (medium, truncate) · % (muted) · meta tuỳ chọn (muted)" },
        { name: "Skeleton", tier: "primitive" as const, state: "Đang tải", role: "mirror tile + tiêu đề + % + bar (§6, isSkeleton là prop)" },
    ],
    reason:
        "Một hàng tiến độ khóa học trong danh sách 'hub' (dashboard/settings/profile) cần gộp NHIỀU tín hiệu (tile · tiêu đề · trạng thái học thử · % · bar) thành MỘT khối để feature chỉ truyền dữ liệu — khung hàng bấm được (SurfaceListCard/SurfaceListCardItem) vẫn là mối quan tâm RIÊNG, consumer bọc block này vào.",
}

/** Default — enrolled course, no trial chip (the norm; mirrors `CourseTrialChip` self-hiding). */
export const Default: Story = {
    render: () =>
        blockShell(
            <div className="w-full max-w-md">
                <CourseProgressRow
                    icon={<BookOpenIcon aria-hidden focusable="false" />}
                    title="Fullstack Mastery"
                    percent={62}
                />
            </div>,
            ANATOMY,
        ),
}

/** Trial — `trialLabel` set renders the warning-tone chip beside the title. */
export const Trial: Story = {
    render: () =>
        blockShell(
            <div className="w-full max-w-md">
                <CourseProgressRow
                    icon={<BookOpenIcon aria-hidden focusable="false" />}
                    title="System Design Mastery"
                    trialLabel="Học thử"
                    percent={8}
                />
            </div>,
            ANATOMY,
        ),
}

/** WithMeta — an optional meta line under the bar (e.g. a task count). */
export const WithMeta: Story = {
    render: () =>
        blockShell(
            <div className="w-full max-w-md">
                <CourseProgressRow
                    icon={<BookOpenIcon aria-hidden focusable="false" />}
                    title="DevOps Mastery"
                    percent={34}
                    meta="41/120 mục · cập nhật 2 ngày trước"
                />
            </div>,
            ANATOMY,
        ),
}

/** Interactive — `onPress` renders a bare `<button>`; hover underlines the title (go-there nav, no fill). */
export const Interactive: Story = {
    render: () =>
        blockShell(
            <div className="w-full max-w-md">
                <CourseProgressRow
                    icon={<BookOpenIcon aria-hidden focusable="false" />}
                    title="Fullstack Mastery"
                    percent={62}
                    onPress={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** WithCoverImage — `src` set renders the course thumbnail filling the tile instead of the icon fallback (mirrors `CourseRow`'s `item.thumbnailUrl`). */
export const WithCoverImage: Story = {
    render: () =>
        blockShell(
            <div className="w-full max-w-md">
                <CourseProgressRow
                    icon={<BookOpenIcon aria-hidden focusable="false" />}
                    src="https://placehold.co/96x96/png"
                    alt="Fullstack Mastery cover"
                    title="Fullstack Mastery"
                    percent={62}
                />
            </div>,
            ANATOMY,
        ),
}

/** Empty — 0% completed, straight after enrolling. */
export const Empty: Story = {
    render: () =>
        blockShell(
            <div className="w-full max-w-md">
                <CourseProgressRow
                    icon={<BookOpenIcon aria-hidden focusable="false" />}
                    title="Nhập môn Git"
                    trialLabel="Học thử"
                    percent={0}
                />
            </div>,
            ANATOMY,
        ),
}

/** Complete — 100%, the bar fills fully (no remaining-track sliver). */
export const Complete: Story = {
    render: () =>
        blockShell(
            <div className="w-full max-w-md">
                <CourseProgressRow
                    icon={<BookOpenIcon aria-hidden focusable="false" />}
                    title="Nhập môn Git"
                    percent={100}
                />
            </div>,
            ANATOMY,
        ),
}

/** List — several rows stacked, the realistic "hub" reading (list-card frame owned by the consumer). */
export const List: Story = {
    render: () =>
        blockShell(
            <div className="flex w-full max-w-md flex-col rounded-3xl bg-surface shadow-surface">
                <CourseProgressRow
                    icon={<BookOpenIcon aria-hidden focusable="false" />}
                    title="Fullstack Mastery"
                    percent={62}
                    onPress={() => {}}
                />
                <CourseProgressRow
                    icon={<BookOpenIcon aria-hidden focusable="false" />}
                    title="System Design Mastery"
                    trialLabel="Học thử"
                    percent={8}
                    onPress={() => {}}
                />
                <CourseProgressRow
                    icon={<BookOpenIcon aria-hidden focusable="false" />}
                    title="DevOps Mastery"
                    percent={100}
                    onPress={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** Skeleton — basic mirror (title + % + bar only; trial chip/meta not reserved). */
export const Skeleton: Story = {
    render: () =>
        blockShell(
            <div className="w-full max-w-md">
                <CourseProgressRow
                    icon={<BookOpenIcon aria-hidden focusable="false" />}
                    title="Fullstack Mastery"
                    percent={62}
                    isSkeleton
                />
            </div>,
            ANATOMY,
        ),
}

/** SkeletonWithTrialAndMeta — `withTrialChip`/`withMeta` reserve those placeholder lines too. */
export const SkeletonWithTrialAndMeta: Story = {
    render: () =>
        blockShell(
            <div className="w-full max-w-md">
                <CourseProgressRow
                    icon={<BookOpenIcon aria-hidden focusable="false" />}
                    title="System Design Mastery"
                    percent={8}
                    isSkeleton
                    withTrialChip
                    withMeta
                />
            </div>,
            ANATOMY,
        ),
}
