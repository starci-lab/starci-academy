import type { Meta, StoryObj } from "@storybook/nextjs"
import { BookOpenIcon } from "@phosphor-icons/react"
import { CourseProgressRow } from "./CourseProgressRow"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — one enrolled-course progress row (tile · title · optional trial chip ·
 * percent · two-tone bar · optional meta). Owns only the ROW CONTENT; the pressable
 * list-row frame (`SurfaceListCard`) stays a separate concern the consumer wraps it in.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there is
 * no separate consolidated "Anatomy" story.
 */
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

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// Base row (no trial chip, no meta) — the norm: Default · Interactive · WithCoverImage · Complete.
const ROW_PARTS: Array<AnatomyNode> = [
    { name: "IconTile", tier: "primitive", role: "tile 48px (size sm) — icon fallback, hoặc ảnh bìa khi có src" },
    { name: "Typography · title", tier: "primitive", role: "tiêu đề khóa học (body-sm, medium, truncate)" },
    { name: "Typography · percent", tier: "primitive", role: "% hoàn tất (body-xs, muted)" },
    { name: "SegmentBar", tier: "primitive", role: "track 2 sắc (đã xong / còn lại), hideLegend" },
]

// Trial shape — trialLabel adds a warning StatusChip beside the title (Trial · Empty).
const TRIAL_PARTS: Array<AnatomyNode> = [
    { name: "IconTile", tier: "primitive", role: "tile 48px (size sm) — icon fallback" },
    { name: "Typography · title", tier: "primitive", role: "tiêu đề khóa học (body-sm, medium, truncate)" },
    { name: "StatusChip", tier: "primitive", role: "chip 'Học thử' — CHỈ khi trialLabel được truyền", state: "warning" },
    { name: "Typography · percent", tier: "primitive", role: "% hoàn tất (body-xs, muted)" },
    { name: "SegmentBar", tier: "primitive", role: "track 2 sắc (đã xong / còn lại), hideLegend" },
]

// Meta shape — an extra muted line under the bar (WithMeta).
const META_PARTS: Array<AnatomyNode> = [
    { name: "IconTile", tier: "primitive", role: "tile 48px (size sm) — icon fallback" },
    { name: "Typography · title", tier: "primitive", role: "tiêu đề khóa học (body-sm, medium, truncate)" },
    { name: "Typography · percent", tier: "primitive", role: "% hoàn tất (body-xs, muted)" },
    { name: "SegmentBar", tier: "primitive", role: "track 2 sắc (đã xong / còn lại), hideLegend" },
    { name: "Typography · meta", tier: "primitive", role: "dòng phụ dưới bar (đếm mục / cập nhật), muted" },
]

// List shape — several rows stacked in a consumer-owned surface frame.
const LIST_PARTS: Array<AnatomyNode> = [
    {
        name: "Khung list (surface)",
        tier: "block",
        role: "khung bo góc + shadow-surface — CONSUMER bọc, KHÔNG thuộc block",
        children: [
            { name: "CourseProgressRow", tier: "design", role: "một hàng tiến độ, lặp ×3 (base · học thử · hoàn tất)", children: TRIAL_PARTS },
        ],
    },
]

// Loading (basic) — skeleton mirror of the base row (Skeleton).
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton · tile", tier: "primitive", role: "ô 48px thay IconTile" },
    { name: "Skeleton.Typography · title", tier: "primitive", role: "vệt tiêu đề (1/2)" },
    { name: "Skeleton · percent", tier: "primitive", role: "vệt % (w-8)" },
    { name: "Skeleton.ProgressBar", tier: "primitive", role: "vệt track (h-1)" },
]

// Loading (full) — reserves the trial-chip + meta placeholders too (SkeletonWithTrialAndMeta).
const SKELETON_FULL_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton · tile", tier: "primitive", role: "ô 48px thay IconTile" },
    { name: "Skeleton.Typography · title", tier: "primitive", role: "vệt tiêu đề (1/2)" },
    { name: "Skeleton.Chip", tier: "primitive", role: "vệt chip học thử (withTrialChip)" },
    { name: "Skeleton · percent", tier: "primitive", role: "vệt % (w-8)" },
    { name: "Skeleton.ProgressBar", tier: "primitive", role: "vệt track (h-1)" },
    { name: "Skeleton.Typography · meta", tier: "primitive", role: "vệt dòng meta (withMeta)" },
]

/** Default — enrolled course, no trial chip (the norm; mirrors `CourseTrialChip` self-hiding). */
export const Default: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseProgressRow"
                tier="design"
                leaf="Có tiến độ"
                parts={ROW_PARTS}
                reason="Một hàng tiến độ khóa học trong danh sách 'hub' (dashboard/settings/profile) cần gộp NHIỀU tín hiệu (tile · tiêu đề · trạng thái học thử · % · bar) thành MỘT khối để feature chỉ truyền dữ liệu — khung hàng bấm được (SurfaceListCard/SurfaceListCardItem) vẫn là mối quan tâm RIÊNG, consumer bọc block này vào. Khi tải: Skeleton mirror đúng khung này (isSkeleton là prop, §6)."
            >
                <div className="w-full max-w-md">
                    <CourseProgressRow
                        icon={<BookOpenIcon aria-hidden focusable="false" />}
                        title="Fullstack Mastery"
                        percent={62}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Trial — `trialLabel` set renders the warning-tone chip beside the title. */
