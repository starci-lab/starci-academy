import { useMutateSubmitPersonalProjectIdealSwr } from "../../swr"
import { useAppSelector } from "@/redux"
import { runGraphQLWithToast } from "@/modules/toast"
import { useFormik } from "formik"
import { useMemo } from "react"
import { useTranslations } from "next-intl"
import * as Yup from "yup"

/**
 * Form values for personal project idea submission.
 */
export interface PersonalProjectIdeaFormikValues {
    /** The idea text to submit. */
    ideaText: string
}

/**
 * Singleton Formik core for personal project idea submission.
 */
export const usePersonalProjectIdeaFormikCore = () => {
    const t = useTranslations()
    const { trigger: submitProjectIdeal } = useMutateSubmitPersonalProjectIdealSwr()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const validationSchema = useMemo(
        () => Yup.object({
            ideaText: Yup.string()
                .trim()
                .required(t("finalProject.page.submit.ideaRequired"))
                .min(10, t("finalProject.page.submit.ideaTooShort")),
        }), [t],
    )
    return useFormik<PersonalProjectIdeaFormikValues>({
        initialValues: {
            ideaText: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            if (!courseId) {
                return
            }
            await runGraphQLWithToast(
                async () => {
                    const result = await submitProjectIdeal({
                        courseId,
                        ideaText: values.ideaText.trim(),
                    })
                    const env = result?.data?.submitPersonalProjectIdeal
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
