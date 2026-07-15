"use client"

import React, { useState } from "react"
import {
    Button,
    Modal,
    Typography,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { SparkleIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { CvBlock } from "../../types"
import { CvTextOrFileInput } from "../shared/CvTextOrFileInput"
import { useMutateSplitCvFromTextSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSplitCvFromTextSwr"

/** Props for {@link CvSplitFromTextModal}. */
export interface CvSplitFromTextModalProps extends WithClassNames<undefined> {
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
 * "Dán CV có sẵn" entry point — a modal with a raw-text textarea that calls
 * `splitCvFromText` (AI ingest, not persisted) and hands the parsed blocks
 * back to the caller to load into the editor.
 *
 * @param props - {@link CvSplitFromTextModalProps}
 */
export const CvSplitFromTextModal = ({ className, isOpen, onOpenChange, onSplit }: CvSplitFromTextModalProps) => {
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
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog className={cn(className)}>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Typography type="body" weight="semibold" className="pr-8">
                                {t("cv.builder.splitModalTitle")}
                            </Typography>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="flex flex-col gap-3">
                                <Typography type="body-sm" color="muted">
                                    {t("cv.builder.splitModalDescription")}
                                </Typography>

                                <CvTextOrFileInput
                                    fieldId="cv-split-text"
                                    label={t("cv.builder.splitModalFieldLabel")}
                                    placeholder={t("cv.builder.splitModalPlaceholder")}
                                    value={text}
                                    onChange={setText}
                                    onExtractingChange={setIsExtracting}
                                />

                                {hasError ? (
                                    <Typography type="body-sm" className="text-danger-soft-foreground">
                                        {t("cv.builder.splitModalError")}
                                    </Typography>
                                ) : null}

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-fit self-end"
                                    isDisabled={!text.trim() || isMutating || isExtracting}
                                    onPress={onSubmit}
                                >
                                    <SparkleIcon aria-hidden className="size-4" />
                                    {isMutating ? t("cv.builder.splitModalSubmitting") : t("cv.builder.splitModalSubmit")}
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
