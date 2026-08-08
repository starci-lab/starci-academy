"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { SparkleIcon } from "@phosphor-icons/react"
import type { ModelProvider } from "@/modules/api/graphql/queries/query-my-ai-settings"
import type { CvBlock } from "@/modules/types/entities/cv"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { StackV } from "@/components/frames/Stack"
import { CvTextOrFileInput } from "../shared/CvTextOrFileInput"
import { useMutateTailorCvBlocksSwr } from "@/hooks/swr/api/graphql/mutations/useMutateTailorCvBlocksSwr"

/** Props for {@link CvTailorToJobModal}. */
export interface CvTailorToJobModalProps {
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
 * "Tailor to job posting" entry point — a modal with a job-description
 * textarea that calls `tailorCvBlocks` (AI adjustment, not persisted) and
 * hands the adjusted blocks back to the caller to load into the editor.
 *
 * @param props - {@link CvTailorToJobModalProps}
 */
export const CvTailorToJobModal = ({
    isOpen,
    onOpenChange,
    blocks,
    selectedModel,
    selectedModelProvider,
    onTailored}: CvTailorToJobModalProps) => {
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
        <ModalShell
            identity={{ tier: "block", component: "CvTailorToJobModal" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={t("cv.builder.tailorModalTitle")}
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
                                text={t("cv.builder.tailorModalDescription")}
                            />
                        ),
                        () => (
                            <CvTextOrFileInput
                                fieldId="cv-tailor-job-description"
                                label={t("cv.builder.tailorModalFieldLabel")}
                                placeholder={t("cv.builder.tailorModalPlaceholder")}
                                value={jobDescription}
                                onChange={setJobDescription}
                                onExtractingChange={setIsExtracting}
                            />
                        ),
                        ...(hasError
                            ? [
                                () => (
                                    <Typography
                                        size="sm"
                                        color="danger"
                                        text={t("cv.builder.tailorModalError")}
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
                    label={
                        isMutating
                            ? t("cv.builder.tailorModalSubmitting")
                            : t("cv.builder.tailorModalSubmit")
                    }
                    isDisabled={!jobDescription.trim() || isMutating || isExtracting}
                    onPress={onSubmit}
                />
            )}
        />
    )
}
