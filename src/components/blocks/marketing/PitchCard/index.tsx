import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import {
    IdentityTile,
    type IdentityTileIcon,
    type IdentityTileTone,
} from "@/components/atoms/display/IdentityTile"
import { SectionCard } from "@/components/blocks/cards/SectionCard"

/** Props for the {@link PitchCard} block. */
export interface PitchCardProps {
    /** Phosphor icon component rendered inside the tinted {@link IdentityTile}. */
    icon: IdentityTileIcon
    /** Tint of the identity tile; defaults to accent. */
    tone?: IdentityTileTone
    /** Card title (the claim). */
    title: React.ReactNode
    /** Supporting body copy (the proof / explanation). */
    body: React.ReactNode
    /** Optional footer slot — e.g. a Link/Button into the relevant surface. */
    footer?: React.ReactNode
}

/**
 * A single "pitch" card: tinted identity tile, a bold claim, supporting copy, and an
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
        <SectionCard
            identity={{ tier: "block", component: "PitchCard" }}
            contentGap={4}
            fillHeight
        >
            <IdentityTile icon={icon} tone={tone} size="md" />
            <Typography size="h5" weight="semibold" text={title} />
            <Typography size="sm" color="muted" text={body} />
            {footer}
        </SectionCard>
    )
}
