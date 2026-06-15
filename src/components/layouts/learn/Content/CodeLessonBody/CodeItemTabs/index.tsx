"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Tabs, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types"

export interface CodeItemTabsProps<T extends { id: string }> extends WithClassNames<undefined> {
    /** Rows to show as tabs (one panel each). */
    items: Array<T>
    /** Tab label for each row (e.g. language or index). */
    getTabLabel: (item: T) => string
    /** Accessible name for the tab list. */
    ariaLabel: string
    /** Panel body for the selected row. */
    renderPanel: (item: T) => React.ReactNode
}

/**
 * Horizontal tabs for a list of code lesson items (language or snippet index).
 * @param props.items - Sorted items to tab through.
 * @param props.getTabLabel - Label shown on each tab trigger.
 * @param props.ariaLabel - A11y label for the tab list.
 * @param props.renderPanel - Content for the active tab.
 * @param props.className - Optional wrapper class.
 */
export const CodeItemTabs = <T extends { id: string }>({
    items,
    getTabLabel,
    ariaLabel,
    renderPanel,
    className,
}: CodeItemTabsProps<T>) => {
    const firstId = items[0]?.id ?? ""

    const [selectedId, setSelectedId] = useState(firstId)

    const selectedItem = useMemo(
        () => items.find((item) => item.id === selectedId) ?? items[0],
        [items, selectedId],
    )

    useEffect(() => {
        if (!items.length) {
            return
        }
        const stillSelected = items.some((item) => item.id === selectedId)
        if (!stillSelected) {
            setSelectedId(items[0].id)
        }
    }, [items, selectedId])

    if (!items.length || !selectedItem) {
        return null
    }

    if (items.length === 1) {
        return (
            <div className={className}>
                {renderPanel(selectedItem)}
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col", className)}>
            <Tabs
                selectedKey={selectedId}
                variant="secondary"
                onSelectionChange={(key) => setSelectedId(String(key))}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label={ariaLabel}>
                        {items.map((item) => (
                            <Tabs.Tab
                                key={item.id}
                                id={item.id}
                                className="rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"
                            >
                                {getTabLabel(item)}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs.ListContainer>
            </Tabs>
            <div className="h-3" />
            <div>{renderPanel(selectedItem)}</div>
        </div>
    )
}
