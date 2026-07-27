import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Dropzone } from "@sb-components/atoms/forms/Dropzone/Dropzone"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Skeleton` — heroui's OWN component (imported `Skeleton as HeroSkeleton` and
 * rendered directly in the `isSkeleton` branch), so it enters the tree as tier
 * `heroui` with no `storyId` (§ two-law pass, 2026-07-28). The drag box and the
 * error line are no longer badged at all (2026-07-28 orphan-part pass) — they're
 * plain hand-rolled `<div>`s, not a real component, and a badge that can never be
 * declared is worse than no badge.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Skeleton": { tier: "heroui", role: "loading placeholder box" },
}

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
 *
 * Mỗi leaf dưới đây có ĐÚNG một state trong `states[]` (thầy chốt bố cục C,
 * 2026-07-27) — atom-tier vẫn 1 prop = 1 leaf, chỉ đổi chỗ chứa render/why/code.
 */

/** Baseline: entering a form, the drop area shows the hint, no file picked yet. */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Dropzone"
                tier="atom"
                leaf="Empty"
                reason="This is a drag-drop box rather than a labeled field, so the hint text renders as placeholder content inside the box itself. That single spot is also where the file name lands once one is picked, so the box never needs a second line to confirm the pick."
                states={[
                    {
                        name: "file = null",
                        why: "The dashed box shows only the hint line, with no file name and no error text present. This is the first thing a learner sees before touching the field, so the copy has to explain what to drop and which format is accepted.",
                        code: "<Dropzone hint=\"PDF or DOCX, up to 5MB\" acceptedMimeTypes={[…]} maxSizeInBytes={…} />",
                        render: <Controlled hint={HINT} acceptedMimeTypes={ACCEPT} maxSizeInBytes={MAX} />,
                    },
                ]}
            />
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
                states={[
                    {
                        name: "file != null",
                        why: "The hint line is swapped for the picked file's name, in the exact same spot and with the same box around it. Showing the real file name confirms the pick succeeded without adding a second confirmation element next to the box.",
                        code: "<Dropzone file={cvFile} hint=\"PDF or DOCX, up to 5MB\" />",
                        render: <Controlled hint={HINT} initialFile={cvFile} acceptedMimeTypes={ACCEPT} maxSizeInBytes={MAX} />,
                    },
                ]}
            />
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
                states={[
                    {
                        name: "errorMessage != null",
                        why: "The box border switches to the danger tone and an error line appears directly beneath it. Naming the exact problem right at the field, wrong type or over the size cap, lets the learner fix the file without guessing what went wrong.",
                        code: "<Dropzone errorMessage=\"File is larger than 5MB\" hint=\"PDF or DOCX, up to 5MB\" />",
                        render: (
                            <Controlled
                                hint={HINT}
                                errorMessage="File is over 5 MB or not a PDF — please choose a different file."
                                acceptedMimeTypes={ACCEPT}
                                maxSizeInBytes={MAX}
                            />
                        ),
                    },
                ]}
            />
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
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton",
                        why: "The whole box collapses into a single shimmer block sized to the dashed box's shape, with no hint text and no error line drawn. Keeping the rest to one simple shape avoids mirroring a box and an error line that might never even appear.",
                        code: "<Dropzone isSkeleton />",
                        render: (
                            <Dropzone
                                isSkeleton
                                hint={HINT}
                                file={null}
                                acceptedMimeTypes={ACCEPT}
                                maxSizeInBytes={MAX}
                                onValueChange={() => {}}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
