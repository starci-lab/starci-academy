import type { Meta, StoryObj } from "@storybook/nextjs"

import { CVSubmissionForm } from "./index"

const meta: Meta<typeof CVSubmissionForm> = {
    title: "Core/Form/CVSubmissionForm",
    component: CVSubmissionForm,
}

export default meta

type Story = StoryObj<typeof CVSubmissionForm>

/** Handlers no-op dùng chung — parent thật sở hữu logic upload/process. */
const handlers = {
    onSubmit: () => {},
    onProcess: () => {},
}

/** READY: chưa chọn file — Formik + field chọn CV, tiến độ 0. Form thuần trình bày; state upload/process do parent truyền qua props. */
export const Default: Story = {
    parameters: { usage: "Ready: chưa chọn file. Form trình bày thuần — parent truyền state upload/process + handlers." },
    render: () => (
        <div className="max-w-lg">
            <CVSubmissionForm
                isUploading={false}
                isProcessing={false}
                uploadProgress={0}
                uploadedFileName={null}
                uploadedS3Key={null}
                {...handlers}
            />
        </div>
    ),
}

/** UPLOADING: `isUploading` + `uploadProgress` → thanh tiến độ đang chạy (upload S3 do parent lo). */
export const Uploading: Story = {
    parameters: { usage: "Uploading: isUploading + uploadProgress → thanh tiến độ chạy." },
    render: () => (
        <div className="max-w-lg">
            <CVSubmissionForm
                isUploading
                isProcessing={false}
                uploadProgress={45}
                uploadedFileName="nguyen-van-a-cv.pdf"
                uploadedS3Key={null}
                {...handlers}
            />
        </div>
    ),
}

/** UPLOADED: có `uploadedFileName` + `uploadedS3Key`, hết uploading → sẵn sàng bấm xử lý (`onProcess`). */
export const Uploaded: Story = {
    parameters: { usage: "Uploaded: có file + S3 key, hết uploading → sẵn sàng bấm xử lý (onProcess)." },
    render: () => (
        <div className="max-w-lg">
            <CVSubmissionForm
                isUploading={false}
                isProcessing={false}
                uploadProgress={100}
                uploadedFileName="nguyen-van-a-cv.pdf"
                uploadedS3Key="cv/nguyen-van-a-cv.pdf"
                {...handlers}
            />
        </div>
    ),
}

/** PROCESSING: `isProcessing` → backend đang phân tích CV đã upload. */
export const Processing: Story = {
    parameters: { usage: "Processing: isProcessing → backend đang phân tích CV đã upload." },
    render: () => (
        <div className="max-w-lg">
            <CVSubmissionForm
                isUploading={false}
                isProcessing
                uploadProgress={100}
                uploadedFileName="nguyen-van-a-cv.pdf"
                uploadedS3Key="cv/nguyen-van-a-cv.pdf"
                {...handlers}
            />
        </div>
    ),
}
