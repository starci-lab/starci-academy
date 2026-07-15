import type { Meta, StoryObj } from "@storybook/nextjs"
import { EntityLink } from "./index"

const meta: Meta<typeof EntityLink> = {
    title: "Blocks/Feed/EntityLink",
    component: EntityLink,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof EntityLink>

/** So sánh cạnh nhau ba trạng thái của một token thực thể: điều hướng được, tĩnh (không resolve), và đang xử lý. */
export const AllStates: Story = {
    parameters: { usage: "Dùng khi cần đối chiếu nhanh ba trạng thái của token thực thể cạnh nhau để chọn đúng cách hiển thị: bấm điều hướng được, chữ đậm tĩnh khi thực thể bị gỡ, và vô hiệu hoá khi đang chờ resolve/điều hướng." },
    render: () => (
        <div className="flex flex-col gap-3 text-sm text-foreground">
            <div className="flex items-center gap-2">
                <span className="w-40 text-default-500">Điều hướng được</span>
                <EntityLink label="Nguyễn Văn An" onPress={() => {}} />
            </div>
            <div className="flex items-center gap-2">
                <span className="w-40 text-default-500">Không thể điều hướng</span>
                <EntityLink label="Khoá học đã bị gỡ" />
            </div>
            <div className="flex items-center gap-2">
                <span className="w-40 text-default-500">Đang xử lý</span>
                <EntityLink label="React nâng cao" onPress={() => {}} isPending />
            </div>
        </div>
    ),
}

/** Dùng trong một câu hoạt động (activity line) để tham chiếu inline nhiều thực thể liền mạch với văn bản. */
export const TrongCauHoatDong: Story = {
    parameters: { usage: "Dùng trong một câu hoạt động (activity line) để tham chiếu inline nhiều thực thể liền mạch với văn bản." },
    render: () => (
        <p className="text-sm text-foreground">
            <EntityLink label="Trần Thị Bình" onPress={() => {}} /> vừa hoàn thành thử thách{" "}
            <EntityLink label="Xây dựng REST API" onPress={() => {}} /> trong khoá{" "}
            <EntityLink label="Fullstack Mastery" />
        </p>
    ),
}
