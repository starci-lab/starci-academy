import React from "react"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `LeaderboardHeader`: the PAGE IDENTITY cluster at the top of the
 * leaderboard screen — trail, title, subtitle. Nothing else.
 *
 * WHY IT EXISTS AS ITS OWN BLOCK (rule 1) rather than the screen touching
 * `PageHeader` directly: every other ported screen in the catalog has its own
 * domain-named sibling around `PageHeader` — `ContentHeader`, `ModuleHeader`,
 * `CourseBrief`, `ChallengeHeader`, `SubmissionResultHeader`. A screen imports
 * blocks, never a composite (rule 1's "screen imports ONLY blocks and frames").
 * Leaderboard keeps that same shape even though it has less to say.
 *
 * ⚠️ GENUINELY THINNER THAN ITS SIBLINGS, AND THAT IS THE POINT, NOT A BUG.
 * `ContentHeader` carries a meta row (read-state chip, minutes, challenge
 * count) and an outcomes card; `CourseBrief` counts modules/hours/learners.
 * The real leaderboard header carries NO meta chips — no read-state, no tier,
 * no count fact rides along with the identity — because ranking position and
 * score live in the leaderboard LIST below, not in the header. Inventing a
 * meta row here to "look as busy as the siblings" would be putting words in
 * the design's mouth (§14d.1 in reverse: a block must not manufacture facts
 * the caller never had).
 *
 * ⚠️ FLAGGED FOR A SECOND LOOK (left in this header, not resolved by fiat):
 * with no meta row this block's only "earning" over calling `PageHeader`
 * straight is the `isSkeleton` → `Typography` swap on title/description — the
 * exact idiom `ContentHeader`/`ModuleHeader` already use for the same slots.
 * `check-passthrough-block` does not trip on it (it renders THREE distinct
 * child tags — `PageHeader`, `Breadcrumbs`, `Typography` — not one), but the
 * gate's silence is not the same as a verdict on genuine domain weight. If
 * leaderboard later grows a real domain fact (e.g. "this week" vs "all time"
 * scope as a meta chip), it belongs HERE, not bolted onto the screen.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One breadcrumb link — plain data, the block builds the atom from it. */
export interface LeaderboardHeaderCrumb {
    /** Stable React key. */
    key: string
    /** Display label. */
    label: string
    /** Has a handler → the crumb is pressable; the current page leaves it out. */
    onPress?: () => void
}

/** Props for {@link LeaderboardHeader}. */
export interface LeaderboardHeaderProps {
    /** Breadcrumb trail as DATA — the block builds `Breadcrumbs` itself. */
    breadcrumbItems: Array<LeaderboardHeaderCrumb>
    /** Page title, e.g. "Leaderboard". */
    title: string
    /** One-sentence subtitle explaining what the ranking measures. */
    description?: string
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c), so the shimmer keeps the exact box of the thing it replaces.
     */
    isSkeleton?: boolean
}

/**
 * Leaderboard page identity — trail, title, subtitle. See the file header for
 * why this stays a thin sibling of `ContentHeader`/`ModuleHeader` rather than
 * the screen calling `PageHeader` directly.
 *
 * @param props - {@link LeaderboardHeaderProps}
 */
const LeaderboardHeader = ({
    breadcrumbItems,
    title,
    description,
    isSkeleton = false,
}: LeaderboardHeaderProps) => {
    return (
        <div>
            <PageHeader

                isSkeleton={isSkeleton}
                breadcrumb={() =>
                    isSkeleton || breadcrumbItems.length ? (
                        <div className="w-fit">
                            <Breadcrumbs
                                collapseOnMobile
                                collapseFrom={4}
                                items={breadcrumbItems}
                                isSkeleton={isSkeleton}
                            />
                        </div>
                    ) : undefined
                }
                title={title}
                description={description}
            />
        </div>
    )
}

export { LeaderboardHeader }
