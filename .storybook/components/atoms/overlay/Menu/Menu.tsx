import type { ComponentType, ReactNode, SVGProps } from "react"
import {
    Dropdown as HeroDropdown,
    DropdownTrigger as HeroDropdownTrigger,
    DropdownPopover as HeroDropdownPopover,
    DropdownMenu as HeroDropdownMenu,
    DropdownItem as HeroDropdownItem,
    DropdownSection as HeroDropdownSection,
    Button as HeroButton,
    Skeleton as HeroSkeleton,
    cn,
} from "@heroui/react"
// react-aria `Header` is the collection-native way to label a menu SECTION; HeroUI's
// `DropdownSection` (react-aria MenuSection) does not expose a `title` prop, so the
// header is composed as its first child — exactly how HeroUI builds sections internally.
import { Header as HeroMenuHeader } from "react-aria-components"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ATOM — `Menu`: the constrained action-menu atom over HeroUI Dropdown.
 *
 * Wraps HeroUI `Dropdown` (Trigger · Popover · Menu · Section · Item) with
 * a `Button` (aliased `HeroButton`) as trigger. This atom owns the chrome:
 * popover surface, placement, item layout, icon scale.
 *
 * All exports go through `Menu.*` (currently only `Base`).
 *
 * No `children`: the open-button label is the data prop `triggerLabel`
 * (`triggerIcon` is a component, rendered at trigger scale by the atom).
 *
 * A caller passes data (flat `items` or grouped `sections`) rather than
 * building `DropdownItem` by hand. Each item is
 * `{ key, label, icon?, isDisabled? }`; `icon` is a component reference
 * (Phosphor), rendered by the atom. Selecting an item fires `onAction(key)`.
 *
 * `DropdownPopover` renders through a portal outside this component's own
 * render box, so an on-render anatomy badge can only anchor to `Trigger`;
 * the menu parts still show in the legend and tree.
 */

/** An icon passed as a COMPONENT (e.g. `Gear`), rendered by the atom at menu scale. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/**
 * Menu glyph scale, defined once — the atom owns scale, callers pass a
 * bare icon. Item and trigger labels are both `text-sm` (14px), so glyphs
 * are `size-3.5` to match 1:1, with `bold` weight to keep the stroke
 * visible at that size.
 */
const MENU_ICON_CLASS = "size-3.5"
const MENU_ICON_WEIGHT = "bold" as const

/** One selectable menu row. */
export interface MenuItemModel {
    /** Stable key — emitted to `onAction`. */
    key: string
    /** Row label. */
    label: string
    /** Leading icon as a component reference, rendered at `size-3.5` with `bold` weight. */
    icon?: IconComponent
    /** Non-selectable (dimmed) row. */
    isDisabled?: boolean
}

/** A titled group of rows. */
export interface MenuSectionModel {
    /** Stable key for the section. */
    key: string
    /** Optional group header label. */
    title?: string
    /** Rows in this group. */
    items: Array<MenuItemModel>
}

/** Props for {@link MenuBase}. */
export interface MenuBaseProps {
    /** Trigger button label (not children). */
    triggerLabel: ReactNode
    /** Leading icon of the trigger as a component reference, rendered at `size-3.5` to match the button text scale. */
    triggerIcon?: IconComponent
    /** Flat rows — mutually exclusive with {@link MenuBaseProps.sections}. */
    items?: Array<MenuItemModel>
    /** Grouped rows with optional titles. */
    sections?: Array<MenuSectionModel>
    /** Accessible name for the menu list. */
    ariaLabel?: string
    /** Fired with the pressed row's `key`. */
    onAction?: (key: string) => void
    /** Trigger button visual. Default `"secondary"`. */
    triggerVariant?: "primary" | "secondary" | "tertiary" | "ghost"
    /** Placement of the popover. Default `"bottom start"`. */
    placement?: "bottom start" | "bottom end" | "top start" | "top end"
    /** Controlled open — pin the menu open (STORY soak). */
    isOpen?: boolean
    /** Uncontrolled initial-open state. */
    defaultOpen?: boolean
    /** Open-state change handler. */
    onOpenChange?: (isOpen: boolean) => void
    /** Render the leaf skeleton (rows of icon + label bars) instead of the real dropdown; the atom owns its own skeleton. */
    isSkeleton?: boolean
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}

