"use client"
import React, { PropsWithChildren } from "react"
import { I18nProvider } from "@heroui/react"

/**
 * Thin HeroUI i18n wrapper — mounts {@link I18nProvider} so HeroUI components
 * resolve locale-aware strings under the app tree.
 */
export const HeroUIProvider = ({ children }: PropsWithChildren) => {
    return <I18nProvider>{children}</I18nProvider>
}
