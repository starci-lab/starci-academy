import type { Meta, StoryObj } from "@storybook/nextjs"
import { ImageDropzone } from "@/components/blocks/identity/ImageDropzone"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ImageDropzone> = {
    title: "Blocks/Identity/ImageDropzone",
    component: ImageDropzone,
}
export default meta
type Story = StoryObj<typeof ImageDropzone>

/**
 * Toàn bộ ma trận trạng thái của ImageDropzone: có hint định dạng/kích thước
 * và không hint. Dùng để tra khi nào nên nói trước ràng buộc định dạng, và khi
 * nào có thể bỏ hint để khu vực thả ảnh gọn lại một dòng label.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Có hint định dạng"
                hint="Dùng khi backend có ràng buộc thật về định dạng hoặc kích thước file. Nói trước ở đây rẻ hơn để người dùng chọn xong mới gặp lỗi. Dùng khi tải lên là ẢNH và cần thấy ngay ảnh vừa chọn — thay cho `Dropzone` chung (mọi loại file, nối vào React Hook Form). Để đổi avatar tại chỗ không cần khu vực thả riêng, dùng `AvatarUploadButton`."
            >
                <div className="max-w-md">
                    <ImageDropzone
                        onFile={() => {}}
                        label="Drag and drop an image here, or click to choose"
                        hint="PNG, JPG, WEBP, GIF · up to 5 MB"
                    />
                </div>
            </Variant>
            <Variant
                label="Không hint"
                hint="Bỏ hint khi mọi định dạng ảnh phổ biến đều được nhận và không có giới hạn kích thước đáng nói. Đừng bỏ chỉ để gọn — che một ràng buộc thật khiến người dùng gặp lỗi sau khi đã chọn."
            >
                <div className="max-w-md">
                    <ImageDropzone onFile={() => {}} label="Click to choose an image" />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của ImageDropzone: có hint định dạng/kích thước và không hint. " +
            "Dùng khi tải lên là ẢNH và cần thấy ngay ảnh vừa chọn — thay cho `Dropzone` chung (mọi loại " +
            "file, nối vào React Hook Form). Để đổi avatar tại chỗ không cần khu vực thả riêng, dùng " +
            "`AvatarUploadButton`.",
    },
}
