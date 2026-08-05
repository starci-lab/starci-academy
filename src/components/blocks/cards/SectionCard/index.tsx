"use client"

import React from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackH } from "@/components/frames/Stack"
import { type VerdictBand, verdictBandClassName } from "../verdict-band"

/** Props for {@link SectionCard}. */
export interface SectionCardProps {
    /** Card body. */
    children: React.ReactNode
    /** Optional section title rendered in the header row. The atom wraps it in `Typography` itself. */
    title?: React.ReactNode
    /** Optional leading icon shown before the title. */
    icon?: React.ReactNode
    /** Optional action node pinned to the right of the header (button/link). */
    action?: React.ReactNode
    /** Accent variant: tinted border + background (highlight / "yours"). */
    accent?: boolean
    /**
     * Verdict variant: a thick LEFT band (`border-l-4`) on top of the card's own
     * border — the asymmetric-border shape for "a card carrying a signal FROM DATA"
     * (`card.md` §3i). See {@link VerdictBand}. Left band ONLY reads as a DATA
     * signal — never ad-hoc "active region" decoration (`card.md` §3g).
     */
    withVerdict?: VerdictBand
    /**
     * Where the card sits inside its parent. Appearance is not passable — it is
     * already a prop.
     */
    classNames?: Array<AllowedClassName>
    /** Extra classes merged onto the inner content wrapper. */
    contentClassName?: string
}

/**
 * The canonical bordered "framed" card used across profile + dashboard. A thin
 * skin (`rounded-3xl bg-surface shadow-surface`, the same face `.card` in
 * `globals.css` gives HeroUI's own `Card`) that adds an optional header row
 * (icon + title on the left, action on the right) so every titled section looks
 * identical. Use `accent` for the viewer's own / highlighted cards. The header
 * row and content wrapper compose the frame tier's `StackH`/`Box`.
 *
 * @param props - {@link SectionCardProps}
 * @see Story: .storybook/stories/blocks/cards/SectionCard/SectionCard.stories
 */
export const SectionCard = ({
    children,
    title,
    icon,
    action,
    accent = false,
    withVerdict,
    classNames,
    contentClassName,
}: SectionCardProps) => {
    const hasHeader = Boolean(title || action || icon)
    return (
        <div
            className={cn(
                "rounded-3xl bg-surface shadow-surface p-4",
                accent && "border-accent",
                verdictBandClassName(withVerdict),
                classNames,
            )}
            data-tier="composite"
            data-component="SectionCard"
        >
            <Box className={cn("flex flex-col gap-3", contentClassName)}>
                {hasHeader ? (
                    <Box className="border-b border-separator pb-3">
                        <StackH
                            gap={3}
                            justify="between"
                            items={[
                                () => (
                                    <StackH
                                        gap={2}
                                        classNames={["min-w-0"]}
                                        items={[
                                            ...(icon ? [() => <>{icon}</>] : []),
                                            ...(title ? [() => (
                                                <Typography size="base" weight="semibold" truncate text={title} />
                                            )] : []),
                                        ]}
                                    />
                                ),
                                ...(action ? [() => <span className="shrink-0">{action}</span>] : []),
                            ]}
                        />
                    </Box>
                ) : null}
                {children}
            </Box>
        </div>
    )
}
