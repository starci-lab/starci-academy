import React from "react"
import { Link } from "@heroui/react"
import { ArrowLeftIcon } from "@phosphor-icons/react"

/** Props for {@link _BackLink} — presentational; the text already resolved. */
export interface BackLinkProps {
    /** Already-localized link text ("Back" / "Back to {target}" / a full override). */
    text: string
    /** Fired when the link is pressed — the caller owns the routing. */
    onPress: () => void
}

/**
 * The single back affordance of a leaf / sub-view page ("← Back",
 * "← Back to challenge"…), rendered top-left — typically into `PageHeader`'s
 * `breadcrumb` slot. A quiet text link (muted), NOT a pill/button. Hover =
 * the arrow slides left + the label underlines (go-there affordance); the
 * block owns the look so every back link reads the same.
 *
 * @param props - {@link BackLinkProps}
 * @see Story: .storybook/stories/blocks/navigation/BackLink/BackLink.stories
 */
export const _BackLink = ({ text, onPress }: BackLinkProps) => (
    <Link
        onPress={onPress}
        className="group flex w-fit cursor-pointer items-center gap-2 text-sm text-muted no-underline transition-colors hover:text-foreground"
    >
        <ArrowLeftIcon
            aria-hidden
            focusable="false"
            className="size-4 transition-transform group-hover:-translate-x-1"
        />
        <span className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">{text}</span>
    </Link>
)
