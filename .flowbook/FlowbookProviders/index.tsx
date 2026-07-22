import React, { PropsWithChildren } from "react"

import { I18nProvider } from "@heroui/react"

/**
 * Mirrors the app's `HeroUIProvider` (which is just HeroUI's `I18nProvider`) on a themed
 * `@container` surface, so the redrawn screens read the same tokens/breakpoints the app
 * does. No `next-intl` here — the prototype hardcodes its copy rather than importing the
 * app's i18n dictionaries.
 */
export const FlowbookProviders = ({
    children,
    theme = "dark",
}: PropsWithChildren<{ theme?: "light" | "dark" }>) => {
    return (
        <I18nProvider>
            <div className={`${theme} @container bg-background text-foreground min-h-screen w-full`}>
                {children}
            </div>
        </I18nProvider>
    )
}
