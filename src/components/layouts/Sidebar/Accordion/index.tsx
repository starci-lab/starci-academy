"use client"

import type { IconComponent } from "@/types"
import React from "react"
import {
    Accordion,
    cn,
    ListBox,
} from "@heroui/react"

/**
 * One nested module item rendered inside {@link SidebarAccordion}.
 */
interface SidebarAccordionSubItem {
    /** Unique key for each sub item. */
    key: string
    /** Display label of each sub item. */
    label: string
    /** Order index of each sub item. */
    orderIndex: number
}

/**
 * Props for {@link SidebarAccordion}.
 */
export interface SidebarAccordionProps {
    /** Title shown in accordion trigger. */
    label: string
    /** IconComponent rendered for parent and sub items. */
    icon: IconComponent
    /** Nested items rendered inside accordion body. */
    items: Array<SidebarAccordionSubItem>
    /** Fired with the sub-item key when a nested item is selected. */
    onSelectSubItem: (extraId: string) => void
    /** Selected nested item id. */
    extraId?: string
}

/**
 * SidebarAccordion — a sidebar row with nested modules inside an accordion.
 *
 * Presentational: renders the passed items and forwards selection via
 * `onSelectSubItem`. `"use client"` for the press handlers.
 * @param props - accordion data and display config
 */
export const SidebarAccordion = ({
    label,
    icon: IconComponent,
    items,
    onSelectSubItem,
    extraId,
}: SidebarAccordionProps) => {
    return (
        <Accordion>
            <Accordion.Item>
                <Accordion.Heading>
                    <Accordion.Trigger>
                        <div className="flex w-full items-center gap-2">
                            <IconComponent className="size-5 shrink-0" />
                            <span className={cn("hidden sm:inline text-base font-normal")}>{label}</span>
                        </div>
                        <Accordion.Indicator />
                    </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                    <Accordion.Body>
                        <div className="flex w-full flex-col gap-3 text-start text-sm">
                            <ListBox
                                selectedKeys={extraId ? [extraId] : []}
                                selectionMode="single"
                            >
                                {items.map((subItem) => (
                                    <ListBox.Item
                                        key={subItem.key}
                                        value={subItem}
                                        onPress={() => onSelectSubItem(subItem.key)}
                                        className={cn("", subItem.key === extraId ? "text-accent bg-accent/10" : "")}
                                    >
                                        <span className="hidden sm:inline">{`${subItem.orderIndex + 1}. ${subItem.label}`}</span>
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </div>
                    </Accordion.Body>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}
