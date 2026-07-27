import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Dropzone } from "@sb-components/atoms/forms/Dropzone/Dropzone"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Dropzone> = {
    title: "Atoms/Forms/Dropzone",
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
            onValueChange={setFile}
            showAnatomy
        />
    )
}

const cvFile = new File(["sample resume content"], "jane-doe-resume.pdf", { type: "application/pdf" })

const HINT = "Drag and drop, or click to choose a resume file (PDF, up to 5 MB)"
const ACCEPT = ["application/pdf"]
const MAX = 5 * 1024 * 1024

/**
 * ATOM — `Dropzone`: ô kéo-thả file DUY NHẤT của hệ, hand-rolled (deliberately
 * NOT `FieldShell` — xem note trong component). Không compose atom nào có story
 * riêng ⇒ ATOM LÁ, không có `annotate` (§12 — "atom lá bọc thẳng HeroUI/hand-roll
 * thì bỏ hẳn prop, đừng để `{}`"). `DropBox`/`ErrorMessage`/`Skeleton` chỉ là KHE
 * nội bộ, không phải deps.
 *
 * 📐 Bộ leaf theo §12g — mỗi leaf ứng với MỘT prop có hình: `file` (nội dung
 * trong khung đổi từ hint sang tên file), `errorMessage` (viền đỏ + dòng lỗi),
 * `isSkeleton` (mirror khung lúc chưa sẵn sàng). `hint` luôn có nên nằm sẵn ở
 * leaf trần (`Empty`), không tách leaf riêng.
 */

/** Baseline: entering a form, the drop area shows the hint, no file picked yet. */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Dropzone"
                tier="atom"
                leaf="Empty"
                code={"<Dropzone.Base hint=\"PDF or DOCX, up to 5MB\" acceptedMimeTypes={[…]} maxSizeInBytes={…} />"}
                reason="A drag-drop box, not a labeled field — the hint renders as placeholder text INSIDE the box, replaced by the file name once one is picked."
            >
                <Controlled hint={HINT} acceptedMimeTypes={ACCEPT} maxSizeInBytes={MAX} />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `file` — once a file is picked, its name replaces the hint line. */
export const WithFile: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Dropzone"
                tier="atom"
                leaf="Prop `file`"
                code={"<Dropzone.Base file={cvFile} hint=\"PDF or DOCX, up to 5MB\" />"}
                note="file != null swaps the hint for the file name — same box, same composition, just different content."
            >
                <Controlled hint={HINT} initialFile={cvFile} acceptedMimeTypes={ACCEPT} maxSizeInBytes={MAX} />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `errorMessage` — wrong mime type or over the size cap: border goes danger, an error line appears below. */
export const Error: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Dropzone"
                tier="atom"
                leaf="Prop `errorMessage`"
                code={"<Dropzone.Base errorMessage=\"File is larger than 5MB\" hint=\"PDF or DOCX, up to 5MB\" />"}
                note="Passing errorMessage adds an error line under the box and switches its border to danger."
            >
                <Controlled
                    hint={HINT}
                    errorMessage="File is over 5 MB or not a PDF — please choose a different file."
                    acceptedMimeTypes={ACCEPT}
                    maxSizeInBytes={MAX}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `isSkeleton` — loading placeholder mirroring the dashed box's shape/rounding. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Dropzone"
                tier="atom"
                leaf="Prop `isSkeleton`"
                code={"<Dropzone.Base isSkeleton />"}
                note="isSkeleton swaps in a single shimmer block sized to the dashed box — it does not try to separately mirror the box and the error line."
            >
                <Dropzone
                    isSkeleton
                    hint={HINT}
                    file={null}
                    acceptedMimeTypes={ACCEPT}
                    maxSizeInBytes={MAX}
                    onValueChange={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
