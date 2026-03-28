"use client"

import React, { type PropsWithChildren } from "react"
import { DiscloresureProvider } from "./discloresure"
import { SwrProvider } from "./swr"
import { FormikProvider } from "./formik"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => {
    return (
        <DiscloresureProvider>
            <SwrProvider>
                <FormikProvider>
                    {children}
                </FormikProvider>
            </SwrProvider>
        </DiscloresureProvider>
    )
}
