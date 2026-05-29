"use client"

import React, { type PropsWithChildren } from "react"
import { OverlayStateProvider } from "./overlay-state"
import { SwrProvider } from "./swr"
import { FormikProvider } from "./formik"
import { SocketIoProvider } from "./socketio"

/**
 * Root singleton provider: composes {@link OverlayStateProvider}, {@link SocketIoProvider},
 * {@link SwrProvider}, and {@link FormikProvider} in a single wrapper so all singleton
 * hooks are available to the app tree.
 * @param props.children - app content
 */
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
