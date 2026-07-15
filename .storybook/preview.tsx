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
 * Render inline markdown in the "Cách dùng" caption — backtick `code` spans become
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
    // autodocs: render each story's JSDoc as its "cách dùng" description in the Docs tab.
    tags: ["autodocs"],
    parameters: {
        a11y: { test: "error" },
        controls: { expanded: true },
        // full-bleed canvas for EVERY story — the decorator below fills it
        // (`min-h-screen w-full p-8`) and content flows from the top-left. No
        // per-story `layout` overrides: one uniform canvas across the whole book
        // (thầy 2026-07-15: "full canvas trên trái"). `fullscreen` (not the SB
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
            // Show the story's "cách dùng" (its JSDoc) as a caption ON the canvas —
            // not just in the Docs tab. Only on the canvas (viewMode "story") so it
            // doesn't duplicate the description Docs already renders.
            const usage = context.parameters?.usage || context.parameters?.docs?.description?.story
            const showUsage = usage && context.viewMode === "story"
            return (
                <NextIntlClientProvider locale="vi" messages={messages}>
                    <HeroUIProvider>
                        <div className={`${theme} bg-background text-foreground min-h-screen w-full p-8`}>
                            {showUsage ? (
                                // standalone on the page canvas (not nested in another
                                // surface) → raw `Alert`, default surface+shadow is
                                // correct here (alert.md §3 — Callout's tint/no-shadow
                                // is only for surface-in-surface).
                                <Alert status="accent" className="mb-6">
                                    {/* same Phosphor-icon + size-6 rule as `Callout` (fe review
                                        2026-07-14) — never HeroUI's own internal icon-family
                                        fallback (`Alert`'s bare `getDefaultIcon()`). */}
                                    <Alert.Indicator className="[&_svg]:size-6!">
                                        <InfoIcon />
                                    </Alert.Indicator>
                                    <Alert.Content>
                                        <Alert.Title>Cách dùng</Alert.Title>
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
