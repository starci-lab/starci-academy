import type { Meta, StoryObj } from "@storybook/nextjs"
import { CheckListCard, CheckListItem } from "./index"

const meta: Meta<typeof CheckListCard> = {
    title: "Blocks/Card/CheckListCard",
    component: CheckListCard,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof CheckListCard>

/** Dùng cho danh sách giá trị đạt được — mỗi dòng có dấu tick thành công mặc định. */
export const Default: Story = {
    parameters: { usage: "Dùng cho danh sách giá trị đạt được — mỗi dòng có dấu tick thành công mặc định." },
    render: () => (
        <div className="w-80">
            <CheckListCard>
                <CheckListItem>Xây dựng được API RESTful hoàn chỉnh</CheckListItem>
                <CheckListItem>Triển khai xác thực JWT an toàn</CheckListItem>
                <CheckListItem>Tối ưu truy vấn cơ sở dữ liệu</CheckListItem>
            </CheckListCard>
        </div>
    ),
}

/** Dùng cho danh sách điều kiện tiên quyết — đây là yêu cầu chứ không phải thành tích nên không có tick. */
export const WithoutCheck: Story = {
    parameters: { usage: "Dùng cho danh sách điều kiện tiên quyết — đây là yêu cầu chứ không phải thành tích nên không có tick." },
    render: () => (
        <div className="w-80">
            <CheckListCard>
                <CheckListItem showCheck={false}>Đã hoàn thành khóa lập trình cơ bản</CheckListItem>
                <CheckListItem showCheck={false}>Có máy tính cài sẵn Node.js 20+</CheckListItem>
                <CheckListItem showCheck={false}>Hiểu cơ bản về Git</CheckListItem>
            </CheckListCard>
        </div>
    ),
}

/** Dùng khi nội dung dòng dài, cần kiểm tra việc xuống dòng và căn lề với icon tick. */
export const LongText: Story = {
    parameters: { usage: "Dùng khi nội dung dòng dài, cần kiểm tra việc xuống dòng và căn lề với icon tick." },
    render: () => (
        <div className="w-80">
            <CheckListCard>
                <CheckListItem>
                    Thiết kế và triển khai hệ thống microservices có khả năng mở rộng cao, xử lý hàng triệu request mỗi ngày với độ trễ thấp
                </CheckListItem>
                <CheckListItem>Viết unit test đạt độ phủ trên 80%</CheckListItem>
            </CheckListCard>
        </div>
    ),
}