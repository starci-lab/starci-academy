"use client"
import { ChallengeSubmissionEntity, SubmissionType } from "@/modules/types"
import { useAppSelector } from "@/redux"
import { useFormik } from "formik"
import { useEffect, useMemo } from "react"
import * as Yup from "yup"
import { 
    useMutateSubmitChallengeSubmissionsSwr, 
    useMutateSyncChallengeSubmissionsSwr 
} from "@/hooks/singleton"
import { debounce } from "lodash"
import { runGraphQLWithToast } from "@/modules/toast"

const GITHUB_REGEX =
    /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?(\/)?$/

const GOOGLE_DOCS_REGEX =
    /^https:\/\/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/[A-Za-z0-9_-]+/

/** The values for the edit submission form */
export interface EditSubmissionFormValues {
    /** The submissions to edit */
    submissions: Array<ChallengeSubmissionEntity>
}

/**
 * Edit URLs for each `challengeSubmissions` row.
 * Debounced sync calls `syncChallengeSubmissions`; Formik stays aligned with Redux via `enableReinitialize`.
 */
export const useEditSubmissionFormikCore = () => {
    const challengeSubmissions = useAppSelector(
        (state) => state.challenge.challengeSubmissions,
    )
    const syncChallengeSubmissionsSwr = useMutateSyncChallengeSubmissionsSwr()
    const submitChallengeSubmissionsSwr = useMutateSubmitChallengeSubmissionsSwr()
    const challengeId = useAppSelector((state) => state.challenge.entity?.id)
    const initialValues = useMemo<EditSubmissionFormValues>(
        () => ({
            submissions: challengeSubmissions ?? [],
        }),
        [challengeSubmissions],
    )

    const formik = useFormik<EditSubmissionFormValues>({
        initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object({
            submissions: Yup.array().of(
                Yup.object({
                    id: Yup.string().required(),
                    type: Yup.mixed<SubmissionType>().required(),
                    userSubmission: Yup.object({
                        submissionUrl: Yup.string()
                            .required("URL is required")
                            .test(
                                "url-by-type",
                                "Invalid URL for this submission type",
                                function (value) {
                                    const submission = this.from?.[1]?.value
                                    if (!value) return false
                                    if (submission.type === SubmissionType.GithubUrl) {
                                        return GITHUB_REGEX.test(value as string)
                                    }
                                    if (submission.type === SubmissionType.GoogleDocsUrl) {
                                        return GOOGLE_DOCS_REGEX.test(value as string)
                                    }
                                    return true
                                },
                            )
                            .required("URL is required"),
                    }).nullable(),
                }),
            ),
        }),
        onSubmit: async () => {
            if (!challengeId) {
                return
            }
            await runGraphQLWithToast(
                async () => {
                    const response = await submitChallengeSubmissionsSwr.trigger(
                        {
                            challengeId
                        }
                    )
                    if (!response.data?.submitChallengeSubmissions) {
                        throw new Error(response.error?.message)
                    }
                    return response.data?.submitChallengeSubmissions
                },
                {
                    showSuccessToast: true,
                    showErrorToast: true,
                }
            )
        },
    })

    useEffect(() => {
        if (Object.keys(formik.errors).length > 0) {
            return
        }
        if (
            JSON.stringify(formik.values.submissions) ===
            JSON.stringify(initialValues.submissions)
        ) {
            return
        }
        const debouncedTrigger = debounce(() => {
            void syncChallengeSubmissionsSwr.trigger({
                items: formik.values.submissions.map((submission) => ({
                    id: submission.id,
                    url: submission.userSubmission?.submissionUrl ?? "",
                })),
            })
        }, 1000)
        debouncedTrigger()
        return () => {
            debouncedTrigger.cancel()
        }
    }, [
        formik.errors,
        formik.values.submissions,
        initialValues.submissions,
    ])

    return formik
}
