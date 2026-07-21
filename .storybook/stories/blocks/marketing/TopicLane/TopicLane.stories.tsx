import type { Meta, StoryObj } from "@storybook/nextjs"
import { CodeIcon, StackIcon, TrayIcon } from "@phosphor-icons/react"
import { TopicLane } from "./TopicLane"
import { blockShell } from "../../../block-anatomy"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

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

const ANATOMY = {
    primitives: [
        { name: "Typography", role: "tiêu đề lane + nhãn lesson + tag (type=code)" },
        { name: "ListRow", role: "hàng chủ đề bấm được (đang hand-roll button)" },
    ],
    reason:
        "Khoe chiều sâu chương trình bằng một lane đặt tên: mỗi hàng là một lesson thật bấm được, tag khóa bên phải. Gói header + list row vào một block để feature chỉ truyền data + handler; xếp 2 lane (code / hạ tầng) cạnh nhau là thấy độ phủ.",
}

export const SingleRow: Story = {
    render: () =>
        blockShell(
            <div className="max-w-[320px]">
                <TopicLane
                    icon={<CodeIcon />}
                    title="Code"
                    items={[{ label: "React Server Components", tag: "FS", onPress: () => {} }]}
                />
            </div>,
            ANATOMY,
        ),
}

export const TypicalList: Story = {
    render: () =>
        blockShell(
            <div className="max-w-[320px]">
                <TopicLane
                    icon={<CodeIcon />}
                    title="Code"
                    items={[
                        { label: "React Server Components", tag: "FS", onPress: () => {} },
                        { label: "Thiết kế schema PostgreSQL", tag: "FS", onPress: () => {} },
                        { label: "Circuit breaker pattern", tag: "SD", onPress: () => {} },
                        { label: "Zero-downtime deployment", tag: "DO", onPress: () => {} },
                    ]}
                />
            </div>,
            ANATOMY,
        ),
}

export const LongLabelTruncate: Story = {
    render: () =>
        blockShell(
            <div className="max-w-[320px]">
                <TopicLane
                    icon={<StackIcon />}
                    title="Infrastructure"
                    items={[
                        { label: "Thiết kế hệ thống chịu lỗi ở quy mô hàng triệu request mỗi giây", tag: "SD", onPress: () => {} },
                        { label: "Triển khai Kubernetes multi-region với zero downtime", tag: "DO", onPress: () => {} },
                    ]}
                />
            </div>,
            ANATOMY,
        ),
}

export const StaticRows: Story = {
    render: () =>
        blockShell(
            <div className="max-w-[320px]">
                <TopicLane
                    icon={<StackIcon />}
                    title="Infrastructure"
                    items={[
                        { label: "Message queue với Kafka", tag: "SD" },
                        { label: "Observability với OpenTelemetry", tag: "DO" },
                    ]}
                />
            </div>,
            ANATOMY,
        ),
}

/** Empty: no topics → the {@link EmptyState} primitive fills the lane instead of a bare header. */
export const Empty: Story = {
    render: () =>
        blockShell(
            <div className="max-w-[320px]">
                <TopicLane icon={<CodeIcon />} title="Code" items={[]} />
                <EmptyState
                    icon={<TrayIcon weight="duotone" />}
                    title="Chưa có chủ đề nào"
                    description="Các chủ đề tiêu biểu của lộ trình sẽ hiện ở đây."
                />
            </div>,
            ANATOMY,
        ),
}

/**
 * Loading: MIRROR the lane — keep the header row + a stack of row frames, swap only the
 * label/tag text for `Skeleton` bars sized to match, so nothing shifts when data arrives.
 */
export const SkeletonLoading: Story = {
    render: () =>
        blockShell(
            <div className="flex max-w-[320px] flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-4 shrink-0 rounded" />
                    <Skeleton className="my-[5px] h-[14px] w-20 rounded" />
                </div>
                <div className="flex flex-col gap-2">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-default bg-surface px-3 py-2">
                            <Skeleton className="my-[5px] h-[14px] w-1/2 rounded" />
                            <Skeleton className="h-3 w-6 shrink-0 rounded" />
                        </div>
                    ))}
                </div>
            </div>,
            ANATOMY,
        ),
}
