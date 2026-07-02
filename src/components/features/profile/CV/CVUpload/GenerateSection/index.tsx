"use client"

import { ArrowClockwiseIcon, SparkleIcon } from "@phosphor-icons/react"
import React, { useMemo, useState } from "react"
import {
    Button,
    Label,
    Spinner,
    TextArea,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AIProcessingText } from "@/components/reuseable/AIProcessingText"
import { LatexCvPreview } from "@/components/blocks/documents/LatexCvPreview"
import { StarCiAIBadge } from "@/components/reuseable/StarCiAIBadge"
import { JobCategory } from "@/modules/types/enums/job-category"
import { JobStatus } from "@/modules/types/enums/job-status"
import { CvGenerationStatus } from "@/modules/types/enums/cv-generation-status"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useCvGenerationForm } from "@/hooks/zustand/cvGeneration/useCvGenerationForm"
import { useCvGenerationStore } from "@/hooks/zustand/cvGeneration/store"
import { useQueryCvGenerationSwr } from "@/hooks/swr/api/graphql/queries/useQueryCvGenerationSwr"
import { useQueryAiModelsSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiModelsSwr"
import { useQueryMyAiSettingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiSettingsSwr"
import { AiMode } from "@/modules/api/graphql/queries/query-my-ai-settings"
import { AiModelCategory, AiModelTask } from "@/modules/api/graphql/queries/query-ai-models"
import type { AiGradableModel } from "@/modules/api/graphql/queries/types/ai-models"
import {
    GradeModelDropdown,
    type GradeModelSelection,
} from "@/components/blocks/grading/GradeModelDropdown"
import { pathConfig } from "@/resources/path"

/** Model categories offered in the CV-generation picker — "medium trở lên" (Balanced and up). */
const CV_GENERATE_CATEGORIES: ReadonlyArray<AiModelCategory> = [
    AiModelCategory.Balanced,
    AiModelCategory.Premium,
    AiModelCategory.Frontier,
]

/** Default selection — Auto lane, balancer picks the model. */
const AUTO_SELECTION: GradeModelSelection = {
    mode: AiMode.Auto,
    model: null,
    provider: null,
}

/** Props for {@link GenerateSection}. */
export interface GenerateSectionProps extends WithClassNames<undefined> {
    /**
     * `cv_submissions.id` of the currently uploaded CV, if any. Enables the "Revise my CV"
     * action (revise operates on an uploaded submission).
     */
    cvSubmissionId?: string
    /** Fired to open the (reused) CV upload modal for the revise flow. */
    onOpenUpload: () => void
}

/**
 * AI CV generation section: a free-text "extra context" field plus two flows —
 * **Generate** (build a CV from the learner's StarCi activity) and **Revise** (improve an
 * uploaded CV). Both enqueue a background job whose id is polled via
 * {@link useQueryCvGenerationSwr}; while pending it shows the shared AI-processing status
 * line, and on `Done` it renders the returned `.tex` via {@link LatexCvPreview}.
 *
 * @param props - {@link GenerateSectionProps}
 */
export const GenerateSection = ({
    cvSubmissionId,
    onOpenUpload,
    className,
}: GenerateSectionProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const [extraPrompts, setExtraPrompts] = useState("")
    const [selection, setSelection] = useState<GradeModelSelection>(AUTO_SELECTION)
    const { generate, revise, isGenerating, isRevising } = useCvGenerationForm()
    const activeCvGenerationId = useCvGenerationStore((state) => state.activeCvGenerationId)
    const generationSwr = useQueryCvGenerationSwr(activeCvGenerationId ?? undefined)
    const generation = generationSwr.data

    const aiModelsSwr = useQueryAiModelsSwr()
    const myAiSettingsSwr = useQueryMyAiSettingsSwr()
    const canPremium = Boolean(myAiSettingsSwr.data?.canPremium)
    const cvModels = useMemo<Array<AiGradableModel>>(
        () => (aiModelsSwr.data?.aiModels?.data?.gradableModels ?? []).filter(
            (model) =>
                CV_GENERATE_CATEGORIES.includes(model.category)
                && (model.supportedTasks?.length
                    ? model.supportedTasks.includes(AiModelTask.CvGenerating)
                    : true),
        ),
        [aiModelsSwr.data],
    )

    /** Map the CV generation lifecycle to the shared AI job-status copy (queued/processing/…). */
    const jobStatus = useMemo<JobStatus | undefined>(() => {
        switch (generation?.status) {
        case CvGenerationStatus.Pending:
            return JobStatus.Queued
        case CvGenerationStatus.Processing:
            return JobStatus.Processing
        case CvGenerationStatus.Done:
            return JobStatus.Completed
        case CvGenerationStatus.Failed:
            return JobStatus.Failed
        default:
            return undefined
        }
    }, [generation?.status])

    /** True while a generation is enqueued or still running. */
    const isPending = useMemo(
        () => isGenerating
            || isRevising
            || generation?.status === CvGenerationStatus.Pending
            || generation?.status === CvGenerationStatus.Processing,
        [isGenerating, isRevising, generation?.status],
    )

    const isDone = generation?.status === CvGenerationStatus.Done
    const latexSource = generation?.latexSource ?? ""

    const onGenerate = () => {
        void generate(extraPrompts, selection)
    }

    const onRevise = () => {
        if (!cvSubmissionId) {
            onOpenUpload()
            return
        }
        void revise(cvSubmissionId, extraPrompts, selection)
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className="flex items-center gap-2">
                <Label>{t("cv.generate.title")}</Label>
                <StarCiAIBadge />
            </div>
            <Typography type="body-sm" color="muted">
                {t("cv.generate.description")}
            </Typography>

            <TextField variant="secondary">
                <Label htmlFor="cv-generate-extra-prompts">
                    {t("cv.generate.extraPromptsLabel")}
                </Label>
                <TextArea
                    id="cv-generate-extra-prompts"
                    rows={4}
                    className="resize-none"
                    placeholder={t("cv.generate.extraPromptsPlaceholder")}
                    value={extraPrompts}
                    onChange={(event) => setExtraPrompts(event.target.value)}
                />
            </TextField>

            <div className="flex flex-wrap items-center gap-2">
                <Button
                    size="lg"
                    isDisabled={isPending}
                    isPending={isGenerating}
                    onPress={onGenerate}
                >
                    {({ isPending: btnPending }) => (
                        <>
                            {btnPending
                                ? <Spinner color="current" />
                                : <SparkleIcon aria-hidden className="size-5" />}
                            <span>{t("cv.generate.generateAction")}</span>
                        </>
                    )}
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    isDisabled={isPending}
                    isPending={isRevising}
                    onPress={onRevise}
                >
                    {({ isPending: btnPending }) => (
                        <>
                            {btnPending
                                ? <Spinner color="current" />
                                : <ArrowClockwiseIcon aria-hidden className="size-5" />}
                            <span>{t("cv.generate.reviseAction")}</span>
                        </>
                    )}
                </Button>
            </div>

            <GradeModelDropdown
                className="w-fit max-w-full text-sm text-muted"
                models={cvModels}
                selection={selection}
                canPremium={canPremium}
                isDisabled={isPending}
                task={AiModelTask.CvGenerating}
                floor={AiModelCategory.Balanced}
                showAutoLane
                onSelect={setSelection}
                onUpgrade={() => router.push(
                    pathConfig().locale(locale).profile().aiSubscription().build(),
                )}
            />

            {jobStatus !== undefined && !isDone ? (
                <AIProcessingText
                    jobCategory={JobCategory.ReviewCv}
                    jobStatus={jobStatus}
                    error={generation?.error ?? undefined}
                />
            ) : null}

            {isDone && latexSource ? (
                <LatexCvPreview
                    latexSource={latexSource}
                    className="min-h-[360px]"
                />
            ) : null}
        </div>
    )
}
