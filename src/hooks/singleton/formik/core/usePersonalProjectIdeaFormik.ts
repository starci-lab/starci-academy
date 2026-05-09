"use client"
import { 
    useMutateSubmitPersonalProjectIdealSwr, 
    useQueryCourseEnrollmentStatusSwr 
} from "../../swr"
import { useAppSelector } from "@/redux"
import { useFormik } from "formik"
import { useMemo } from "react"
import { useTranslations } from "next-intl"
import * as Yup from "yup"
import { runGraphQLWithToast } from "@/modules/toast"

/**
 * Form values for personal project idea submission.
 */
export interface PersonalProjectIdeaFormikValues {
    /** The idea text to submit. */
    ideaText: string
}

/**
 * Singleton Formik core for personal project idea submission.
 * Debounced sync calls `syncIdealText`; Formik stays aligned with Redux via `enableReinitialize`.
 */
export const usePersonalProjectIdeaFormikCore = () => {
    const t = useTranslations()
    const submitPersonalProjectIdealSwr = useMutateSubmitPersonalProjectIdealSwr()
    const queryCourseEnrollmentStatusSwr = useQueryCourseEnrollmentStatusSwr()
    const enrollment = useAppSelector((state) => state.user.enrollment)
    const course = useAppSelector((state) => state.course.entity)
    const initialSubmitted = Boolean(enrollment?.ideaText?.trim())
    const validationSchema = useMemo(
        () => Yup.object({
            ideaText: Yup.string()
                .trim()
                .required(t("finalProject.page.submit.ideaRequired"))
                .min(10, t("finalProject.page.submit.ideaTooShort")),
        }), [t],
    )

    const initialValues = useMemo<PersonalProjectIdeaFormikValues>(
        () => ({
            ideaText: enrollment?.ideaText ?? "",
        }),
        [enrollment?.ideaText],
    )

    const formik = useFormik<PersonalProjectIdeaFormikValues>({
        initialValues,
        enableReinitialize: true,
        validationSchema,
        initialStatus: {
            submitted: initialSubmitted,
            error: "",
        },
        onSubmit: async (value) => {
            const normalizedIdeaText = value.ideaText.trim()
            await runGraphQLWithToast(
                async () => {
                    if (!course?.id) {
                        throw new Error("Course id not found")
                    }
                    const result = await submitPersonalProjectIdealSwr.trigger({
                        courseId: course.id,
                        ideaText: normalizedIdeaText,
                    })
                    const env = result?.data?.submitPersonalProjectIdeal
                    if (!env) {
                        throw new Error("Submit failed")
                    }
                    if (!env.success) {
                        throw new Error(env.error ?? env.message ?? "Submit failed")
                    }
                    await queryCourseEnrollmentStatusSwr.mutate()
                    return env
                },
                {
                    showErrorToast: true,
                    showSuccessToast: true,
                },
            )
        }
    })

    return formik
}
