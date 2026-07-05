"use client"

import { ArrowClockwiseIcon, DownloadSimpleIcon, SparkleIcon } from "@phosphor-icons/react"
import React, { useCallback, useMemo, useState } from "react"
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
    model: null,
    provider: null,
}

/** Props for {@link GenerateSection}. */
export interface GenerateSectionProps extends WithClassNames<undefined> {
    /**
     * `cv_generations.id` of the caller's current CV (either source — uploaded or
     * generated), if any. Enables the "Revise my CV" action.
     */
    sourceCvGenerationId?: string
    /** Course/track the generated CV should be tied to — owned by the parent so the picker renders once. */
    courseId?: string
}

/**
 * AI CV generation section: a free-text "extra context" field plus two flows —
 * **Generate** (build a CV from the learner's StarCi activity) and **Revise** (improve an
 * existing CV). Both enqueue a background job whose id is polled via
 * {@link useQueryCvGenerationSwr}; while pending it shows the shared AI-processing status
 * line. The compiled result (`generatedPdfUrl`, server-side `tectonic`) previews in the
 * SIBLING {@link CVPreview} (right column) — the one shared viewer for every CV
 * regardless of source — so this section only surfaces a status line + the
 * `.tex` download (a compile failure degrades to a "can't preview" message instead
 * of blocking the run).
 *
 * @param props - {@link GenerateSectionProps}
 */
export const GenerateSection = ({
    sourceCvGenerationId,
    courseId,
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
    const generatedPdfUrl = generation?.generatedPdfUrl ?? ""

    /** Download the raw `.tex` as a blob via a throwaway anchor (revoked immediately). */
    const onDownloadTex = useCallback(() => {
        if (typeof window === "undefined" || !latexSource) {
            return
        }
        const blob = new Blob([latexSource], { type: "application/x-tex" })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = "cv.tex"
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
        URL.revokeObjectURL(url)
    }, [latexSource])

    const onGenerate = () => {
        void generate(extraPrompts, selection, courseId)
    }

    const onRevise = () => {
        if (!sourceCvGenerationId) {
            return
        }
        void revise(sourceCvGenerationId, extraPrompts, selection, courseId)
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
                    isDisabled={isPending || !sourceCvGenerationId}
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
                    error={generation?.errorMessage ?? undefined}
                />
            ) : null}

            {isDone && generatedPdfUrl ? (
                <p className="text-sm text-success">
                    {t("cv.generate.previewReadyHint")}
                </p>
            ) : isDone ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-default bg-surface p-4 text-center">
                    <p className="text-sm text-muted">
                        {t("cv.generate.renderFallback")}
                    </p>
                </div>
            ) : null}

            {isDone && latexSource ? (
                <Button
                    variant="secondary"
                    onPress={onDownloadTex}
                    className="shrink-0 self-start"
                >
                    <DownloadSimpleIcon aria-hidden className="size-5" />
                    {t("cv.generate.downloadTex")}
                </Button>
            ) : null}
        </div>
    )
}
