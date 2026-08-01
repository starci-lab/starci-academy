import React, { type Key, type ReactNode } from "react"
import { ListBox, Select, Tabs, cn } from "@heroui/react"
import { TabsExtended } from "@/components/atoms/navigation/Tabs"
import { StackH } from "@/components/frames/Stack"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSITE TIER (§13) — `Toolbar.*`, the FRAME of a nav/control ROW above a panel.
 *
 * ⚠️ RENAMED (2026-07-25): this was `TabsCard`. The name was a lie — there is no
 * card anywhere in it: the root is `flex items-center justify-between gap-3`,
 * with NO surface fill, NO border, NO radius, NO padding. What it actually is:
 * a TOOLBAR row that pins one tab group left, an optional inline action cluster
 * (`leftEnd`) right after it, and an optional second tab group right — collapsing
 * that right group into a compact dropdown below `@app-sm`. Behaviour and skin
 * are carried over VERBATIM; this is a rename, not a redesign.
 *
 * FRAME API LAW (§13b): `Toolbar` is NOT a generic wrapper — every channel
 * is a named slot. The two tab groups arrive as DATA (`items` + `selectedKey` +
 * `onSelectionChange`, {@link ToolbarTabGroup}), never as children; only
 * `leftEnd` is a free node slot. Namespace only — no bare component export.
 *
 * §13c — WHY this frame is not "an atom in a costume", i.e. why `Tabs.Base` /
 * `Select.Single` are NOT composed here (would change the pixels):
 *  - `Tabs.Base` (atom) renders HeroUI's own tab chrome only. This row needs the
 *    `.extended-tabs` hug-content variant, the `size="sm"` compact strip, the
 *    NEUTRAL selected chrome (`border-b-2 border-foreground` — `.tabs--secondary`'s
 *    indicator is hardcoded `bg-accent`, so the native indicator is suppressed on
 *    that path), the per-item `muted` tone, and the icon-only-on-mobile label
 *    (`sr-only @app-sm:not-sr-only`). None of those are expressible through the
 *    atom's locked API, so the group keeps rendering through `ExtendedTabs`.
 *  - `Select.Single` (atom) is a FIELD control: `FieldFrame` + `fullWidth` + a
 *    trigger that prints the selected LABEL. The collapsed right group here is a
 *    compact ICON-ONLY trigger (label `sr-only`) that must not stretch. Swapping
 *    it in would visibly change the mobile row, so the HeroUI `Select` compound
 *    stays. Revisit if the atom ever grows a `fullWidth={false}` + trigger slot.
 *
 * Authored in Storybook (not `src`); synced to `src` later.
 * ─────────────────────────────────────────────────────────────────────────────
 */
/** One tab in a {@link ToolbarTabGroup}. */
export interface ToolbarTabItem {
    /** Stable id used as the selection key. */
    key: string
    /** Tab content (text, or an icon + text row). */
    label: ReactNode
    /**
     * Set → shown INSTEAD of `label` below `@app-sm` (e.g. "TS" for "TypeScript"),
     * `label` returns from `@app-sm` up — a deliberate call (teacher's ruling,
     * 2026-07-29, "go by judgment, not by trusting the source"): a shortened tab beats collapsing the group
     * behind `collapseRightOnMobile`'s dropdown when every option should stay
     * reachable in one tap. Omit → unchanged (no compact swap).
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
    classNames?: Array<AllowedClassName>
    /** Dev/spec: overlay the anatomy annotation on this toolbar. */
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
}
/** size → extra Tab className override (md = HeroUI's own default, no override). */
const TAB_SIZE_SM = "h-auto! w-auto! px-3! py-2! text-xs!"
/**
 * Selected-state TEXT color only (accent tab group) — the underline itself now
 * comes from `<Tabs.Indicator/>` (native HeroUI `.tabs--secondary` accent bar).
 */
const TAB_CLASS_ACCENT = "data-[selected=true]:text-accent-soft-foreground"
/**
 * Selected-state chrome — NEUTRAL foreground underline (secondary toggle
 * group, no accent). Kept on the MANUAL `border-b-2` technique because
 * `.tabs--secondary`'s indicator is hardcoded `bg-accent` — there is no
 * "neutral-colored" native indicator to switch to, so `<Tabs.Indicator/>` is
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
    classNames}: ToolbarBaseProps) => {
    /** Render one controlled tab group (`accent` = accent selected chrome, secondary-only). */
    const renderGroup = (group: ToolbarTabGroup, accent = true): ReactNode => (
        <TabsExtended
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
                                size === "sm" && TAB_SIZE_SM)}
                        >
                            <StackH
                                gap={3}
                                body={
                                    <>
                                        {item.icon}
                                        {/* a tab WITH an icon hides its label visually on mobile
                                            (icon-only) and shows it from sm up; `sr-only` keeps the
                                            accessible name on mobile. An icon-less tab always shows it. */}
                                        {item.compactLabel != null ? (
                                            <>
                                                <span className="@app-sm:hidden">{item.compactLabel}</span>
                                                <span className="hidden @app-sm:inline">{item.label}</span>
                                            </>
                                        ) : item.label ? (
                                            <span className={cn(item.icon && "sr-only @app-sm:not-sr-only")}>
                                                {item.label}
                                            </span>
                                        ) : null}
                                    </>
                                }
                            />
                            {/* REQUIRED for "primary" and secondary-ACCENT — HeroUI Tabs
                                renders no selected-state chrome of its own. Suppressed for
                                secondary-NEUTRAL: `.tabs--secondary`'s indicator is hardcoded
                                `bg-accent`, so that path keeps its OWN `border-b-2
                                border-foreground` (TAB_CLASS_NEUTRAL) as the sole indicator. */}
                            {(variant === "primary" || accent) && <Tabs.Indicator />}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs.ListContainer>
            {/* react-aria's useTab ALWAYS computes an `aria-controls` id pointing at
                a tabpanel with this tab's key, whether or not one is ever rendered.
                `Toolbar` never shows panel CONTENT here (callers render their own
                content elsewhere), so these panels stay empty/`sr-only` — they exist
                purely to satisfy the tab↔tabpanel ARIA relationship. */}
            {group.items.map((item) => (
                <Tabs.Panel key={item.key} id={item.key} className="sr-only">{null}</Tabs.Panel>
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
                    {/* `item.icon` stays OFF each row on purpose — it's the closed trigger's
                        only content (no room for text there), but once the popover is open
                        every row already reads its own full label; repeating the same icon
                        on every row adds no information (§5a.2, the "everyone already knows
                        this icon" rule: no icon purely decorating text that already reads on
                        its own). */}
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
                                {item.label}
                            </ListBox.Item>
                        ))}
                    </ListBox.Root>
                </Select.Popover>
            </Select.Root>
        )
    }
    const leftGroup = leftEnd ? (
        <StackH
            gap={2}
            classNames={["min-w-0"]}
            body={
                <>
                    <div>{renderGroup(leftTabs)}</div>
                    <div>{leftEnd}</div>
                </>
            }
        />
    ) : (
        <div>{renderGroup(leftTabs)}</div>
    )
    const rightGroup = rightTabs
        ? collapseRightOnMobile
            ? (
                <div>
                    {/* mobile: collapse to a dropdown (HeroUI Select.Root); sm+: inline tabs
                        (atom Tabs.Extended) — BOTH real components mount at once (one hidden
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
            classNames={classNames}
            body={
                <>
                    {leftGroup}
                    {rightGroup}
                </>
            }
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