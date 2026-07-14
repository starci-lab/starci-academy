"use client"

import React, {
    useMemo,
} from "react"
import {
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import { useCvReviewLevelDetailsOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setSelectedCvReviewTemplateId } from "@/redux/slices/cv-review-level"
import { WithClassNames } from "@/modules/types/base/class-name"
import { ModalShell } from "@/components/blocks/layout/ModalShell"
import { SelectableCardGroup, SelectableCardItem } from "@/components/blocks/navigation/SelectableCardGroup"

/**
 * One selectable CV rubric template row in the modal.
 */
interface CvReviewLevelOption {
    /** `template_cvs.id`. */
    id: string
    /** Template title shown to the learner. */
    title: string
    /** Template description shown under the title. */
    description?: string | null
}

/** Props for {@link CvReviewLevelDetailsModal}. */
type CvReviewLevelDetailsModalProps = WithClassNames<undefined>

/**
 * Lets the learner choose a CV review level from template title and description.
 */
export const CvReviewLevelDetailsModal = ({ className }: CvReviewLevelDetailsModalProps = {}) => {
    const {
        isOpen,
        setOpen,
    } = useCvReviewLevelDetailsOverlayState()
    const dispatch = useAppDispatch()
    const selectedTemplateId = useAppSelector((state) => state.cvReviewLevel.selectedTemplateId)
    const templateCvsRows = useAppSelector((state) => state.templateCvs.rows)
    const t = useTranslations()

    const reviewLevelOptions = useMemo<Array<CvReviewLevelOption>>(
        () =>
            templateCvsRows.map((row) => ({
                id: row.id,
                title: row.title,
                description: row.description,
            })),
        [
            templateCvsRows,
        ],
    )

    const handleSelectReviewLevel = (templateId: string) => {
        dispatch(setSelectedCvReviewTemplateId(templateId))
        setOpen(false)
    }

    const cardItems = useMemo<Array<SelectableCardItem<string>>>(
        () => reviewLevelOptions.map((option) => ({
            value: option.id,
            label: option.title,
            description: option.description?.trim() || t("cv.submission.reviewLevelDetails.emptyDescription"),
        })),
        [
            reviewLevelOptions,
            t,
        ],
    )

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={className}
            size="md"
            header={(
                <>
                    <Typography className="font-semibold">
                        {t("cv.submission.reviewLevelDetails.selectionTitle")}
                    </Typography>
                    <Typography type="body-xs" color="muted">
                        {t("cv.submission.reviewLevelDetails.subtitle")}
                    </Typography>
                </>
            )}
            bodyClassName="flex flex-col gap-6"
        >
            <div className="max-h-[60vh] overflow-y-auto">
                <SelectableCardGroup
                    items={cardItems}
                    value={selectedTemplateId}
                    onChange={handleSelectReviewLevel}
                    ariaLabel={t("cv.submission.reviewLevelDetails.selectionTitle")}
                    columns={1}
                />
            </div>
        </ModalShell>
    )
}
