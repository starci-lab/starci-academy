"use client"

import React, {
    useEffect,
} from "react"
import {
    Card,
    cn,
} from "@heroui/react"
import type {
    CvSubmissionFormValues,
} from "@/types"
import {
    CvSubmissionFields,
} from "./CvSubmissionFields"
import { useCvSubmissionForm } from "@/hooks/rhf/useCvSubmissionForm"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link CVSubmissionForm}. */
export interface CVSubmissionFormProps extends WithClassNames<undefined> {
    /** Whether the S3 upload step is in progress. */
    isUploading: boolean
    /** Whether the backend processing step is in progress. */
    isProcessing: boolean
    /** Upload progress percentage (0–100). */
    uploadProgress: number
    /** Name of the successfully uploaded file, or `null`. */
    uploadedFileName: string | null
    /** S3 key of the successfully uploaded file, or `null`. */
    uploadedS3Key: string | null
    /** Fired with the form values to upload the CV; the parent container owns the async upload logic. */
    onSubmit: (values: CvSubmissionFormValues) => void | Promise<void>
    /** Fired to trigger backend processing of the uploaded CV. */
    onProcess: () => void
}

/**
 * Presentational CV submission form: react-hook-form wiring + file field + progress bar.
 *
 * Presentational (reuseable): owns only form/UI wiring and local validation; the
 * parent container supplies the upload/process handlers and progress state via
 * props. `"use client"` — uses react-hook-form and interactive controls.
 * @param props - {@link CVSubmissionFormProps}
 * @see Story: .storybook/stories/features/careers/CVSubmissionForm/CVSubmissionForm.stories
 */
export const CVSubmissionForm = ({
    isUploading,
    isProcessing,
    uploadProgress,
    uploadedFileName,
    uploadedS3Key,
    onSubmit,
    onProcess,
    className,
}: CVSubmissionFormProps) => {
    const {
        watch,
        setValue,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
        onSubmit: handleFormSubmit,
    } = useCvSubmissionForm({ onSubmit })

    // the container signals a successful S3 upload by setting these two props
    // (mirrors the old Formik `resetForm()` call from the container's onSubmit)
    useEffect(() => {
        if (uploadedFileName && uploadedS3Key) {
            reset()
        }
    }, [uploadedFileName, uploadedS3Key, reset])

    return (
        <Card className={cn(className)}>
            <CvSubmissionFields
                cv={watch("cv")}
                cvError={errors.cv?.message}
                isSubmitting={isSubmitting}
                onCvChange={(file) => setValue("cv", file, { shouldValidate: true, shouldTouch: true })}
                onSubmit={handleFormSubmit}
                isUploading={isUploading}
                isProcessing={isProcessing}
                uploadProgress={uploadProgress}
                uploadedFileName={uploadedFileName}
                uploadedS3Key={uploadedS3Key}
                onProcess={onProcess}
            />
        </Card>
    )
}
