"use client"

import React, {
    useId,
    useMemo,
} from "react"

/**
 * One rubric level row shown in the review level picker trigger.
 */
type CvReviewLevelFieldOption = {
    /** `template_cvs.id`. */
    id: string
    /** Visible title for this rubric level. */
    title: string
}

interface CvReviewLevelFieldProps {
    /** Accessible label text (already translated). */
    labelText: string
    /** Placeholder on the trigger when there is no selection yet. */
    placeholderText: string
    /** Available rubric templates from `templateCvs`. */
    options: Array<CvReviewLevelFieldOption>
    /** Currently selected `template_cvs.id`, or empty string when none. */
    value: string
    /** Opens the review-level picker modal. */
    onOpen: () => void
    /** Disables the control (e.g. while a review request is in flight). */
    isDisabled: boolean
    /** Shows a loading state on the control. */
    isLoading: boolean
}

/**
 * Button field that opens the CV rubric level picker modal.
 *
 * @param props.labelText — Screen-reader visible label.
 * @param props.placeholderText — Placeholder when there is no selected option.
 * @param props.options — Rubric rows returned by `templateCvs`.
 * @param props.value — Selected template id.
 * @param props.onOpen — Opens the picker modal.
 * @param props.isDisabled — Disables interaction.
 * @param props.isLoading — Loading UI state.
 */
export const CvReviewLevelField = (props: CvReviewLevelFieldProps) => {
    const {
        labelText,
        placeholderText,
        options,
        value,
        onOpen,
        isDisabled,
        isLoading,
    } = props

    const buttonId = useId()

    const selectedOption = useMemo(
        () => options.find((opt) => opt.id === value) ?? null,
        [
            options,
            value,
        ],
    )

    return (
        <div className="flex max-w-md flex-col gap-2">
            <label
                className="text-sm font-medium text-foreground"
                htmlFor={buttonId}
            >
                {labelText}
            </label>
            <button
                id={buttonId}
                type="button"
                className="border-divider bg-content1 text-foreground focus-visible:ring-accent flex h-10 w-full items-center justify-between rounded-medium border px-3 text-left text-sm outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDisabled || isLoading}
                onClick={onOpen}
            >
                <span className={selectedOption ? "truncate" : "truncate text-foreground-500"}>
                    {selectedOption?.title ?? placeholderText}
                </span>
                <span aria-hidden="true">v</span>
            </button>
        </div>
    )
}
