"use client"
import { ChallengeSubmissionEntity, SubmissionType } from "@/modules/types"
import { useAppSelector } from "@/redux"
import { useFormik } from "formik"
import { useEffect, useMemo, useRef } from "react"
import * as Yup from "yup"
import { 
    useChallengeSubmissionOverlayState,
    useMutateSyncChallengeSubmissionSwr,
    useQueryChallengeSubmissionsSwr
} from "@/hooks/singleton"
import { debounce } from "lodash"
import { setLoadingChallengeSubmissionIds } from "@/redux/slices"
import { useAppDispatch } from "@/redux"

/** Regex for GitHub URLs */
const GITHUB_REGEX =
    /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?(\/)?$/
/** Regex for Google Docs URLs */
const GOOGLE_DOCS_REGEX =
    /^https:\/\/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/[A-Za-z0-9_-]+/
/** Message for required URL */
const MSG_URL_REQUIRED = "challenge.submissionModal.errors.urlRequired" as const
/** Message for invalid GitHub URL */
const MSG_INVALID_GITHUB = "challenge.submissionModal.errors.invalidGithubUrl" as const
/** Message for invalid Google Docs URL */
const MSG_INVALID_GOOGLE = "challenge.submissionModal.errors.invalidGoogleDocsUrl" as const

/** The values for the edit submission form */
export interface EditSubmissionFormValues {
    /** The submissions to edit */
    submissions: Array<ChallengeSubmissionEntity>
}

/**
 * Edit URLs for each `challengeSubmissions` row.
 * Debounced sync calls `syncSubmission` per row; Formik stays aligned with Redux via `enableReinitialize`.
 */
export const useEditSubmissionFormikCore = () => {
    const challengeSubmissions = useAppSelector(
        (state) => state.challenge.challengeSubmissions,
    )
    const syncChallengeSubmissionsSwr = useMutateSyncChallengeSubmissionSwr()
    const queryChallengeSubmissionsSwr = useQueryChallengeSubmissionsSwr()
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
        onSubmit: async () => {},
    })
    const { isOpen } = useChallengeSubmissionOverlayState()
    const mountedRef = useRef(false)
    const dispatch = useAppDispatch()
    useEffect(
        () => {
            /** If the form is not mounted, we set the mounted flag and return */
            if (!mountedRef.current) {
                mountedRef.current = true
                return
            }
            /** If the overlay is not open, return */
            if (!isOpen) {
                return
            }
            /** If the form has errors, return */
            if (Object.keys(formik.errors).length > 0) {
                return
            }
            /** We check which submissions have changed */
            const changedSubmissions = formik.values.submissions.filter(
                (submission) => {
                    const initialSubmission = initialValues.submissions.find(
                        (_submission) => _submission.id === submission.id)
                    return submission.userSubmission?.submissionUrl !== initialSubmission?.userSubmission?.submissionUrl
                })
            if (changedSubmissions.length === 0) {
                return
            }
            /** Trigger the sync */
            const debouncedTrigger = debounce(
                async () => {
                    /** We build the items to sync */
                    const items = changedSubmissions.map(
                        (submission) => ({
                            id: submission.id,
                            url: submission.userSubmission?.submissionUrl ?? "",
                        }
                        )
                    )
                    /** We trigger the sync for each changed submission */
                    dispatch(
                        setLoadingChallengeSubmissionIds(
                            items.map((item) => item.id)))
                    await Promise.allSettled(
                        items.map((item) => syncChallengeSubmissionsSwr.trigger(item)),
                    )
                    await queryChallengeSubmissionsSwr.mutate()
                    dispatch(setLoadingChallengeSubmissionIds([]))
                }, 
                300
            )
            /** Trigger the sync */
            debouncedTrigger()
            return () => {
            /** Cancel the debounce */
                debouncedTrigger.cancel()
            }
        }, [
            isOpen,
            formik.errors,
            formik.values.submissions,
            initialValues.submissions,
        ]
    )
    return formik
}
