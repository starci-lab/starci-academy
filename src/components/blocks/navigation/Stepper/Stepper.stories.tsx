import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { Stepper } from "./index"

const meta: Meta<typeof Stepper> = {
    title: "Core/Navigation/Stepper",
    component: Stepper,
}
export default meta
type Story = StoryObj<typeof Stepper>

const CHECKOUT_STEPS = [
    { id: "info", label: "Thông tin", description: "Điền hồ sơ" },
    { id: "review", label: "Xác nhận", description: "Kiểm tra lại" },
    { id: "done", label: "Hoàn tất", description: "Nhận biên nhận" },
]

/** Dùng cho luồng nhiều bước theo chiều ngang trên màn rộng — hiển thị bước đã xong (dấu tích), bước hiện tại (nổi bật) và bước sắp tới trên cùng một hàng. */
export const HorizontalMidFlow: Story = {
    parameters: { usage: "Dùng cho luồng nhiều bước theo chiều ngang trên màn rộng (onboarding, nộp CV, thanh toán). Bước đã xong hiện dấu tích, bước hiện tại nổi bật bằng vòng nhấn accent, bước sắp tới mờ. Đặt currentIndex vào bước đang làm dở." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Đang ở bước giữa</Label>
                    <Typography type="body-sm" color="muted">Ba bước trên một hàng, người dùng đang ở bước thứ hai: bước một đã xong, bước hai là hiện tại, bước ba sắp tới.</Typography>
                </div>
                <Stepper steps={CHECKOUT_STEPS} currentIndex={1} />
            </div>
        </div>
    ),
}

/** Dùng cho màn hẹp hoặc danh sách bước dài — xếp dọc để mỗi bước có chỗ cho nhãn và mô tả mà không bị chật; bước đã xong bấm được khi truyền onStepPress. */
export const Vertical: Story = {
    parameters: { usage: "Dùng cho màn hẹp/mobile hoặc khi danh sách bước dài — xếp dọc để mỗi bước đủ chỗ cho nhãn và mô tả. Ở đây truyền onStepPress nên các bước đã xong bấm được để quay lại chỉnh sửa." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Xếp dọc</Label>
                    <Typography type="body-sm" color="muted">Các bước xếp dọc với đường nối chạy theo trục bên trái; hợp với màn hẹp và luồng có mô tả cho từng bước.</Typography>
                </div>
                <Stepper
                    steps={CHECKOUT_STEPS}
                    currentIndex={1}
                    orientation="vertical"
                    onStepPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** Dùng để xem trạng thái khi mọi bước đã hoàn tất — toàn bộ chỉ báo chuyển dấu tích và các đường nối đều tô màu success. */
export const AllDone: Story = {
    parameters: { usage: "Dùng để kiểm tra trạng thái kết thúc: khi currentIndex vượt bước cuối, mọi bước đều thành dấu tích và các đường nối đều tô success. Truyền currentIndex bằng số bước để đánh dấu đã xong hết." },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Đã xong hết</Label>
                    <Typography type="body-sm" color="muted">Tất cả các bước đã hoàn tất: mọi chỉ báo là dấu tích và mọi đường nối đều tô màu thành công.</Typography>
                </div>
                <Stepper steps={CHECKOUT_STEPS} currentIndex={CHECKOUT_STEPS.length} />
            </div>
        </div>
    ),
}
