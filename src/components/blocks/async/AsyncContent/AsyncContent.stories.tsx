import type { Meta, StoryObj } from "@storybook/nextjs"
import { CaretRightIcon } from "@phosphor-icons/react"

import { AsyncContent } from "./index"
import { ListRow } from "@/components/blocks/lists/ListRow"

const meta: Meta<typeof AsyncContent> = {
    title: "Blocks/AsyncContent",
    component: AsyncContent,
}

export default meta

type Story = StoryObj<typeof AsyncContent>

/** The resolved content branch — a real list inside its surface. */
const content = (
    <div className="rounded-3xl bg-surface p-4 shadow-surface">
        <ListRow title="Xây dựng REST API" subtitle="đã nộp · 5/5 test" trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />} onPress={() => {}} divider />
        <ListRow title="Xác thực & phân quyền" subtitle="đang làm · 0/3 test" trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />} onPress={() => {}} />
    </div>
)

/** A layout-mirroring skeleton so the box never collapses / jumps on resolve. */
const skeleton = (
    <div className="flex flex-col gap-2 rounded-3xl bg-surface p-4 shadow-surface" aria-hidden>
        {[0, 1].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-2xl bg-surface-secondary" />
        ))}
    </div>
)

/** Nhánh CONTENT: loading resolve + có data → render children. Đây là switch 4 nhánh chuẩn cho MỌI vùng data-backed (error → loading → empty → content). */
export const Content: Story = {
    parameters: { usage: "Nhánh content: có data → render children. Switch 4 nhánh chuẩn cho vùng data-backed (error → loading → empty → content)." },
    render: () => (
        <div className="max-w-md">
            <AsyncContent isLoading={false} skeleton={skeleton}>{content}</AsyncContent>
        </div>
    ),
}

/** Nhánh LOADING: `isLoading` → render `skeleton` (tree Skeleton.* phản chiếu layout thật). */
export const Loading: Story = {
    parameters: { usage: "Nhánh loading: isLoading → render skeleton mirror layout thật (không sập/nhảy khi resolve)." },
    render: () => (
        <div className="max-w-md">
            <AsyncContent isLoading skeleton={skeleton}>{content}</AsyncContent>
        </div>
    ),
}

/** Nhánh EMPTY: `isEmpty` → render `EmptyContent` (cấu hình bằng PROPS: `emptyContent={{ title, onRetry, retryLabel }}`). Bỏ `emptyContent` = section tự ẩn. */
export const Empty: Story = {
    parameters: { usage: "Nhánh empty: isEmpty → EmptyContent, cấu hình bằng props emptyContent={{ title, ... }}. Bỏ props = section tự ẩn." },
    render: () => (
        <div className="max-w-md">
            <AsyncContent
                isLoading={false}
                isEmpty
                skeleton={skeleton}
                emptyContent={{ title: "Chưa có bài nộp nào", description: "Hoàn thành 1 thử thách để thấy nó ở đây." }}
            >
                {content}
            </AsyncContent>
        </div>
    ),
}

/** Nhánh ERROR: `error` truthy → render `ErrorContent` (ưu tiên cao nhất). Chỉ truyền `error` khi KHÔNG có cache để fallback. */
export const Error: Story = {
    parameters: { usage: "Nhánh error: error truthy → ErrorContent (ưu tiên cao nhất). Chỉ truyền khi không có cache fallback." },
    render: () => (
        <div className="max-w-md">
            <AsyncContent
                isLoading={false}
                error={new globalThis.Error("boom")}
                skeleton={skeleton}
                errorContent={{ title: "Không tải được danh sách", onRetry: () => {}, retryLabel: "Thử lại" }}
            >
                {content}
            </AsyncContent>
        </div>
    ),
}
