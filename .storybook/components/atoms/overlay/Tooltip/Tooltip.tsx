/** @noSkeleton renders a floating surface; the content is handed in and shimmers on its own. */
import type { ReactNode } from "react"
import { Tooltip as HeroTooltip, cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ATOM — `Tooltip`: the constrained hover-hint atom over HeroUI Tooltip.
 *
 * Wraps HeroUI `Tooltip` (aliased `HeroTooltip`) and owns all of the
 * tooltip's chrome: inset, max-width, arrow. A caller passes only `label`
 * (content), a trigger (`children`), and `placement` — it does not build
 * the panel or arrow itself.
 *
 * All exports go through `Tooltip.*` (currently only `Base`).
 *
 * `children` is kept as a named exception. `Tooltip` cannot build its own
 * trigger: it explains an arbitrary element the caller supplies (chip,
 * icon button, inline term, number field), and react-aria must attach
 * hover/focus/`aria-describedby` directly onto that element. Forcing a
 * `triggerLabel` would lock the trigger to one text shape and lose the
 * ability to wrap. (Only `Tooltip` and `Badge` keep `children`; every
 * other atom uses data props.)
 *
 * `label` is the explanatory content (ReactNode text), `children` is the
 * bare trigger. `placement` is limited to 4 sides. `isOpen`/`defaultOpen`
 * let a story pin the panel open; in production react-aria opens it on
 * hover.
 *
 * `Tooltip.Content` renders through a body portal outside this
 * component's own render box, so an on-render anatomy badge can only
 * anchor to `Trigger`; `Content`/`Arrow` still show in the legend and
 * tree.
 */

/** Props for {@link TooltipBase}. */
export interface TooltipBaseProps {
    /**
     * The trigger element the tooltip explains (term / chip / icon button).
     *
     * Kept as a named exception — see file header: this atom must wrap an
     * arbitrary caller-supplied element.
     */
    children: ReactNode
    /** Tooltip body — plain-language hint. */
    label: ReactNode
    /** Placement relative to the trigger. Default `"top"`. */
    placement?: "top" | "bottom" | "left" | "right"
    /** Render the little arrow pointing at the trigger. Default `true`. */
    showArrow?: boolean
    /** Open delay (ms) on hover. Default `200`. Ignored when `isOpen` is controlled. */
    delay?: number
    /** Controlled open — pin the panel open (STORY soak). */
    isOpen?: boolean
    /** Uncontrolled initial-open — panel starts open then follows hover. */
    defaultOpen?: boolean
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}

/**
 * The base tooltip atom. See file header for the strict contract (incl. the named
 * `children` exception).
 *
 * @param props - {@link TooltipBaseProps}
 */
const TooltipBase = ({
    children,
    label,
    placement = "top",
    showArrow = true,
    delay = 200,
    isOpen,
    defaultOpen,
    classNames,
}: TooltipBaseProps) => {
    return (
        <HeroTooltip data-tier="atom" data-component="Tooltip" delay={delay} isOpen={isOpen} defaultOpen={defaultOpen}>
            <HeroTooltip.Trigger className={cn(classNames)}>
                {children}
            </HeroTooltip.Trigger>
            <HeroTooltip.Content
                placement={placement}
                showArrow={showArrow}
                className="max-w-[260px]"

            >
                {showArrow ? <HeroTooltip.Arrow /> : null}
                {label}
            </HeroTooltip.Content>
        </HeroTooltip>
    )
}

/** `Tooltip.*` — the hover-hint atom namespace. One of two atoms that keep `children` (wrapper required). */
export { TooltipBase as Tooltip }

export const meta = { tier: "atom", name: "Tooltip" } as const
