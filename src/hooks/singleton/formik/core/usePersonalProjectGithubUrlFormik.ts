import { useMutateSubmitPersonalGithubUrlSwr } from "../../swr"
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
 */
export const usePersonalProjectGithubUrlFormikCore = () => {
    const t = useTranslations()
    const { trigger: submitGithubUrl } = useMutateSubmitPersonalGithubUrlSwr()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const validationSchema = useMemo(
        () => Yup.object({
            githubUrl: Yup.string()
                .trim()
                .required(t("finalProject.page.submitGithub.urlRequired"))
                .url(t("finalProject.page.submitGithub.urlInvalid")),
        }), [t],
    )
    return useFormik<PersonalProjectGithubUrlFormikValues>({
        initialValues: {
            githubUrl: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            if (!courseId) {
                return
            }
            await runGraphQLWithToast(
                async () => {
                    const result = await submitGithubUrl({
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
                    return env
                },
                {
                    showErrorToast: true,
                    showSuccessToast: true,
                },
            )
        },
    })
}
