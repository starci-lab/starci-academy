import React from "react"
import { cn } from "@heroui/react"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import type { IconTileTone, IconComponent } from "@sb-components/atoms/display/IconTile/IconTile"
import { SectionCard } from "@sb-components/_legacy/designs/cards/SectionCard/SectionCard"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported faithfully from
 * `@/components/blocks/marketing/PitchCard`. Composed from the local primitives
 * `SectionCard` (frame) + `IconTile` (tinted icon). Synced to `src` later.
 */

/** Props for the {@link PitchCard} block. */
export interface PitchCardProps {
    /** Phosphor icon component rendered inside the tinted {@link IconTile}. */
    icon: IconComponent
    /** Tint of the icon tile; defaults to accent. */
    tone?: IconTileTone
    /** Card title (the claim). */
    title: React.ReactNode
    /** Supporting body copy (the proof / explanation). */
    body: React.ReactNode
    /** Optional footer slot — e.g. a Link/Button into the relevant surface. */
    footer?: React.ReactNode
    /** Extra classes on the card. */
    className?: string
    /** When on, emit `data-anat-part` markers on the block's parts (Storybook anatomy). */
    showAnatomy?: boolean
}

/**
 * A single "pitch" card: tinted icon tile, a bold claim, supporting copy, and an
 * optional footer action. Presentational block built on {@link SectionCard} — owns
 * all styling, content via props. Reused across the beats of the landing page.
 *
 * @param props - {@link PitchCardProps}
 */
export const PitchCard = ({ icon, tone = "accent", title, body, footer, className, showAnatomy }: PitchCardProps) => {
    return (
        <SectionCard
            className={cn("h-full", className)}
            contentClassName="flex h-full flex-col gap-3"
            anatPart={showAnatomy ? "SectionCard" : undefined}
        >
            <IconTile icon={icon} tone={tone} size="md" anatPart={showAnatomy ? "IconTile" : undefined} />
            <Typography size="h5" text={title} showAnatomy={showAnatomy} />
            <Typography size="sm" text={body} color="muted" className="flex-1" showAnatomy={showAnatomy} />
            {footer ? <div>{footer}</div> : null}
        </SectionCard>
    )
}
