"use client"

import React, { useState } from "react"
// ATOM GAP — `Tabs.ListContainer`/`Tabs.List`/`Tabs.Tab`/`Tabs.Indicator` come straight from the
// vendor because `TabsExtended` (the atom below) only wraps the ROOT `Tabs`; its own JSDoc
// documents that "the children still use the `Tabs.*` compound parts" — there is no atom-tier
// wrapper for the individual compound pieces themselves. Same established pattern as `Toolbar`.
import { Tabs } from "@heroui/react"
import { CodeIcon, SidebarIcon } from "@phosphor-icons/react"
import { TabsExtended } from "@/components/atoms/navigation/Tabs"
import { StackV } from "@/components/frames/Stack"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

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
    /** Where this sits inside its parent. */
    classNames?: Array<AllowedClassName>
}

/**
 * Presentational **[ Preview | Code ]** tabs, self-contained (the `TabsExtended`
 * ATOM root + phosphor icons — the compound children still come from HeroUI's
 * own `Tabs.*` namespace, which has no atom of its own beyond the root; see
 * `Toolbar.tsx` for the same split). Preview is selected first so the learner
 * sees the rendered result, then flips to the code. Shared by `TabsBlock` (the
 * `:::tab` directive's dual panes) so the tab shell stays identical and
 * depends on NO layout component.
 * @param props - {@link CodePreviewTabsProps}
 */
export const CodePreviewTabs = ({ preview, code, classNames }: CodePreviewTabsProps) => {
    const [tab, setTab] = useState<"preview" | "code">("preview")
    const panes = (
        <>
            <TabsExtended
                selectedKey={tab}
                variant="secondary"
                onSelectionChange={(key) => setTab(key === "code" ? "code" : "preview")}
            >
                <Tabs.ListContainer className="w-fit">
                    <Tabs.List aria-label="Preview / Code" className="w-fit">
                        <Tabs.Tab
                            id="preview"
                            data-principles="icon-text"
                            className="gap-1 data-[selected=true]:text-accent-soft-foreground"
                        >
                            <SidebarIcon />
                            Preview
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab
                            id="code"
                            data-principles="icon-text"
                            className="gap-1 data-[selected=true]:text-accent-soft-foreground"
                        >
                            <CodeIcon />
                            Code
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
            </TabsExtended>
            <div className={tab === "preview" ? "rounded-xl border border-divider p-3" : undefined}>
                {tab === "preview" ? preview : code}
            </div>
        </>
    )
    return (
        <StackV
            gap={3}
            classNames={classNames}
            body={panes}
        />
    )
}
