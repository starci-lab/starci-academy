import type { Meta, StoryObj } from "@storybook/nextjs"
import { OutlineRail } from "@/components/blocks/navigation/OutlineRail"
import { Gallery, Variant } from "../../../../story-kit"
import { Controlled, mockGroups } from "./components"

const meta: Meta<typeof OutlineRail> = {
    title: "Features/Learn/OutlineRail",
    component: OutlineRail,
}
export default meta
type Story = StoryObj<typeof OutlineRail>

/**
 * Toàn bộ ma trận trạng thái của OutlineRail: có dữ liệu, đang tải lần đầu, khóa
 * học rỗng, tìm kiếm không khớp, và lỗi tải kèm nút thử lại. Dùng để tra khi nào
 * mỗi trạng thái xuất hiện trong luồng học bài thật.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Có dữ liệu"
                hint="Rail điều hướng khóa học đã có tiến độ tổng, ô tìm kiếm, và các module đã có dữ liệu — trạng thái mặc định khi mọi thứ tải xong."
            >
                <Controlled
                    header={{
                        label: "Progress",
                        progress: { done: 3, total: 9 },
                        countLabel: "3/9 lessons",
                        continue: { label: "Continue learning", onPress: () => {} },
                    }}
                    groups={mockGroups}
                    async={{
                        isLoading: false,
                        skeleton: null,
                        isEmpty: false,
                        emptyTitle: "No content yet",
                        errorTitle: "Couldn't load content",
                        onRetry: () => {},
                        retryLabel: "Retry",
                        noMatchLabel: "No matching lessons found",
                    }}
                />
            </Variant>
            <Variant
                label="Đang tải"
                hint="Dữ liệu module đang tải lần đầu, trước khi có tiến độ nào để hiện ở phần header."
            >
                <Controlled
                    groups={[]}
                    async={{
                        isLoading: true,
                        skeleton: (
                            <div className="flex flex-col gap-3">
                                <div className="h-14 w-full animate-pulse rounded-lg bg-default-100" />
                                <div className="h-14 w-full animate-pulse rounded-lg bg-default-100" />
                                <div className="h-14 w-full animate-pulse rounded-lg bg-default-100" />
                            </div>
                        ),
                        isEmpty: false,
                        emptyTitle: "No content yet",
                        errorTitle: "Couldn't load content",
                        onRetry: () => {},
                        retryLabel: "Retry",
                        noMatchLabel: "No matching lessons found",
                    }}
                />
            </Variant>
            <Variant
                label="Rỗng"
                hint="Khóa học chưa có module/bài học nào được xuất bản."
            >
                <Controlled
                    groups={[]}
                    async={{
                        isLoading: false,
                        skeleton: null,
                        isEmpty: true,
                        emptyTitle: "No content for this course yet",
                        errorTitle: "Couldn't load content",
                        onRetry: () => {},
                        retryLabel: "Retry",
                        noMatchLabel: "No matching lessons found",
                    }}
                />
            </Variant>
            <Variant
                label="Không tìm thấy"
                hint="Từ khóa tìm kiếm không khớp với bài học nào trong các module hiện có."
            >
                <Controlled
                    initialQuery="advanced 3d graphics"
                    groups={[]}
                    async={{
                        isLoading: false,
                        skeleton: null,
                        isEmpty: false,
                        emptyTitle: "No content yet",
                        errorTitle: "Couldn't load content",
                        onRetry: () => {},
                        retryLabel: "Retry",
                        noMatchLabel: "No lessons match your search",
                    }}
                />
            </Variant>
            <Variant
                label="Lỗi tải"
                hint="Tải dữ liệu module thất bại và người dùng cần cách để thử lại."
            >
                <Controlled
                    groups={[]}
                    async={{
                        isLoading: false,
                        skeleton: null,
                        isEmpty: false,
                        emptyTitle: "No content yet",
                        errorTitle: "Couldn't load the lesson list",
                        error: new Error("Network request failed"),
                        onRetry: () => {},
                        retryLabel: "Retry",
                        noMatchLabel: "No matching lessons found",
                    }}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của OutlineRail: có dữ liệu (tiến độ tổng + ô tìm kiếm + module đã " +
            "tải), đang tải lần đầu (skeleton thay header tiến độ), khóa học rỗng (chưa có module/bài học " +
            "xuất bản), tìm kiếm không khớp bài học nào, và lỗi tải kèm nút thử lại. Dùng khi cần tra trạng " +
            "thái nào hiện khi nào trong luồng học bài.",
    },
}
