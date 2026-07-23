import type { Meta, StoryObj } from "@storybook/nextjs"
import { CodeIcon, StackIcon, TrayIcon } from "@phosphor-icons/react"
import { TopicLane } from "./TopicLane"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * BLOCK — a labelled vertical lane of clickable "trophy topic" rows (lesson title
 * left, course tag right), used to showcase curriculum depth.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof TopicLane> = {
    title: "Block/Marketing/TopicLane",
    component: TopicLane,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TopicLane>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// The lane-content parts (every row-bearing leaf shares this composition).
// DOM: header (Icon span + tiêu đề Typography) → list div → mỗi hàng là <button>
// hand-roll BỌC nhãn + tag Typography bên trong (không phải sibling phẳng).
const CONTENT_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "primitive", role: "icon lane (code / hạ tầng) — ReactNode truyền vào, bọc <span> size-4" },
    { name: "Typography", tier: "primitive", role: "tiêu đề lane (type=body-sm, weight=semibold)" },
    {
        name: "button",
        tier: "primitive",
        role: "hàng chủ đề bấm được — hand-roll <button> (có port ListRow nhưng chưa dùng)",
        children: [
            { name: "Typography · nhãn", tier: "primitive", role: "nhãn lesson (type=body-sm, truncate, hover underline)" },
            { name: "Typography · tag", tier: "primitive", role: "tag khóa phải (type=code, text-[10px] muted)" },
        ],
    },
]

// empty leaf: header (Icon + tiêu đề) vẫn giữ, danh sách hàng đổi sang EmptyState
// (là sibling của lane trong story); EmptyState tự bọc icon + tiêu đề + mô tả.
const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "primitive", role: "icon lane — header vẫn giữ" },
    { name: "Typography", tier: "primitive", role: "tiêu đề lane (type=body-sm, weight=semibold)" },
    {
        name: "EmptyState",
        tier: "primitive",
        role: '"Chưa có chủ đề nào" thay cho danh sách hàng',
        state: "empty",
        children: [
            { name: "Icon · rỗng", tier: "primitive", role: "icon rỗng (TrayIcon, size-8, muted)" },
            { name: "Typography · tiêu đề rỗng", tier: "primitive", role: "tiêu đề rỗng (weight=medium, center)" },
            { name: "Typography · mô tả", tier: "primitive", role: "mô tả (type=body-xs, muted, center)" },
        ],
    },
]

// loading leaf: chrome mirrored — header Skeleton (icon + tiêu đề) + 3 khung hàng,
// mỗi khung BỌC 2 Skeleton (nhãn + tag) đúng footprint <button> để không nhảy layout.
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton · icon", tier: "primitive", role: "mirror icon lane (size-4)", state: "skeleton" },
    { name: "Skeleton · tiêu đề", tier: "primitive", role: "mirror tiêu đề lane (h-[14px] w-20)", state: "skeleton" },
    {
        name: "Row frame",
        tier: "primitive",
        role: "khung hàng ×3 (div border + surface) — giữ đúng footprint của <button>",
        state: "skeleton",
        children: [
            { name: "Skeleton · nhãn", tier: "primitive", role: "mirror nhãn lesson (h-[14px] w-1/2)", state: "skeleton" },
            { name: "Skeleton · tag", tier: "primitive", role: "mirror tag (h-3 w-6)", state: "skeleton" },
        ],
    },
]

