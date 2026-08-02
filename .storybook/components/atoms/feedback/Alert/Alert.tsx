import type { ComponentType, ReactNode, SVGProps } from "react"
import { Alert as HeroAlert, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon, XIcon } from "@phosphor-icons/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ATOM — `Alert`: the one port down to HeroUI Alert (`Callout` and `Toast` both compose from here).
 * 
 * 1 PROP = 1 LEAF. At the atom tier, `tone`/`icon`/`body`/`action`/`onClose` each change a
 * real shape (a different fill, a different added node), so each gets its own leaf.
 * 
 * The one true DEP: the `Close` node — the atom builds the × button itself from `Button`
 * (not a caller slot), so it's clickable through to its story. `action` is a slot where the
 * caller supplies any node, so it does not count as a dep.
 */

/**
 * An icon passed as a component (Phosphor), rendered by the atom at its own
 * scale. Typed as the bare `ComponentType<SVGProps<SVGSVGElement>>` rather
 * than a library-specific icon type, so callers aren't locked into one provider.
 */
export type AlertIcon = ComponentType<SVGProps<SVGSVGElement>>

/**
 * Semantic tone — drives tint, default icon and close-button skin. `info` is
 * a calm/neutral status distinct from `accent` (the brand's active-state
 * pink); its `--info` token is declared in `src/app/globals.css` alongside
 * `success`/`warning`.
 */
export type AlertStatus = "default" | "accent" | "success" | "warning" | "danger" | "info"

/**
 * Fill strategy. `soft` forces a flat `bg-<status>-soft` tint strip (reads like a
 * highlight strip, NOT a card-in-card — use when the alert sits INSIDE a
 * surface). `plain` keeps HeroUI's default tint (alert stands on canvas / floats).
 */
export type AlertTone = "soft" | "plain"

/**
 * Default indicator icon per status. `warning` uses a triangle; the rest
 * share a round shape.
 */
const STATUS_ICON: Record<AlertStatus, AlertIcon> = {
    default: InfoIcon,
    accent: InfoIcon,
    success: CheckCircleIcon,
    warning: WarningIcon,
    danger: XCircleIcon,
    info: InfoIcon,
}

/** Soft tint per status. */
const STATUS_TINT: Record<AlertStatus, string> = {
    default: "bg-default",
    accent: "bg-accent-soft",
    success: "bg-success-soft",
    warning: "bg-warning-soft",
    danger: "bg-danger-soft",
    info: "bg-info-soft",
}

/**
 * Close (×) color + hover tint per status. The `!` is required to override
 * `Button`'s own `ghost` text/hover utilities.
 */
const STATUS_CLOSE_TONE: Record<AlertStatus, string> = {
    default: "!text-muted hover:!bg-default",
    accent: "!text-accent-soft-foreground hover:!bg-accent-soft",
    success: "!text-success-soft-foreground hover:!bg-success-soft",
    warning: "!text-warning-soft-foreground hover:!bg-warning-soft",
    danger: "!text-danger-soft-foreground hover:!bg-danger-soft",
    info: "!text-info-soft-foreground hover:!bg-info-soft",
}

/** Glyph scale — one size for every alert. */
const GLYPH_SCALE = "[&_svg]:size-5!"


/** Props SPECIFIC to {@link Alert.Base} — EXCEPT the `title`/`isSkeleton` pair (see {@link AlertBaseProps}). */
interface AlertBaseOwnProps {
    /** Semantic tone — drives tint + default icon + close skin. Default `"default"`. */
    status?: AlertStatus
    /** Fill strategy — `soft` for alerts INSIDE a surface. Default `"soft"`. */
    tone?: AlertTone
    /** Optional supporting line under the title — the body TEXT slot. */
    description?: ReactNode
    /** Optional free-form body under `description` (a short list, a meta row). */
    body?: ReactNode
    /** Optional custom indicator icon COMPONENT; omit for the status default. */
    icon?: AlertIcon
    /** Optional trailing action (e.g. a Button), rendered before the close button. */
    action?: ReactNode
    /** When provided, renders a status-coloured × wired to this. */
    onClose?: () => void
    /** Accessible label for the × (caller passes a localised string). */
    closeAriaLabel?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Props for {@link Alert.Base}.
 *
 * `isSkeleton` is a co-located loading state — this atom renders its own
 * skeleton rather than delegating to a `Skeleton.*` compound. `title` is
 * optional only in the `isSkeleton: true` branch; the live branch still
 * requires it.
 */
export type AlertBaseProps = AlertBaseOwnProps &
    (
        | { isSkeleton: true; title?: ReactNode }
        | { isSkeleton?: false; title: ReactNode }
    )

/**
 * The base alert atom. See the file header for the strict contract.
 *
 * @param props - {@link AlertBaseProps}
 */
const AlertBase = ({
    status = "default",
    tone = "soft",
    title,
    description,
    body,
    icon,
    action,
    onClose,
    closeAriaLabel,
    classNames,
    isSkeleton = false,
}: AlertBaseProps) => {
    const Icon = icon ?? STATUS_ICON[status]
    return (
        <HeroAlert
            data-tier="atom"
            data-component="Alert"
            // Vendor `HeroAlert.status` is a closed union without `info`.
            // `"default"` is a safe stand-in because this atom's own
            // `STATUS_TINT`/`STATUS_ICON`/`STATUS_CLOSE_TONE` (all `info`-aware)
            // drive the actual paint via explicit className.
            status={status === "info" ? "default" : status}
            className={cn("shadow-none", tone === "soft" && STATUS_TINT[status], classNames)}

        >
            {/* The scaffold owns the glyph scale — callers hand a bare icon component. */}
            <HeroAlert.Indicator className={GLYPH_SCALE}>
                <Icon aria-hidden />
            </HeroAlert.Indicator>
            <HeroAlert.Content>
                {/* The skeleton branch is checked before any other text-rendering branch. */}
                {isSkeleton ? (
                    // The frame (tint, radius, shadow, gap) and the icon render for real —
                    // only the text turns into bars. Each bar matches the real line-box so
                    // layout doesn't jump: title `text-sm leading-6` → my-1 + h-4 = 24px;
                    // description `text-sm` (leading-5) → my-1 + h-3 = 20px.
                    <>
                        <HeroSkeleton
                            className="my-1 h-4 w-40 rounded"

                        />
                        <HeroSkeleton
                            className="my-1 h-3 w-full max-w-64 rounded"

                        />
                    </>
                ) : (
                    <>
                        <HeroAlert.Title>{title}</HeroAlert.Title>
                        {description ? (
                            <HeroAlert.Description>
                                {description}
                            </HeroAlert.Description>
                        ) : null}
                    </>
                )}
                {body != null ? (
                    <div className="mt-2 w-full">{body}</div>
                ) : null}
            </HeroAlert.Content>
            {action ? (
                <div className="shrink-0">{action}</div>
            ) : null}
            {onClose ? (
                // Alert draws its own close chrome — a raw button, not the house `Button` atom.
                // An atom is the floor: importing another atom would make this a composite (ATOM-3).
                // A ghost icon-button is a handful of utility classes, so it stays inline here.
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={closeAriaLabel ?? "Close"}

                    className={cn(
                        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent",
                        STATUS_CLOSE_TONE[status],
                    )}
                >
                    <XIcon weight="bold" className="size-3.5" />
                </button>
            ) : null}
        </HeroAlert>
    )
}

/**
 * `Alert.*` — the alert atom namespace. `Alert.Base` is the single alert
 * surface; `Callout` and `Toast` both compose from it.
 */
export { AlertBase as Alert }

export const meta = { tier: "atom", name: "Alert" } as const
