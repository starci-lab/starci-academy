import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { PageContainer } from "./index"

const meta: Meta<typeof PageContainer> = {
    title: "Blocks/Layout/PageContainer",
    component: PageContainer,
}
export default meta
type Story = StoryObj<typeof PageContainer>

/** Dùng làm lớp ngoài cùng của MỘT trang — block giữ độc quyền padding và bề rộng tối đa, nhờ vậy feature bên trong không cần (và không được) tự đặt `p-*`, và mọi trang có cùng một lề. Khối nằm bên trong một trang vốn đã có container thì đừng bọc thêm lần nữa: hai lớp gutter chồng nhau sẽ bóp nội dung vào giữa. */
export const Default: Story = {
    parameters: { usage: "Dùng làm lớp ngoài cùng của MỘT trang — block giữ độc quyền padding và bề rộng tối đa, nhờ vậy feature bên trong không cần (và không được) tự đặt `p-*`, và mọi trang có cùng một lề. Khối nằm bên trong một trang vốn đã có container thì đừng bọc thêm lần nữa: hai lớp gutter chồng nhau sẽ bóp nội dung vào giữa." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Khung trang chuẩn</Label>
                <Typography type="body-sm" color="muted">
                    nội dung bị canh giữa ở bề rộng tối đa và gutter tự giãn theo màn hình — thẻ có viền bên dưới chỉ để thấy mép nội dung nằm đâu, block không tự vẽ viền nào.
                </Typography>
            </div>
            <PageContainer>
                <div className="rounded-2xl border border-default p-6">
                    <Typography type="h3">Khóa học của tôi</Typography>
                    <Typography type="body-sm" color="muted" className="mt-2">
                        Danh sách các khóa học bạn đã đăng ký, cùng tiến độ học tập gần nhất.
                    </Typography>
                </div>
            </PageContainer>
        </div>
    ),
}
