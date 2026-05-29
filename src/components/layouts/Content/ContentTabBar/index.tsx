"use client"

import React, {
    type Key,
} from "react"
import {
    Tabs,
} from "@heroui/react"
import type {
    ContentTab,
} from "@/redux/slices"
import type {
    ContentTabItem,
} from "../types"
import {
    CONTENT_TAB_ICON_MAP,
} from "../map"
import {
    TabTrigger,
} from "./TabTrigger"

/** Props for {@link ContentTabBar}. */
export interface ContentTabBarProps {
    /** Tabs to render, in display order. */
    tabItems: Array<ContentTabItem>
    /** Currently selected tab key. */
    selectedKey: ContentTab
    /** Accessible name for the tab list. */
    ariaLabel: string
    /** Fired with the newly selected tab key. */
    onSelectionChange: (key: Key) => void
}

/**
 * Secondary tab bar shown above the content body (loading and loaded states).
 *
 * Presentational: maps {@link ContentTabItem} rows to triggers and forwards the
 * selection callback; no data or business logic.
 * @param props - tab items, selected key, a11y label and selection callback
 */
export const ContentTabBar = ({
    tabItems,
    selectedKey,
    ariaLabel,
    onSelectionChange,
}: ContentTabBarProps) => {
    return (
        <Tabs
            selectedKey={selectedKey}
            variant="secondary"
            onSelectionChange={onSelectionChange}
        >
            <Tabs.ListContainer>
                <Tabs.List aria-label={ariaLabel}>
                    {tabItems.map((item) => (
                        <Tabs.Tab
                            key={item.key}
                            id={item.key}
                            className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                        >
                            <TabTrigger
                                icon={CONTENT_TAB_ICON_MAP[item.key]}
                                label={item.label}
                            />
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs.ListContainer>
        </Tabs>
    )
}
