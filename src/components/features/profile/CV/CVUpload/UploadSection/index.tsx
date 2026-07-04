"use client"

import { UploadSimpleIcon } from "@phosphor-icons/react"
import React, { useMemo, useState } from "react"
import {
    Button,
    Input,
    Label,
    Spinner,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Dropzone } from "@/components/reuseable/Dropzone"
import { AiModelCategory, AiModelTask } from "@/modules/api/graphql/queries/query-ai-models"
import type { AiGradableModel } from "@/modules/api/graphql/queries/types/ai-models"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useCvUploadForm } from "@/hooks/zustand/cvGeneration/useCvUploadForm"
import { useCvGenerationStore } from "@/hooks/zustand/cvGeneration/store"
import { useQueryAiModelsSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiModelsSwr"
import { useQueryMyAiSettingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiSettingsSwr"
import {
    GradeModelDropdown,
    type GradeModelSelection,
} from "@/components/blocks/grading/GradeModelDropdown"
import { pathConfig } from "@/resources/path"

/** Model categories offered in the CV-scoring picker — "medium trở lên" (Balanced and up). */
const CV_SCORE_CATEGORIES: ReadonlyArray<AiModelCategory> = [
    AiModelCategory.Balanced,
    AiModelCategory.Premium,
    AiModelCategory.Frontier,
]

/** Default selection — Auto lane, balancer picks the model. */
const AUTO_SELECTION: GradeModelSelection = {
    model: null,
    provider: null,
}

/** Props for {@link UploadSection}. */
export type UploadSectionProps = WithClassNames<undefined>

/**
 * CV **upload** section (WF-07): pick a PDF, optionally name it, choose a scoring
 * model, then upload. Runs the presign → PUT → `uploadCv` flow via
 * {@link useCvUploadForm}; the created generation is registered in the shared
 * {@link useCvGenerationStore}, so the sibling preview polls + renders it — the
 * same infra the generate/revise flows use. Owns its file/label/selection state.
 *
 * @param props - {@link UploadSectionProps}
 */
export const UploadSection = ({ className }: UploadSectionProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const [label, setLabel] = useState("")
    const [selection, setSelection] = useState<GradeModelSelection>(AUTO_SELECTION)
    const { cvFile, setCvFile, error, submit, isUploading } = useCvUploadForm()
    const setActiveCvGenerationId = useCvGenerationStore((state) => state.setActiveCvGenerationId)

    const aiModelsSwr = useQueryAiModelsSwr()
    const myAiSettingsSwr = useQueryMyAiSettingsSwr()
    const canPremium = Boolean(myAiSettingsSwr.data?.canPremium)
    const cvModels = useMemo<Array<AiGradableModel>>(
        () => (aiModelsSwr.data?.aiModels?.data?.gradableModels ?? []).filter(
            (model) =>
                CV_SCORE_CATEGORIES.includes(model.category)
                && (model.supportedTasks?.length
                    ? model.supportedTasks.includes(AiModelTask.Grading)
                    : true),
        ),
        [aiModelsSwr.data],
    )

    const onUpload = () => {
        // Clear any previously-previewed generation so the sibling preview follows this upload.
        setActiveCvGenerationId(null)
        void submit(label, selection)
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <Label>{t("cv.upload.title")}</Label>
            <Typography type="body-sm" color="muted">
                {t("cv.upload.description")}
            </Typography>

            <Dropzone
                hint={t("cv.upload.fileHint")}
                file={cvFile}
                errorMessage={cvFile && error ? t(error) : undefined}
                acceptedMimeTypes={["application/pdf"]}
                maxSizeInBytes={10 * 1024 * 1024}
                onChange={(file) => setCvFile(file)}
            />

            <TextField variant="secondary">
                <Label htmlFor="cv-upload-label">
                    {t("cv.upload.labelLabel")}
                </Label>
                <Input
                    id="cv-upload-label"
                    placeholder={t("cv.upload.labelPlaceholder")}
                    value={label}
                    onChange={(event) => setLabel(event.target.value)}
                />
            </TextField>

            <div className="flex flex-wrap items-center gap-2">
                <Button
                    size="lg"
                    isDisabled={isUploading || !cvFile || Boolean(error)}
                    isPending={isUploading}
                    onPress={onUpload}
                >
                    {({ isPending: btnPending }) => (
                        <>
                            {btnPending
                                ? <Spinner color="current" />
                                : <UploadSimpleIcon aria-hidden className="size-5" />}
                            <span>{t("cv.upload.uploadAction")}</span>
                        </>
                    )}
                </Button>
            </div>

            <GradeModelDropdown
                className="w-fit max-w-full text-sm text-muted"
                models={cvModels}
                selection={selection}
                canPremium={canPremium}
                isDisabled={isUploading}
                task={AiModelTask.Grading}
                floor={AiModelCategory.Balanced}
                showAutoLane
                onSelect={setSelection}
                onUpgrade={() => router.push(
                    pathConfig().locale(locale).profile().aiSubscription().build(),
                )}
            />
        </div>
    )
}
