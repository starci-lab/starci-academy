"use client"

import React, {
    type Key,
} from "react"
import {
    cn,
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
        // outermost: full-width underline edge-to-edge (the only divider under the tab row)
        <div className="w-full border-b">
            {/* capped + centered wrapper so the tabs line up with the 1024 reading column */}
            <div className="mx-auto w-full max-w-[1024px] px-3">
                <Tabs
                    selectedKey={selectedKey}
                    variant="secondary"
                    onSelectionChange={onSelectionChange}
                    className="w-full"
                >
                    <Tabs.ListContainer className="w-full">
                        {/* kill HeroUI secondary's own list border so only the full-width line above shows */}
                        <Tabs.List aria-label={ariaLabel} className="w-full border-b-0!">
                            {tabItems.map((item) => (
                                <Tabs.Tab
                                    key={item.key}
                                    id={item.key}
                                    className={cn(
                                        "rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent",
                                        // locked premium tab: muted but still clickable (opens the register modal)
                                        item.locked && "text-muted",
                                    )}
                                >
                                    <TabTrigger
                                        icon={CONTENT_TAB_ICON_MAP[item.key]}
                                        label={item.label}
                                        locked={item.locked}
                                    />
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Tabs>
            </div>
        </div>
    )
}
