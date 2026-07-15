import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentMapRow } from "./index"

const meta: Meta<typeof ContentMapRow> = {
    title: "Blocks/Navigation/ContentMapRow",
    component: ContentMapRow,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ContentMapRow>

/** So sánh cạnh nhau bốn dấu trạng thái của một hàng: chưa đọc, đã đọc, bị khoá và premium. */
export const AllStatuses: Story = {
    parameters: { usage: "Dùng để đối chiếu nhanh bốn dấu trạng thái của hàng content map — chưa đọc, đã đọc, bị khoá, premium — khi rà soát tính nhất quán của icon và màu sắc." },
    render: () => (
        <div className="flex w-72 flex-col gap-3">
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted">Chưa đọc</span>
                <ContentMapRow
                    title="Giới thiệu về React Server Components"
                    isActive={false}
                    isRead={false}
                    isPremium={false}
                    onPress={() => {}}
                />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted">Đã đọc</span>
                <ContentMapRow
                    title="Thiết lập môi trường phát triển Next.js"
                    isActive={false}
                    isRead
                    isPremium={false}
                    onPress={() => {}}
                />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted">Bị khoá</span>
                <ContentMapRow
                    title="Tối ưu hiệu năng với React Compiler"
                    isActive={false}
                    isRead={false}
                    isLocked
                    isPremium
                    onPress={() => {}}
                />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted">Premium</span>
                <ContentMapRow
                    title="Kiến trúc microservices nâng cao cho hệ thống lớn"
                    isActive={false}
                    isRead={false}
                    isPremium
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** Dùng để làm nổi bật bài học người dùng đang mở, giúp họ định vị vị trí hiện tại trong content map. */
export const Active: Story = {
    parameters: { usage: "Dùng để làm nổi bật bài học người dùng đang mở, giúp họ định vị vị trí hiện tại trong content map." },
    render: () => (
        <div className="w-72">
            <ContentMapRow
                title="Quản lý state với Zustand"
                isActive
                isRead={false}
                isPremium={false}
                onPress={() => {}}
            />
        </div>
    ),
}

/** Dùng khi bài học thuộc nội dung premium nhưng đã mở khoá (đã đăng ký), kèm nhãn thời lượng đọc ở lề phải. */
export const PremiumWithMeta: Story = {
    parameters: { usage: "Dùng khi bài học thuộc nội dung premium nhưng đã mở khoá (đã đăng ký), kèm nhãn thời lượng đọc ở lề phải." },
    render: () => (
        <div className="w-72">
            <ContentMapRow
                title="Kiến trúc microservices nâng cao cho hệ thống lớn"
                isActive={false}
                isRead={false}
                isPremium
                meta={<span className="text-xs text-muted">12 phút</span>}
                onPress={() => {}}
            />
        </div>
    ),
}
