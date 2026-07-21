import type { Meta, StoryObj } from "@storybook/nextjs"
import { CalendarBlankIcon } from "@phosphor-icons/react"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof EmptyContent> = {
    title: "Legacy/Blocks/Async/EmptyContent",
    component: EmptyContent,
}
export default meta
type Story = StoryObj<typeof EmptyContent>

/**
 * Toàn bộ ma trận trạng thái của EmptyContent: mặc định chỉ báo rỗng, có nút thử
 * lại khi tải lỗi, và icon tuỳ chỉnh cho ngữ cảnh rỗng riêng biệt. Dùng để tra khi
 * nào cần onRetry + retryLabel và khi nào nên đổi icon mặc định.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định"
                hint="Chỉ báo hiệu rỗng, không gợi ý hành động — danh sách chưa có gì và đó là bình thường."
            >
                <div className="max-w-md">
                    <EmptyContent title="No content yet" />
                </div>
            </Variant>
            <Variant
                label="Có nút thử lại"
                hint="Rỗng vì tải lỗi và người dùng có thể thử lại. Cần CẢ HAI onRetry và retryLabel — thiếu một trong hai nút sẽ không hiện."
            >
                <div className="max-w-md">
                    <EmptyContent
                        title="Couldn't load data"
                        description="Something went wrong while loading the content. Please try again."
                        onRetry={() => {}}
                        retryLabel="Try again"
                    />
                </div>
            </Variant>
            <Variant
                label="Icon tuỳ chỉnh"
                hint="Một ngữ cảnh rỗng cụ thể (lịch, giỏ hàng) mà icon khay mặc định quá chung."
            >
                <div className="max-w-md">
                    <EmptyContent
                        icon={<CalendarBlankIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
                        title="No scheduled sessions yet"
                        description="Your class schedule is currently empty."
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của EmptyContent: mặc định chỉ báo rỗng, có nút thử lại khi tải lỗi " +
            "(cần cả onRetry và retryLabel), và icon tuỳ chỉnh cho ngữ cảnh rỗng riêng biệt (lịch, giỏ hàng...) " +
            "khi icon khay mặc định quá chung.",
    },
}
