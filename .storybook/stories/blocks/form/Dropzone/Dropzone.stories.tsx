import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Dropzone } from "./Dropzone"

const meta: Meta<typeof Dropzone> = {
    title: "Primitives/Form/Dropzone",
    component: Dropzone,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Dropzone>

/** Local controlled wrapper — holds `file` so drag-drop / click-to-pick runs for real on the canvas. */
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
    const [file, setFile] = useState<File | null>(initialFile)
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

const HINT = "Kéo-thả hoặc bấm để chọn file CV (PDF, tối đa 5MB)"
const ACCEPT = ["application/pdf"]
const MAX = 5 * 1024 * 1024

/** Empty: default state on entering a form — the drop area shows the hint, no file picked. */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <Controlled hint={HINT} acceptedMimeTypes={ACCEPT} maxSizeInBytes={MAX} />
        </div>
    ),
}

/** WithFile: after a successful drop/pick, the file name replaces the hint line. */
export const WithFile: Story = {
    render: () => (
        <div className="p-8">
            <Controlled hint={HINT} initialFile={cvFile} acceptedMimeTypes={ACCEPT} maxSizeInBytes={MAX} />
        </div>
    ),
}

/** Error: wrong mime type or over the size cap — the border goes danger and an error line appears below. */
export const Error: Story = {
    render: () => (
        <div className="p-8">
            <Controlled
                hint={HINT}
                errorMessage="File vượt quá 5MB hoặc không đúng định dạng PDF — vui lòng chọn file khác."
                acceptedMimeTypes={ACCEPT}
                maxSizeInBytes={MAX}
            />
        </div>
    ),
}
