import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    CheckCircleIcon,
    RocketLaunchIcon,
    WarningIcon,
} from "@phosphor-icons/react"
import { IconTile } from "./index"

const meta: Meta<typeof IconTile> = {
    title: "Blocks/Identity/IconTile",
    component: IconTile,
}
export default meta
type Story = StoryObj<typeof IconTile>

/** Dùng làm avatar nhận diện cho một khoá học/section khi chưa có ảnh bìa riêng. */
export const Default: Story = {
    parameters: { usage: "Dùng làm avatar nhận diện cho một khoá học/section khi chưa có ảnh bìa riêng." },
    render: () => <IconTile icon={<BookOpenIcon />} />,
}

/** Đổi tông màu (accent/success/warning/danger/neutral) để tile phản ánh trạng thái của thứ nó đại diện. */
export const CacTong: Story = {
    parameters: { usage: "Đổi tông màu (accent/success/warning/danger/neutral) để tile phản ánh trạng thái của thứ nó đại diện." },
    render: () => (
        <div className="flex items-center gap-4">
            <IconTile icon={<RocketLaunchIcon />} tone="accent" />
            <IconTile icon={<CheckCircleIcon />} tone="success" />
            <IconTile icon={<WarningIcon />} tone="warning" />
            <IconTile icon={<WarningIcon />} tone="danger" />
            <IconTile icon={<BookOpenIcon />} tone="neutral" />
        </div>
    ),
}

/** Chọn size sm/md/lg theo mật độ khu vực hiển thị — sm cho danh sách dày, lg cho khối nổi bật đầu trang. */
export const CacKichThuoc: Story = {
    parameters: { usage: "Chọn size sm/md/lg theo mật độ khu vực hiển thị — sm cho danh sách dày, lg cho khối nổi bật đầu trang." },
    render: () => (
        <div className="flex items-end gap-4">
            <IconTile icon={<BookOpenIcon />} size="sm" />
            <IconTile icon={<BookOpenIcon />} size="md" />
            <IconTile icon={<BookOpenIcon />} size="lg" />
        </div>
    ),
}

/** Truyền ảnh bìa thật cho khoá học/dự án đã có asset — ảnh sẽ lấp đầy tile thay icon. */
export const AnhBiaThayTheIcon: Story = {
    parameters: { usage: "Truyền ảnh bìa thật cho khoá học/dự án đã có asset — ảnh sẽ lấp đầy tile thay icon." },
    render: () => (
        <IconTile
            icon={<BookOpenIcon />}
            src="https://picsum.photos/seed/starci-course/128/128"
            alt="Lộ trình Fullstack Mastery"
            size="lg"
        />
    ),
}

/** Khi URL ảnh bìa lỗi/chưa đồng bộ, tile tự rơi về icon mặc định thay vì hiện icon ảnh vỡ. */
export const AnhLoiRoiVeIcon: Story = {
    parameters: { usage: "Khi URL ảnh bìa lỗi/chưa đồng bộ, tile tự rơi về icon mặc định thay vì hiện icon ảnh vỡ." },
    render: () => (
        <IconTile
            icon={<BookOpenIcon />}
            src="https://invalid.starci.example/not-found.jpg"
            alt="Ảnh bìa không tải được"
            tone="neutral"
        />
    ),
}
