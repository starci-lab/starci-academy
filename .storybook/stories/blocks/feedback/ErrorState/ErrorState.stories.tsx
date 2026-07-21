import type { Meta, StoryObj } from "@storybook/nextjs"
import { ErrorState } from "@/components/blocks/feedback/ErrorState"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ErrorState> = {
    title: "Blocks/Feedback/ErrorState",
    component: ErrorState,
}
export default meta
type Story = StoryObj<typeof ErrorState>

/**
 * Toàn bộ ma trận trạng thái của ErrorState: có nút thử lại, chỉ tiêu đề, tiêu đề
 * kèm mô tả không thử lại, và mô tả dài để kiểm tra wrap. Dùng để tra khi nào cần
 * retryLabel/onRetry và khi nào lỗi không có hành động khắc phục.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Có nút thử lại"
                hint="Dùng khi tải dữ liệu thất bại và có thể thử lại ngay: hiện tiêu đề, mô tả ngắn, và nút thử lại."
            >
                <ErrorState
                    title="Couldn't load data"
                    description="Something went wrong while loading the content. Please try again."
                    retryLabel="Try again"
                    onRetry={() => {}}
                />
            </Variant>
            <Variant
                label="Chỉ tiêu đề"
                hint="Dùng khi lỗi đã tự giải thích và không còn gì để nói thêm — chỉ truyền title, không có mô tả hay nút thử lại."
            >
                <ErrorState title="An error occurred" />
            </Variant>
            <Variant
                label="Tiêu đề và mô tả, không thử lại"
                hint="Dùng khi lỗi không có hành động khắc phục: cần giải thích rõ nguyên nhân nhưng vẫn không hiện nút thử lại."
            >
                <ErrorState
                    title="Course not found"
                    description="This course may have been removed or the link is no longer valid."
                />
            </Variant>
            <Variant
                label="Mô tả dài"
                hint="Dùng với thông báo lỗi dài để kiểm tra mô tả xuống dòng và vẫn căn giữa mà không phá layout."
            >
                <ErrorState
                    title="Connection to the server was interrupted"
                    description="The system is having trouble connecting to the server, possibly due to an unstable network or scheduled maintenance. Please check your network connection and try again in a few minutes."
                    retryLabel="Try again"
                    onRetry={() => {}}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của ErrorState: có nút thử lại, chỉ tiêu đề, tiêu đề kèm mô tả " +
            "không thử lại, và mô tả dài để kiểm tra wrap. Dùng khi cần tra retryLabel/onRetry nên dùng " +
            "lúc nào và khi nào lỗi không có hành động khắc phục.",
    },
}
