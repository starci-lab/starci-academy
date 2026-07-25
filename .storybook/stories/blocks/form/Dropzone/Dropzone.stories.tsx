import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Dropzone } from "@sb-components/blocks/form/Dropzone/Dropzone"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Dropzone> = {
    title: "Primitives/Forms/Dropzone",
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
            showAnatomy
        />
    )
}

const cvFile = new File(["nội dung CV mẫu"], "cv-nguyen-van-a.pdf", { type: "application/pdf" })

const HINT = "Kéo-thả hoặc bấm để chọn file CV (PDF, tối đa 5MB)"
const ACCEPT = ["application/pdf"]
const MAX = 5 * 1024 * 1024

/**
 * ANATOMY IS PER-LEAF: every story below wraps its render in its OWN BlockAnatomy
 * axis. `Dropzone` is hand-rolled (deliberately NOT `FieldShell` — see the
 * component's own note) but still composes a `DropBox` (the dashed drag surface:
 * icon + hint/filename, undrilled) plus an optional `ErrorMessage` line below.
 */
const BOX_PARTS: Array<AnatomyNode> = [
    { name: "DropBox", tier: "primitive", role: "khung nét đứt kéo-thả (icon + hint/tên file)" },
]
const ERROR_PARTS: Array<AnatomyNode> = [
    { name: "DropBox", tier: "primitive", role: "khung nét đứt, viền đỏ khi có lỗi" },
    { name: "ErrorMessage", tier: "primitive", role: "dòng lỗi validation dưới khung" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "primitive", role: "mirror khung nét đứt lúc chưa sẵn sàng", state: "skeleton" },
]

/** Empty: default state on entering a form — the drop area shows the hint, no file picked. */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Dropzone"
                tier="primitive"
                leaf="Empty"
                parts={BOX_PARTS}
                reason="Ô kéo-thả file, không phải FieldShell có label — hint render NGAY TRONG khung như placeholder, thay bằng tên file khi đã chọn."
            >
                <Controlled hint={HINT} acceptedMimeTypes={ACCEPT} maxSizeInBytes={MAX} />
            </BlockAnatomy>
        </div>
    ),
}

/** WithFile: after a successful drop/pick, the file name replaces the hint line. */
export const WithFile: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Dropzone"
                tier="primitive"
                leaf="WithFile"
                parts={BOX_PARTS}
                note="file != null → DropBox hiện tên file thay hint, cùng composition."
            >
                <Controlled hint={HINT} initialFile={cvFile} acceptedMimeTypes={ACCEPT} maxSizeInBytes={MAX} />
            </BlockAnatomy>
        </div>
    ),
}

/** Error: wrong mime type or over the size cap — the border goes danger and an error line appears below. */
export const Error: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Dropzone"
                tier="primitive"
                leaf="Error"
                parts={ERROR_PARTS}
                note="errorMessage → thêm node ErrorMessage dưới DropBox, viền DropBox chuyển đỏ."
            >
                <Controlled
                    hint={HINT}
                    errorMessage="File vượt quá 5MB hoặc không đúng định dạng PDF — vui lòng chọn file khác."
                    acceptedMimeTypes={ACCEPT}
                    maxSizeInBytes={MAX}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Skeleton: loading placeholder mirroring the dashed drop box's shape/rounding. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Dropzone"
                tier="primitive"
                leaf="Skeleton"
                parts={SKELETON_PARTS}
                note="isSkeleton → một khối Skeleton duy nhất mirror kích thước DropBox, chưa tách DropBox/ErrorMessage."
            >
                <Dropzone
                    isSkeleton
                    hint={HINT}
                    file={null}
                    acceptedMimeTypes={ACCEPT}
                    maxSizeInBytes={MAX}
                    onChange={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
