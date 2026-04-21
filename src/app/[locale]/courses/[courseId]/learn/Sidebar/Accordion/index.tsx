"use client"

import { Accordion, cn, ListBox } from "@heroui/react"
import { Icon } from "@phosphor-icons/react"
import React from "react"

interface SidebarAccordionSubItem {
    /** Unique key for each sub item. */
    key: string
    /** Display label of each sub item. */
    label: string
    /** Order index of each sub item. */
    orderIndex: number
}

export interface SidebarAccordionProps {
    /** Title shown in accordion trigger. */
    label: string
    /** Icon rendered for parent and sub items. */
    icon: Icon
    /** Nested items rendered inside accordion body. */
    items: Array<SidebarAccordionSubItem>
    /** Callback when selecting a nested item. */
    onSelectSubItem: (extraId: string) => void
    /** Selected nested item id. */
    extraId?: string
}

/**
 * Render sidebar item with nested modules inside accordion.
 * @param {SidebarAccordionProps} props Accordion data and display config.
 */
export const SidebarAccordion = ({
    label,
    icon: Icon,
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
                            <Icon className="size-5 shrink-0" />
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
