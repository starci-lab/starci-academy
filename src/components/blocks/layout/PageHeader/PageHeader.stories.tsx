import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip, Label, Typography } from "@heroui/react"
import { CaretRightIcon, PlusIcon } from "@phosphor-icons/react"

import { PageHeader } from "./index"

const meta: Meta<typeof PageHeader> = {
    title: "Blocks/Layout/PageHeader",
    component: PageHeader,
}

export default meta

type Story = StoryObj<typeof PageHeader>

/** Dùng cho tiêu đề của MỘT TRANG — nó không tự vẽ khung card, nên đặt thẳng vào layout; cần surface thì caller tự bọc. Tiêu đề của một KHỐI bên trong trang thì đừng dùng block này mà dùng LabeledCard (nhãn ngoài + Card trong): hai trang có hai PageHeader chồng nhau là dấu hiệu một trong hai vốn là khối, không phải trang. */
export const Default: Story = {
    parameters: { usage: "Dùng cho tiêu đề của MỘT TRANG — nó không tự vẽ khung card, nên đặt thẳng vào layout; cần surface thì caller tự bọc. Tiêu đề của một KHỐI bên trong trang thì đừng dùng block này mà dùng `LabeledCard` (nhãn ngoài + Card trong): hai `PageHeader` chồng nhau trên một trang là dấu hiệu một trong hai vốn là khối, không phải trang." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Tối thiểu</Label>
                <Typography type="body-sm" color="muted">
                    bộ khung ít nhất còn dùng được: tiêu đề, một dòng mô tả và một hành động. Đủ cho trang quản trị mà người dùng vào thẳng từ menu, không có đường dẫn phân cấp nào để bày.
                </Typography>
            </div>
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
        </div>
    ),
}

/** Dùng khi trang nằm SÂU trong một phân cấp và người dùng cần biết mình đang ở đâu — lúc đó mới bày đủ bốn tầng: breadcrumb, tiêu đề, meta, hành động. Trang vào thẳng từ menu thì đừng bịa breadcrumb, dùng bộ tối thiểu ở story Default. */
export const Full: Story = {
    parameters: { usage: "Dùng khi trang nằm SÂU trong một phân cấp và người dùng cần biết mình đang ở đâu — lúc đó mới bày đủ bốn tầng: breadcrumb, tiêu đề, meta, hành động. Trang vào thẳng từ menu thì đừng bịa breadcrumb, dùng bộ tối thiểu ở story Default." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Đủ bốn tầng</Label>
                <Typography type="body-sm" color="muted">
                    bố cục của trang chi tiết nằm sâu trong phân cấp: khác bộ tối thiểu ở chỗ có breadcrumb dẫn đường phía trên và một dải meta phía dưới. Dải meta là chữ ngăn bằng dấu chấm giữa chứ không phải nhiều chip cạnh nhau, chip chỉ dành cho một trạng thái.
                </Typography>
            </div>
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
        </div>
    ),
}

/** Dùng để soi nhánh tràn chữ: mô tả dài gặp bề rộng hẹp thì bị cắt còn 2 dòng, để header không nuốt mất màn hình đầu tiên của trang. */
export const LongDescriptionClamped: Story = {
    parameters: { usage: "Dùng để soi nhánh tràn chữ: mô tả dài gặp bề rộng hẹp thì bị cắt còn 2 dòng, để header không nuốt mất màn hình đầu tiên của trang." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mô tả dài bị cắt</Label>
                <Typography type="body-sm" color="muted">
                    trạng thái khi mô tả dài hơn chỗ nó có: dừng ở 2 dòng rồi thôi. Khung hẹp bên dưới là cố ý, để thấy điểm cắt — cùng đoạn chữ đó ở trang rộng sẽ hiện đủ.
                </Typography>
            </div>
            <div className="max-w-sm">
                <PageHeader
                    title="Cấu hình cổng thanh toán"
                    description="Thiết lập SePay và PayOS, chọn cổng mặc định cho học viên mới, cấu hình các gói trả góp áp dụng riêng cho từng khóa học và theo dõi trạng thái giao dịch theo thời gian thực."
                    actions={
                        <Button variant="secondary" size="sm">Lưu</Button>
                    }
                />
            </div>
        </div>
    ),
}
