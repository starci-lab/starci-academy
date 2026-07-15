import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { ArrowClockwiseIcon, CaretRightIcon, TrayIcon, WarningIcon } from "@phosphor-icons/react"

import { PaginatedList } from "./index"
import { ListRow } from "../ListRow"

const meta: Meta<typeof PaginatedList> = {
    title: "Blocks/List/PaginatedList",
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

/**
 * Chỉ dùng khi list HỮU HẠN và người dùng cần TÌM hoặc QUAY LẠI đúng một item — "trang 3" có nghĩa,
 * địa chỉ được, đóng tab mở lại vẫn về chỗ cũ (danh mục khóa học · danh sách việc làm · bộ thẻ). Nếu
 * người dùng chỉ LƯỚT một dòng chảy vô tận và list nằm trong container scroll RIÊNG (modal · panel ·
 * rail, dưới nó không còn gì) → dùng InfiniteScrollSentinel, pager ở đó là ma sát thừa. Nếu dòng chảy
 * đó nằm ở CỘT CHÍNH của trang mà dưới còn footer → dùng NÚT "Tải thêm" (auto-scroll sẽ cướp scroll,
 * người dùng không bao giờ chạm tới footer). Block là orchestrator 4 nhánh thuần trình bày: chọn đúng
 * 1 nhánh theo cờ (error → loading → empty → data), nhánh nào cũng do caller truyền slot; pagination
 * chỉ render ở nhánh data — chỉ có 1 trang thì bỏ hẳn slot đó, đừng hiện pager chết.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Chỉ dùng khi list HỮU HẠN và người dùng cần TÌM hoặc QUAY LẠI đúng một item — \"trang 3\" có nghĩa, " +
            "địa chỉ được, đóng tab mở lại vẫn về chỗ cũ (danh mục khóa học · danh sách việc làm · bộ thẻ). " +
            "Nếu người dùng chỉ LƯỚT một dòng chảy vô tận và list nằm trong container scroll RIÊNG (modal · panel · " +
            "rail, dưới nó không còn gì) → dùng InfiniteScrollSentinel, pager ở đó là ma sát thừa. Nếu dòng chảy đó " +
            "nằm ở CỘT CHÍNH của trang mà dưới còn footer → dùng NÚT \"Tải thêm\" (auto-scroll sẽ cướp scroll, " +
            "người dùng không bao giờ chạm tới footer). " +
            "Block là orchestrator 4 nhánh thuần trình bày: chọn đúng 1 nhánh theo cờ (error → loading → empty → " +
            "data), nhánh nào cũng do caller truyền slot; pagination chỉ render ở nhánh data — chỉ có 1 trang thì " +
            "bỏ hẳn slot đó, đừng hiện pager chết.",
    },
    render: () => (
        <div className="max-w-md">
            <PaginatedList pagination={pagination}>{rows}</PaginatedList>
        </div>
    ),
}

/** So sánh cả 4 nhánh cạnh nhau theo đúng thứ tự ưu tiên error → loading → empty → data — mỗi nhánh có nhãn ngắn để đọc lướt. */
export const AllBranches: Story = {
    parameters: { usage: "Xem cả 4 nhánh cạnh nhau (error → loading → empty → data) để đối chiếu thứ tự ưu tiên và layout từng slot; dùng khi cần soi orchestrator chọn nhánh nào." },
    render: () => (
        <div className="flex max-w-4xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <Label>Error (ưu tiên cao nhất)</Label>
                <PaginatedList error errorState={errorState}>{rows}</PaginatedList>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Loading</Label>
                <PaginatedList isLoading skeleton={skeleton}>{rows}</PaginatedList>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Empty</Label>
                <PaginatedList isEmpty emptyState={emptyState}>{rows}</PaginatedList>
            </div>
            <div className="flex flex-col gap-3">
                <Label>Data</Label>
                <PaginatedList pagination={pagination}>{rows}</PaginatedList>
            </div>
        </div>
    ),
}
