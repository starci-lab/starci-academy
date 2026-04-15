"use client"

import React, { type PropsWithChildren } from "react"
import { OverlayStateProvider } from "./overlay-state"
import { KeycloakProvider } from "./keycloak"
import { SwrProvider } from "./swr"
import { FormikProvider } from "./formik"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => {
    return (
        <OverlayStateProvider>
            <KeycloakProvider>
                <SwrProvider>
                    <FormikProvider>
                        {children}
                    </FormikProvider>
                </SwrProvider>
            </KeycloakProvider>
        </OverlayStateProvider>
    )
}
