import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { PageContainer } from "./index"

const meta: Meta<typeof PageContainer> = {
    title: "Core/Layout/PageContainer",
    component: PageContainer,
}
export default meta
type Story = StoryObj<typeof PageContainer>

/** Lớp ngoài cùng của trang — full width, sát lề trái, chỉ giữ gutter phải + py. Feature bên trong không tự đặt `p-*`. */
export const Default: Story = {
    parameters: {
        usage: "Lớp ngoài cùng của MỘT trang: full width, sát lề trái (không `mx-auto`, không `pl-*`). Chỉ gutter phải + `py-16`. Feature bên trong không (và không được) tự đặt `p-*`. Đừng bọc thêm container lần nữa.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Khung trang sát trái</Label>
                <Typography type="body-sm" color="muted">
                    Full width, không canh giữa — chỉ gutter phải + py. Thẻ có viền bên dưới chỉ để thấy mép nội dung; block không tự vẽ viền.
                </Typography>
            </div>
            {/* `-ml-8 mr-0`: triệt decorator lề trái, giữ mr = 0 (không `-mx-8`). */}
            <div className="-ml-8 mr-0">
                <PageContainer>
                    <div className="rounded-2xl border border-default">
                        <Typography type="h3">Khóa học của tôi</Typography>
                        <Typography type="body-sm" color="muted" className="mt-2">
                            Danh sách các khóa học bạn đã đăng ký, cùng tiến độ học tập gần nhất.
                        </Typography>
                    </div>
                </PageContainer>
            </div>
        </div>
    ),
}
