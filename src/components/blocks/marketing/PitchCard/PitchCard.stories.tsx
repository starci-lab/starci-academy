import type { Meta, StoryObj } from "@storybook/nextjs"
import { RocketLaunchIcon, ShieldCheckIcon, TrophyIcon } from "@phosphor-icons/react"
import { Link } from "@heroui/react"
import { PitchCard } from "./index"

const meta: Meta<typeof PitchCard> = {
    title: "Blocks/Marketing/PitchCard",
    component: PitchCard,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof PitchCard>

/** Dùng làm khối "pitch" mặc định trong các beat của landing page — nêu một tuyên bố kèm luận điểm chứng minh. */
export const Default: Story = {
    parameters: { usage: "Dùng làm khối \"pitch\" mặc định trong các beat của landing page — nêu một tuyên bố kèm luận điểm chứng minh." },
    render: () => (
        <div className="w-80">
            <PitchCard
                icon={<RocketLaunchIcon size={20} weight="bold" />}
                title="Học đi kèm thực chiến"
                body="Không chỉ xem video — mỗi module đều có bài tập thực tế, chấm điểm bằng AI, và phản hồi ngay lập tức."
            />
        </div>
    ),
}

/** Đổi tông màu icon tile để phân biệt nhóm luận điểm (thành công, cảnh báo, rủi ro, trung tính) trong cùng một dãy pitch card. */
export const Tones: Story = {
    parameters: { usage: "Đổi tông màu icon tile để phân biệt nhóm luận điểm (thành công, cảnh báo, rủi ro, trung tính) trong cùng một dãy pitch card." },
    render: () => (
        <div className="grid w-[70rem] grid-cols-2 gap-4 lg:grid-cols-4">
            <PitchCard
                tone="accent"
                icon={<RocketLaunchIcon size={20} weight="bold" />}
                title="Nhấn mạnh trọng tâm"
                body="Tông accent dùng cho luận điểm chủ lực của trang."
            />
            <PitchCard
                tone="success"
                icon={<TrophyIcon size={20} weight="bold" />}
                title="Kết quả đã kiểm chứng"
                body="Tông success dùng khi nói về thành tích, tỷ lệ hoàn thành, hoặc kết quả đầu ra."
            />
            <PitchCard
                tone="warning"
                icon={<ShieldCheckIcon size={20} weight="bold" />}
                title="Lưu ý trước khi bắt đầu"
                body="Tông warning dùng khi cảnh báo về độ khó hoặc yêu cầu đầu vào."
            />
            <PitchCard
                tone="neutral"
                icon={<ShieldCheckIcon size={20} weight="bold" />}
                title="Thông tin bổ trợ"
                body="Tông neutral dùng cho các luận điểm phụ, không cần nổi bật."
            />
        </div>
    ),
}

/** Thêm footer khi pitch card cần dẫn người đọc sang một surface liên quan (ví dụ xem chi tiết lộ trình). */
export const WithFooter: Story = {
    parameters: { usage: "Thêm footer khi pitch card cần dẫn người đọc sang một surface liên quan (ví dụ xem chi tiết lộ trình)." },
    render: () => (
        <div className="w-80">
            <PitchCard
                icon={<RocketLaunchIcon size={20} weight="bold" />}
                tone="accent"
                title="Lộ trình rõ ràng theo từng cấp độ"
                body="Từ junior đến senior, mỗi giai đoạn đều có mục tiêu và bài kiểm tra riêng."
                footer={<Link href="/courses">Xem lộ trình</Link>}
            />
        </div>
    ),
}
