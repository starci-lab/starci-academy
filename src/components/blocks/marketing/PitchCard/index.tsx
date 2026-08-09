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
}

/**
 * A single "pitch" card shell: tinted identity tile inside a {@link SectionCard}.
 * Tier-3 presentational block — owns all styling, content via props. Reused across
 * the wedge / outcome / methodology beats of the landing page.
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
}: PitchCardProps) => {
    return (
        <SectionCard
            identity={{ tier: "block", component: "PitchCard" }}
            contentGap={4}
            fillHeight
        >
            <IdentityTile icon={icon} tone={tone} size="md" />
        </SectionCard>
    )
}
