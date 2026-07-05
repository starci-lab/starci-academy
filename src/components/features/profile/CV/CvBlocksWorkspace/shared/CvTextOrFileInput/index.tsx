"use client"

import React, { useCallback, useMemo, useState } from "react"
import axios from "axios"
import {
    Spinner,
    TextArea,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { Dropzone } from "@/components/reuseable/Dropzone"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { sleep } from "@/modules/utils/misc"
import { useMutateGenerateSubmitCvPresignUrlSwr } from "@/hooks/swr/api/graphql/mutations/useMutateGenerateSubmitCvPresignUrlSwr"
import { useMutateExtractDocumentTextSwr } from "@/hooks/swr/api/graphql/mutations/useMutateExtractDocumentTextSwr"

/** MIME types the upload mode accepts (mirrors the BE `extractCvText`: pdf-parse / mammoth / utf-8 fallback). */
const ACCEPTED_MIME_TYPES: ReadonlyArray<string> = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
]

/** Max upload size in bytes (10MB — mirrors the legacy CV-upload ceiling). */
const MAX_SIZE_IN_BYTES = 10 * 1024 * 1024

/** Which input method is active. */
type InputMode = "paste" | "upload"

/** Props for {@link CvTextOrFileInput}. */
export interface CvTextOrFileInputProps extends WithClassNames<undefined> {
    /** The text value both modes ultimately produce (paste = typed, upload = extracted). */
    value: string
    /** Fired with the new text (typed directly, or extracted from an uploaded file). */
    onChange: (text: string) => void
    /** Field id for the paste `<Label htmlFor>`. */
    fieldId: string
    /** Label above the paste textarea. */
    label: string
    /** Placeholder inside the paste textarea. */
    placeholder: string
    /** Fired whenever an upload is in-flight so the parent can disable submit. */
    onExtractingChange?: (isExtracting: boolean) => void
}

/**
 * A shared "paste text OR upload a file" input — the two ways to feed the same
 * text payload into `splitCvFromText` (a CV) or `tailorCvBlocks` (a job
 * description). A `SegmentedControl` switches modes: paste = a plain textarea;
 * upload = a `Dropzone` (PDF / DOCX / TXT, 10MB) that presigns → PUTs the file
 * to storage → calls `extractDocumentText` server-side → writes the extracted
 * text back into `value` AND flips to paste mode so the user reviews/edits it
 * before submitting. Both modals reuse this so the pattern stays identical
 * (only the labels + downstream mutation differ).
 *
 * @param props - {@link CvTextOrFileInputProps}
 */
export const CvTextOrFileInput = ({
    className,
    value,
    onChange,
    fieldId,
    label,
    placeholder,
    onExtractingChange,
}: CvTextOrFileInputProps) => {
    const t = useTranslations()
    const [mode, setMode] = useState<InputMode>("paste")
    const [file, setFile] = useState<File | null>(null)
    const [isExtracting, setIsExtracting] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const { trigger: presign } = useMutateGenerateSubmitCvPresignUrlSwr()
    const { trigger: extractDocumentText } = useMutateExtractDocumentTextSwr()

    const setExtracting = useCallback((next: boolean) => {
        setIsExtracting(next)
        onExtractingChange?.(next)
    }, [onExtractingChange])

    const onFileSelected = useCallback(async (selected: File | null) => {
        setFile(selected)
        setUploadError(null)
        if (!selected) {
            return
        }
        if (selected.size > MAX_SIZE_IN_BYTES) {
            setUploadError(t("cv.builder.uploadTooLarge"))
            return
        }
        setExtracting(true)
        try {
            // 1) presign a PUT URL + object key
            const presignResult = await presign({ request: { fileName: selected.name } })
            const presignData = presignResult.data?.generateSubmitCvPresignUrl?.data
            if (!presignData?.url || !presignData.cdnKey) {
                throw new Error("presign failed")
            }
            // 2) PUT the raw file to storage
            const contentType = selected.type || "application/octet-stream"
            const putResult = await axios.put(presignData.url, selected, {
                headers: { "Content-Type": contentType },
            })
            if (putResult.status !== 200) {
                throw new Error(`upload failed (${putResult.status})`)
            }
            // 3) wait for storage to propagate, then extract text server-side
            await sleep(1000)
            const extractResult = await extractDocumentText({ cdnKey: presignData.cdnKey })
            const text = extractResult.data?.extractDocumentText?.data?.text
            if (!text) {
                throw new Error("extraction empty")
            }
            // load the extracted text into the shared value + flip to paste so the
            // user reviews/edits it before submitting
            onChange(text)
            setMode("paste")
            setFile(null)
        } catch {
            setUploadError(t("cv.builder.uploadFailed"))
        } finally {
            setExtracting(false)
        }
    }, [presign, extractDocumentText, onChange, setExtracting, t])

    const modeTabs = useMemo(() => ({
        items: [
            { key: "paste", label: t("cv.builder.inputModePaste") },
            { key: "upload", label: t("cv.builder.inputModeUpload") },
        ],
        selectedKey: mode,
        ariaLabel: t("cv.builder.inputModeAria"),
        onSelectionChange: (key: React.Key) => setMode(String(key) as InputMode),
    }), [mode, t])

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {/* TabsCard pattern: mode tabs float above; the field sits DIRECTLY below
                (no outer <Card> — the modal is already a surface, so wrapping the field
                in another card = card-in-card). No field <Label> (tab labels the mode). */}
            <TabsCard leftTabs={modeTabs} />
            {mode === "paste" ? (
                <TextField variant="secondary" className="w-full">
                    <TextArea
                        id={fieldId}
                        aria-label={label}
                        rows={10}
                        className="resize-none"
                        placeholder={placeholder}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                    />
                </TextField>
            ) : (
                <div className="flex flex-col gap-2">
                    <Dropzone
                        hint={t("cv.builder.uploadHint")}
                        file={file}
                        acceptedMimeTypes={[...ACCEPTED_MIME_TYPES]}
                        maxSizeInBytes={MAX_SIZE_IN_BYTES}
                        errorMessage={uploadError ?? undefined}
                        onChange={onFileSelected}
                    />
                    {isExtracting ? (
                        <div className="flex items-center gap-2">
                            <Spinner />
                            <Typography type="body-sm" color="muted">
                                {t("cv.builder.uploadExtracting")}
                            </Typography>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}