/**
 * The base action-menu atom. See file header for the strict contract.
 *
 * @param props - {@link MenuBaseProps}
 */
const MenuBase = ({
    triggerLabel,
    triggerIcon: TriggerIcon,
    items,
    sections,
    ariaLabel = "Menu",
    onAction,
    triggerVariant = "secondary",
    placement = "bottom start",
    isOpen,
    defaultOpen,
    onOpenChange,
    isSkeleton = false,
    classNames,
}: MenuBaseProps) => {
    /**
     * Render one menu row (shared by flat + sectioned modes).
     *
     * Defined inside the component so it reads `showAnatomy` from scope. As a module-level helper
     * it needed the switch as a second parameter, and a parameter that exists only to badge a part
     * vanishes with the overlay — leaving the app's copy of this file holding a function of a
     * different arity than the blueprint's. Closing over it keeps one signature true in both trees.
     */
    const renderItem = (item: MenuItemModel) => {
        const Icon = item.icon
        return (
            <HeroDropdownItem
                key={item.key}
                id={item.key}
                textValue={item.label}
                isDisabled={item.isDisabled}

            >
                <span className="flex items-center gap-2">
                    {Icon ? <Icon className={cn(MENU_ICON_CLASS, "shrink-0")} weight={MENU_ICON_WEIGHT} aria-hidden /> : null}
                    <span>{item.label}</span>
                </span>
            </HeroDropdownItem>
        )
    }
    if (isSkeleton) {
        // This atom draws its own skeleton with `HeroSkeleton` (no shared skeleton
        // component): container `p-1`, each row an icon `size-5 rounded-full`
        // beside a label `h-[14px] w-1/3`. Item labels are usually one word
        // ("Edit", "Settings", "Sign out"), so the label bar is fractional width
        // rather than fixed. Row count matches the real item count (flat or
        // summed across sections) so the skeleton height matches once real data
        // lands; falls back to 4 rows when the count is unknown.
        const rowCount = sections
            ? sections.reduce((total, section) => total + section.items.length, 0)
            : (items?.length ?? 4)
        return (
            <div data-tier="atom" data-component="Menu" className={cn("flex w-full flex-col gap-1 p-1", classNames)}>
                {Array.from({ length: rowCount || 4 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-2 px-2 py-2">
                        <HeroSkeleton className="size-5 shrink-0 rounded-full" />
                        <HeroSkeleton className="h-[14px] w-1/3 rounded" />
                    </div>
                ))}
            </div>
        )
    }
    return (
        <HeroDropdown data-tier="atom" data-component="Menu" isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
            <HeroDropdownTrigger className={cn(classNames)}>
                <HeroButton variant={triggerVariant}>
                    {TriggerIcon ? (
                        // `!` needed: HeroUI's `.button svg` rule has higher specificity.
                        <span aria-hidden className="inline-flex shrink-0 [&_svg]:!size-3.5">
                            <TriggerIcon weight={MENU_ICON_WEIGHT} />
                        </span>
                    ) : null}
                    {triggerLabel}
                </HeroButton>
            </HeroDropdownTrigger>
            <HeroDropdownPopover placement={placement} className="w-56 max-w-[calc(100vw-2rem)]">
                <HeroDropdownMenu
                    aria-label={ariaLabel}
                    onAction={onAction ? (key) => onAction(String(key)) : undefined}

                >
                    {sections
                        ? sections.map((section) => (
                            <HeroDropdownSection key={section.key}>
                                {section.title ? (
                                    <HeroMenuHeader
                                        className="px-2 py-2 text-xs font-semibold text-muted"

                                    >
                                        {section.title}
                                    </HeroMenuHeader>
                                ) : null}
                                {section.items.map((item) => renderItem(item))}
                            </HeroDropdownSection>
                        ))
                        : (items ?? []).map((item) => renderItem(item))}
                </HeroDropdownMenu>
            </HeroDropdownPopover>
        </HeroDropdown>
    )
}

/** `Menu.*` — the action-menu atom namespace. Flat `items` or grouped `sections` are both leaf props. */
export { MenuBase as Menu }

export const meta = { tier: "atom", name: "Menu" } as const
