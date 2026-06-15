"use client"

import React from "react"
import {
    Button,
    Card,
    CardContent,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"

/** Props for {@link ReviewLevelCard}. */
export interface ReviewLevelCardProps {
    /** Title of the selected rubric template (if any). */
    templateTitle?: string | null
    /** Description of the selected rubric template (if any). */
    templateDescription?: string | null
    /** Whether the update action is disabled (submitting/loading). */
    isUpdateDisabled: boolean
    /** Fired when the user wants to open the rubric level details / picker modal. */
    onOpenReviewLevelDetails: () => void
}

/**
 * Rubric review-level card: selected template title/description + update action.
 *
 * Presentational: renders the provided template metadata, no logic.
 * @param props - {@link ReviewLevelCardProps}
 */
export const ReviewLevelCard = ({
    templateTitle,
    templateDescription,
    isUpdateDisabled,
    onOpenReviewLevelDetails,
}: ReviewLevelCardProps) => {
    const t = useTranslations()
    return (
        <div>
            <div className="mb-3 text-base font-semibold">{t("cv.submission.reviewLevelLabel")}</div>
            <Card className="w-full shadow-none">
                <CardContent>
                    <div className="mb-2">{templateTitle}</div>
                    <div className="text-sm text-muted">
                        {templateDescription}
                    </div>
                </CardContent>
            </Card>
            <div className="h-3" />
            <Button
                variant="secondary"
                isDisabled={isUpdateDisabled}
                onPress={onOpenReviewLevelDetails}
            >
                {t("cv.submission.reviewLevelUpdate")}
            </Button>
        </div>
    )
}
