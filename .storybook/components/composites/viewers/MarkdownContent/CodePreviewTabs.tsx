"use client"

import React, { useState } from "react"
import { Tabs, cn } from "@heroui/react"
import { CodeIcon, SidebarIcon } from "@phosphor-icons/react"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/rendering/MarkdownContent/CodePreviewTabs`. Authored in
 * Storybook (not `src`); synced back to `src` later.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link CodePreviewTabs}. */
export interface CodePreviewTabsProps {
    /** Live render (the rendered demo pane). */
    preview: React.ReactNode
    /** Source code panel (Shiki-highlighted). */
    code: React.ReactNode
    /** Extra classes. */
    className?: string
    /** Where this sits inside its parent. */
    classNames?: Array<AllowedClassName>
}

/**
 * Presentational **[ Preview | Code ]** tabs, self-contained (HeroUI `Tabs` + phosphor icons).
 * Preview is selected first so the learner sees the rendered result, then flips to the code.
 * Shared by `TabsBlock` (the `:::tab` directive's dual panes) so the tab shell stays identical
 * and depends on NO layout component.
 * @param props - {@link CodePreviewTabsProps}
 */
export const CodePreviewTabs = ({ preview, code, className, classNames }: CodePreviewTabsProps) => {
    const [tab, setTab] = useState<"preview" | "code">("preview")
    const panes = (
        <>
            <Tabs
                selectedKey={tab}
                variant="secondary"
                onSelectionChange={(key) => setTab(String(key) === "code" ? "code" : "preview")}
            >
                <Tabs.ListContainer className="w-fit">
                    <Tabs.List aria-label="Preview / Code" className="w-fit">
                        <Tabs.Tab
                            id="preview"
                            className="data-[selected=true]:text-accent-soft-foreground"
                        >
                            <SidebarIcon />
                            Preview
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab
                            id="code"
                            className="data-[selected=true]:text-accent-soft-foreground"
                        >
                            <CodeIcon />
                            Code
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
            </Tabs>
            <div className={tab === "preview" ? "rounded-xl border border-divider p-3" : undefined}>
                {tab === "preview" ? preview : code}
            </div>
        </>
    )
    return (
        <StackV
            gap="related"
            className={className ? cn("not-prose", className) : "not-prose"}
            classNames={classNames}
            body={panes}
        />
    )
}
