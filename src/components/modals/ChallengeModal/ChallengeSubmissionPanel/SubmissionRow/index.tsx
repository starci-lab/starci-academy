"use client"

import React from "react"
import {
    Button,
    FieldError,
    Input,
    Spinner,
    TextField,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    JobCategory,
} from "@/modules/types"
import {
    PencilLineIcon,
} from "@phosphor-icons/react"
import {
    AIProcessingText,
} from "@/components/reuseable"
import type {
    AiGradableModel,
} from "@/modules/api"
import type {
    ChallengeGradeSelection,
    ChallengeSubmissionRowViewModel,
} from "../types"
import {
    GradeModelDropdown,
} from "../GradeModelDropdown"
import {
    LastAttemptResult,
} from "./LastAttemptResult"

/** Props for {@link SubmissionRow}. */
export interface SubmissionRowProps {
    /** Pre-computed render state for the row. */
    row: ChallengeSubmissionRowViewModel
    /** Fraction of the max score required to pass (0..1). */
    passThreshold: number
    /** Enabled models the grading dropdown can offer. */
    gradeModels: Array<AiGradableModel>
    /** This row's current grading-lane + model selection. */
    gradeSelection: ChallengeGradeSelection
    /** Whether the Premium lane is unlocked for this user. */
    canPremium: boolean
    /** Fired with the new URL value when the input changes. */
    onChangeUrl: (fieldName: string, value: string) => void
    /** Fired when the URL input is blurred (marks it touched). */
    onBlurUrl: (fieldName: string) => void
    /** Fired to submit this row's URL for grading. */
    onSubmit: (submissionId: string, index: number) => void
    /** Fired with this row's new grading selection. */
    onSelectGrade: (submissionId: string, selection: ChallengeGradeSelection) => void
    /** Fired to open the attempt history for this submission. */
    onViewAttempts: (submissionId: string) => void
}

/**
 * One challenge requirement: title, description, URL input, grade/history actions, the
 * active AI-processing panel and the last-attempt result.
 *
 * Presentational: renders the supplied {@link ChallengeSubmissionRowViewModel} and forwards
 * user intents through `onXXX` props; no data fetching or orchestration.
 * @param props - {@link SubmissionRowProps}
 */
export const SubmissionRow = ({
    row,
    passThreshold,
    gradeModels,
    gradeSelection,
    canPremium,
    onChangeUrl,
    onBlurUrl,
    onSubmit,
    onSelectGrade,
    onViewAttempts,
}: SubmissionRowProps) => {
    const t = useTranslations()
    const {
        submission,
        fieldName,
        inputId,
        urlValue,
        iconComponent: IconComponent,
        errorMessage,
        isTouched,
        isPending,
        isInputDisabled,
        isLoading,
        activeJobStatus,
        activeJobError,
        showActiveJob,
        lastAttemptScore,
        maxScore,
    } = row

    return (
        <div className="border-b last:border-b-0 p-3">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-foreground text-base font-semibold">
                    <div>
                        {submission.orderIndex + 1}
                        {". "}
                        {submission.title}
                    </div>
                    {IconComponent ? <IconComponent size={16} /> : null}
                </div>
                <div className="h-2" />
                <div className="text-xs text-muted">
                    {submission.description}
                </div>
                <div className="h-3" />
                <TextField
                    className="w-full"
                    fullWidth
                    isInvalid={!!(isTouched && errorMessage)}
                >
                    <Input
                        variant="secondary"
                        id={inputId}
                        name={fieldName}
                        disabled={isInputDisabled}
                        placeholder={t("challenge.submissionModal.urlPlaceholder")}
                        value={urlValue}
                        onBlur={() => onBlurUrl(fieldName)}
                        onChange={(event) => onChangeUrl(fieldName, event.target.value)}
                    />
                    <FieldError>
                        {typeof errorMessage === "string" && errorMessage.startsWith("challenge.")
                            ? t(errorMessage)
                            : errorMessage}
                    </FieldError>
                </TextField>
                <div className="h-3" />
                {
                    showActiveJob && activeJobStatus !== undefined
                        ? (
                            <AIProcessingText
                                className="mb-3"
                                classNames={{
                                    innerPanel: "bg-overlay",
                                }}
                                jobCategory={JobCategory.SubmitChallenge}
                                jobStatus={activeJobStatus}
                                error={activeJobError}
                            />
                        )
                        : isLoading
                            ? (
                                <div className="mt-3 flex items-center gap-2">
                                    <Spinner />
                                    <div className="text-sm text-muted">
                                        {t("challenge.submissionModal.loading")}
                                    </div>
                                </div>
                            )
                            : null
                }
                <div className="flex flex-col items-start gap-2">
                    {/* grading lane + model picker — small dropdown above the actions */}
                    <GradeModelDropdown
                        models={gradeModels}
                        selection={gradeSelection}
                        canPremium={canPremium}
                        isDisabled={isPending}
                        onSelect={(selection) => onSelectGrade(submission.id, selection)}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            isPending={isPending}
                            size="lg"
                            variant="primary"
                            onPress={() => onSubmit(submission.id, row.index)}
                        >
                            {({ isPending: pending }) => (
                                <>
                                    {pending ? <Spinner color="current" /> : <PencilLineIcon className="size-5" />}
                                    {t("challenge.submissionModal.submit")}
                                </>
                            )}
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            onPress={() => onViewAttempts(submission.id)}
                        >
                            {t("challenge.submissionModal.viewAttempts")}
                        </Button>
                    </div>
                </div>
            </div>
            {submission.userSubmission?.lastAttempt ? (
                <LastAttemptResult
                    earnedScore={lastAttemptScore ?? 0}
                    maxScore={maxScore}
                    passThreshold={passThreshold}
                />
            ) : null}
        </div>
    )
}
