import type { Meta, StoryObj } from "@storybook/nextjs"
import { PageContainer } from "./index"

const meta: Meta<typeof PageContainer> = {
    title: "Blocks/Layout/PageContainer",
    component: PageContainer,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof PageContainer>

/** Dùng làm khung chuẩn cho một trang, canh giữa nội dung và tự chừa gutter/padding responsive. */
export const Default: Story = {
    parameters: { usage: "Dùng làm khung chuẩn cho một trang, canh giữa nội dung và tự chừa gutter/padding responsive." },
    render: () => (
        <PageContainer>
            <div className="rounded-lg border border-default-200 p-6">
                <h1 className="text-2xl font-semibold">Khóa học của tôi</h1>
                <p className="mt-2 text-default-500">
                    Danh sách các khóa học bạn đã đăng ký, cùng tiến độ học tập gần nhất.
                </p>
            </div>
        </PageContainer>
    ),
}
