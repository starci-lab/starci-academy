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

const MSG_URL_REQUIRED = "challenge.submissionModal.errors.urlRequired" as const
const MSG_INVALID_GITHUB = "challenge.submissionModal.errors.invalidGithubUrl" as const
const MSG_INVALID_GOOGLE = "challenge.submissionModal.errors.invalidGoogleDocsUrl" as const

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
                            .required(MSG_URL_REQUIRED)
                            .test("url-by-type", function (value) {
                                const submission = this.from?.[1]?.value as
                                    | ChallengeSubmissionEntity
                                    | undefined
                                if (!submission) {
                                    return true
                                }
                                if (!value || !String(value).trim()) {
                                    return this.createError({ message: MSG_URL_REQUIRED })
                                }
                                if (submission.type === SubmissionType.GithubUrl) {
                                    return GITHUB_REGEX.test(value as string)
                                        ? true
                                        : this.createError({ message: MSG_INVALID_GITHUB })
                                }
                                if (submission.type === SubmissionType.GoogleDocsUrl) {
                                    return GOOGLE_DOCS_REGEX.test(value as string)
                                        ? true
                                        : this.createError({ message: MSG_INVALID_GOOGLE })
                                }
                                return true
                            }),
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
        const debouncedTrigger = debounce(() => {
            void syncChallengeSubmissionsSwr.trigger({
                items: formik.values.submissions.map((submission) => ({
                    id: submission.id,
                    url: submission.userSubmission?.submissionUrl ?? "",
                })),
            })
        }, 300)
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
