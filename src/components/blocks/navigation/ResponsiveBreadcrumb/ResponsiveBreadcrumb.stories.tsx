import type { Meta, StoryObj } from "@storybook/nextjs"

import { ResponsiveBreadcrumb } from "./index"

const meta: Meta<typeof ResponsiveBreadcrumb> = {
    title: "Blocks/ResponsiveBreadcrumb",
    component: ResponsiveBreadcrumb,
}

export default meta

type Story = StoryObj<typeof ResponsiveBreadcrumb>

/** Trail root → hiện tại; crumb cuối (đang xem) KHÔNG có `onPress` (read-only). Các crumb trước bấm để điều hướng. Tự co gọn trên màn hẹp. */
export const Default: Story = {
    parameters: { usage: "Trail root → hiện tại; crumb cuối read-only (không onPress). Tự co gọn trên màn hẹp." },
    render: () => (
        <ResponsiveBreadcrumb
            items={[
                { key: "home", label: "Trang chủ", onPress: () => {} },
                { key: "courses", label: "Khóa học", onPress: () => {} },
                { key: "fs", label: "Fullstack Mastery", onPress: () => {} },
                { key: "current", label: "Module 3 · Bất đồng bộ" },
            ]}
        />
    ),
}

/** Trail ngắn (2 cấp) — trường hợp tối thiểu. */
export const Short: Story = {
    parameters: { usage: "Trail 2 cấp — tối thiểu." },
    render: () => (
        <ResponsiveBreadcrumb
            items={[
                { key: "home", label: "Trang chủ", onPress: () => {} },
                { key: "current", label: "Cài đặt" },
            ]}
        />
    ),
}
