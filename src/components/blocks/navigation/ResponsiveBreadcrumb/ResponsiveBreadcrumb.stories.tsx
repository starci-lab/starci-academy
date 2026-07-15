import type { Meta, StoryObj } from "@storybook/nextjs"
import { ResponsiveBreadcrumb } from "./index"

const meta: Meta<typeof ResponsiveBreadcrumb> = {
    title: "Blocks/Navigation/ResponsiveBreadcrumb",
    component: ResponsiveBreadcrumb,
}
export default meta
type Story = StoryObj<typeof ResponsiveBreadcrumb>

/** Dùng cho một trang con nằm sâu trong cây điều hướng, hiển thị đầy đủ đường dẫn trên desktop và rút gọn thành nút quay lại trên mobile. */
export const Default: Story = {
    parameters: { usage: "Dùng cho một trang con nằm sâu trong cây điều hướng, hiển thị đầy đủ đường dẫn trên desktop và rút gọn thành nút quay lại trên mobile." },
    render: () => (
        <ResponsiveBreadcrumb
            items={[
                { key: "home", label: "Trang chủ", onPress: () => {} },
                { key: "courses", label: "Khoá học", onPress: () => {} },
                { key: "fullstack", label: "Fullstack Mastery", onPress: () => {} },
                { key: "current", label: "Bài 4: Thiết kế API" },
            ]}
        />
    ),
}

/** Dùng khi trang hiện tại chính là gốc điều hướng, không có tổ tiên nào để quay về nên bản mobile không render nút quay lại. */
export const RootOnly: Story = {
    parameters: { usage: "Dùng khi trang hiện tại chính là gốc điều hướng, không có tổ tiên nào để quay về nên bản mobile không render nút quay lại." },
    render: () => (
        <ResponsiveBreadcrumb
            items={[
                { key: "current", label: "Trang chủ" },
            ]}
        />
    ),
}

/** Dùng khi tên crumb dài (tiêu đề bài học/khoá học dài) — bản mobile phải cắt chữ bằng truncate thay vì tràn dòng. */
export const LongLabel: Story = {
    parameters: { usage: "Dùng khi tên crumb dài (tiêu đề bài học/khoá học dài) — bản mobile phải cắt chữ bằng truncate thay vì tràn dòng." },
    render: () => (
        <div className="w-64">
            <ResponsiveBreadcrumb
                items={[
                    { key: "home", label: "Trang chủ", onPress: () => {} },
                    { key: "courses", label: "Khoá học", onPress: () => {} },
                    {
                        key: "milestone",
                        label: "Dự án cá nhân: Xây dựng hệ thống thanh toán trả góp hoàn chỉnh",
                        onPress: () => {},
                    },
                    { key: "current", label: "Nhiệm vụ 3: Tích hợp cổng thanh toán SePay và PayOS" },
                ]}
            />
        </div>
    ),
}
