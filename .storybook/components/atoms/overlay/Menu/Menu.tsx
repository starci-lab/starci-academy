import type { ComponentType, ReactNode, SVGProps } from "react"
import {
    Dropdown as HeroDropdown,
    DropdownTrigger as HeroDropdownTrigger,
    DropdownPopover as HeroDropdownPopover,
    DropdownMenu as HeroDropdownMenu,
    DropdownItem as HeroDropdownItem,
    DropdownSection as HeroDropdownSection,
    Button as HeroButton,
} from "@heroui/react"
// react-aria `Header` is the collection-native way to label a menu SECTION; HeroUI's
// `DropdownSection` (react-aria MenuSection) does not expose a `title` prop, so the
// header is composed as its first child — exactly how HeroUI builds sections internally.
import { Header as HeroMenuHeader } from "react-aria-components"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Menu.Base`: the ONE constrained action-menu atom over HeroUI Dropdown.
 *
 * Bọc HeroUI `Dropdown` TỐI ĐA (Trigger · Popover · Menu · Section · Item) + một
 * `Button` (alias `HeroButton`) làm trigger. Atom SỞ HỮU chrome: popover surface,
 * placement, item layout, icon scale (size-4).
 *
 * NAMESPACE (thầy chốt 2026-07-25): atom KHÔNG export component trần — mọi thành
 * viên đi qua `Menu.*` (hôm nay chỉ có `Base`), khớp `Chip.*` / `Button.*`.
 *
 * KHÔNG `children` (luật ② thầy chốt 2026-07-25): nhãn nút mở đi bằng PROP DỮ LIỆU
 * `triggerLabel` (+ `triggerIcon` là COMPONENT, atom tự ép scale). Menu KHÔNG buộc
 * phải bọc phần tử khác — trigger do chính atom dựng — nên KHÔNG thuộc ngoại lệ
 * wrapper (chỉ `Tooltip`/`Badge` được giữ `children`).
 *
 * STRICT §4: consumer truyền DỮ LIỆU (`items` phẳng HOẶC `sections` gộp), KHÔNG dựng
 * `DropdownItem` tay. Mỗi item = `{ key, label, icon?, isDisabled? }`; `icon` truyền
 * COMPONENT (gravity), atom render size-4. Chọn item → `onAction(key)`.
 *
 * Overlay portal: `DropdownPopover` render RA NGOÀI render-box nên badge on-render chỉ
 * neo được `Trigger`; các part menu vẫn hiện trong legend + Cây.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** An icon passed as a COMPONENT (e.g. `Gear`), rendered by the atom at menu scale. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

/** One selectable menu row. */
export interface MenuItemModel {
    /** Stable key — emitted to `onAction`. */
    key: string
    /** Row label. */
    label: string
    /** Leading icon as a COMPONENT reference. Atom renders it at `size-4`. */
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
    /** Trigger button label (nhãn, KHÔNG phải children). */
    triggerLabel: ReactNode
    /** Leading icon of the trigger as a COMPONENT reference. Atom ép `size-3.5` (scale chữ nút). */
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
    /** Dev/spec: emit `data-anat-part` on Trigger/Popover/Menu/Item so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    /** Extra classes on the trigger. */
    className?: string
}

/** Render one menu row (shared by flat + sectioned modes). */
const renderItem = (item: MenuItemModel, showAnatomy: boolean) => {
    const Icon = item.icon
    return (
        <HeroDropdownItem
            key={item.key}
            id={item.key}
            textValue={item.label}
            isDisabled={item.isDisabled}
            data-anat-part={showAnatomy ? (item.isDisabled ? "Item.Disabled" : "Item") : undefined}
        >
            <span className="flex items-center gap-2">
                {Icon ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
                <span>{item.label}</span>
            </span>
        </HeroDropdownItem>
    )
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
    showAnatomy = false,
    className,
}: MenuBaseProps) => {
    return (
        <HeroDropdown isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
            <HeroDropdownTrigger className={className} data-anat-part={showAnatomy ? "Trigger" : undefined}>
                <HeroButton variant={triggerVariant}>
                    {TriggerIcon ? (
                        // Atom sở hữu glyph scale — `!` bắt buộc vì HeroUI có rule `.button svg` specificity cao hơn.
                        <span
                            aria-hidden
                            data-anat-part={showAnatomy ? "TriggerIcon" : undefined}
                            className="inline-flex shrink-0 [&_svg]:!size-3.5"
                        >
                            <TriggerIcon />
                        </span>
                    ) : null}
                    {triggerLabel}
                </HeroButton>
            </HeroDropdownTrigger>
            <HeroDropdownPopover placement={placement} className="w-56 max-w-[calc(100vw-2rem)]" data-anat-part={showAnatomy ? "Popover" : undefined}>
                <HeroDropdownMenu
                    aria-label={ariaLabel}
                    onAction={onAction ? (key) => onAction(String(key)) : undefined}
                    data-anat-part={showAnatomy ? "Menu" : undefined}
                >
                    {sections
                        ? sections.map((section) => (
                            <HeroDropdownSection key={section.key} data-anat-part={showAnatomy ? "Section" : undefined}>
                                {section.title ? (
                                    <HeroMenuHeader
                                        className="px-2 py-2 text-xs font-semibold text-muted"
                                        data-anat-part={showAnatomy ? "SectionHeader" : undefined}
                                    >
                                        {section.title}
                                    </HeroMenuHeader>
                                ) : null}
                                {section.items.map((item) => renderItem(item, showAnatomy))}
                            </HeroDropdownSection>
                        ))
                        : (items ?? []).map((item) => renderItem(item, showAnatomy))}
                </HeroDropdownMenu>
            </HeroDropdownPopover>
        </HeroDropdown>
    )
}

/**
 * `Menu.*` — the action-menu ATOM namespace. `Menu.Base` là atom menu DUY NHẤT
 * (flat `items` hay `sections` gộp đều là LEAF prop-driven của nó).
 */
export const Menu = {
    Base: MenuBase,
}
