"use client"
import React from "react"
import dynamic from "next/dynamic"

import { type ThemeProviderProps } from "next-themes"
const ThemeProvider = dynamic(
    () => import("next-themes").then((e) => e.ThemeProvider),
    {
        ssr: false,
    }
)

/**
 * Client-only next-themes provider (dynamic, `ssr: false`) — owns light/dark
 * class application on `<html>` without flashing the wrong theme on first paint.
 */
export const NextThemesProvider = ({ children, ...props }: ThemeProviderProps) => {
    return <ThemeProvider {...props}>{children}</ThemeProvider>
}