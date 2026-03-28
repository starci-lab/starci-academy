"use client"

import React, { type PropsWithChildren } from "react"
import { DiscloresureProvider } from "./discloresure"
import { SwrProvider } from "./swr"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => {
    return (
        <DiscloresureProvider>
            <SwrProvider>
                {children}
            </SwrProvider>
        </DiscloresureProvider>
    )
}
