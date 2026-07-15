"use client"

import {
    Button,
    ProgressBar,
    Spinner,
    Typography,
    cn,
} from "@heroui/react"
import {
    Form,
} from "formik"
import type {
    FormikErrors,
    FormikTouched,
} from "formik"
import { useTranslations } from "next-intl"
import type {
    CvSubmissionFormValues,
} from "@/types"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { Dropzone } from "@/components/reuseable/Dropzone"

/** Max CV upload size (10MB), mirrored in the drop hint copy. */
const MAX_CV_BYTES = 10 * 1024 * 1024

/** Props for {@link CvSubmissionFields}. */
export interface CvSubmissionFieldsProps extends WithClassNames<undefined> {
    /** Current form values from Formik. */
    values: CvSubmissionFormValues
    /** Validation errors from Formik. */
    errors: FormikErrors<CvSubmissionFormValues>
    /** Touched-field map from Formik. */
    touched: FormikTouched<CvSubmissionFormValues>
    /** Whether the wrapped Formik form is currently submitting. */
    isSubmitting: boolean
    /** Sets the `cv` field value on the Formik form. */
    setFieldValue: (field: string, value: File) => void
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
    /** Fired to trigger backend processing of the uploaded CV. */
    onProcess: () => void
}

/**
 * Inner field layout for the CV submission form: canonical {@link Dropzone}
 * (real drag-drop + token styling + inline error), progress bar, and the
 * upload/process buttons. Presentational — renders Formik render-prop values +
 * upload state, no business logic. All copy via the `cv.submission.*` namespace.
 * @param props - {@link CvSubmissionFieldsProps}
 */
export const CvSubmissionFields = ({
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    isUploading,
    isProcessing,
    uploadProgress,
    uploadedFileName,
    uploadedS3Key,
    onProcess,
    className,
}: CvSubmissionFieldsProps) => {
    const t = useTranslations("cv.submission")

    return (
        <Form className={cn("flex flex-col gap-3", className)}>
            <div className="flex flex-col gap-2">
                <Typography type="body-sm" weight="medium">{t("uploadLabel")}</Typography>
                <Dropzone
                    acceptedMimeTypes={["application/pdf"]}
                    maxSizeInBytes={MAX_CV_BYTES}
                    file={(values.cv as File | null) ?? null}
                    hint={t("dropHint")}
                    errorMessage={touched.cv && errors.cv ? String(errors.cv) : undefined}
                    onChange={(file) => {
                        if (file) {
                            setFieldValue("cv", file)
                        }
                    }}
                />
                {uploadedFileName && uploadedS3Key ? (
                    <Typography type="body-sm" className="text-success-soft-foreground">
                        {t("uploadSuccess")}
                    </Typography>
                ) : null}
            </div>

            {isUploading ? (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Typography type="body-sm" weight="medium">{t("uploadingCta")}</Typography>
                        <Typography type="body-sm" color="muted">{uploadProgress}%</Typography>
                    </div>
                    <ProgressBar
                        className="w-full"
                        maxValue={100}
                        minValue={0}
                        value={uploadProgress}
                    >
                        <ProgressBar.Track>
                            <ProgressBar.Fill />
                        </ProgressBar.Track>
                    </ProgressBar>
                </div>
            ) : null}

            <Button
                type="submit"
                isDisabled={isUploading || isProcessing || isSubmitting}
                fullWidth
                variant="primary"
            >
                {isUploading ? (
                    <>
                        <Spinner size="sm" />
                        {t("uploadingCta")}
                    </>
                ) : (
                    t("uploadCta")
                )}
            </Button>

            <Button
                type="button"
                isDisabled={
                    !uploadedFileName
                    || !uploadedS3Key
                    || isUploading
                    || isProcessing
                }
                fullWidth
                variant="secondary"
                onPress={onProcess}
            >
                {isProcessing ? (
                    <>
                        <Spinner size="sm" />
                        {t("processingCta")}
                    </>
                ) : (
                    t("processCta")
                )}
            </Button>
        </Form>
    )
}
