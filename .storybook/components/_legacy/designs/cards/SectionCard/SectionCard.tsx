import React from "react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Card, CardContent, cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { type VerdictBand, verdictBandClassName } from "@sb-components/composites/cards/verdict-band"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

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
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * Storybook-only: when true, each composed part (Icon/Title/Action/Body) emits
     * a `data-anat-part` so the anatomy overlay can anchor badges. No visual effect.
     */
    showAnatomy?: boolean
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
    anatPart,
    showAnatomy = false,
}: SectionCardProps) => {
    const hasHeader = Boolean(title || action || icon)
    return (
        <Card
            data-anat-part={anatPart}
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
                                    <HeroSkeleton className="size-6 shrink-0 rounded-full" data-anat-part={showAnatomy ? "Icon" : undefined} />
                                ) : (
                                    <span
                                        className={cn(ICON_CLS, accent ? "text-accent" : "text-muted")}
                                        data-anat-part={showAnatomy ? "Icon" : undefined}
                                    >
                                        {icon}
                                    </span>
                                )
                            ) : null}
                            {title ? (
                                isSkeleton ? (
                                    <Typography size="base" isSkeleton className="w-1/2" anatPart={showAnatomy ? "Title" : undefined} />
                                ) : (
                                    <span
                                        className="truncate text-base font-semibold tracking-tight text-foreground"
                                        data-anat-part={showAnatomy ? "Title" : undefined}
                                    >
                                        {title}
                                    </span>
                                )
                            ) : null}
                        </div>
                        {action ? (
                            isSkeleton ? (
                                <Button.Base isSkeleton className="w-24" showAnatomy={showAnatomy} />
                            ) : (
                                <div className="shrink-0" data-anat-part={showAnatomy ? "Action" : undefined}>
                                    {action}
                                </div>
                            )
                        ) : null}
                    </div>
                ) : null}
                {isSkeleton ? (
                    // Gạch prose 3 dòng vẽ TẠI CHỖ — thân thẻ là NỘI DUNG của chính
                    // thẻ này (§12c: mỗi chủ tự vẽ skeleton của mình; compound
                    // compound Skeleton.* đã xoá).
                    <div className="flex flex-col" data-anat-part={showAnatomy ? "Body" : undefined}>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <HeroSkeleton
                                key={index}
                                className={cn("my-[6px] h-4 rounded", index === 2 ? "w-2/3" : "w-full")}
                            />
                        ))}
                    </div>
                ) : showAnatomy ? (
                    <div data-anat-part="Body">{children}</div>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    )
}
