import React from "react"
import { ContinueCard } from "@/components/blocks/cards/ContinueCard"

/** Props for {@link _ResumeCard} — presentational; all text already resolved, no fetch/store/i18n. */
export interface ResumeCardProps {
    /** Title to show — the resume item's label. */
    title: string
    /** Already-translated subtitle label for the item's kind ("Challenge" / "Lesson"). */
    subtitle: string
    /** Already-translated call-to-action label ("Continue"). */
    ctaLabel: string
    /** Fires when the card's CTA is pressed — the connected half resolves the route. */
    onPress: () => void
}

/**
 * `_ResumeCard` — the presentational half of {@link import("./index").ResumeCard}: a
 * thin wrapper over the canonical {@link ContinueCard} block. Takes already-resolved
 * text and a press handler; owns no fetch, no store, no i18n (that lives in the
 * connected `./index.tsx` — see `tiers/split.md`). No BE progress field is available
 * for either resume kind yet, so the progress meter stays hidden (never fabricate a
 * number).
 * @param props - {@link ResumeCardProps}
 */
export const _ResumeCard = ({
    title,
    subtitle,
    ctaLabel,
    onPress,
}: ResumeCardProps) => (
    <ContinueCard
        variant="item"
        title={title}
        subtitle={subtitle}
        ctaLabel={ctaLabel}
        onPress={onPress}
        identity={{ tier: "block", component: "ResumeCard" }}
    />
)
