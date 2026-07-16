import type { Meta, StoryObj } from "@storybook/nextjs"

import { CVSubmissionForm } from "@/components/reuseable/CVSubmissionForm"
import { handlers } from "./components"

const meta: Meta<typeof CVSubmissionForm> = {
    title: "Core/Form/CVSubmissionForm",
    component: CVSubmissionForm,
}

export default meta

type Story = StoryObj<typeof CVSubmissionForm>

/** READY: no file selected yet — Formik + CV picker field, progress at 0. A purely presentational form; upload/process state is passed down by the parent via props. */
export const Default: Story = {
    parameters: { usage: "Ready: no file selected. Purely presentational form — the parent passes upload/process state + handlers." },
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

/** UPLOADING: `isUploading` + `uploadProgress` → the progress bar animates (the S3 upload is handled by the parent). */
export const Uploading: Story = {
    parameters: { usage: "Uploading: isUploading + uploadProgress → the progress bar animates." },
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

/** UPLOADED: `uploadedFileName` + `uploadedS3Key` present, uploading finished → ready to trigger processing (`onProcess`). */
export const Uploaded: Story = {
    parameters: { usage: "Uploaded: file + S3 key present, uploading finished → ready to trigger processing (onProcess)." },
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

/** PROCESSING: `isProcessing` → the backend is analyzing the uploaded CV. */
export const Processing: Story = {
    parameters: { usage: "Processing: isProcessing → the backend is analyzing the uploaded CV." },
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
