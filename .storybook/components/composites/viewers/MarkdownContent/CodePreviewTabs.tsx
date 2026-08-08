"use client"

import React, { useState } from "react"
import { CodeIcon, SidebarIcon } from "@phosphor-icons/react"
import {
    TabsExtended,
    TabsIndicator,
    TabsList,
    TabsListContainer,
    TabsTab,
} from "@sb-components/atoms/navigation/Tabs/Tabs"
import { StackV } from "@sb-components/frames/Stack/Stack"

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
}

/**
 * Presentational **[ Preview | Code ]** tabs, self-contained (`TabsExtended`
 * atom root + house tab parts + phosphor icons). Preview is selected first so
 * the learner sees the rendered result, then flips to the code. Shared by
 * `TabsBlock` (the `:::tab` directive's dual panes) so the tab shell stays
 * identical and depends on NO layout component.
 * @param props - {@link CodePreviewTabsProps}
 */
export const CodePreviewTabs = ({ preview, code }: CodePreviewTabsProps) => {
    const [tab, setTab] = useState<"preview" | "code">("preview")
    const panes = [
        () => (
            <TabsExtended
                selectedKey={tab}
                variant="secondary"
                onSelectionChange={(key) => setTab(key === "code" ? "code" : "preview")}
            >
                <TabsListContainer className="w-fit">
                    <TabsList aria-label="Preview / Code" className="w-fit">
                        <TabsTab
                            id="preview"
                            data-principle="icon-text" className="gap-1 data-[selected=true]:text-accent-soft-foreground"
                        >
                            <SidebarIcon />
                            Preview
                            <TabsIndicator />
                        </TabsTab>
                        <TabsTab
                            id="code"
                            data-principle="icon-text" className="gap-1 data-[selected=true]:text-accent-soft-foreground"
                        >
                            <CodeIcon />
                            Code
                            <TabsIndicator />
                        </TabsTab>
                    </TabsList>
                </TabsListContainer>
            </TabsExtended>
        ),
        () => (
            <div className={tab === "preview" ? "rounded-xl border border-divider p-3" : undefined}>
                {tab === "preview" ? preview : code}
            </div>
        ),
    ]
    return (
        <StackV
            principle="sibling-stack"
            explain="Preview and code panes are same-kind peers under the tab strip — not group-boundary, because they are alternating views rather than section groups."
            items={panes}
        />
    )
}
