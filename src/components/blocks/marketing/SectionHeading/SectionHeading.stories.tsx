import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { SectionHeading } from "./index"

const meta: Meta<typeof SectionHeading> = {
    title: "Core/Marketing/SectionHeading",
    component: SectionHeading,
}
export default meta
type Story = StoryObj<typeof SectionHeading>

/** Dùng làm tiêu đề section marketing mặc định: eyebrow gợi nhớ thương hiệu, tiêu đề đậm và một dòng mô tả ngắn phía dưới. */
export const Default: Story = {
    parameters: { usage: "Dùng làm tiêu đề section marketing mặc định: eyebrow gợi nhớ thương hiệu, tiêu đề đậm và một dòng mô tả ngắn phía dưới." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định (căn giữa)</Label>
                <Typography type="body-sm" color="muted">
                    Dùng cho tiêu đề section marketing thông thường — eyebrow + tiêu đề đậm + một dòng mô tả, căn giữa.
                </Typography>
            </div>
            <SectionHeading
                eyebrow="Học thật"
                title="Lộ trình học được thiết kế cho người đi làm"
                intro="Từ nền tảng đến dự án thực chiến, mỗi khóa học đều gắn với sản phẩm cầm nắm được."
            />
        </div>
    ),
}

/** Dùng khi tiêu đề cần căn lề trái để khớp với bố cục cột nội dung hoặc sidebar, thay vì căn giữa mặc định của section marketing. */
export const AlignedStart: Story = {
    parameters: { usage: "Dùng khi tiêu đề cần căn lề trái để khớp với bố cục cột nội dung hoặc sidebar, thay vì căn giữa mặc định của section marketing." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Căn lề trái</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi tiêu đề phải khớp bố cục cột nội dung hoặc sidebar — căn trái thay vì căn giữa mặc định.
                </Typography>
            </div>
            <SectionHeading
                align="start"
                title="Câu hỏi thường gặp"
                intro="Những thắc mắc phổ biến nhất trước khi bạn đăng ký khóa học."
            />
        </div>
    ),
}

/** Dùng khi section cần được tham chiếu trực tiếp bằng URL (ví dụ từ mục lục hoặc menu điều hướng), hiện dấu "#" bên cạnh tiêu đề để copy link. */
export const WithAnchorLink: Story = {
    parameters: { usage: "Dùng khi section cần được tham chiếu trực tiếp bằng URL (ví dụ từ mục lục hoặc menu điều hướng), hiện dấu \"#\" bên cạnh tiêu đề để copy link." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có neo URL</Label>
                <Typography type="body-sm" color="muted">
                    Dùng khi section cần được trỏ thẳng bằng URL (từ mục lục / menu) — hiện dấu neo cạnh tiêu đề để copy link.
                </Typography>
            </div>
            <SectionHeading
                title="Học phí và ưu đãi"
                intro="Xem chi tiết các gói học phí, hình thức trả góp và ưu đãi đang áp dụng."
                anchorId="hoc-phi"
            />
        </div>
    ),
}

/** Dùng bản tối giản không eyebrow và không intro khi tiêu đề đã đủ rõ nghĩa, tránh dư thừa nội dung trong section ngắn. */
export const TitleOnly: Story = {
    parameters: { usage: "Dùng bản tối giản không eyebrow và không intro khi tiêu đề đã đủ rõ nghĩa, tránh dư thừa nội dung trong section ngắn." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chỉ tiêu đề</Label>
                <Typography type="body-sm" color="muted">
                    Dùng bản tối giản (bỏ eyebrow và intro) khi tiêu đề đã đủ rõ — tránh dư thừa trong section ngắn.
                </Typography>
            </div>
            <SectionHeading title="Đối tác đào tạo" />
        </div>
    ),
}
