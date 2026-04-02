"use client"
import { ChallengeSubmissionEntity, SubmissionType } from "@/modules/types"
import { useAppSelector } from "@/redux"
import { useFormik } from "formik"
import { useEffect } from "react"
import * as Yup from "yup"
import { useMutateSyncChallengeSubmissionUrlsSwr } from "@/hooks/singleton"
import { debounce } from "lodash"

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
 * `initialKeyValues` mirrors Redux; Formik `initialValues` is kept in sync via `enableReinitialize`.
 */
export const useEditSubmissionFormikCore = () => {
    const challengeSubmissions = useAppSelector(
        (state) => state.challenge.challengeSubmissions,
    )
    const swr = useMutateSyncChallengeSubmissionUrlsSwr()
    const initialValues: EditSubmissionFormValues = {
        submissions: challengeSubmissions,
    }
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
                            ).required("URL is required"),
                    }).nullable(),
                }),
            ),
        }),
        onSubmit: (values) => {
            window.alert(JSON.stringify(values, null, 2))
        },
    })
    
    /**
     * Trigger the SWR mutation when the form is submitted or the values change.
     */
    useEffect(
        () => {
            if (Object.keys(formik.errors).length > 0) {
                return
            }
            if (JSON.stringify(formik.values) === JSON.stringify(initialValues)) {
                return
            }
            const debouncedTrigger = debounce(
                () => {
                    swr.trigger(
                        {
                            items: formik.values.submissions.map((submission) => ({
                                id: submission.id,
                                url: submission.userSubmission?.submissionUrl ?? "",
                            }
                            )),
                        })
                }, 1000
            )
            debouncedTrigger()
            return () => {
                debouncedTrigger.cancel()
            }
        }, [
            formik.errors, formik.values
        ]
    )
    return formik
}
