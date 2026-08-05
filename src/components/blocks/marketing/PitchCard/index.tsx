import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { IconTile } from "../../identity/IconTile"
import type { IconTileTone } from "../../identity/IconTile"
import { SectionCard } from "@/components/blocks/cards/SectionCard"

/** Props for the {@link PitchCard} block. */
export interface PitchCardProps {
    /** Phosphor icon node rendered inside the tinted {@link IconTile}. */
    icon: React.ReactNode
    /** Tint of the icon tile; defaults to accent. */
    tone?: IconTileTone
    /** Card title (the claim). */
    title: React.ReactNode
    /** Supporting body copy (the proof / explanation). */
    body: React.ReactNode
    /** Optional footer slot — e.g. a Link/Button into the relevant surface. */
    footer?: React.ReactNode
}

/**
 * A single "pitch" card: tinted icon tile, a bold claim, supporting copy, and an
 * optional footer action. Tier-3 presentational block built on {@link SectionCard}
 * — owns all styling, content via props. Reused across the wedge / outcome /
 * methodology beats of the landing page.
 *
 * No `className` (BLOCK-4): nothing calls this block yet, so there is no
 * appearance to forward — a caller that needs to place this card in a grid
 * composes that grid itself, one tier up.
 *
 * @param props - {@link PitchCardProps}
 */
export const PitchCard = ({
    icon,
    tone = "accent",
    title,
    body,
    footer,
}: PitchCardProps) => {
    return (
        <SectionCard classNames={["h-full"]} contentGap={4} fillHeight>
            <IconTile icon={icon} tone={tone} size="md" />
            <Typography size="h5" weight="semibold" text={title} />
            <Typography size="sm" color="muted" classNames={["flex-1"]} text={body} />
            {footer}
        </SectionCard>
    )
}
