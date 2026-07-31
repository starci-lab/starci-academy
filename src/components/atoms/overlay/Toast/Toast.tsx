import type { ComponentType, ReactNode, SVGProps } from "react"
import { Alert as AtomAlert } from "@/components/atoms/feedback/Alert/Alert"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
/**
 * ATOM — `Toast`: the constrained notification-surface atom.
 *
 * Composed from the `AtomAlert` atom — toast and callout share the same
 * alert primitive and differ only in placement (toast floats, callout sits
 * inside a surface). Uses `tone="plain"` (default tint, not forced to soft)
 * with `sm` glyphs. The HeroUI port lives solely in `AtomAlert`.
 *
 * This is a static notification surface (inspectable, no live queue
 * needed) — a feature uses it as the body of a toast or inline alert.
 *
 * All exports go through `Toast.*` (currently only `Base`).
 *
 * No `children`: toast is fully data-driven — `title`/`description`/
 * `action` are content (ReactNode, not children).
 *
 * `status` selects the tone (success/warning/danger/info) and the atom
 * picks the icon itself, so a caller cannot pass a mismatched icon.
 * `title`/`description` are content; `action` (optional) sits before the
 * close button; `onClose` enables the close button. The icon table lives
 * solely in `AtomAlert`.
 */
/** An icon passed as a COMPONENT (Phosphor), rendered by the atom at status-icon scale. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>
/** Semantic tone of the toast. */
export type ToastStatus = "success" | "warning" | "danger" | "info"
/** `status` → the `AtomAlert` atom status (info folds to the accent tint). */
const STATUS_TO_ALERT: Record<ToastStatus, "success" | "warning" | "danger" | "accent"> = {
    success: "success",
    warning: "warning",
    danger: "danger",
    info: "accent",
}
/** Props for {@link ToastBase}. */
export interface ToastBaseProps {
    /** Semantic tone — drives tint + default icon. Default `"info"`. */
    status?: ToastStatus
    /** Headline line (always shown). */
    title: ReactNode
    /** Optional supporting line under the title. */
    description?: ReactNode
    /** Optional custom indicator icon COMPONENT; omit for the status default. */
    icon?: IconComponent
    /** Optional trailing action (e.g. a Button), rendered before the close button. */
    action?: ReactNode
    /** When set → renders a × and calls this on click. */
    onClose?: () => void
    /** Accessible label for the × (caller passes a localised string). */
    closeLabel?: string
    /**
     * Placement utilities only (e.g. `mb-4`).
     * @deprecated pass `classNames` instead — a free string cannot be constrained.
     */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}
/**
 * The base toast/notification atom. See file header for the strict contract.
 *
 * @param props - {@link ToastBaseProps}
 */
const ToastBase = ({
    status = "info",
    title,
    description,
    icon,
    action,
    onClose,
    closeLabel,
    className,
    classNames,
}: ToastBaseProps) => (
    <AtomAlert
        status={STATUS_TO_ALERT[status]}
        tone="plain"
        title={title}
        description={description}
        icon={icon}
        action={action}
        onClose={onClose}
        closeAriaLabel={closeLabel}
        className={cn(className, classNames)}
    />
)
/** `Toast.*` — the notification-surface atom namespace. `status`/`action`/`close` are all leaf props. */
export { ToastBase as Toast }