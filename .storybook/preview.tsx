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
 *
 * The canvas is intentionally CLEAN: the story renders JUST the component + its states.
 * A story's JSDoc still becomes its description in the Docs/Overview tab (autodocs), but is
 * NOT painted as a "Usage" alert on the canvas (thầy: bỏ usage khỏi canvas).
 */
const preview: Preview = {
    // autodocs: render each story's JSDoc as its description in the Docs/Overview tab.
    tags: ["autodocs"],
    parameters: {
        a11y: { test: "error" },
        controls: { expanded: true },
        // App Router everywhere → let @storybook/nextjs build the `next/navigation`
        // router mocks. Without this the framework wires the PAGES router instead and
        // any block calling `useRouter()` (CourseCard, BackLink, EntityLink…) throws
        // NextjsRouterMocksNotAvailable on render.
        nextjs: { appDirectory: true },
        // full-bleed canvas for EVERY story — the decorator below fills it
        // (`min-h-screen w-full`) and content flows from the top-left. Each story owns
        // its OWN `p-8` wrapper (the decorator adds no padding — no double-padding).
        layout: "fullscreen",
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
            return (
                <NextIntlClientProvider locale="vi" messages={messages}>
                    <HeroUIProvider>
                        {/* `@container` MIRRORS the app shell: the real app renders inside a
                            container-marked column (`InnerLayout`) so it can re-lay-out when the
                            chat rail narrows it, and every component's breakpoints are `@app-*`
                            container variants. Without a container here, those variants would
                            have nothing to measure and every story would render at its narrowest
                            layout — the canvas must establish one for stories to match the app. */}
                        <div className={`${theme} @container bg-background text-foreground min-h-screen w-full`}>
                            <Story />
                        </div>
                    </HeroUIProvider>
                </NextIntlClientProvider>
            )
        },
    ],
}

export default preview
