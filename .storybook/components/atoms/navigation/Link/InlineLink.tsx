import React from "react"
import { Link as HeroUILink, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import type { IconComponent } from "@sb-components/atoms/buttons/Button/Button"
import { SKELETON_TEXT_BAR_SM } from "@sb-components/atoms/_skeleton-bar"

/**
 * ATOM — `InlineLink`: muted text or icon press-link wrapping HeroUI `Link`.
 * Earned by Footer column rows, legal stubs, and social glyphs. Not
 * `LinkBack`/`LinkSeeMore` (those own arrow affordances).
 *
 * Navigation is the caller's job via `onPress` (Footer contract). Optional
 * `href` wins when set, matching {@link LinkSeeMore}.
 */

/** Text size for labelled rows — columns use `sm`, legal stubs use `xs`. */
export type InlineLinkSize = "sm" | "xs"

/** Shared props for both labelled and icon-only shapes. */
interface InlineLinkBaseProps {
    /** Press handler. Ignored when {@link href} is set. */
    onPress?: () => void
    /** Optional destination URL. Takes priority over {@link onPress}. */
    href?: string
    /**
     * Render the leaf shimmer instead of the real link — same box so the row
     * does not move once content resolves (ATOM-4).
     */
    isSkeleton?: boolean
}

/** Labelled muted text link (Footer column / legal). */
type InlineLinkLabelProps = InlineLinkBaseProps & {
    /** Visible label. */
    label: string
    /** Text size. Defaults to `sm`. */
    size?: InlineLinkSize
    icon?: never
    ariaLabel?: never
}

/** Icon-only muted link (Footer socials). */
type InlineLinkIconProps = InlineLinkBaseProps & {
    /** Brand glyph. */
    icon: IconComponent
    /** Accessible name for the glyph-only trigger. */
    ariaLabel: string
    label?: never
    size?: never
}

/** Props for {@link InlineLink}. */
export type InlineLinkProps = InlineLinkLabelProps | InlineLinkIconProps

const TEXT_CLASS: Record<InlineLinkSize, string> = {
    sm: "text-sm",
    xs: "text-xs",
}

/** Label-bar shimmer sized to the same line box as the real text. */
const SKEL_TEXT_BAR: Record<InlineLinkSize, string> = {
    sm: SKELETON_TEXT_BAR_SM,
    xs: "my-[3px] h-[10px] rounded",
}

/**
 * Muted inline press-link — text or icon. See the file header.
 *
 * @param props - {@link InlineLinkProps}
 */
export const InlineLink = (props: InlineLinkProps) => {
    if (props.isSkeleton) {
        if (props.icon) {
            return (
                <span data-tier="atom" data-component="InlineLink" className="inline-flex">
                    <HeroSkeleton className="size-5 rounded" />
                </span>
            )
        }
        const size = props.size ?? "sm"
        return (
            <span data-tier="atom" data-component="InlineLink" className="inline-flex w-fit">
                <HeroSkeleton className={cn(SKEL_TEXT_BAR[size], "w-1/4")} />
            </span>
        )
    }

    if (props.icon) {
        const Icon = props.icon
        const className = "text-muted transition-colors hover:text-foreground"
        if (props.href) {
            return (
                <a
                    data-tier="atom"
                    data-component="InlineLink"
                    href={props.href}
                    aria-label={props.ariaLabel}
                    className={className}
                >
                    <Icon className="size-5" aria-hidden />
                </a>
            )
        }
        return (
            <HeroUILink
                data-tier="atom"
                data-component="InlineLink"
                onPress={props.onPress}
                aria-label={props.ariaLabel}
                className={className}
            >
                <Icon className="size-5" aria-hidden />
            </HeroUILink>
        )
    }

    const size = props.size ?? "sm"
    const className = cn(
        "w-fit cursor-pointer text-muted transition-colors hover:text-foreground",
        TEXT_CLASS[size],
    )
    if (props.href) {
        return (
            <a
                data-tier="atom"
                data-component="InlineLink"
                href={props.href}
                className={className}
            >
                {props.label}
            </a>
        )
    }
    return (
        <HeroUILink
            data-tier="atom"
            data-component="InlineLink"
            onPress={props.onPress}
            className={className}
        >
            {props.label}
        </HeroUILink>
    )
}

/** Tier metadata for `InlineLink`. */
export const meta = { tier: "atom", name: "InlineLink" } as const
