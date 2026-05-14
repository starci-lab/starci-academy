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
} from "./core"

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
}

export const FormikContext = createContext<FormikContextType | null>(null)

// Lazy formik provider - only initializes hooks after mount
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
        }}>
            {children}
        </FormikContext.Provider>
    )
}