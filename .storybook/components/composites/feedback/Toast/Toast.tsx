import type { ComponentType, SVGProps } from "react"
import { Alert as AtomAlert } from "@sb-components/atoms/feedback/Alert/Alert"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { Box } from "@sb-components/frames/Box/Box"
import { cn } from "@heroui/react"
/**
 * `Toast` — the one notification surface, composed from `Alert` (`tone="plain"` + glyph `sm`);
 * the HeroUI port lives entirely in `Alert`. Leaves: `Statuses` (the full `ToastStatus` union)
 * and `WithAction` (adds `Action`/`Close` nodes).
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "Toast" } as const
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
/** A whole trailing region (e.g. a "View" link) that the composite must be able to build with `isSkeleton` — never an already-called node. */
export type ToastActionComponent = ComponentTypeWithSkeleton
/** Props for {@link ToastBase} — EXCEPT the `title`/`isSkeleton` pair (see {@link ToastBaseProps}). */
interface ToastOwnProps {
    /** Semantic tone — drives tint + default icon. Default `"info"`. */
    status?: ToastStatus
    /**
     * Optional supporting line under the title. `string`, not `ReactNode` — the
     * composite forwards it into `AtomAlert`, which renders it (or a shimmer
     * bar in its place, ignoring the value) itself.
     */
    description?: string
    /** Optional custom indicator icon COMPONENT; omit for the status default. */
    icon?: IconComponent
    /**
     * Optional trailing action (e.g. a Button), rendered before the close
     * button. A COMPONENT reference, never a built node — `AtomAlert` renders
     * `action` unconditionally regardless of `isSkeleton`, so a pre-built
     * element would freeze mid-shimmer; the composite calls this itself with
     * `isSkeleton` forwarded (COMPOSITE-8).
     */
    action?: ToastActionComponent
    /** When set → renders a × and calls this on click. */
    onClose?: () => void
    /** Accessible label for the × (caller passes a localised string). */
    closeLabel?: string
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}
/**
 * `isSkeleton` is the loading state of the value this toast renders, so the title is optional
 * only in that branch — a toast waiting for its message has no message yet, and the live branch
 * still demands one. The shimmer's shape belongs to `AtomAlert`, which owns the line box —
 * this composite only forwards the flag (COMPOSITE-10), it never draws one itself. `title` is
 * `string`, not `ReactNode` — see {@link ToastOwnProps.description}.
 */
export type ToastBaseProps = ToastOwnProps &
    ({ isSkeleton: true; title?: string } | { isSkeleton?: false; title: string })
/**
 * The Toast composite. See file header for the strict contract.
 *
 * @param props - {@link ToastBaseProps}
 */
const ToastBase = (props: ToastBaseProps) => {
    const { status = "info", description, icon, action: Action, onClose, closeLabel, classNames } = props
    // Narrowed off the discriminant so the title stays required in the live branch. Destructuring
    // `title` first would widen it to `ReactNode | undefined` and lose exactly that guarantee.
    const content = props.isSkeleton
        ? ({ isSkeleton: true, title: props.title } as const)
        : ({ isSkeleton: false, title: props.title } as const)
    const alert = (
        <AtomAlert
            status={STATUS_TO_ALERT[status]}
            tone="plain"
            {...content}
            description={description}
            icon={icon}
            action={Action ? <Action isSkeleton={props.isSkeleton} /> : undefined}
            onClose={onClose}
            closeAriaLabel={closeLabel}
        />
    )
    return classNames?.length ? <Box className={cn(classNames)}>{alert}</Box> : alert
}
/** `Toast.*` — the notification-surface composite namespace. `status`/`action`/`close` are all leaf props. */
export { ToastBase as Toast }

/**
 * `Toast` authors no JSX root of its own — its entire return is
 * `<AtomAlert {...} />`, so there is no element here to carry
 * `data-tier`/`data-component="Toast"` without either editing `Alert` or
 * adding props it silently drops. `Alert` marks its own root as itself
 * (`data-component="Alert"`, self-named per ATOM-10 — an atom takes the
 * inspection switch, never a caller-supplied part name), so a `Deps` panel
 * sees "this composite is built from Alert", which is the accurate picture:
 * `Toast` contributes no shape of its own beyond `tone="plain"` + `status`
 * mapping. The `meta` line above is exported anyway so a source-level gate
 * can still resolve this file's tier from the folder path.
 */
