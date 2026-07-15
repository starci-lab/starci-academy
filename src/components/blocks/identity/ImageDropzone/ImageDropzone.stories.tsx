import type { Meta, StoryObj } from "@storybook/nextjs"
import { CameraIcon } from "@phosphor-icons/react"
import { ImageDropzone } from "./index"

const meta: Meta<typeof ImageDropzone> = {
    title: "Blocks/ImageDropzone",
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

/** Dùng khi ngữ cảnh cần một icon khác thay cho icon ảnh mặc định, ví dụ upload ảnh chân dung. */
export const IconTuyChinh: Story = {
    parameters: { usage: "Dùng khi ngữ cảnh cần một icon khác thay cho icon ảnh mặc định, ví dụ upload ảnh chân dung." },
    render: () => (
        <ImageDropzone
            onFile={() => {}}
            label="Kéo thả ảnh chân dung vào đây"
            hint="PNG, JPG · tối đa 5 MB"
            icon={<CameraIcon focusable="false" />}
        />
    ),
}

/** Dùng khi cần đặt dropzone gọn trong một cột hẹp của form, ví dụ modal chỉnh sửa hồ sơ. */
export const KhungHep: Story = {
    parameters: { usage: "Dùng khi cần đặt dropzone gọn trong một cột hẹp của form, ví dụ modal chỉnh sửa hồ sơ." },
    render: () => (
        <div style={{ width: 240 }}>
            <ImageDropzone
                onFile={() => {}}
                label="Kéo thả ảnh vào đây, hoặc bấm để chọn"
                hint="PNG, JPG, WEBP, GIF · tối đa 5 MB"
                className="py-6"
            />
        </div>
    ),
}
