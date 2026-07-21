import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { PageContainer } from "@/components/blocks/layout/PageContainer"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof PageContainer> = {
    title: "Layout/PageContainer",
    component: PageContainer,
}
export default meta
type Story = StoryObj<typeof PageContainer>

/**
 * Toàn bộ trạng thái của PageContainer: lớp ngoài cùng của một trang, full
 * width, flush lề trái, chỉ giữ gutter phải + py. Dùng để tra khi nào bọc
 * feature bằng PageContainer và vì sao feature bên trong không tự set p-*.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Left-flush page frame"
                hint="Lớp ngoài cùng của một trang: full width, flush lề trái (không mx-auto, không pl-*). Chỉ có gutter phải + py-16. Feature bên trong không (và không được) tự set p-*. Đừng bọc nó trong container khác."
            >
                {/* `-ml-8 mr-0`: cancel the left-edge decorator, keep mr = 0 (not `-mx-8`). */}
                <div className="-ml-8 mr-0">
                    <PageContainer>
                        <div className="rounded-2xl border border-default">
                            <Typography type="h3">My courses</Typography>
                            <Typography type="body-sm" color="muted" className="mt-2">
                                The list of courses you've enrolled in, along with your most recent learning progress.
                            </Typography>
                        </div>
                    </PageContainer>
                </div>
            </Variant>
        </Gallery>
    ),
}
