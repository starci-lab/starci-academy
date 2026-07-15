"use client"

import React from "react"
import {
    Accordion,
    Link,
    Typography,
    cn,
} from "@heroui/react"
import {
    useSidebarCollapsed,
} from "../CollapsibleSidebar/context"
import type {
    IconComponent,
} from "@/types"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** One expandable child destination inside a {@link SidebarNavAccordionGroup}. */
export interface SidebarNavAccordionChild {
    /** Stable list key. */
    value: string
    /** Visible label text. */
    label: string
    /** Whether this child is the current destination (accent fill). */
    isActive?: boolean
    /** Fired when the row is activated. */
    onPress: () => void
}

/** Props for the {@link SidebarNavAccordionGroup} block. */
export interface SidebarNavAccordionGroupProps extends WithClassNames<undefined> {
    /** Leading icon of the group trigger row. */
    icon: IconComponent
    /** Visible label of the group trigger row. */
    label: string
    /** The expandable child destinations. */
    items: Array<SidebarNavAccordionChild>
}

/**
 * A {@link import("../SidebarNavItem").SidebarNavItem}-weight sidebar row that
 * expands in place to a short list of child destinations, instead of routing
 * directly — for a small fixed cluster of related surfaces (e.g. the
 * Playground's Docker/Kubernetes/RAG exercises) that doesn't warrant its own
 * flat rows cluttering the nav. Built on HeroUI `Accordion` (`variant="default"`
 * — it sits directly on the sidebar's own background, not a card surface, per
 * `fe/components/accordion.md` §3 "chọn da theo ngữ cảnh nền"), single item,
 * closed by default.
 *
 * @param props - {@link SidebarNavAccordionGroupProps}
 */
export const SidebarNavAccordionGroup = ({
    icon: Icon,
    label,
    items,
    className,
}: SidebarNavAccordionGroupProps) => {
    // collapsed rail (icon-only) has no room for a panel — fall back to the
    // plain icon trigger; the accordion still expands on click if pressed.
    const collapsed = useSidebarCollapsed()
    return (
        <Accordion variant="default" className={cn("w-full", className)}>
            <Accordion.Item aria-label={label}>
                <Accordion.Heading>
                    <Accordion.Trigger
                        className={cn(
                            "flex min-h-9 w-full items-center gap-2 rounded-large px-3 py-2 text-foreground no-underline transition-colors hover:bg-default/40",
                            collapsed && "mx-auto w-fit justify-center gap-0 px-2",
                        )}
                    >
                        <Icon className="size-5 shrink-0" />
                        {!collapsed ? (
                            <>
                                <Typography type="body-sm" className="min-w-0 flex-1 text-left" truncate>
                                    {label}
                                </Typography>
                                <Accordion.Indicator />
                            </>
                        ) : null}
                    </Accordion.Trigger>
                </Accordion.Heading>
                {!collapsed ? (
                    <Accordion.Panel>
                        <Accordion.Body className="flex flex-col gap-1 pt-1 pl-4">
                            {items.map((child) => (
                                <Link
                                    key={child.value}
                                    aria-label={child.label}
                                    aria-current={child.isActive ? "page" : undefined}
                                    onPress={child.onPress}
                                    className={cn(
                                        "flex min-h-8 w-full cursor-pointer items-center rounded-large px-3 py-2 no-underline transition-colors",
                                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                                        child.isActive
                                            ? "bg-accent-soft text-accent-soft-foreground"
                                            : "text-foreground hover:bg-default/40",
                                    )}
                                >
                                    <Typography
                                        type="body-sm"
                                        className={cn("min-w-0 flex-1", child.isActive ? "text-accent-soft-foreground" : undefined)}
                                        weight={child.isActive ? "medium" : "normal"}
                                        truncate
                                    >
                                        {child.label}
                                    </Typography>
                                </Link>
                            ))}
                        </Accordion.Body>
                    </Accordion.Panel>
                ) : null}
            </Accordion.Item>
        </Accordion>
    )
}
