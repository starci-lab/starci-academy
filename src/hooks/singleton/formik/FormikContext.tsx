"use client"
import React, { PropsWithChildren } from "react"
import { createContext } from "react"
import {
    useSignInFormikCore,
    useSignUpFormikCore,
    useEditSubmissionFormikCore,
    useCvApplyFormikCore,
    useGlobalSearchFormikCore,
} from "./core"

export interface FormikContextType {
    signInFormik: ReturnType<typeof useSignInFormikCore>
    signUpFormik: ReturnType<typeof useSignUpFormikCore>
    editSubmissionFormik: ReturnType<typeof useEditSubmissionFormikCore>
    cvApplyFormik: ReturnType<typeof useCvApplyFormikCore>
    globalSearchFormik: ReturnType<typeof useGlobalSearchFormikCore>
}

export const FormikContext = createContext<FormikContextType | null>(null)

// Lazy formik provider - only initializes hooks after mount
export const FormikProvider = ({ children }: PropsWithChildren) => {
    const signInFormik = useSignInFormikCore()
    const signUpFormik = useSignUpFormikCore()
    const editSubmissionFormik = useEditSubmissionFormikCore()
    const cvApplyFormik = useCvApplyFormikCore()
    const globalSearchFormik = useGlobalSearchFormikCore()
    return (
        <FormikContext.Provider value={{
            signInFormik,
            signUpFormik,
            editSubmissionFormik,
            cvApplyFormik,
            globalSearchFormik,
        }}>
            {children}
        </FormikContext.Provider>
    )
}