export const SingleRow: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TopicLane"
                tier="block"
                leaf="Một hàng"
                parts={CONTENT_PARTS}
                note="Lane tối giản: header + đúng một hàng chủ đề bấm được — cùng composition với danh sách đầy."
            >
                <div className="max-w-[320px]">
                    <TopicLane
                        showAnatomy
                        icon={<CodeIcon />}
                        title="Code"
                        items={[{ label: "React Server Components", tag: "FS", onPress: () => {} }]}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const TypicalList: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TopicLane"
                tier="block"
                leaf="Danh sách thường"
                parts={CONTENT_PARTS}
                reason="Khoe chiều sâu chương trình bằng một lane đặt tên: mỗi hàng là một lesson thật bấm được, tag khóa bên phải. Gói header + list row vào một block để feature chỉ truyền data + handler; xếp 2 lane (code / hạ tầng) cạnh nhau là thấy độ phủ."
            >
                <div className="max-w-[320px]">
                    <TopicLane
                        showAnatomy
                        icon={<CodeIcon />}
                        title="Code"
                        items={[
                            { label: "React Server Components", tag: "FS", onPress: () => {} },
                            { label: "Thiết kế schema PostgreSQL", tag: "FS", onPress: () => {} },
                            { label: "Circuit breaker pattern", tag: "SD", onPress: () => {} },
                            { label: "Zero-downtime deployment", tag: "DO", onPress: () => {} },
                        ]}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const LongLabelTruncate: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TopicLane"
                tier="block"
                leaf="Nhãn dài cắt bớt"
                parts={CONTENT_PARTS}
                note="Nhãn quá dài → Typography truncate, tag vẫn khóa phải; CÙNG composition với danh sách thường."
            >
                <div className="max-w-[320px]">
                    <TopicLane
                        showAnatomy
                        icon={<StackIcon />}
                        title="Infrastructure"
                        items={[
                            { label: "Thiết kế hệ thống chịu lỗi ở quy mô hàng triệu request mỗi giây", tag: "SD", onPress: () => {} },
                            { label: "Triển khai Kubernetes multi-region với zero downtime", tag: "DO", onPress: () => {} },
                        ]}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const StaticRows: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TopicLane"
                tier="block"
                leaf="Hàng tĩnh"
                parts={CONTENT_PARTS}
                note="Bỏ onPress → hàng không bấm được (chỉ trưng bày), nhưng vẫn CÙNG composition Typography + ListRow."
            >
                <div className="max-w-[320px]">
                    <TopicLane
                        showAnatomy
                        icon={<StackIcon />}
                        title="Infrastructure"
                        items={[
                            { label: "Message queue với Kafka", tag: "SD" },
                            { label: "Observability với OpenTelemetry", tag: "DO" },
                        ]}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Empty: no topics → the {@link EmptyState} primitive fills the lane instead of a bare header. */
export const Empty: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TopicLane"
                tier="block"
                leaf="Rỗng"
                parts={EMPTY_PARTS}
                note="Không có chủ đề → header giữ nguyên, danh sách hàng đổi sang EmptyState (khác leaf có dữ liệu)."
            >
                <div className="max-w-[320px]">
                    <TopicLane showAnatomy icon={<CodeIcon />} title="Code" items={[]} />
                    <EmptyState
                        anatPart="EmptyState"
                        icon={<TrayIcon weight="duotone" data-anat-part="Icon · rỗng" />}
                        title="Chưa có chủ đề nào"
                        description="Các chủ đề tiêu biểu của lộ trình sẽ hiện ở đây."
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/**
 * Loading: MIRROR the lane — keep the header row + a stack of row frames, swap only the
 * label/tag text for `Skeleton` bars sized to match, so nothing shifts when data arrives.
 */
export const SkeletonLoading: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TopicLane"
                tier="block"
                leaf="Đang tải"
                parts={LOADING_PARTS}
                note="Skeleton mirror header + hàng — giữ đúng footprint để không nhảy khi data về (khác leaf có dữ liệu)."
            >
                <div className="flex max-w-[320px] flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-4 shrink-0 rounded" />
                        <Skeleton className="my-[5px] h-[14px] w-20 rounded" />
                    </div>
                    <div className="flex flex-col gap-2">
                        {[0, 1, 2].map((i) => (
                            <div key={i} data-anat-part="Row frame" className="flex items-center justify-between gap-3 rounded-xl border border-default bg-surface px-3 py-2">
                                <Skeleton className="my-[5px] h-[14px] w-1/2 rounded" />
                                <Skeleton className="h-3 w-6 shrink-0 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </BlockAnatomy>,
        ),
}
