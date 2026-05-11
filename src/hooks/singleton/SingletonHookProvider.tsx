"use client"

import React, { type PropsWithChildren } from "react"
import { OverlayStateProvider } from "./overlay-state"
import { SwrProvider } from "./swr"
import { FormikProvider } from "./formik"
import { SocketIoProvider } from "./socketio"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => {
    return (
        <OverlayStateProvider>
            <SocketIoProvider>
                <SwrProvider>
                    <FormikProvider>    
                        {children}
                    </FormikProvider>
                </SwrProvider>
            </SocketIoProvider>
        </OverlayStateProvider>
    )
}
