import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ImageDropzone } from "./index"

const meta: Meta<typeof ImageDropzone> = {
    title: "Blocks/Identity/ImageDropzone",
    component: ImageDropzone,
}
export default meta
type Story = StoryObj<typeof ImageDropzone>

/** Dùng khi thứ tải lên là ẢNH và người dùng cần thấy ngay ảnh mình vừa chọn — thay vì `Dropzone` generic (file bất kỳ, nối vào React Hook Form). Đổi ảnh đại diện ngay tại chỗ, không cần khu kéo thả riêng, thì dùng `AvatarUploadButton`. */
export const Default: Story = {
    parameters: { usage: "Dùng khi thứ tải lên là ẢNH và người dùng cần thấy ngay ảnh mình vừa chọn — thay vì `Dropzone` generic (file bất kỳ, nối vào React Hook Form). Đổi ảnh đại diện ngay tại chỗ, không cần khu kéo thả riêng, thì dùng `AvatarUploadButton`." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có gợi ý định dạng</Label>
                <Typography type="body-sm" color="muted">
                    Truyền hint khi backend có ràng buộc thật về định dạng hoặc dung lượng. Nói trước ở đây
                    rẻ hơn để người dùng chọn xong mới báo lỗi.
                </Typography>
            </div>
            <ImageDropzone
                onFile={() => {}}
                label="Kéo thả ảnh vào đây, hoặc bấm để chọn"
                hint="PNG, JPG, WEBP, GIF · tối đa 5 MB"
            />
        </div>
    ),
}

/** Bỏ `hint` khi không có ràng buộc nào đáng nói trước — khu kéo thả rút còn một dòng nhãn. */
export const WithoutHint: Story = {
    parameters: { usage: "Bỏ `hint` khi không có ràng buộc nào đáng nói trước — khu kéo thả rút còn một dòng nhãn." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Không có gợi ý</Label>
                <Typography type="body-sm" color="muted">
                    Bỏ hint khi mọi định dạng ảnh thường gặp đều nhận được và không có trần dung lượng đáng
                    kể. Đừng bỏ chỉ để cho gọn — có ràng buộc mà giấu thì người dùng gặp lỗi sau khi chọn.
                </Typography>
            </div>
            <ImageDropzone onFile={() => {}} label="Bấm để chọn ảnh" />
        </div>
    ),
}
