"use client"
import React, { PropsWithChildren } from "react"
import { createContext } from "react"
import {
    useSignInFormikCore,
    useSignUpFormikCore,
    useEditSubmissionFormikCore,
    useCvApplyFormikCore,
    useCvReviewFormikCore,
    useGlobalSearchFormikCore,
    useAdminApiKeyFormikCore,
    usePersonalProjectIdeaFormikCore,
    usePersonalProjectGithubFormikCore,
    useAiSettingsFormikCore,
} from "./core"

/**
 * Shape of the singleton Formik context; each field is a live formik instance
 * created once in {@link FormikProvider} and consumed via the accessor hooks.
 */
export interface FormikContextType {
    signInFormik: ReturnType<typeof useSignInFormikCore>
    signUpFormik: ReturnType<typeof useSignUpFormikCore>
    editSubmissionFormik: ReturnType<typeof useEditSubmissionFormikCore>
    cvApplyFormik: ReturnType<typeof useCvApplyFormikCore>
    cvReviewFormik: ReturnType<typeof useCvReviewFormikCore>
    globalSearchFormik: ReturnType<typeof useGlobalSearchFormikCore>
    adminApiKeyFormik: ReturnType<typeof useAdminApiKeyFormikCore>
    personalProjectIdeaFormik: ReturnType<typeof usePersonalProjectIdeaFormikCore>
    personalProjectGithubFormik: ReturnType<typeof usePersonalProjectGithubFormikCore>
    aiSettingsFormik: ReturnType<typeof useAiSettingsFormikCore>
}

export const FormikContext = createContext<FormikContextType | null>(null)

/**
 * Mounts all singleton Formik instances once at the top of the app tree.
 * Consumers use the typed accessor hooks (e.g. {@link useSignInFormik}) rather
 * than reading the context directly.
 * @param props.children - app content
 */
export const FormikProvider = ({ children }: PropsWithChildren) => {
    const signInFormik = useSignInFormikCore()
    const signUpFormik = useSignUpFormikCore()
    const editSubmissionFormik = useEditSubmissionFormikCore()
    const cvApplyFormik = useCvApplyFormikCore()
    const cvReviewFormik = useCvReviewFormikCore()
    const globalSearchFormik = useGlobalSearchFormikCore()
    const adminApiKeyFormik = useAdminApiKeyFormikCore()
    const personalProjectIdeaFormik = usePersonalProjectIdeaFormikCore()
    const personalProjectGithubFormik = usePersonalProjectGithubFormikCore()
    const aiSettingsFormik = useAiSettingsFormikCore()
    return (
        <FormikContext.Provider value={{
            signInFormik,
            signUpFormik,
            editSubmissionFormik,
            cvApplyFormik,
            cvReviewFormik,
            globalSearchFormik,
            adminApiKeyFormik,
            personalProjectIdeaFormik,
            personalProjectGithubFormik,
            aiSettingsFormik,
        }}>
            {children}
        </FormikContext.Provider>
    )
}