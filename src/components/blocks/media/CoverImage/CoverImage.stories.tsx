import type { Meta, StoryObj } from "@storybook/nextjs"
import { CoverImage } from "./index"

const meta: Meta<typeof CoverImage> = {
    title: "Blocks/Media/CoverImage",
    component: CoverImage,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof CoverImage>

/** Dùng cho ảnh bìa/thumbnail 16:9 của khoá học, bài blog hay changelog — ảnh tự cắt object-cover cho vừa khung bo góc. */
export const Default: Story = {
    parameters: { usage: "Dùng cho ảnh bìa/thumbnail 16:9 của khoá học, bài blog hay changelog — ảnh tự cắt object-cover cho vừa khung bo góc." },
    render: () => (
        <div className="w-96">
            <CoverImage src="https://picsum.photos/seed/coverimage/800/450" alt="Ảnh bìa khoá học" />
        </div>
    ),
}

/** Dùng khi chưa có ảnh (src null) — khung vẫn giữ đúng tỉ lệ 16:9 với nền surface, tránh nhảy layout khi ảnh tải về sau. */
export const Empty: Story = {
    parameters: { usage: "Dùng khi chưa có ảnh (src null) — khung vẫn giữ đúng tỉ lệ 16:9 với nền surface, tránh nhảy layout khi ảnh tải về sau." },
    render: () => (
        <div className="w-96">
            <CoverImage src={null} alt="Chưa có ảnh bìa" />
        </div>
    ),
}
