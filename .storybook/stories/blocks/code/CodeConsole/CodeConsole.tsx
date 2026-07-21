"use client"

import React from "react"
import type { ReactNode } from "react"
import { Tabs, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/code/CodeConsole`.
 * Authored in Storybook (not `src`); synced to `src` later.
 * `WithClassNames<undefined>` collapses to an optional `className`, inlined here.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// TODO: swap for the ExtendedTabs local port when it exists under
// `.storybook/stories/blocks/navigation/ExtendedTabs`. Faithful inline copy of
// `@/components/blocks/navigation/ExtendedTabs` (a thin wrapper over HeroUI Tabs
// baking in the underline `.extended-tabs` look) — kept private to this file.
const ExtendedTabs = ({
    selectedKey,
    onSelectionChange,
    children,
    className,
    variant = "secondary",
    size = "md",
}: {
    selectedKey: string
    onSelectionChange: (key: string) => void
    children: ReactNode
    className?: string
    variant?: "primary" | "secondary"
    size?: "sm" | "md"
}) => {
    return (
        <Tabs
            variant={variant}
            selectedKey={selectedKey}
            onSelectionChange={(key) => onSelectionChange(String(key))}
            className={cn(
                // tab labels must never wrap to a 2nd line — white-space inherits down to
                // every Tabs.Tab, so a squeezed segment truncates (w-full) or sizes to the
                // one-line label (w-fit) instead of stacking words.
                "whitespace-nowrap",
                variant === "secondary" ? "extended-tabs" : size === "sm" ? "w-fit" : "w-full",
                className,
            )}
        >
            {children}
        </Tabs>
    )
}

/** One tab of a {@link CodeConsole} (e.g. "Test case", "Kết quả"). */
export interface CodeConsoleTab {
    /** Stable tab id. */
    key: string
    /** Tab label. */
    label: ReactNode
    /** Panel content shown when this tab is selected. */
    content: ReactNode
}

/** Props for the {@link CodeConsole} block. */
export interface CodeConsoleProps {
    /** Accessible label for the tab list. */
    ariaLabel: string
    /** The console tabs, in order. */
    tabs: Array<CodeConsoleTab>
    /** Selected tab id (controlled). */
    selectedTab: string
    /** Fired with the newly selected tab id. */
    onSelectTab: (key: string) => void
    /** Right-aligned action controls in the footer bar (e.g. Run / Submit). */
    actions: ReactNode
    /** Optional muted hint shown at the left of the footer bar. */
    hint?: ReactNode
    /** Extra classes on the outer console shell. */
    className?: string
}

/**
 * The bottom CONSOLE of a code workspace: a tab strip ({@link ExtendedTabs}) over
 * a scrollable panel, capped by a footer action bar (Run / Submit). Sits under an
 * editor, delineated by a top border; the block owns the shell (tabs · scroll ·
 * footer seam) so a feature only feeds tab content + the action controls. The
 * LeetCode-style console pattern — testcases and results in tabs, actions pinned.
 *
 * @param props - {@link CodeConsoleProps}
 */
export const CodeConsole = ({
    ariaLabel,
    tabs,
    selectedTab,
    onSelectTab,
    actions,
    hint,
    className,
}: CodeConsoleProps) => {
    const active = tabs.find((tab) => tab.key === selectedTab) ?? tabs[0]

    return (
        <div className={cn("flex min-h-0 flex-col border-t border-default bg-surface", className)}>
            <div className="px-3 pt-1">
                <ExtendedTabs selectedKey={selectedTab} onSelectionChange={onSelectTab}>
                    <Tabs.ListContainer>
                        <Tabs.List aria-label={ariaLabel}>
                            {tabs.map((tab) => (
                                <Tabs.Tab key={tab.key} id={tab.key}>
                                    {tab.label}
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                    </Tabs.ListContainer>
                </ExtendedTabs>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-3">
                {active?.content}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-default px-3 py-2">
                {hint ? <span className="text-xs text-muted">{hint}</span> : <span />}
                <div className="flex items-center gap-2">{actions}</div>
            </div>
        </div>
    )
}
