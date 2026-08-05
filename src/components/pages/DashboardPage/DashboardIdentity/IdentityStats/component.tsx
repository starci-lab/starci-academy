import React from "react"
import { IconLabelValueRow } from "@/components/composites/lists/IconLabelValueRow"
import type { TypographyIcon } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"

/**
 * One glanceable stat row (`icon + label + value`) — streak / AI credit / reward each
 * fetch on their OWN SWR leaf, so each row carries its own first-load `isSkeleton` and
 * settled `isEmpty` rather than the block sharing a single flag (loading-and-skeleton.md
 * §2). Rendered through the co-located {@link IconLabelValueRow} composite, which already
 * owns the icon/label/value shimmer — there is no separate skeleton tree to hand-keep.
 */
export interface IdentityStatRow {
    /** First load, nothing in hand yet → the row shimmers in place. */
    isSkeleton?: boolean
    /** Settled with nothing to show → the row hides itself (mirrors the legacy branch, which rendered no message here either). */
    isEmpty?: boolean
    /** Leading glyph — a Phosphor icon COMPONENT reference, never built JSX. */
    icon: TypographyIcon
    /** Already-translated row label (e.g. "Streak"). Resolved regardless of `isSkeleton`/`isEmpty` — it never depends on the fetch. */
    label: string
    /** Already-translated/formatted value (e.g. "3 days"). Ignored while `isSkeleton`. */
    value: string
}

/** Props for {@link _IdentityStats} — presentational; all data resolved, no fetch/store/i18n. */
export type IdentityStatsProps = {
    /** Current streak row. */
    streak: IdentityStatRow
    /** Remaining weekly AI credit row. */
    credit: IdentityStatRow
    /** Reward wallet balance row. */
    reward: IdentityStatRow
}

/**
 * Renders one row, or hides it once settled with nothing to show — the same
 * error → skeleton → empty → content priority the legacy `AsyncContent` branch used,
 * minus the message branches this region never configured (neither `emptyContent` nor
 * `errorContent` was ever passed on the old block, so nothing is shown here either;
 * only the co-located shimmer changed).
 */
const renderRow = (row: IdentityStatRow, key: string) => {
    if (!row.isSkeleton && row.isEmpty) {
        return null
    }
    return (
        <IconLabelValueRow
            key={key}
            icon={row.icon}
            label={row.label}
            value={row.value}
            isSkeleton={row.isSkeleton}
        />
    )
}

/**
 * `_IdentityStats` — the presentational half of {@link import("./index").IdentityStats}:
 * viewer "standing" stat rows for the identity column (current streak, remaining weekly
 * AI credit, reward balance). Each row is its own async leaf — `isSkeleton` is threaded
 * straight into {@link IconLabelValueRow}, which draws its own shimmer, so there is no
 * hand-kept parallel skeleton tree (loading-and-skeleton.md). Owns no fetch, no store, no
 * i18n (that lives in the connected `./index.tsx` — see `tiers/split.md`).
 *
 * @param props - {@link IdentityStatsProps}
 */
export const _IdentityStats = ({
    streak,
    credit,
    reward,
}: IdentityStatsProps) => (
    <StackV
        identity={{ tier: "block", component: "IdentityStats" }}
        gap={2}
        items={[
            () => renderRow(streak, "streak"),
            () => renderRow(credit, "credit"),
            () => renderRow(reward, "reward"),
        ]}
    />
)
