import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { Dropzone } from "@/components/blocks/form/Dropzone"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof Dropzone> = {
    title: "Blocks/Form/Dropzone",
    component: Dropzone,
}
export default meta
type Story = StoryObj<typeof Dropzone>

/** Giữ state `file` bằng useState để khu vực kéo-thả/click chọn file chạy thật trong Storybook. */
const Controlled = ({
    hint,
    initialFile = null,
    errorMessage,
    acceptedMimeTypes,
    maxSizeInBytes,
}: {
    hint: string
    initialFile?: File | null
    errorMessage?: string
    acceptedMimeTypes: Array<string>
    maxSizeInBytes: number
}) => {
    const [file, setFile] = React.useState<File | null>(initialFile)
    return (
        <Dropzone
            hint={hint}
            file={file}
            errorMessage={errorMessage}
            acceptedMimeTypes={acceptedMimeTypes}
            maxSizeInBytes={maxSizeInBytes}
            onChange={setFile}
        />
    )
}

const cvFile = new File(["nội dung CV mẫu"], "cv-nguyen-van-a.pdf", { type: "application/pdf" })

/**
 * Toàn bộ state của Dropzone trong một gallery: chưa chọn file, đã chọn file,
 * và lỗi định dạng/kích thước — đây là ba trạng thái duy nhất mà props thật
 * của block hỗ trợ (không có `disabled`/`loading` riêng).
 */
export const AllVariants: Story = {
    parameters: { usage: "Xem Dropzone ở mọi trạng thái trước khi ghép vào form nộp CV hoặc tải file đính kèm — trạng thái nào hiện tên file, khi nào đường viền chuyển sang màu lỗi." },
    render: () => (
        <Gallery>
            <Variant
                label="Trống — chưa chọn file"
                hint="Trạng thái mặc định khi vào form: khu vực kéo-thả hiện hint hướng dẫn, chưa có file nào được chọn."
            >
                <Controlled
                    hint="Kéo-thả hoặc bấm để chọn file CV (PDF, tối đa 5MB)"
                    acceptedMimeTypes={["application/pdf"]}
                    maxSizeInBytes={5 * 1024 * 1024}
                />
            </Variant>
            <Variant
                label="Đã chọn file"
                hint="Sau khi kéo-thả hoặc chọn file thành công, tên file thay chỗ dòng hint để người dùng biết mình đã chọn đúng file."
            >
                <Controlled
                    hint="Kéo-thả hoặc bấm để chọn file CV (PDF, tối đa 5MB)"
                    initialFile={cvFile}
                    acceptedMimeTypes={["application/pdf"]}
                    maxSizeInBytes={5 * 1024 * 1024}
                />
            </Variant>
            <Variant
                label="Lỗi định dạng hoặc kích thước"
                hint="Khi file không đúng mime type hoặc vượt maxSizeInBytes, viền chuyển sang màu danger và dòng lỗi hiện ngay dưới khu vực kéo-thả."
            >
                <Controlled
                    hint="Kéo-thả hoặc bấm để chọn file CV (PDF, tối đa 5MB)"
                    errorMessage="File vượt quá 5MB hoặc không đúng định dạng PDF — vui lòng chọn file khác."
                    acceptedMimeTypes={["application/pdf"]}
                    maxSizeInBytes={5 * 1024 * 1024}
                />
            </Variant>
        </Gallery>
    ),
}
