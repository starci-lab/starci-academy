import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { MagnifyingGlassIcon, TrayIcon, WarningCircleIcon } from "@phosphor-icons/react"

import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { Gallery, Variant } from "../../../../story-kit"

/**
 * `EmptyState` — a presentational, props-only empty-state placeholder.
 * All copy is passed in as `ReactNode`; the block never calls a translation
 * hook itself, so every story below uses static copy.
 */
const meta: Meta<typeof EmptyState> = {
    title: "Legacy/Blocks/Feedback/EmptyState",
    component: EmptyState,
}

export default meta

type Story = StoryObj<typeof EmptyState>

/**
 * Toàn bộ ma trận trạng thái của EmptyState: chỉ tiêu đề, icon + tiêu đề, thêm
 * mô tả gợi ý, kèm nút hành động, và tông lỗi khi tải dữ liệu thất bại. Dùng để
 * tra khi nào chọn mức chi tiết nào cho tình huống thật.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Chỉ tiêu đề"
                hint="Dùng khi chỉ cần báo “không có gì ở đây” nhanh gọn — không cần icon/mô tả/hành động, ví dụ một khu vực kết quả phụ chưa có dữ liệu."
            >
                <EmptyState title="No data" />
            </Variant>
            <Variant
                label="Icon và tiêu đề"
                hint="Dùng cho danh sách rỗng thông thường, khi chỉ cần báo trống mà không cần gợi ý hay hành động tiếp theo."
            >
                <EmptyState icon={<TrayIcon weight="duotone" />} title="No courses yet" />
            </Variant>
            <Variant
                label="Thêm mô tả"
                hint="Dùng khi cần gợi ý bước tiếp theo, ví dụ tìm kiếm không ra kết quả nên gợi ý đổi bộ lọc hoặc từ khoá."
            >
                <EmptyState
                    icon={<MagnifyingGlassIcon weight="duotone" />}
                    title="No results found"
                    description="Try adjusting your filters or search keywords to see more results."
                />
            </Variant>
            <Variant
                label="Kèm hành động"
                hint="Dùng khi có một hành động tạo-mới rõ ràng để người dùng rời khỏi trạng thái rỗng ngay tại đây."
            >
                <EmptyState
                    icon={<TrayIcon weight="duotone" />}
                    title="Empty list"
                    description="You haven't saved any items to this list yet."
                    action={<Button variant="primary">Add new item</Button>}
                />
            </Variant>
            <Variant
                label="Tông lỗi"
                hint="Dùng khi tải dữ liệu thất bại (lỗi mạng, lỗi API) — icon cảnh báo kèm nút “Try again” để người dùng khôi phục, không phải trạng thái rỗng thông thường."
            >
                <EmptyState
                    icon={<WarningCircleIcon weight="duotone" />}
                    title="Couldn't load data"
                    description="Something went wrong. Please try again later."
                    action={<Button variant="danger">Try again</Button>}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của EmptyState: chỉ tiêu đề, icon + tiêu đề, thêm mô tả gợi ý, " +
            "kèm nút hành động, và tông lỗi khi tải dữ liệu thất bại. Dùng để tra khi nào chọn mức chi " +
            "tiết nào cho tình huống thật.",
    },
}
