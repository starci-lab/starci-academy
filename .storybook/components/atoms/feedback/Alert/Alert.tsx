import type { ComponentType, ReactNode, SVGProps } from "react"
import { Alert as HeroAlert, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon, XIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Alert.Base`: the ONE "a message with a valence and an exit" atom.
 *
 * Teacher finalized 2026-07-25: `FeedbackCallout` and `Toast` turned out to
 * be the SAME atom (a color-filled alert), differing only in PLACEMENT — callout
 * sits inside a surface, toast floats. Before this, each side had its own
 * `import { Alert } from "@heroui/react"` and kept its own color/close table →
 * "change one, change all" (C-compose drift). This atom is the ONE AND ONLY port
 * down to HeroUI Alert; the other two compose from here, no more cutting straight through.
 *
 * ATOM OWNS: `status`→tint mapping · default icon per valence · glyph scale (§4/§5)
 * · × button skin per status · Indicator/Content/Action/Close layout · this
 * shape's own skeleton (§12c).
 * CONSUMER ONLY SUPPLIES: content (`title`/`description`/`body`) + `action` + `onClose`.
 *
 * ICON (§5.0, teacher finalized 2026-07-26): ONE single set, `@phosphor-icons/react`.
 * Weight follows size (§5.0a): the indicator glyph at `size-5` ⇒ regular (no
 * `weight` passed); the × glyph inside `Button size="sm"` gets forced to `size-3.5` ⇒ `weight="bold"`.
 *
 * NAMESPACE (§13a): do NOT export a bare component — every member goes through `Alert.*`.
 *
 * §12b: do NOT open `children` — `body` is the ONE path for free-form content
 * (a short list, a meta row) under description. `Alert.Base` isn't a real wrapper
 * (there's no "caller content" that needs wrapping beyond the data props already
 * given), so `children` here would just be an escape hatch duplicating `body` — dropped.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * An icon passed as a COMPONENT (Phosphor), rendered by the atom at its own scale (§4/§5).
 * The type stays BARE as `ComponentType<SVGProps<SVGSVGElement>>` (§5.0) — no
 * library-specific icon type declared, so the whole tree doesn't lock into one provider.
 */
export type AlertIcon = ComponentType<SVGProps<SVGSVGElement>>

/** Semantic tone — drives tint, default icon and close-button skin. */
export type AlertStatus = "default" | "accent" | "success" | "warning" | "danger"

/**
 * Fill strategy. `soft` forces a flat `bg-<status>-soft` tint strip (reads like a
 * highlight strip, NOT a card-in-card — use when the alert sits INSIDE a
 * surface). `plain` keeps HeroUI's default tint (alert stands on canvas / floats).
 */
export type AlertTone = "soft" | "plain"

/**
 * Default indicator icon per status — Phosphor regular (§5.0). Same round shape
 * for 4 of the 5 statuses; `warning` keeps a triangle because that's the standard warning semantic.
 */
const STATUS_ICON: Record<AlertStatus, AlertIcon> = {
    default: InfoIcon,
    accent: InfoIcon,
    success: CheckCircleIcon,
    warning: WarningIcon,
    danger: XCircleIcon,
}

/** Soft tint per status — the ONE table (was duplicated in Callout + Toast). */
const STATUS_TINT: Record<AlertStatus, string> = {
    default: "bg-default",
    accent: "bg-accent-soft",
    success: "bg-success-soft",
    warning: "bg-warning-soft",
    danger: "bg-danger-soft",
}

/**
 * Close (×) colour + hover tint per status. The `!` beats `Button`'s own
 * `ghost` text/hover (a plain utility would lose to it). Hover = a tint of the
 * alert's OWN tone.
 */
const STATUS_CLOSE_TONE: Record<AlertStatus, string> = {
    default: "!text-muted hover:!bg-default",
    accent: "!text-accent-soft-foreground hover:!bg-accent-soft",
    success: "!text-success-soft-foreground hover:!bg-success-soft",
    warning: "!text-warning-soft-foreground hover:!bg-warning-soft",
    danger: "!text-danger-soft-foreground hover:!bg-danger-soft",
}

/**
 * Glyph scale — ONE size for every alert (teacher finalized 2026-07-25, eyeballed
 * on story `Tones`). Before this the atom carried a `size` axis sm/md just to
 * preserve the old shape of Callout (size-6) vs Toast (size-5); teacher locked
 * both to size-5 ⇒ that axis became redundant, removed (§6: don't keep a prop that carries no real difference).
 */
const GLYPH_SCALE = "[&_svg]:size-5!"

/**
 * The × glyph of the close button. `Button size="sm"` forces the icon down
 * to `size-3.5` — smaller than `size-5`, so §5.0a requires compensating with
 * `weight="bold"`; left at regular, the × stroke reads ~33% thinner than the
 * `size-5` indicator glyph sitting on the same row, showing two different weights.
 */
const CloseGlyph = (props: SVGProps<SVGSVGElement>) => <XIcon {...props} weight="bold" />

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
    /** Placement utilities only (e.g. `mb-4`) — NOT for restyling the alert. */
    className?: string
    /** Anatomy tag: names this frame so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * Props for {@link Alert.Base}.
 *
 * §12c: `isSkeleton` is a CO-LOCATED state — this atom is the ONE AND ONLY origin
 * shape of the alert, so it draws its own loading shape too (no `Skeleton.*`
 * compound). When `isSkeleton`, `title` becomes OPTIONAL via a UNION (not
 * optional across the board — the live branch still REQUIRES a title).
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
    className,
    anatPart,
    showAnatomy = false,
    isSkeleton = false,
}: AlertBaseProps) => {
    const Icon = icon ?? STATUS_ICON[status]
    return (
        <HeroAlert
            status={status}
            className={cn("shadow-none", tone === "soft" && STATUS_TINT[status], className)}
            data-anat-part={anatPart}
        >
            {/* §4: the scaffold owns the glyph scale — the caller hands a BARE icon (component ref). */}
            <HeroAlert.Indicator className={GLYPH_SCALE} data-anat-part={showAnatomy ? "Alert.Indicator" : undefined}>
                <Icon aria-hidden />
            </HeroAlert.Indicator>
            <HeroAlert.Content data-anat-part={showAnatomy ? "Alert.Content" : undefined}>
                {/* §12c: the skeleton branch is checked BEFORE any other text-rendering branch. */}
                {isSkeleton ? (
                    // The FRAME (tint · radius · shadow · gap) and the ICON render FOR REAL — only
                    // the TEXT turns into bars. Each bar matches the real line-box so layout never
                    // jumps (§8): title `text-sm leading-6` → my-1 + h-4 = 24px; description
                    // `text-sm` (leading-5) → my-1 + h-3 = 20px.
                    <>
                        <HeroSkeleton
                            className="my-1 h-4 w-40 rounded"
                            data-anat-part={showAnatomy ? "Skeleton" : undefined}
                        />
                        <HeroSkeleton
                            className="my-1 h-3 w-full max-w-64 rounded"
                            data-anat-part={showAnatomy ? "Skeleton" : undefined}
                        />
                    </>
                ) : (
                    <>
                        <HeroAlert.Title data-anat-part={showAnatomy ? "Alert.Title" : undefined}>{title}</HeroAlert.Title>
                        {description ? (
                            <HeroAlert.Description data-anat-part={showAnatomy ? "Alert.Description" : undefined}>
                                {description}
                            </HeroAlert.Description>
                        ) : null}
                    </>
                )}
                {/* §11a: `body` is a CALLER SLOT — the node inside belongs to whoever passed it,
                    not to this atom's own anatomy, so the wrapper does not badge it. */}
                {body != null ? (
                    <div className="mt-2 w-full">{body}</div>
                ) : null}
            </HeroAlert.Content>
            {/* §11a: `action` is a CALLER SLOT too (usually `Button`, but the atom never
                forces that) — not badged for the same reason as `body` above. */}
            {action ? (
                <div className="shrink-0">{action}</div>
            ) : null}
            {onClose ? (
                // §11a: the badge stops at the "Close" node (atom `Button`) — don't drill into the atom's guts.
                <span className="shrink-0" data-anat-part={showAnatomy ? "Button" : undefined}>
                    <Button isIconOnly
                        prefixIcon={CloseGlyph}
                        ariaLabel={closeAriaLabel ?? "Close"}
                        variant="ghost"
                        size="sm"
                        onPress={onClose}
                        className={STATUS_CLOSE_TONE[status]}
                    />
                </span>
            ) : null}
        </HeroAlert>
    )
}

/**
 * `Alert.*` — the alert ATOM namespace. `Alert.Base` is the ONE AND ONLY alert
 * surface of the system; `FeedbackCallout` (placed inside a surface) and `Toast` (floating) both compose from it.
 */
export { AlertBase as Alert }
