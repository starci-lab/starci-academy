import React from "react"
import { Card, CardContent, cn } from "@heroui/react"
import { type VerdictBand, verdictBandClassName } from "../verdict-band"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/cards/SectionCard`. Authored in Storybook (not `src`);
 * synced back to `src` later.
 */

// §5a: icon size ĐỐI CHIẾU text-size của title ("text-base" → size-6). Primitive sở
// hữu size + màu (§4) — consumer truyền icon TRẦN, KHÔNG kèm size-*/text-*.
const ICON_CLS = "[&_svg]:size-6 shrink-0"

/** Props for {@link SectionCard}. */
export interface SectionCardProps {
    /** Card body. */
    children: React.ReactNode
    /** Optional section title rendered in the header row. */
    title?: React.ReactNode
    /** Optional leading icon shown before the title. Truyền TRẦN — primitive tự ép size-6 + màu theo `accent` (§4/§5a). */
    icon?: React.ReactNode
    /** Optional action node pinned to the right of the header (button/link). */
    action?: React.ReactNode
    /** Accent variant: tinted border + background (highlight / "yours"). */
    accent?: boolean
    /**
     * Verdict variant: a LEFT band on top of the card's own border — the
     * asymmetric-border shape for "card mang tín hiệu từ DATA" (`card.md` §3i).
     * See {@link VerdictBand}. Left band ONLY reads as a DATA signal — never
     * ad-hoc "vùng active" decoration (`card.md` §3g).
     */
    withVerdict?: VerdictBand
    /** `true` → render skeleton mirror (header icon/title/action bars + body paragraph). Consumer chỉ bật cờ. */
    isSkeleton?: boolean
    /** Extra classes merged onto the inner content wrapper. */
    contentClassName?: string
    /** Extra classes on the card root. */
    className?: string
}

/**
 * The canonical bordered "viền" card used across profile + dashboard. A thin
 * wrapper over HeroUI {@link Card}/{@link CardContent} (globals already give it
 * the 3xl radius, padding, no-shadow + border) that adds an optional header row
 * (icon + title on the left, action on the right) so every titled section looks
 * identical. Use `accent` for the viewer's own / highlighted cards.
 *
 * @param props - {@link SectionCardProps}
 */
export const SectionCard = ({
    children,
    title,
    icon,
    action,
    accent = false,
    withVerdict,
    isSkeleton = false,
    className,
    contentClassName,
}: SectionCardProps) => {
    const hasHeader = Boolean(title || action || icon)
    return (
        <Card
            className={cn(
                accent && "border-accent",
                verdictBandClassName(withVerdict),
                className,
            )}
        >
            <CardContent className={cn("flex flex-col gap-3", contentClassName)}>
                {hasHeader ? (
                    <div className="flex items-center justify-between gap-3 border-b border-separator pb-3">
                        <div className="flex min-w-0 items-center gap-2">
                            {icon ? (
                                isSkeleton ? (
                                    <Skeleton className="size-6 shrink-0 rounded-full" />
                                ) : (
                                    <span className={cn(ICON_CLS, accent ? "text-accent" : "text-muted")}>
                                        {icon}
                                    </span>
                                )
                            ) : null}
                            {title ? (
                                isSkeleton ? (
                                    <Skeleton.Typography type="body" width="1/2" />
                                ) : (
                                    <span className="truncate text-base font-semibold tracking-tight text-foreground">
                                        {title}
                                    </span>
                                )
                            ) : null}
                        </div>
                        {action ? (
                            isSkeleton ? (
                                <Skeleton.Button />
                            ) : (
                                <div className="shrink-0">{action}</div>
                            )
                        ) : null}
                    </div>
                ) : null}
                {isSkeleton ? <Skeleton.Paragraph lines={3} /> : children}
            </CardContent>
        </Card>
    )
}
