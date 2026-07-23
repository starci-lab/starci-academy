import React from "react"
import { Card, CardContent, Typography, cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

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
     * under the card radius. Pass the `<img>` TRẦN (`<img src alt />`) — the primitive
     * owns cover sizing (`size-full object-cover`, §4), the consumer does NOT set it.
     * When omitted, a 16:9 placeholder fills the same full-bleed slot.
     */
    cover?: React.ReactNode
    /** Primary heading of the card (course / lesson / challenge / blog title). */
    title: React.ReactNode
    /**
     * Optional metadata row shown directly under the title — a self-contained row
     * primitive (e.g. a {@link MetaRow}: one signal chip + dot-joined muted segments).
     * The slot renders the node as-is; it owns its own inline layout.
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
    /**
     * `true` → render a skeleton mirror of the whole card (cover slot + title +
     * meta + two-line description + footer button) instead of the real content.
     * The primitive OWNS its loading shape — the consumer only flips this flag
     * (never hand-stuffs `<Skeleton>` into the content slots).
     */
    isSkeleton?: boolean
    /** Extra classes on the outermost node. */
    className?: string
}

/**
 * Consolidated, presentational content card — one shape for course / lesson /
 * challenge / blog grids. Built on the HeroUI {@link Card}/{@link CardContent}
 * system (globals supply the 3xl radius, border, flat look). The cover sits
 * full-bleed at the top in 16:9 (Card is `p-0` + `overflow-hidden`); when
 * {@link cover} is omitted a 16:9 placeholder fills that slot. The padded body
 * (`p-3`) stacks title, meta, description, and footer with a uniform `gap-3`.
 *
 * Pass `href` for navigation or `onPress` for a custom handler — either one makes
 * the entire card pressable and keyboard-accessible. Pass `isSkeleton` while the
 * entity loads — the card self-renders a layout-matched skeleton mirror.
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
    isSkeleton = false,
    className,
}: MediaCardProps) => {
    // §4/M1: the primitive OWNS its loading shape — self-render a mirror that keeps
    // the exact frame (Card p-0 + full-bleed 16:9 cover slot + p-3 body) and swaps
    // each content node for its matching Skeleton.* piece, so nothing jumps on resolve.
    if (isSkeleton) {
        return (
            <Card className={cn("gap-0 overflow-hidden p-0", className)}>
                <div className="aspect-video w-full shrink-0 overflow-hidden">
                    <Skeleton className="size-full" />
                </div>
                <CardContent className="flex flex-col gap-3 p-3">
                    {/* Title (Typography default body) */}
                    <Skeleton.Typography type="body" width="2/3" />
                    {/* Meta row mirror — a signal chip + one muted segment */}
                    <div className="flex items-center gap-2">
                        <Skeleton.Chip />
                        <Skeleton.Typography type="body-xs" width="1/3" />
                    </div>
                    {/* Description (body-sm) — two lines */}
                    <span className="flex flex-col gap-2">
                        <Skeleton.Typography type="body-sm" width="full" />
                        <Skeleton.Typography type="body-sm" width="1/2" />
                    </span>
                    {/* Footer CTA */}
                    <Skeleton.Button />
                </CardContent>
            </Card>
        )
    }

    // HeroUI v3 Card is not pressable itself — wrap it in a real anchor/button
    // when interactive so the whole card is one accessible target.
    const interactive = Boolean(onPress || href)
    const coverNode = cover ?? <img src={FALLBACK_COVER_SRC} alt="" />
    const card = (
        // `p-0`: body padding lives on CardContent only so the media can kiss the
        // top/side edges under the card radius (`overflow-hidden` clips the cover).
        <Card className={cn("gap-0 overflow-hidden p-0", !interactive && className)}>
            {/* §4: the wrapper OWNS cover sizing for any child img — consumer passes it TRẦN. */}
            <div className="aspect-video w-full shrink-0 overflow-hidden [&_img]:block [&_img]:size-full [&_img]:object-cover">
                {coverNode}
            </div>
            <CardContent className="flex flex-col gap-3 p-3">
                <Typography weight="medium">{title}</Typography>
                {meta ? <div>{meta}</div> : null}
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

    // §7a adopt-contract: MediaCard có cover full-bleed + Card bg đặc → KHÔNG compose
    // PressableCard, mà adopt Y NGUYÊN press-contract trên chính wrapper interactive
    // (<a>/<button> native). Card lún còn 97% khi nhấn — v4: scale là property riêng
    // nên transition PHẢI liệt kê `scale`, không `transform`. Không hover-tint (§7).
    // RIPPLE bỏ qua có chủ đích: Card có bg đặc + cover full-bleed clip trong
    // overflow-hidden → lớp ripple đặt SAU Card sẽ bị che khuất; §7a không bắt buộc ripple.
    const pressContract =
        "relative rounded-3xl transition-[scale] duration-200 ease-out motion-reduce:transition-none active:scale-[0.97] [-webkit-tap-highlight-color:transparent] outline-none focus-visible:ring-2 focus-visible:ring-accent"

    if (href) {
        return (
            <a href={href} className={cn("block", pressContract, className)}>
                {card}
            </a>
        )
    }
    if (onPress) {
        return (
            <button
                type="button"
                onClick={onPress}
                className={cn("block w-full text-left", pressContract, className)}
            >
                {card}
            </button>
        )
    }
    return card
}
