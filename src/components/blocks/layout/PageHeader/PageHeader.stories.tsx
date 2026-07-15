import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip, Typography } from "@heroui/react"
import { CaretRightIcon, PlusIcon } from "@phosphor-icons/react"

import { PageHeader } from "./index"

const meta: Meta<typeof PageHeader> = {
    title: "Blocks/Layout/PageHeader",
    component: PageHeader,
}

export default meta

type Story = StoryObj<typeof PageHeader>

/** Tối thiểu: title + description + actions bên phải. Không có khung card — caller đặt thẳng vào layout hoặc bọc SectionCard nếu cần surface. */
export const Default: Story = {
    parameters: { usage: "Tối thiểu: title + description + actions phải. Không khung card — đặt thẳng vào layout hoặc bọc SectionCard." },
    render: () => (
        <div className="max-w-3xl">
            <PageHeader
                title="Quản lý học viên"
                description="Xem và chỉnh sửa mọi học viên đã đăng ký."
                actions={
                    <Button variant="primary" size="sm">
                        <PlusIcon className="size-4" aria-hidden focusable="false" />
                        Mời học viên
                    </Button>
                }
            />
        </div>
    ),
}

/** Đầy đủ tầng: breadcrumb (trên) → title/description → meta chips (dưới) + actions. Mỗi tầng cách nhau `gap-3`, title↔description sát `gap-2`. */
export const Full: Story = {
    parameters: { usage: "Đầy đủ: breadcrumb → title/description → meta chips + actions. Các tầng gap-3, title↔description gap-2." },
    render: () => (
        <div className="max-w-3xl">
            <PageHeader
                breadcrumb={
                    <nav className="flex items-center gap-1 text-xs text-muted" aria-label="breadcrumb">
                        <a href="#courses" className="hover:text-foreground">Khóa học</a>
                        <CaretRightIcon className="size-3" aria-hidden focusable="false" />
                        <span className="text-foreground">Fullstack Mastery</span>
                    </nav>
                }
                title="Fullstack Mastery"
                description="Lộ trình từ nền tảng tới triển khai sản phẩm thật, chấm bằng AI."
                meta={
                    <div className="flex flex-wrap items-center gap-2">
                        {/* stat strip = dot-separated TEXT (adjacent chips are canon-banned); one status chip is fine */}
                        <Typography type="body-xs" color="muted">24 Module · 87 Nội dung · 32 giờ</Typography>
                        <Chip size="sm" variant="soft" color="success"><Chip.Label>Đang mở</Chip.Label></Chip>
                    </div>
                }
                actions={
                    <Button variant="primary" size="sm">Ghi danh</Button>
                }
            />
        </div>
    ),
}

/** Mô tả dài trên di động cần rút gọn 2 dòng (`line-clamp-2`) để header không chiếm quá nhiều chỗ, mở rộng đủ trên màn hình rộng hơn. */
export const LongDescriptionClamped: Story = {
    parameters: { usage: "Mô tả dài trên di động cần rút gọn 2 dòng (`line-clamp-2`) để header không chiếm quá nhiều chỗ, mở rộng đủ trên màn hình rộng hơn." },
    render: () => (
        <div className="max-w-sm">
            <PageHeader
                title="Cấu hình cổng thanh toán"
                description="Thiết lập SePay và PayOS, chọn cổng mặc định cho học viên mới, cấu hình các gói trả góp áp dụng riêng cho từng khóa học và theo dõi trạng thái giao dịch theo thời gian thực."
                actions={
                    <Button variant="secondary" size="sm">Lưu</Button>
                }
            />
        </div>
    ),
}
