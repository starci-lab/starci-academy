"use client"
import React, { PropsWithChildren } from "react"
// 1. import `HeroUIProvider` component
import {HeroUIProvider as Provider } from "@heroui/react"

export const HeroUIProvider = ({ children }: PropsWithChildren) => {
    return <Provider>{children}</Provider>
}