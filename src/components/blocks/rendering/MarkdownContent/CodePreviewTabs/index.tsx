"use client"

import React, { useState } from "react"
import { Tabs } from "@heroui/react"
import { CodeIcon, SidebarIcon } from "@phosphor-icons/react"

/** Props for {@link CodePreviewTabs}. */
export interface CodePreviewTabsProps {
    /** Live render (the rendered React component). */
    preview: React.ReactNode
    /** Source code panel (Shiki-highlighted). */
    code: React.ReactNode
}

/**
 * Presentational **[ Preview | Code ]** tabs, self-contained (HeroUI `Tabs` + phosphor icons).
 * Preview is selected first so the learner sees the rendered result, then flips to the code.
 * Shared by {@link RenderReactComponent} (single ` ```mdx ` source) and TabsBlock (dual
 * `:::tab` panes) so the tab shell stays identical and depends on NO layout component.
 * @param props - {@link CodePreviewTabsProps}
 */
export const CodePreviewTabs = ({ preview, code}: CodePreviewTabsProps) => {
    const [tab, setTab] = useState<"preview" | "code">("preview")
    return (
        <div className={"not-prose flex flex-col gap-2"}>
            <Tabs
                selectedKey={tab}
                variant="secondary"
                onSelectionChange={(key) => setTab(String(key) === "code" ? "code" : "preview")}
            >
                <Tabs.ListContainer className="w-fit bg-transparent">
                    <Tabs.List aria-label="Preview / Code" className="w-fit bg-transparent">
                        <Tabs.Tab
                            id="preview"
                            data-principle="icon-text"
                            className="gap-1 rounded-none data-[selected=true]:text-accent-soft-foreground"
                        >
                            <SidebarIcon />
                            Preview
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab
                            id="code"
                            data-principle="icon-text"
                            className="gap-1 rounded-none data-[selected=true]:text-accent-soft-foreground"
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
        </div>
    )
}
