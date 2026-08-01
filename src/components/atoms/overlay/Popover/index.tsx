/** @noSkeleton renders a floating surface; the content is handed in and shimmers on its own. */
import type { ComponentType, ReactNode, SVGProps } from "react"
import { Popover as HeroPopover, Button as HeroButton, cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * ATOM — `Popover`: the constrained click-panel atom over HeroUI Popover.
 *
 * Wraps HeroUI `Popover` (aliased `HeroPopover`) with a `Button` (aliased
 * `HeroButton`) as trigger — react-aria's `DialogTrigger` requires the
 * trigger to be pressable. This atom owns the chrome: dialog surface,
 * placement, arrow, heading.
 *
 * All exports go through `Popover.*` (currently only `Base`).
 *
 * No `children`: the open-button label is the data prop `triggerLabel`
 * (`triggerIcon` is a component, rendered at trigger scale by the atom).
 *
 * `content` is the panel body (a ReactNode, not children), `heading`
 * (optional) renders `Popover.Heading`. `isOpen`/`defaultOpen` let a story
 * pin the panel open.
 *
 * `Popover.Content` renders through a portal outside this component's own
 * render box, so an on-render anatomy badge can only anchor to `Trigger`;
 * the panel parts still show in the legend and tree.
 */

/** An icon passed as a COMPONENT (e.g. `CircleInfo`), rendered by the atom at trigger scale. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** Trigger glyph at `size-3.5` (14px) needs `bold` weight to keep the stroke visible at that size. */
const TRIGGER_ICON_WEIGHT = "bold" as const

/** Props for {@link PopoverBase}. */
export interface PopoverBaseProps {
    /** Trigger button label (not children). */
    triggerLabel: ReactNode
    /** Leading icon of the trigger as a component reference, rendered at `size-3.5` to match the button text scale. */
    triggerIcon?: IconComponent
    /** Panel body. */
    content: ReactNode
    /** Optional bold heading line above the body. */
    heading?: ReactNode
    /** Trigger button visual. Default `"secondary"`. */
    triggerVariant?: "primary" | "secondary" | "tertiary" | "ghost"
    /** Placement of the panel relative to the trigger. Default `"bottom"`. */
    placement?: "top" | "bottom" | "left" | "right" | "bottom start" | "bottom end" | "top start" | "top end"
    /** Render the little arrow pointing at the trigger. Default `true`. */
    showArrow?: boolean
    /** Controlled open — pin the panel open (STORY soak). */
    isOpen?: boolean
    /** Uncontrolled initial-open state. */
    defaultOpen?: boolean
    /** Open-state change handler (uncontrolled/controlled). */
    onOpenChange?: (isOpen: boolean) => void
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}

/**
 * The base popover atom. See file header for the strict contract.
 *
 * @param props - {@link PopoverBaseProps}
 */
const PopoverBase = ({
    triggerLabel,
    triggerIcon: TriggerIcon,
    content,
    heading,
    triggerVariant = "secondary",
    placement = "bottom",
    showArrow = true,
    isOpen,
    defaultOpen,
    onOpenChange,
    classNames,
}: PopoverBaseProps) => {
    return (
        <HeroPopover data-tier="atom" data-component="Popover" isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
            <HeroButton variant={triggerVariant} className={cn(classNames)}>
                {TriggerIcon ? (
                    // `!` needed: HeroUI's `.button svg` rule has higher specificity. This
                    // span is a plain wrapper around a caller-supplied icon, not a named
                    // component.
                    <span aria-hidden className="inline-flex shrink-0 [&_svg]:!size-3.5">
                        <TriggerIcon weight={TRIGGER_ICON_WEIGHT} />
                    </span>
                ) : null}
                {triggerLabel}
            </HeroButton>
            <HeroPopover.Content
                placement={placement}
                className="w-64 max-w-[calc(100vw-2rem)]"
            >
                {showArrow ? <HeroPopover.Arrow /> : null}
                {heading ? (
                    <HeroPopover.Heading className="mb-1 text-sm font-semibold text-foreground">
                        {heading}
                    </HeroPopover.Heading>
                ) : null}
                {/* Plain div wrapping caller-supplied `content`; not a named component. */}
                <div className="text-sm text-muted">
                    {content}
                </div>
            </HeroPopover.Content>
        </HeroPopover>
    )
}

/** `Popover.*` — the click-panel atom namespace. `heading`/`arrow`/`placement` are all leaf props. */
export { PopoverBase as Popover }

export const meta = { tier: "atom", name: "Popover" } as const
