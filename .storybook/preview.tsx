import type { Preview } from "@storybook/nextjs"
import React from "react"
import { Alert } from "@heroui/react"
import { InfoIcon } from "@phosphor-icons/react"
import { NextIntlClientProvider } from "next-intl"
import { HeroUIProvider } from "../src/components/providers/HeroUIProvider"
import messages from "../src/messages/vi.json"
import "../src/app/globals.css"

/**
 * Global decorator: HeroUI provider + Tailwind/HeroUI CSS + theme wrapper.
 * `theme` toolbar (light/dark) drives the `.dark`/`.light` class HeroUI/Tailwind read.
 * a11y addon runs axe on every story (fail-on-error surfaces contrast/aria bugs lint can't see).
 */
/**
 * Render inline markdown in the "Usage" caption — backtick `code` spans become
 * styled `<code>` (the usage strings are written in markdown). Lightweight on
 * purpose: only inline code, no block parsing / heavy markdown pipeline needed.
 */
const renderUsage = (text: string): React.ReactNode =>
    text.split(/(`[^`]+`)/g).map((part, index) =>
        part.length > 1 && part.startsWith("`") && part.endsWith("`") ? (
            <code key={index} className="rounded bg-default px-1 text-[13px] text-foreground">
                {part.slice(1, -1)}
            </code>
        ) : (
            <React.Fragment key={index}>{part}</React.Fragment>
        ),
    )

const preview: Preview = {
    // autodocs: render each story's JSDoc as its "usage" description in the Docs tab.
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
        // (`min-h-screen w-full p-8`) and content flows from the top-left. No
        // per-story `layout` overrides: one uniform canvas across the whole book
        // (full-bleed canvas, content anchored top-left). `fullscreen` (not the SB
        // default "padded"/"centered") is what lets the decorator's height reach
        // the real iframe — "centered" shrink-wraps it and strands `h-full`.
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
            // Show the story's "usage" text as an Alert caption ON the canvas —
            // not just in the Docs tab. Only on the canvas (viewMode "story") so it
            // doesn't duplicate the description Docs already renders.
            const usage = context.parameters?.usage || context.parameters?.docs?.description?.story
            const showUsage = usage && context.viewMode === "story"
            return (
                <NextIntlClientProvider locale="vi" messages={messages}>
                    <HeroUIProvider>
                        {/* `@container` MIRRORS the app shell: the real app renders inside a
                            container-marked column (`InnerLayout`) so it can re-lay-out when the
                            chat rail narrows it, and every component's breakpoints are `@app-*`
                            container variants. Without a container here, those variants would
                            have nothing to measure and every story would render at its narrowest
                            layout — the canvas must establish one for stories to match the app. */}
                        <div className={`${theme} @container bg-background text-foreground min-h-screen w-full p-8`}>
                            {showUsage ? (
                                // standalone on the page canvas → raw `Alert` (surface +
                                // shadow). Callout tint is only for surface-in-surface.
                                <Alert status="accent" className="mb-6">
                                    <Alert.Indicator className="[&_svg]:size-6!">
                                        <InfoIcon />
                                    </Alert.Indicator>
                                    <Alert.Content>
                                        <Alert.Title>Usage</Alert.Title>
                                        <Alert.Description>{renderUsage(usage)}</Alert.Description>
                                    </Alert.Content>
                                </Alert>
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
