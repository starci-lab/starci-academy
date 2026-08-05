"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { useCvReviewLevelDetailsOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setSelectedCvReviewTemplateId } from "@/redux/slices/cv-review-level"
import { _CvReviewLevelDetailsModal, type CvReviewLevelOption } from "./component"

/**
 * CV review level modal — the CONNECTED half: reads the overlay open-state
 * ({@link useCvReviewLevelDetailsOverlayState}) plus the rubric template rows
 * and the currently selected id (redux), resolves every label, and hands
 * everything to the presentational {@link _CvReviewLevelDetailsModal}.
 * Mounted prop-less by `ModalContainer`. See `tiers/split.md`.
 */
export const CvReviewLevelDetailsModal = () => {
    const { isOpen, setOpen } = useCvReviewLevelDetailsOverlayState()
    const dispatch = useAppDispatch()
    const selectedTemplateId = useAppSelector((state) => state.cvReviewLevel.selectedTemplateId)
    const templateCvsRows = useAppSelector((state) => state.templateCvs.rows)
    const t = useTranslations()

    const options = useMemo<Array<CvReviewLevelOption>>(
        () =>
            templateCvsRows.map((row) => ({
                id: row.id,
                title: row.title,
                description: row.description?.trim() || t("cv.submission.reviewLevelDetails.emptyDescription"),
            })),
        [
            templateCvsRows,
            t,
        ],
    )

    /** Select a rubric template, then close the modal. */
    const handleSelectReviewLevel = (templateId: string) => {
        dispatch(setSelectedCvReviewTemplateId(templateId))
        setOpen(false)
    }

    return (
        <_CvReviewLevelDetailsModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            selectedTemplateId={selectedTemplateId}
            options={options}
            onSelect={handleSelectReviewLevel}
            labels={{
                selectionTitle: t("cv.submission.reviewLevelDetails.selectionTitle"),
                subtitle: t("cv.submission.reviewLevelDetails.subtitle"),
            }}
        />
    )
}
