import React, { type Key, type ReactNode } from "react"
import { cn } from "@heroui/react"
import {
    TabsExtended,
    TabsListContainer,
    TabsList,
    TabsTab,
    TabsIndicator,
    TabsPanel,
} from "@/components/atoms/navigation/Tabs"
import {
    SelectRoot,
    SelectTrigger,
    SelectValue,
    SelectIndicator,
    SelectPopover,
} from "@/components/atoms/forms/Select"
import { ListBoxRoot, ListBoxItem } from "@/components/atoms/forms/ListBox"
import { StackH } from "@/components/frames/Stack"
/**
 * `Toolbar` — the nav/control-row frame sitting above a panel: the primary tab group pinned
 * left (+ an action cluster `leftEnd` right after it), a secondary tab group pinned right,
 * collapsing into a dropdown below `@app-sm`. No chrome; root is
 * `flex items-center justify-between gap-3`. Tab groups come in as data
 * (`items`/`selectedKey`/`onSelectionChange`), and each tab's display state (disabled/muted) is drawn here.
 */
/** One tab in a {@link ToolbarTabGroup}. */
export interface ToolbarTabItem {
    /** Stable id used as the selection key. */
    key: string
    /** Tab content (text, or an icon + text row). */
    label: ReactNode
    /**
     * Set -> shown INSTEAD of `label` below `@app-sm` (e.g. "TS" for "TypeScript"),
     * `label` returns from `@app-sm` up: a shortened tab beats collapsing the
     * group behind `collapseRightOnMobile`'s dropdown when every option should
     * stay reachable in one tap. Omit -> unchanged (no compact swap).
     */
    compactLabel?: ReactNode
    /** Optional leading icon rendered before the label. */
    icon?: ReactNode
    /** Render the tab but block selection. */
    isDisabled?: boolean
    /** Render muted — for a locked/premium tab that is still clickable (the parent
     * intercepts the selection, e.g. to open a paywall). */
    muted?: boolean
}
/** A controlled group of tabs — one side of a {@link Toolbar} row. */
export interface ToolbarTabGroup {
    /** Tabs in display order. */
    items: Array<ToolbarTabItem>
    /** Currently selected tab key. */
    selectedKey: string
    /** Accessible name for this group's tab list. */
    ariaLabel: string
    /** Fired with the newly selected tab key. */
    onSelectionChange: (key: Key) => void
}
/** Props for {@link Toolbar}. */
export interface ToolbarBaseProps {
    /** Primary tab group, pinned left. */
    leftTabs: ToolbarTabGroup
    /**
     * Inline cluster rendered right AFTER the left tab group — actions that belong
     * to the left axis (e.g. a manage-menu for the active tab, an "+" add button,
     * an overflow count). Rendered as SIBLINGS of the tab list, never inside a
     * `Tabs.Tab` (react-aria tabs can't nest interactive elements).
     */
    leftEnd?: ReactNode
    /** Optional secondary tab group, pinned right (e.g. a language switcher). */
    rightTabs?: ToolbarTabGroup
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
     * label width, no outer baseline. `"primary"` = page-FEATURE tabs that switch
     * the ENTIRE panel content — full-width, evenly-stretched segmented pill.
     * Applies to BOTH groups.
     */
    variant?: "primary" | "secondary"
    /**
     * `"md"` (default) = full-width `"primary"` tabs (unchanged). `"sm"`
     * shrinks BOTH groups to a compact `w-fit` strip with smaller
     * padding/text. No effect on `"secondary"` (already hug-content).
     */
    size?: "sm" | "md"
    /** Layout utilities on the toolbar row, from the closed positioning union. */
    /** Dev/spec: overlay the anatomy annotation on this toolbar. */
}
/** size -> extra Tab className override (md = HeroUI's own default, no override). */
const TAB_SIZE_SM = "h-auto! w-auto! px-3! py-2! text-xs!"
/**
 * Selected-state TEXT color only (accent tab group) — the underline itself now
 * comes from `<TabsIndicator/>` (native HeroUI `.tabs--secondary` accent bar).
 */
const TAB_CLASS_ACCENT = "data-[selected=true]:text-accent-soft-foreground"
/**
 * Selected-state chrome — NEUTRAL foreground underline (secondary toggle
 * group, no accent). Kept on the MANUAL `border-b-2` technique because
 * `.tabs--secondary`'s indicator is hardcoded `bg-accent` — there is no
 * "neutral-colored" native indicator to switch to, so `<TabsIndicator/>` is
 * suppressed for this path (see below).
 */
const TAB_CLASS_NEUTRAL =
    "data-[selected=true]:border-b-2 data-[selected=true]:border-foreground data-[selected=true]:font-medium data-[selected=true]:text-foreground"
