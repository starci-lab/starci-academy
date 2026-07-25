import React from "react"
import { Link, cn } from "@heroui/react"
import { ArrowLeftIcon } from "@phosphor-icons/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/navigation/BackLink`.
 * Authored in Storybook (not `src`); synced to `src` later.
 *
 * The real block derives its label from next-intl (`common.goBack` /
 * `common.goBackTo`); this local copy inlines the Vietnamese defaults ("Trở lại")
 * so the design renders standalone without the i18n provider.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for the {@link BackLink} block. */
export interface BackLinkProps {
    /** Full label override; omit to compose from `target` / the generic "Trở lại". */
    label?: string
    /** Destination name appended to the generic label — "Trở lại {target}" (e.g. "Trở lại preview"). */
    target?: string
    /** Fired when the link is pressed — the caller owns the routing. */
    onPress: () => void
    /** Extra classes on the link. */
    className?: string
}

/**
 * The single back affordance of a leaf / sub-view page ("← Trở lại",
 * "← Quay lại thử thách"…), rendered top-left — typically into `PageHeader`'s
 * `breadcrumb` slot. A quiet text link (muted), NOT a pill/button. Hover =
 * the arrow slides left + the label underlines (go-there affordance); the
 * block owns the look so every back link reads the same.
 *
 * @param props - {@link BackLinkProps}
 */
export const BackLink = ({ label, target, onPress, className }: BackLinkProps) => {
    const text = label ?? (target ? `Trở lại ${target}` : "Trở lại")

    return (
        <Link
            onPress={onPress}
            className={cn(
                "group flex w-fit cursor-pointer items-center gap-2 text-sm text-muted no-underline transition-colors hover:text-foreground",
                className,
            )}
        >
            <ArrowLeftIcon
                aria-hidden
                focusable="false"
                className="size-4 transition-transform group-hover:-translate-x-1"
            />
            <span className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">{text}</span>
        </Link>
    )
}
