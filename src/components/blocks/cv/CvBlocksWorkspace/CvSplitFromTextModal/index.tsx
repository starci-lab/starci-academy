"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { SparkleIcon } from "@phosphor-icons/react"
import type { CvBlock } from "@/modules/types/entities/cv"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { StackV } from "@/components/frames/Stack"
import { CvTextOrFileInput } from "../shared/CvTextOrFileInput"
import { useMutateSplitCvFromTextSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSplitCvFromTextSwr"

/** Props for {@link CvSplitFromTextModal}. */
export interface CvSplitFromTextModalProps {
    /** Whether the modal is open. */
    isOpen: boolean
    /** Fired when the modal should open/close. */
    onOpenChange: (isOpen: boolean) => void
    /**
     * Fired with the AI-parsed blocks once `splitCvFromText` resolves — the
     * caller loads them straight into the active document (then autosaves
     * like any other edit; this call itself does NOT persist anything).
     */
    onSplit: (blocks: Array<CvBlock>) => void
}

/**
 * "Paste an existing CvGalleryPage" entry point — a modal with a raw-text textarea that calls
 * `splitCvFromText` (AI ingest, not persisted) and hands the parsed blocks
 * back to the caller to load into the editor.
 *
 * @param props - {@link CvSplitFromTextModalProps}
 */
export const CvSplitFromTextModal = ({ isOpen, onOpenChange, onSplit }: CvSplitFromTextModalProps) => {
    const t = useTranslations()
    const [text, setText] = useState("")
    const [hasError, setHasError] = useState(false)
    const [isExtracting, setIsExtracting] = useState(false)
    const { trigger: splitFromText, isMutating } = useMutateSplitCvFromTextSwr()

    const onSubmit = async () => {
        if (!text.trim()) {
            return
        }
        setHasError(false)
        try {
            const result = await splitFromText({ text })
            const blocks = result.data?.splitCvFromText?.data?.blocks
            if (blocks) {
                onSplit(blocks)
                setText("")
                onOpenChange(false)
            } else {
                setHasError(true)
            }
        } catch {
            setHasError(true)
        }
    }

    return (
        <ModalShell
            identity={{ tier: "block", component: "CvSplitFromTextModal" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("cv.builder.splitModalTitle")}
            size="lg"
            body={() => (
                <StackV
                    principle="group-boundary"
                    explain="Section group spacing — not sibling-stack, because description, input, error, and submit are distinct groups rather than same-kind peers."
                    items={[
                        () => (
                            <Typography
                                size="sm"
                                color="muted"
                                text={t("cv.builder.splitModalDescription")}
                            />
                        ),
                        () => (
                            <CvTextOrFileInput
                                fieldId="cv-split-text"
                                label={t("cv.builder.splitModalFieldLabel")}
                                placeholder={t("cv.builder.splitModalPlaceholder")}
                                value={text}
                                onChange={setText}
                                onExtractingChange={setIsExtracting}
                            />
                        ),
                        ...(hasError
                            ? [
                                () => (
                                    <Typography
                                        size="sm"
                                        color="danger"
                                        text={t("cv.builder.splitModalError")}
                                    />
                                ),
                            ]
                            : []),
                    ]}
                />
            )}
            footer={() => (
                <Button
                    variant="primary"
                    size="lg"
                    prefixIcon={SparkleIcon}
                    label={isMutating ? t("cv.builder.splitModalSubmitting") : t("cv.builder.splitModalSubmit")}
                    isDisabled={!text.trim() || isMutating || isExtracting}
                    onPress={onSubmit}
                />
            )}
        />
    )
}
