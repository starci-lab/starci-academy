"use client"
import React, { PropsWithChildren } from "react"
import { createContext } from "react"
import {
    useSignInFormikCore,
    useSignUpFormikCore,
    useEditSubmissionFormikCore,
    useCvApplyFormikCore,
    useGlobalSearchFormikCore,
    useAdminApiKeyFormikCore,
    usePersonalProjectIdeaFormikCore,
    usePersonalProjectGithubUrlFormikCore,
} from "./core"

export interface FormikContextType {
    signInFormik: ReturnType<typeof useSignInFormikCore>
    signUpFormik: ReturnType<typeof useSignUpFormikCore>
    editSubmissionFormik: ReturnType<typeof useEditSubmissionFormikCore>
    cvApplyFormik: ReturnType<typeof useCvApplyFormikCore>
    globalSearchFormik: ReturnType<typeof useGlobalSearchFormikCore>
    adminApiKeyFormik: ReturnType<typeof useAdminApiKeyFormikCore>
    personalProjectIdeaFormik: ReturnType<typeof usePersonalProjectIdeaFormikCore>
    personalProjectGithubUrlFormik: ReturnType<typeof usePersonalProjectGithubUrlFormikCore>
}

export const FormikContext = createContext<FormikContextType | null>(null)

// Lazy formik provider - only initializes hooks after mount
export const FormikProvider = ({ children }: PropsWithChildren) => {
    const signInFormik = useSignInFormikCore()
    const signUpFormik = useSignUpFormikCore()
    const editSubmissionFormik = useEditSubmissionFormikCore()
    const cvApplyFormik = useCvApplyFormikCore()
    const globalSearchFormik = useGlobalSearchFormikCore()
    const adminApiKeyFormik = useAdminApiKeyFormikCore()
    const personalProjectIdeaFormik = usePersonalProjectIdeaFormikCore()
    const personalProjectGithubUrlFormik = usePersonalProjectGithubUrlFormikCore()
    return (
        <FormikContext.Provider value={{
            signInFormik,
            signUpFormik,
            editSubmissionFormik,
            cvApplyFormik,
            globalSearchFormik,
            adminApiKeyFormik,
            personalProjectIdeaFormik,
            personalProjectGithubUrlFormik,
        }}>
            {children}
        </FormikContext.Provider>
    )
}