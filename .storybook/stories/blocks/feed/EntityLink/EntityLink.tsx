import React from "react"
import { Link, cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feed/EntityLink`. A single-element inline reference (a
 * HeroUI `Link` or a `span`) — closer to a PRIMITIVE than a composite. Synced to
 * `src` later.
 */

/** Props for the {@link EntityLink} block. */
export interface EntityLinkProps {
    /** Token text — a username, lesson/challenge/course title, etc. */
    label: string
    /**
     * Press handler (the owning feature resolves the entity's route and navigates).
     * Omit → the label renders as non-interactive bold text (e.g. an unresolvable /
     * deleted target), never as a dead link.
     */
    onPress?: () => void
    /** Disable the link while a resolve/navigate is in flight. */
    isPending?: boolean
    /** Extra classes merged onto the link/span. */
    className?: string
}

/**
 * An inline entity reference inside a sentence (feed / activity line): the actor
 * or the target. Bold + clickable when an `onPress` is given (owns the link look),
 * bold plain text otherwise. Pure/props-only — the feature owns route resolution
 * and passes the press handler; the block owns the styling so feature lines stay
 * style-free.
 *
 * @param props - {@link EntityLinkProps}
 */
export const EntityLink = ({ label, onPress, isPending, className }: EntityLinkProps) => {
    if (!onPress) {
        return <span className={cn("font-semibold text-foreground", className)}>{label}</span>
    }
    return (
        <Link
            onPress={onPress}
            isDisabled={isPending}
            className={cn("inline cursor-pointer font-semibold text-foreground hover:underline underline-offset-4 decoration-[var(--separator-tertiary)]", className)}
        >
            {label}
        </Link>
    )
}
