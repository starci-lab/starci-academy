"use client"
import { useMutateSubmitPersonalGithubUrlSwr, useQueryCourseEnrollmentStatusSwr } from "../../swr"
import { useAppSelector } from "@/redux"
import { runGraphQLWithToast } from "@/modules/toast"
import { useFormik } from "formik"
import { useMemo } from "react"
import { useTranslations } from "next-intl"
import * as Yup from "yup"

/**
 * Form values for personal project GitHub URL submission.
 */
export interface PersonalProjectGithubUrlFormikValues {
    /** The GitHub repository URL. */
    githubUrl: string
}

/**
 * Singleton Formik core for personal project GitHub URL submission.
 * Uses `runGraphQLWithToast` for submit feedback; Formik stays aligned with Redux via `enableReinitialize`.
 */
export const usePersonalProjectGithubUrlFormikCore = () => {
    const t = useTranslations()
    const submitPersonalGithubUrlSwr = useMutateSubmitPersonalGithubUrlSwr()
    const queryCourseEnrollmentStatusSwr = useQueryCourseEnrollmentStatusSwr()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const enrollment = useAppSelector((state) => state.user.enrollment)
    const validationSchema = useMemo(
        () => Yup.object({
            githubUrl: Yup.string()
                .trim()
                .required(t("finalProject.page.submitGithub.urlRequired"))
                .url(t("finalProject.page.submitGithub.urlInvalid")),
        }), [t],
    )

    const initialValues = useMemo<PersonalProjectGithubUrlFormikValues>(
        () => ({
            githubUrl: enrollment?.personalProjectGithubUrl ?? "",
        }),
        [enrollment?.personalProjectGithubUrl],
    )

    const formik = useFormik<PersonalProjectGithubUrlFormikValues>({
        initialValues,
        enableReinitialize: true,
        validationSchema,
        initialStatus: {
            error: "",
        },
        onSubmit: async (values, helpers) => {
            if (!courseId) {
                return
            }
            await runGraphQLWithToast(
                async () => {
                    const result = await submitPersonalGithubUrlSwr.trigger({
                        courseId,
                        githubUrl: values.githubUrl.trim(),
                    })
                    const env = result?.data?.submitPersonalGithubUrl
                    if (!env) {
                        throw new Error("Submit failed")
                    }
                    if (!env.success) {
                        throw new Error(env.error ?? env.message ?? "Submit failed")
                    }
                    await queryCourseEnrollmentStatusSwr.mutate()
                    helpers.setStatus({
                        error: "",
                    })
                    return env
                },
                {
                    showErrorToast: true,
                    showSuccessToast: true,
                },
            )
        },
    })

    return formik
}

