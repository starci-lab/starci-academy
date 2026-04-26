"use client"

import React, { type PropsWithChildren } from "react"
import { OverlayStateProvider } from "./overlay-state"
import { SwrProvider } from "./swr"
import { FormikProvider } from "./formik"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => {
    return (
        <OverlayStateProvider>
            <SwrProvider>
                <FormikProvider>
                    {children}
                </FormikProvider>
            </SwrProvider>
        </OverlayStateProvider>
    )
}
