import type { Meta, StoryObj } from "@storybook/nextjs"
import { SectionHeading } from "./index"

const meta: Meta<typeof SectionHeading> = {
    title: "Blocks/Marketing/SectionHeading",
    component: SectionHeading,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof SectionHeading>

/** Dùng làm tiêu đề section marketing mặc định: eyebrow gợi nhớ thương hiệu, tiêu đề đậm và một dòng mô tả ngắn phía dưới. */
export const Default: Story = {
    parameters: { usage: "Dùng làm tiêu đề section marketing mặc định: eyebrow gợi nhớ thương hiệu, tiêu đề đậm và một dòng mô tả ngắn phía dưới." },
    render: () => (
        <SectionHeading
            eyebrow="Học thật"
            title="Lộ trình học được thiết kế cho người đi làm"
            intro="Từ nền tảng đến dự án thực chiến, mỗi khóa học đều gắn với sản phẩm cầm nắm được."
        />
    ),
}

/** Dùng khi tiêu đề cần căn lề trái để khớp với bố cục cột nội dung hoặc sidebar, thay vì căn giữa mặc định của section marketing. */
export const AlignedStart: Story = {
    parameters: { usage: "Dùng khi tiêu đề cần căn lề trái để khớp với bố cục cột nội dung hoặc sidebar, thay vì căn giữa mặc định của section marketing." },
    render: () => (
        <SectionHeading
            align="start"
            title="Câu hỏi thường gặp"
            intro="Những thắc mắc phổ biến nhất trước khi bạn đăng ký khóa học."
        />
    ),
}

/** Dùng khi section cần được tham chiếu trực tiếp bằng URL (ví dụ từ mục lục hoặc menu điều hướng), hiện dấu "#" bên cạnh tiêu đề để copy link. */
export const WithAnchorLink: Story = {
    parameters: { usage: "Dùng khi section cần được tham chiếu trực tiếp bằng URL (ví dụ từ mục lục hoặc menu điều hướng), hiện dấu \"#\" bên cạnh tiêu đề để copy link." },
    render: () => (
        <SectionHeading
            title="Học phí và ưu đãi"
            intro="Xem chi tiết các gói học phí, hình thức trả góp và ưu đãi đang áp dụng."
            anchorId="hoc-phi"
        />
    ),
}

/** Dùng bản tối giản không eyebrow và không intro khi tiêu đề đã đủ rõ nghĩa, tránh dư thừa nội dung trong section ngắn. */
export const TitleOnly: Story = {
    parameters: { usage: "Dùng bản tối giản không eyebrow và không intro khi tiêu đề đã đủ rõ nghĩa, tránh dư thừa nội dung trong section ngắn." },
    render: () => <SectionHeading title="Đối tác đào tạo" />,
}
