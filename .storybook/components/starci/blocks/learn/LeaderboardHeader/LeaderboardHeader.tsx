import React from "react"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * `LeaderboardHeader` — the page-identity cluster at the top of the leaderboard screen:
 * breadcrumb trail, title, subtitle. Thinner than sibling headers by design — no meta
 * chips, since ranking position and score live in the list below. Builds `Breadcrumbs`
 * from crumb DATA and drives `PageHeader`'s title slot with the `isSkeleton` →
 * `Typography` swap.
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
