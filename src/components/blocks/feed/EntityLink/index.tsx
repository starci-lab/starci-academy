import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"

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
export const EntityLink = ({ label, onPress, isPending }: EntityLinkProps) => {
    const interactive = Boolean(onPress) && !isPending

    return (
        <Box
            as="span"
            identity={{ tier: "block", component: "EntityLink" }}
            principle="icon-text"
            explain="Inline entity press target is the breadcrumb/see-more end of icon-text (text-only when no glyph) — not name-handle, because there is no paired handle line."
        >
            {interactive ? (
                <Typography
                    size="sm"
                    weight="semibold"
                    isLink
                    text={label}
                    onPress={onPress}
                />
            ) : (
                <Typography
                    size="sm"
                    weight="semibold"
                    text={label}
                />
            )}
        </Box>
    )
}
