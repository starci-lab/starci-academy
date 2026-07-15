import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"
import { ArrowClockwiseIcon, CaretRightIcon, TrayIcon, WarningIcon } from "@phosphor-icons/react"

import { PaginatedList } from "./index"
import { ListRow } from "../ListRow"

const meta: Meta<typeof PaginatedList> = {
    title: "Blocks/PaginatedList",
    component: PaginatedList,
}

export default meta

type Story = StoryObj<typeof PaginatedList>

/** The data-branch rows, reused across the state stories. */
const rows = (
    <div className="rounded-3xl bg-surface p-4 shadow-surface">
        <ListRow title="Xây dựng REST API" subtitle="đã nộp · 5/5 test" trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />} onPress={() => {}} divider />
        <ListRow title="Xác thực & phân quyền" subtitle="đang làm · 0/3 test" trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />} onPress={() => {}} divider />
        <ListRow title="Tối ưu truy vấn" subtitle="chưa bắt đầu" trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />} onPress={() => {}} />
    </div>
)

/** A minimal skeleton placeholder for the loading branch. */
const skeleton = (
    <div className="flex flex-col gap-2 rounded-3xl bg-surface p-4 shadow-surface" aria-hidden>
        {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-2xl bg-surface-secondary" />
        ))}
    </div>
)

const emptyState = (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
        <TrayIcon className="size-8 text-muted" aria-hidden focusable="false" />
        <Typography type="body-sm" color="muted">Chưa có mục nào ở đây</Typography>
    </div>
)

const errorState = (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
        <WarningIcon className="size-8 text-danger" aria-hidden focusable="false" />
        <Typography type="body-sm" color="muted">Không tải được danh sách</Typography>
        <Button variant="secondary" size="sm">
            <ArrowClockwiseIcon className="size-4" aria-hidden focusable="false" />
            Thử lại
        </Button>
    </div>
)

const pagination = (
    <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" isDisabled>Trước</Button>
        <Typography type="body-xs" color="muted">Trang 1 / 4</Typography>
        <Button variant="outline" size="sm">Sau</Button>
    </div>
)

/** Nhánh DATA: children + pagination. Đây là orchestrator 4 nhánh — ưu tiên error → loading → empty → data; nhánh nào cũng do caller truyền slot. */
export const Default: Story = {
    parameters: { usage: "Nhánh data: children + pagination. Orchestrator chọn đúng 1 nhánh theo cờ (error → loading → empty → data)." },
    render: () => (
        <div className="max-w-md">
            <PaginatedList pagination={pagination}>{rows}</PaginatedList>
        </div>
    ),
}

/** Nhánh LOADING: `isLoading` → render slot `skeleton` (placeholder nhấp nháy phản chiếu layout data). */
export const Loading: Story = {
    parameters: { usage: "Nhánh loading: isLoading → render slot skeleton (mirror layout data)." },
    render: () => (
        <div className="max-w-md">
            <PaginatedList isLoading skeleton={skeleton}>{rows}</PaginatedList>
        </div>
    ),
}

/** Nhánh EMPTY: `isEmpty` → render slot `emptyState` (minh hoạ trống + gợi ý), khi không loading/không error. */
export const Empty: Story = {
    parameters: { usage: "Nhánh empty: isEmpty → render slot emptyState (trống + gợi ý)." },
    render: () => (
        <div className="max-w-md">
            <PaginatedList isEmpty emptyState={emptyState}>{rows}</PaginatedList>
        </div>
    ),
}

/** Nhánh ERROR: `error` → render slot `errorState` (có retry). Ưu tiên CAO NHẤT — đè mọi nhánh khác. */
export const Error: Story = {
    parameters: { usage: "Nhánh error: error → render slot errorState (có retry). Ưu tiên cao nhất, đè mọi nhánh." },
    render: () => (
        <div className="max-w-md">
            <PaginatedList error errorState={errorState}>{rows}</PaginatedList>
        </div>
    ),
}
