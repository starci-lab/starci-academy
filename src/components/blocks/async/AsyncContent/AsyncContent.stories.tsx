import type { Meta, StoryObj } from "@storybook/nextjs"
import { CaretRightIcon } from "@phosphor-icons/react"
import { Label, Typography } from "@heroui/react"

import { AsyncContent } from "./index"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"

const meta: Meta<typeof AsyncContent> = {
    title: "Core/Async/AsyncContent",
    component: AsyncContent,
}

export default meta

type Story = StoryObj<typeof AsyncContent>

/** The resolved content branch — a real list read as ONE surface card. */
const content = (
    <SurfaceListCard>
        <SurfaceListCardRow
            title="Xây dựng REST API"
            subtitle="đã nộp · 5/5 test"
            trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
            onPress={() => {}}
        />
        <SurfaceListCardRow
            title="Xác thực & phân quyền"
            subtitle="đang làm · 0/3 test"
            trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />}
            onPress={() => {}}
        />
    </SurfaceListCard>
)

/**
 * A layout-mirroring skeleton so the box never collapses / jumps on resolve —
 * `SurfaceListCardItem` carries the same `p-3` + full-bleed separator as the
 * real row, so the divider is already there while loading.
 */
const skeleton = (
    <SurfaceListCard>
        {[0, 1].map((row) => (
            <SurfaceListCardItem key={row}>
                <div className="flex items-center gap-3">
                    {/* flex-1 so the % widths resolve against a real column */}
                    <div className="flex min-w-0 flex-1 flex-col gap-0">
                        <Skeleton.Typography type="body-sm" width="1/2" />
                        <Skeleton.Typography type="body-xs" width="1/3" />
                    </div>
                    <div className="ml-auto flex shrink-0 items-center gap-2">
                        <Skeleton className="size-4 rounded" />
                    </div>
                </div>
            </SurfaceListCardItem>
        ))}
    </SurfaceListCard>
)

/** Bốn nhánh của `AsyncContent` cạnh nhau theo đúng thứ tự ưu tiên error → loading → empty → content — logic duy nhất mà wrapper này giữ. */
export const Branches: Story = {
    parameters: { usage: "So sánh 4 nhánh cạnh nhau để thấy thứ tự ưu tiên error → loading → empty → content mà mọi vùng data-backed đều chạy qua. Dùng khi cần nhìn tổng thể switch async thay vì demo lẻ từng state." },
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Error (ưu tiên cao nhất)</Label>
                    <Typography type="body-sm" color="muted">
                        Thắng mọi nhánh còn lại. Cần CẢ error LẪN errorContent — truyền error mà quên
                        errorContent thì rơi xuống nhánh loading, lỗi bị nuốt im lặng.
                    </Typography>
                </div>
                <AsyncContent
                    isLoading={false}
                    error={new globalThis.Error("boom")}
                    skeleton={skeleton}
                    errorContent={{ title: "Không tải được danh sách", onRetry: () => {}, retryLabel: "Thử lại" }}
                >
                    {content}
                </AsyncContent>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Loading</Label>
                    <Typography type="body-sm" color="muted">
                        Lần tải ĐẦU, chưa có gì trong tay — truyền điều kiện đã chốt, ví dụ isLoading và
                        danh sách còn rỗng. Revalidate ngầm khi đã có data thì đừng bật, kẻo nháy skeleton đè
                        lên nội dung người dùng đang đọc.
                    </Typography>
                </div>
                <AsyncContent isLoading skeleton={skeleton}>{content}</AsyncContent>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Empty</Label>
                    <Typography type="body-sm" color="muted">
                        Tải xong nhưng không có dữ liệu — khác Error ở chỗ không ai làm gì sai. Bỏ emptyContent
                        thì section TỰ ẨN (render null) thay vì hiện khung rỗng.
                    </Typography>
                </div>
                <AsyncContent
                    isLoading={false}
                    isEmpty
                    skeleton={skeleton}
                    emptyContent={{ title: "Chưa có bài nộp nào", description: "Hoàn thành 1 thử thách để thấy nó ở đây." }}
                >
                    {content}
                </AsyncContent>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Content</Label>
                    <Typography type="body-sm" color="muted">
                        Nhánh cuối: không lỗi, hết loading, có dữ liệu → render children.
                    </Typography>
                </div>
                <AsyncContent isLoading={false} skeleton={skeleton}>{content}</AsyncContent>
            </div>
        </div>
    ),
}
