import { useFormik } from "formik"
import * as Yup from "yup"

/**
 * Form values for CV apply form in learn/cv page.
 */
export interface CvApplyFormikValues {
    cvFile: File | null
    cvSubmissionId: string | null
    cvSubmissionAttemptId: string | null
}

/**
 * Singleton Formik core for CV apply flow.
 */
export const useCvApplyFormikCore = () =>
    useFormik<CvApplyFormikValues>({
        initialValues: {
            cvFile: null,
            cvSubmissionId: null,
            cvSubmissionAttemptId: null,
        },
        validationSchema: Yup.object({
            cvFile: Yup.mixed<File>()
                .required("cv.form.errors.fileRequired")
                .test("fileType", "cv.form.errors.fileTypeInvalid", (value) => {
                    if (!value) return false
                    return value.type === "application/pdf"
                })
                .test("fileSize", "cv.form.errors.fileSizeInvalid", (value) => {
                    if (!value) return false
                    return value.size <= 10 * 1024 * 1024
                }),
        }),
        onSubmit: async (_values, helpers) => {
            await new Promise((resolve) => setTimeout(resolve, 500))
            helpers.resetForm()
        },
    })
