import React from "react"
import { Card, CardContent, Typography, cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/cards/MediaCard`. Authored in Storybook (not `src`);
 * synced back to `src` later.
 */

/** Placeholder when {@link MediaCardProps.cover} is omitted — 16:9. */
const FALLBACK_COVER_SRC = "https://placehold.co/640x360"

/** Props for {@link MediaCard}. */
export interface MediaCardProps {
    /**
     * Optional media node rendered flush at the very top of the card, edge-to-edge
     * under the card radius (e.g. an `<img className="aspect-video w-full object-cover" />`).
     * When omitted, a 16:9 placeholder fills the same full-bleed slot.
     */
    cover?: React.ReactNode
    /** Primary heading of the card (course / lesson / challenge / blog title). */
    title: React.ReactNode
    /**
     * Optional metadata row shown directly under the title — typically a row of
     * HeroUI Chips or muted text (category, difficulty, duration, author).
     */
    meta?: React.ReactNode
    /**
     * Optional short description / excerpt. Rendered muted; two-line clamp
     * (`line-clamp-2`) is kept as a documented layout/overflow constraint.
     */
    description?: React.ReactNode
    /** Optional footer pinned at the bottom of the body — typically a CTA button, price, or progress. */
    footer?: React.ReactNode
    /** Optional press handler. When provided the whole card becomes pressable and keyboard-accessible. */
    onPress?: () => void
    /** Optional destination URL. When provided the card renders as an anchor. */
    href?: string
    /** Extra classes on the outermost node. */
    className?: string
}

/**
 * Consolidated, presentational content card — one shape for course / lesson /
 * challenge / blog grids. Built on the HeroUI {@link Card}/{@link CardContent}
 * system (globals supply the 3xl radius, border, flat look). The cover sits
 * full-bleed at the top in 16:9 (Card is `p-0` + `overflow-hidden`); when
 * {@link cover} is omitted a 16:9 placeholder fills that slot. The padded body
 * stacks title, meta, description, and footer with a uniform `gap-3`.
 *
 * Pass `href` for navigation or `onPress` for a custom handler — either one makes
 * the entire card pressable and keyboard-accessible.
 *
 * @param props - {@link MediaCardProps}
 */
export const MediaCard = ({
    cover,
    title,
    meta,
    description,
    footer,
    onPress,
    href,
    className,
}: MediaCardProps) => {
    // HeroUI v3 Card is not pressable itself — wrap it in a real anchor/button
    // when interactive so the whole card is one accessible target.
    const interactive = Boolean(onPress || href)
    const coverNode = cover ?? (
        <img
            src={FALLBACK_COVER_SRC}
            alt=""
            className="aspect-video w-full object-cover"
        />
    )
    const card = (
        // `p-0`: body padding lives on CardContent only so the media can kiss the
        // top/side edges under the card radius (`overflow-hidden` clips the cover).
        <Card className={cn("gap-0 overflow-hidden p-0", !interactive && className)}>
            <div className="aspect-video w-full shrink-0 overflow-hidden [&_img]:block [&_img]:size-full [&_img]:object-cover">
                {coverNode}
            </div>
            <CardContent className="flex flex-col gap-3 px-4 pb-4 pt-3">
                <Typography weight="medium">{title}</Typography>
                {meta ? (
                    <div className="flex flex-wrap items-center gap-2">{meta}</div>
                ) : null}
                {description ? (
                    // line-clamp-2 is a layout/overflow constraint (minimal exception)
                    <Typography type="body-sm" color="muted" className="line-clamp-2">
                        {description}
                    </Typography>
                ) : null}
                {footer ? <div>{footer}</div> : null}
            </CardContent>
        </Card>
    )

    if (href) {
        return (
            <a href={href} className={cn("block", className)}>
                {card}
            </a>
        )
    }
    if (onPress) {
        return (
            <button type="button" onClick={onPress} className={cn("block w-full text-left", className)}>
                {card}
            </button>
        )
    }
    return card
}