/**
 * The toolbar row: `leftTabs` pinned left (+ an optional `leftEnd` action cluster
 * beside it), optional `rightTabs` pinned right, a `gap-3` gutter between them.
 * Both sides share the same chrome, so the row reads as ONE nav layer — e.g.
 * content tabs on the left and a language switcher on the right. Pass each side
 * as data (items + selectedKey + onSelectionChange); the frame owns all styling.
 *
 * Carries no surface of its own — it sits on whatever background the caller
 * already opened (page, panel, or a `SurfaceCard.*` body).
 *
 * @param props - {@link ToolbarBaseProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "Toolbar" } as const

const ToolbarBase = ({
    leftTabs,
    leftEnd,
    rightTabs,
    collapseRightOnMobile,
    rightTabsNeutral,
    variant = "secondary",
    size = "md",
    
}: ToolbarBaseProps) => {
    /** Render one controlled tab group (`accent` = accent selected chrome, secondary-only). */
    const renderGroup = (group: ToolbarTabGroup, accent = true): ReactNode => (
        <TabsExtended
            variant={variant}
            size={size}
            selectedKey={group.selectedKey}
            onSelectionChange={group.onSelectionChange}
        >
            <TabsListContainer>
                <TabsList aria-label={group.ariaLabel}>
                    {group.items.map((item) => (
                        <TabsTab
                            key={item.key}
                            id={item.key}
                            isDisabled={item.isDisabled}
                            className={cn(
                                variant === "secondary" && (accent ? TAB_CLASS_ACCENT : TAB_CLASS_NEUTRAL),
                                size === "sm" && TAB_SIZE_SM,
                            )}
                        >
                            <StackH
                                gap={3}
                                principle="icon-text"
                                explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                                items={[
                                    () => <>{item.icon}</>,
                                    // a tab WITH an icon hides its label visually on mobile
                                    // (icon-only) and shows it from sm up; `sr-only` keeps the
                                    // accessible name on mobile. An icon-less tab always shows it.
                                    ...(item.compactLabel != null ? [() => (
                                        <>
                                            <span className="@app-sm:hidden">{item.compactLabel}</span>
                                            <span className="hidden @app-sm:inline">{item.label}</span>
                                        </>
                                    )] : item.label ? [() => (
                                        <span className={cn(item.icon && "sr-only @app-sm:not-sr-only")}>
                                            {item.label}
                                        </span>
                                    )] : []),
                                ]}
                            />
                            {/* REQUIRED for "primary" and secondary-ACCENT — HeroUI Tabs
                                renders no selected-state chrome of its own. Suppressed for
                                secondary-NEUTRAL: `.tabs--secondary`'s indicator is hardcoded
                                `bg-accent`, so that path keeps its OWN `border-b-2
                                border-foreground` (TAB_CLASS_NEUTRAL) as the sole indicator. */}
                            {(variant === "primary" || accent) && <TabsIndicator />}
                        </TabsTab>
                    ))}
                </TabsList>
            </TabsListContainer>
            {/* react-aria's useTab ALWAYS computes an `aria-controls` id pointing at
                a tabpanel with this tab's key, whether or not one is ever rendered.
                `Toolbar` never shows panel CONTENT here (callers render their own
                content elsewhere), so these panels stay empty/`sr-only` — they exist
                purely to satisfy the tab<->tabpanel ARIA relationship. */}
            {group.items.map((item) => (
                <TabsPanel key={item.key} id={item.key} className="sr-only">{null}</TabsPanel>
            ))}
        </TabsExtended>
    )
    /**
     * Render `group` as a compact single-select dropdown — the mobile form of a
     * set-once right group (e.g. the language switcher) so it never crowds the row.
     */
    const renderSelect = (group: ToolbarTabGroup): ReactNode => {
        const selected = group.items.find((item) => item.key === group.selectedKey)
        return (
            <SelectRoot
                variant="secondary"
                aria-label={group.ariaLabel}
                selectedKey={group.selectedKey}
                onSelectionChange={(key) => {
                    if (key !== null) {
                        group.onSelectionChange(key)
                    }
                }}
            >
                <SelectTrigger aria-label={group.ariaLabel}>
                    <SelectValue>
                        {() => (
                            <span className="flex items-center">
                                {selected?.icon}
                                {/* trigger is icon-only to stay compact; keep the
                                    selected option's name for screen readers */}
                                <span className="sr-only">{selected?.label}</span>
                            </span>
                        )}
                    </SelectValue>
                    <SelectIndicator />
                </SelectTrigger>
                <SelectPopover>
                    {/* `item.icon` stays OFF each row on purpose — it's the closed trigger's
                        only content (no room for text there), but once the popover is open
                        every row already reads its own full label; repeating the same icon
                        on every row adds no information (§5a.2, the "everyone already knows
                        this icon" rule: no icon purely decorating text that already reads on
                        its own). */}
                    <ListBoxRoot aria-label={group.ariaLabel}>
                        {group.items.map((item) => (
                            <ListBoxItem
                                key={item.key}
                                id={item.key}
                                isDisabled={item.isDisabled}
                                textValue={
                                    typeof item.label === "string" ? item.label : item.key
                                }
                            >
                                {item.label}
                            </ListBoxItem>
                        ))}
                    </ListBoxRoot>
                </SelectPopover>
            </SelectRoot>
        )
    }
    const leftGroup = leftEnd ? (
        <StackH
            gap={2}
            classNames={["min-w-0"]}
            items={[
                () => <div>{renderGroup(leftTabs)}</div>,
                () => <div>{leftEnd}</div>,
            ]}
        />
    ) : (
        <div>{renderGroup(leftTabs)}</div>
    )
    const rightGroup = rightTabs
        ? collapseRightOnMobile
            ? (
                <div>
                    {/* mobile: collapse to a dropdown (house SelectRoot); sm+: inline tabs
                        (atom TabsExtended) — BOTH real components mount at once (one hidden
                        via CSS), so each gets its OWN badge instead of one wrapper name that
                        could only honestly describe one of them. */}
                    <div className="@app-sm:hidden">{renderSelect(rightTabs)}</div>
                    <div className="hidden @app-sm:block">{renderGroup(rightTabs, !rightTabsNeutral)}</div>
                </div>
            )
            : <div>{renderGroup(rightTabs, !rightTabsNeutral)}</div>
        : null
    return (
        <StackH
            gap={4}
            justify="between"
            principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."

            items={[
                () => leftGroup,
                () => rightGroup,
            ]}
        />
    )
}
/**
 * The nav/control-row FRAME namespace — one member for now:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `leftTabs`/`rightTabs` as DATA groups + `leftEnd` node slot (no children) |
 */
export { ToolbarBase as Toolbar }
