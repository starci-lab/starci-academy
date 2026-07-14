import type { Preview } from "@storybook/nextjs"
import React from "react"
import { NextIntlClientProvider } from "next-intl"
import { HeroUIProvider } from "../src/components/providers/HeroUIProvider"
import messages from "../src/messages/vi.json"
import "../src/app/globals.css"

/**
 * Global decorator: HeroUI provider + Tailwind/HeroUI CSS + theme wrapper.
 * `theme` toolbar (light/dark) drives the `.dark`/`.light` class HeroUI/Tailwind read.
 * a11y addon runs axe on every story (fail-on-error surfaces contrast/aria bugs lint can't see).
 */
const preview: Preview = {
    // autodocs: render each story's JSDoc as its "cách dùng" description in the Docs tab.
    tags: ["autodocs"],
    parameters: {
        a11y: { test: "error" },
        controls: { expanded: true },
        layout: "centered",
    },
    globalTypes: {
        theme: {
            description: "HeroUI theme",
            defaultValue: "dark",
            toolbar: {
                title: "Theme",
                icon: "circlehollow",
                items: [
                    { value: "light", title: "Light" },
                    { value: "dark", title: "Dark" },
                ],
                dynamicTitle: true,
            },
        },
    },
    decorators: [
        (Story, context) => {
            const theme = context.globals.theme || "dark"
            // Show the story's "cách dùng" (its JSDoc) as a caption ON the canvas —
            // not just in the Docs tab. Only on the canvas (viewMode "story") so it
            // doesn't duplicate the description Docs already renders.
            const usage = context.parameters?.usage || context.parameters?.docs?.description?.story
            const showUsage = usage && context.viewMode === "story"
            return (
                <NextIntlClientProvider locale="vi" messages={messages}>
                    <HeroUIProvider>
                        <div className={`${theme} bg-background text-foreground p-8`}>
                            {showUsage ? (
                                <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-default bg-surface px-4 py-2 text-sm text-muted">
                                    <span className="mr-1 font-medium text-foreground">Cách dùng:</span>
                                    {usage}
                                </div>
                            ) : null}
                            <Story />
                        </div>
                    </HeroUIProvider>
                </NextIntlClientProvider>
            )
        },
    ],
}

export default preview
