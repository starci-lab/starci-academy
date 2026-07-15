import type { Meta, StoryObj } from "@storybook/nextjs"
import { CaretRightIcon } from "@phosphor-icons/react"

import { AsyncContent } from "./index"
import { ListRow } from "@/components/blocks/lists/ListRow"

const meta: Meta<typeof AsyncContent> = {
    title: "Blocks/Async/AsyncContent",
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

/** Bốn nhánh của `AsyncContent` cạnh nhau theo đúng thứ tự ưu tiên error → loading → empty → content — logic duy nhất mà wrapper này giữ. */
export const Branches: Story = {
    parameters: { usage: "So sánh 4 nhánh cạnh nhau để thấy thứ tự ưu tiên error → loading → empty → content mà mọi vùng data-backed đều chạy qua. Dùng khi cần nhìn tổng thể switch async thay vì demo lẻ từng state." },
    render: () => (
        <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
                <span className="text-xs text-muted">error (ưu tiên cao nhất)</span>
                <AsyncContent
                    isLoading={false}
                    error={new globalThis.Error("boom")}
                    skeleton={skeleton}
                    errorContent={{ title: "Không tải được danh sách", onRetry: () => {}, retryLabel: "Thử lại" }}
                >
                    {content}
                </AsyncContent>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-xs text-muted">loading</span>
                <AsyncContent isLoading skeleton={skeleton}>{content}</AsyncContent>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-xs text-muted">empty</span>
                <AsyncContent
                    isLoading={false}
                    isEmpty
                    skeleton={skeleton}
                    emptyContent={{ title: "Chưa có bài nộp nào", description: "Hoàn thành 1 thử thách để thấy nó ở đây." }}
                >
                    {content}
                </AsyncContent>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-xs text-muted">content</span>
                <AsyncContent isLoading={false} skeleton={skeleton}>{content}</AsyncContent>
            </div>
        </div>
    ),
}
