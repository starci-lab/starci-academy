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
    /**
     * `"secondary"` (default) = in-page content tabs — underline, hugs its own
     * label width, no outer baseline (this component's caller owns full-width
     * chrome if it wants any, §1). `"primary"` = page-FEATURE tabs that switch
     * the ENTIRE panel content — full-width, evenly-stretched segmented pill
     * (HeroUI's own default Tabs look). Use `"primary"` for top-level section
     * switches (e.g. Bắt đầu/Lịch sử/Thống kê), `"secondary"` for a content
     * filter/language-switcher. Applies to BOTH groups (a toolbar is either
     * page-feature nav or in-page filter nav, not a mix).
     */
    variant?: "primary" | "secondary"
    /**
     * `"md"` (default) = full-width `"primary"` tabs (unchanged). `"sm"`
     * shrinks BOTH groups to a compact `w-fit` strip with smaller
     * padding/text — for a `"primary"` choice that's a secondary/nested
     * setting, not a top-level page switch (e.g. a toggle inside a modal
     * panel). No effect on `"secondary"` (already hug-content).
     */
    size?: "sm" | "md"
}

/** size → extra Tab className override (md = HeroUI's own default, no override). */
const TAB_SIZE_SM = "h-auto! w-auto! px-3! py-2! text-xs!"

/**
 * Selected-state TEXT color only (accent tab group) — the underline itself now
 * comes from `<Tabs.Indicator/>` (native HeroUI `.tabs--secondary` accent bar).
 * Corrected 2026-07-09: this used to ALSO draw its own manual `border-b-2
 * border-accent`, which — once `<Tabs.Indicator/>` was added per tabs.md §5 —
 * doubled up with the indicator's own bottom line under the same tab.
 */
const TAB_CLASS_ACCENT = "rounded-none data-[selected=true]:text-accent-soft-foreground"

/**
 * Selected-state chrome — NEUTRAL foreground underline (secondary toggle
 * group, no accent). Kept on the MANUAL `border-b-2` technique (unlike
 * `TAB_CLASS_ACCENT` above) because `.tabs--secondary`'s indicator is
 * hardcoded `bg-accent` — there is no "neutral-colored" native indicator to
 * switch to, so `<Tabs.Indicator/>` is suppressed for this path (see below).
 */
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
    variant = "secondary",
    size = "md",
    className,
}: TabsCardProps) => {
    /** Render one controlled tab group (`accent` = accent selected chrome, secondary-only). */
    const renderGroup = (group: TabsCardGroup, accent = true): ReactNode => (
        <ExtendedTabs
            variant={variant}
            size={size}
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
                            className={cn(
                                variant === "secondary" && (accent ? TAB_CLASS_ACCENT : TAB_CLASS_NEUTRAL),
                                size === "sm" && TAB_SIZE_SM,
                                item.muted && "text-muted",
                            )}
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
                            {/* REQUIRED for "primary" and secondary-ACCENT (fe/components/tabs.md
                                §5) — HeroUI Tabs renders no selected-state chrome of its own;
                                without this, "primary" reads as plain undifferentiated text (no
                                floating pill) and secondary-accent has no underline at all.
                                Suppressed for secondary-NEUTRAL: `.tabs--secondary`'s indicator is
                                hardcoded `bg-accent` (no neutral color option), so that path keeps
                                its OWN `border-b-2 border-foreground` (TAB_CLASS_NEUTRAL) as the
                                sole indicator instead of doubling up with a wrong-colored one. */}
                            {(variant === "primary" || accent) && <Tabs.Indicator />}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs.ListContainer>
            {/* react-aria's useTab ALWAYS computes an `aria-controls` id pointing at
                a tabpanel with this tab's key, whether or not one is ever rendered
                (no console warning fires — see fe review 2026-07-14). Without this,
                the selected tab's `aria-controls` dangles at a non-existent element,
                an axe-core/Lighthouse-flagged a11y bug. `TabsCard` never shows panel
                CONTENT here (callers render their own content elsewhere), so these
                panels stay empty/`sr-only` — they exist purely to satisfy the
                tab↔tabpanel ARIA relationship. */}
            {group.items.map((item) => (
                <Tabs.Panel key={item.key} id={item.key} className="sr-only">{null}</Tabs.Panel>
            ))}
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
