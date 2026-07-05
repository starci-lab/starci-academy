"use client"

import React, {
    type Key,
    type ReactNode,
} from "react"
import {
    ListBox,
    Select,
    Tabs,
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    ExtendedTabs,
} from "../ExtendedTabs"

/** One tab in a {@link TabsCardGroup}. */
export interface TabsCardItem {
    /** Stable id used as the selection key. */
    key: string
    /** Tab content (text, or an icon + text row). */
    label: ReactNode
    /** Optional leading icon rendered before the label. */
    icon?: ReactNode
    /** Render the tab but block selection. */
    isDisabled?: boolean
    /** Render muted — for a locked/premium tab that is still clickable (the parent
     * intercepts the selection, e.g. to open a paywall). */
    muted?: boolean
}

/** A controlled group of secondary tabs — one side of a {@link TabsCard}. */
export interface TabsCardGroup {
    /** Tabs in display order. */
    items: Array<TabsCardItem>
    /** Currently selected tab key. */
    selectedKey: string
    /** Accessible name for this group's tab list. */
    ariaLabel: string
    /** Fired with the newly selected tab key. */
    onSelectionChange: (key: Key) => void
}

/** Props for the {@link TabsCard} block. */
export interface TabsCardProps extends WithClassNames<undefined> {
    /** Primary tab group, pinned left. */
    leftTabs: TabsCardGroup
    /**
     * Inline cluster rendered right AFTER the left tab group — actions that belong
     * to the left axis (e.g. a manage-menu for the active tab, an "+" add button,
     * an overflow count). Rendered as SIBLINGS of the tab list, never inside a
     * `Tabs.Tab` (react-aria tabs can't nest interactive elements).
     */
    leftEnd?: ReactNode
    /** Optional secondary tab group, pinned right (e.g. a language switcher). */
    rightTabs?: TabsCardGroup
    /**
     * Collapse `rightTabs` into a compact dropdown below `sm` (mobile), expanding
     * back to inline tabs from `sm` up. Use when the right group is a set-once
     * preference (e.g. the language switcher) that would crowd a narrow reading
     * column. Defaults to inline at every width.
     */
    collapseRightOnMobile?: boolean
    /**
     * Render `rightTabs` with NEUTRAL selected chrome (foreground underline) instead
     * of accent. Use when the right group is a "same content, different presentation"
     * toggle (e.g. the language switcher) — only the primary `leftTabs` group should
     * carry the accent, so the toolbar has one accent signal, not two. Defaults to
     * accent (both groups accent).
     */
    rightTabsNeutral?: boolean
}

/** Selected-state chrome — accent underline + accent text (primary tab group). */
const TAB_CLASS_ACCENT =
    "rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-accent data-[selected=true]:text-accent"

/** Selected-state chrome — NEUTRAL foreground underline (secondary toggle group, no accent). */
const TAB_CLASS_NEUTRAL =
    "rounded-none data-[selected=true]:border-b-2 data-[selected=true]:border-foreground data-[selected=true]:font-medium data-[selected=true]:text-foreground"

/**
 * Two secondary (underline) tab groups sharing one toolbar row: `leftTabs` pinned
 * left, optional `rightTabs` pinned right, a `gap-3` gutter between them. Both sides
 * use the same secondary chrome (no primary), so the row reads as one nav layer —
 * e.g. content tabs on the left and a language switcher on the right. Pass each side
 * as data (items + selectedKey + onSelectionChange); the block owns all styling.
 *
 * @param props - {@link TabsCardProps}
 */
export const TabsCard = ({
    leftTabs,
    leftEnd,
    rightTabs,
    collapseRightOnMobile,
    rightTabsNeutral,
    className,
}: TabsCardProps) => {
    /** Render one controlled secondary tab group (`accent` = accent selected chrome). */
    const renderGroup = (group: TabsCardGroup, accent = true): ReactNode => (
        <ExtendedTabs
            selectedKey={group.selectedKey}
            onSelectionChange={group.onSelectionChange}
        >
            <Tabs.ListContainer>
                <Tabs.List aria-label={group.ariaLabel}>
                    {group.items.map((item) => (
                        <Tabs.Tab
                            key={item.key}
                            id={item.key}
                            isDisabled={item.isDisabled}
                            className={cn(accent ? TAB_CLASS_ACCENT : TAB_CLASS_NEUTRAL, item.muted && "text-muted")}
                        >
                            <span className="flex items-center gap-2">
                                {item.icon}
                                {/* a tab WITH an icon hides its label visually on mobile
                                    (icon-only) and shows it from sm up; `sr-only` keeps the
                                    accessible name on mobile. An icon-less tab always shows it. */}
                                {item.label ? (
                                    <span className={cn(item.icon && "sr-only sm:not-sr-only")}>
                                        {item.label}
                                    </span>
                                ) : null}
                            </span>
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs.ListContainer>
        </ExtendedTabs>
    )

    /**
     * Render `group` as a compact single-select dropdown — the mobile form of a
     * set-once right group (e.g. the language switcher) so it never crowds the row.
     */
    const renderSelect = (group: TabsCardGroup): ReactNode => {
        const selected = group.items.find((item) => item.key === group.selectedKey)
        return (
            <Select.Root<{ id: string }, "single">
                variant="secondary"
                aria-label={group.ariaLabel}
                selectedKey={group.selectedKey}
                onSelectionChange={(key) => {
                    if (key !== null) {
                        group.onSelectionChange(key)
                    }
                }}
            >
                <Select.Trigger aria-label={group.ariaLabel}>
                    <Select.Value>
                        {() => (
                            <span className="flex items-center">
                                {selected?.icon}
                                {/* trigger is icon-only to stay compact; keep the
                                    selected option's name for screen readers */}
                                <span className="sr-only">{selected?.label}</span>
                            </span>
                        )}
                    </Select.Value>
                    <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                    <ListBox.Root aria-label={group.ariaLabel}>
                        {group.items.map((item) => (
                            <ListBox.Item
                                key={item.key}
                                id={item.key}
                                isDisabled={item.isDisabled}
                                textValue={
                                    typeof item.label === "string" ? item.label : item.key
                                }
                            >
                                <span className="flex items-center gap-2">
                                    {item.icon}
                                    {item.label}
                                </span>
                            </ListBox.Item>
                        ))}
                    </ListBox.Root>
                </Select.Popover>
            </Select.Root>
        )
    }

    return (
        <div className={cn("flex items-center justify-between gap-3", className)}>
            {leftEnd ? (
                <div className="flex min-w-0 items-center gap-1">
                    {renderGroup(leftTabs)}
                    {leftEnd}
                </div>
            ) : renderGroup(leftTabs)}
            {rightTabs
                ? collapseRightOnMobile
                    ? (
                        <>
                            {/* mobile: collapse to a dropdown; sm+: inline tabs */}
                            <div className="sm:hidden">{renderSelect(rightTabs)}</div>
                            <div className="hidden sm:block">{renderGroup(rightTabs, !rightTabsNeutral)}</div>
                        </>
                    )
                    : renderGroup(rightTabs, !rightTabsNeutral)
                : null}
        </div>
    )
}
