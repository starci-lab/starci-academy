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
import type { ModelProvider } from "@/modules/api/graphql/queries/query-my-ai-settings"
import type { CvBlock } from "../../types"
import { CvTextOrFileInput } from "../shared/CvTextOrFileInput"
import { useMutateTailorCvBlocksSwr } from "@/hooks/swr/api/graphql/mutations/useMutateTailorCvBlocksSwr"

/** Props for {@link CvTailorToJobModal}. */
export interface CvTailorToJobModalProps extends WithClassNames<undefined> {
    /** Whether the modal is open. */
    isOpen: boolean
    /** Fired when the modal should open/close. */
    onOpenChange: (isOpen: boolean) => void
    /** The current draft's blocks — sent as-is to be adjusted toward the job description. */
    blocks: Array<CvBlock>
    /** The currently-picked grading model (Auto lane = both null). */
    selectedModel: string | null
    /** Provider of {@link selectedModel} (Auto lane = null). */
    selectedModelProvider: ModelProvider | null
    /**
     * Fired with the AI-adjusted blocks once `tailorCvBlocks` resolves — the
     * caller loads them straight into the active document (then autosaves like
     * any other edit; this call itself does NOT persist anything).
     */
    onTailored: (blocks: Array<CvBlock>) => void
}

/**
 * "Chỉnh theo tin tuyển dụng" entry point — a modal with a job-description
 * textarea that calls `tailorCvBlocks` (AI adjustment, not persisted) and
 * hands the adjusted blocks back to the caller to load into the editor.
 *
 * @param props - {@link CvTailorToJobModalProps}
 */
export const CvTailorToJobModal = ({
    className,
    isOpen,
    onOpenChange,
    blocks,
    selectedModel,
    selectedModelProvider,
    onTailored,
}: CvTailorToJobModalProps) => {
    const t = useTranslations()
    const [jobDescription, setJobDescription] = useState("")
    const [hasError, setHasError] = useState(false)
    const [isExtracting, setIsExtracting] = useState(false)
    const { trigger: tailorBlocks, isMutating } = useMutateTailorCvBlocksSwr()

    const onSubmit = async () => {
        if (!jobDescription.trim()) {
            return
        }
        setHasError(false)
        try {
            const result = await tailorBlocks({
                blocks,
                jobDescription,
                selectedModel,
                selectedModelProvider,
            })
            const tailoredBlocks = result.data?.tailorCvBlocks?.data?.blocks
            if (tailoredBlocks) {
                onTailored(tailoredBlocks)
                setJobDescription("")
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
                                {t("cv.builder.tailorModalTitle")}
                            </Typography>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="flex flex-col gap-3">
                                <Typography type="body-sm" color="muted">
                                    {t("cv.builder.tailorModalDescription")}
                                </Typography>

                                <CvTextOrFileInput
                                    fieldId="cv-tailor-job-description"
                                    label={t("cv.builder.tailorModalFieldLabel")}
                                    placeholder={t("cv.builder.tailorModalPlaceholder")}
                                    value={jobDescription}
                                    onChange={setJobDescription}
                                    onExtractingChange={setIsExtracting}
                                />

                                {hasError ? (
                                    <Typography type="body-sm" className="text-danger">
                                        {t("cv.builder.tailorModalError")}
                                    </Typography>
                                ) : null}

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-fit self-end"
                                    isDisabled={!jobDescription.trim() || isMutating || isExtracting}
                                    onPress={onSubmit}
                                >
                                    <SparkleIcon aria-hidden className="size-4" />
                                    {isMutating
                                        ? t("cv.builder.tailorModalSubmitting")
                                        : t("cv.builder.tailorModalSubmit")}
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
