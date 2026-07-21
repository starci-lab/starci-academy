import type { Meta, StoryObj } from "@storybook/nextjs"
import { CoverImage } from "@/components/blocks/media/CoverImage"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof CoverImage> = {
    title: "Legacy/Blocks/Media/CoverImage",
    component: CoverImage,
}
export default meta
type Story = StoryObj<typeof CoverImage>

/**
 * Toàn bộ trạng thái của CoverImage: có ảnh (crop 16:9 bằng object-cover) và
 * chưa có ảnh (src null, giữ khung 16:9 nền surface để không giật layout khi
 * ảnh tải xong sau).
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Có ảnh"
                hint="Ảnh cover/thumbnail 16:9 của khoá học, bài blog hay changelog — ảnh tự crop bằng object-cover để lấp đầy khung viền tròn."
            >
                <div className="w-96">
                    <CoverImage src="https://picsum.photos/seed/coverimage/800/450" alt="Course cover image" />
                </div>
            </Variant>
            <Variant
                label="Chưa có ảnh"
                hint="Dùng khi chưa có ảnh (src null) — khung vẫn giữ tỉ lệ 16:9 với nền surface, tránh giật layout khi ảnh được tải lên sau đó."
            >
                <div className="w-96">
                    <CoverImage src={null} alt="No cover image yet" />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của CoverImage: có ảnh (crop 16:9 bằng object-cover) và chưa có ảnh " +
            "(src null, giữ khung 16:9 nền surface để không giật layout khi ảnh tải xong sau).",
    },
}