export const Trial: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseProgressRow"
                tier="design"
                leaf="Học thử"
                parts={TRIAL_PARTS}
                note="trialLabel được truyền → thêm StatusChip warning cạnh tiêu đề (khác leaf base)."
            >
                <div className="w-full max-w-md">
                    <CourseProgressRow
                        icon={<BookOpenIcon aria-hidden focusable="false" />}
                        title="System Design Mastery"
                        trialLabel="Học thử"
                        percent={8}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** WithMeta — an optional meta line under the bar (e.g. a task count). */
export const WithMeta: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseProgressRow"
                tier="design"
                leaf="Có dòng meta"
                parts={META_PARTS}
                note="meta được truyền → thêm 1 dòng Typography muted dưới bar (khác leaf base)."
            >
                <div className="w-full max-w-md">
                    <CourseProgressRow
                        icon={<BookOpenIcon aria-hidden focusable="false" />}
                        title="DevOps Mastery"
                        percent={34}
                        meta="41/120 mục · cập nhật 2 ngày trước"
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Interactive — `onPress` renders a bare `<button>`; hover underlines the title (go-there nav, no fill). */
export const Interactive: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseProgressRow"
                tier="design"
                leaf="Bấm được"
                parts={ROW_PARTS}
                note="onPress → row là <button>, hover gạch chân tiêu đề (không tô nền); parts giống leaf base."
            >
                <div className="w-full max-w-md">
                    <CourseProgressRow
                        icon={<BookOpenIcon aria-hidden focusable="false" />}
                        title="Fullstack Mastery"
                        percent={62}
                        onPress={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** WithCoverImage — `src` set renders the course thumbnail filling the tile instead of the icon fallback (mirrors `CourseRow`'s `item.thumbnailUrl`). */
export const WithCoverImage: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseProgressRow"
                tier="design"
                leaf="Có ảnh bìa"
                parts={ROW_PARTS}
                note="src được truyền → IconTile hiện ảnh bìa thay icon fallback; parts giống leaf base."
            >
                <div className="w-full max-w-md">
                    <CourseProgressRow
                        icon={<BookOpenIcon aria-hidden focusable="false" />}
                        src="https://placehold.co/96x96/png"
                        alt="Fullstack Mastery cover"
                        title="Fullstack Mastery"
                        percent={62}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Empty — 0% completed, straight after enrolling. */
export const Empty: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseProgressRow"
                tier="design"
                leaf="Chưa bắt đầu"
                parts={TRIAL_PARTS}
                note="0% + học thử — bar rỗng hoàn toàn; composition như leaf 'Học thử' (có chip)."
            >
                <div className="w-full max-w-md">
                    <CourseProgressRow
                        icon={<BookOpenIcon aria-hidden focusable="false" />}
                        title="Nhập môn Git"
                        trialLabel="Học thử"
                        percent={0}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Complete — 100%, the bar fills fully (no remaining-track sliver). */
export const Complete: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseProgressRow"
                tier="design"
                leaf="Hoàn tất (100%)"
                parts={ROW_PARTS}
                note="100% — bar đầy, không còn sliver còn-lại; parts giống leaf base."
            >
                <div className="w-full max-w-md">
                    <CourseProgressRow
                        icon={<BookOpenIcon aria-hidden focusable="false" />}
                        title="Nhập môn Git"
                        percent={100}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** List — several rows stacked, the realistic "hub" reading (list-card frame owned by the consumer). */
export const List: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseProgressRow"
                tier="design"
                leaf="Danh sách hub"
                parts={LIST_PARTS}
                note="×3 xếp chồng trong khung surface (consumer sở hữu, KHÔNG thuộc block); mỗi hàng là 1 CourseProgressRow — base · học thử · hoàn tất."
            >
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
                </div>
            </BlockAnatomy>,
        ),
}

/** Skeleton — basic mirror (title + % + bar only; trial chip/meta not reserved). */
export const Skeleton: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseProgressRow"
                tier="design"
                leaf="Đang tải"
                parts={SKELETON_PARTS}
                note="isSkeleton → mirror cơ bản (tile + tiêu đề + % + bar); chip/meta KHÔNG giữ chỗ."
            >
                <div className="w-full max-w-md">
                    <CourseProgressRow
                        icon={<BookOpenIcon aria-hidden focusable="false" />}
                        title="Fullstack Mastery"
                        percent={62}
                        isSkeleton
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** SkeletonWithTrialAndMeta — `withTrialChip`/`withMeta` reserve those placeholder lines too. */
export const SkeletonWithTrialAndMeta: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="CourseProgressRow"
                tier="design"
                leaf="Đang tải (đủ chỗ)"
                parts={SKELETON_FULL_PARTS}
                note="isSkeleton + withTrialChip + withMeta → giữ chỗ thêm vệt chip và dòng meta."
            >
                <div className="w-full max-w-md">
                    <CourseProgressRow
                        icon={<BookOpenIcon aria-hidden focusable="false" />}
                        title="System Design Mastery"
                        percent={8}
                        isSkeleton
                        withTrialChip
                        withMeta
                    />
                </div>
            </BlockAnatomy>,
        ),
}
