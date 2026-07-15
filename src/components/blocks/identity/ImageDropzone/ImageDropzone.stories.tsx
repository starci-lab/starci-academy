import type { Meta, StoryObj } from "@storybook/nextjs"
import { ImageDropzone } from "./index"

const meta: Meta<typeof ImageDropzone> = {
    title: "Blocks/Identity/ImageDropzone",
    component: ImageDropzone,
}
export default meta
type Story = StoryObj<typeof ImageDropzone>

/** Dùng khi cần khu vực kéo thả để người dùng tải lên ảnh đại diện. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần khu vực kéo thả để người dùng tải lên ảnh đại diện." },
    render: () => (
        <ImageDropzone
            onFile={() => {}}
            label="Kéo thả ảnh vào đây, hoặc bấm để chọn"
            hint="PNG, JPG, WEBP, GIF · tối đa 5 MB"
        />
    ),
}

/** Dùng khi muốn rút gọn phần hướng dẫn, chỉ hiển thị nhãn chính mà không cần gợi ý định dạng. */
export const KhongCoHint: Story = {
    parameters: { usage: "Dùng khi muốn rút gọn phần hướng dẫn, chỉ hiển thị nhãn chính mà không cần gợi ý định dạng." },
    render: () => <ImageDropzone onFile={() => {}} label="Bấm để chọn ảnh" />,
}
