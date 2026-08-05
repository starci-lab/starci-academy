import React from "react"
import { type SkeletonProps } from "@sb-components/frames/_slot"
import { TrophyIcon } from "@phosphor-icons/react"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { UserCell } from "@sb-components/composites/lists/UserCell/UserCell"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"
import { Podium } from "../Podium"
import { type BoardProps, type LeaderboardRow } from "../types"

/** Builds one row's free-form `SurfaceCard.List` content: rank number + the unchanged `UserCell`. */
const rowItem = (row: LeaderboardRow, meLabel: string, isSkeleton: boolean): SurfaceCardListItem => ({
    key: row.key,
    href: row.profileHref,
    content: () => (
        <StackH
            gap={3}
            principles="identity"
            align="center"
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <Typography
                        size="sm"
                        color="muted"
                        tabularNums
                        align="center"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : `#${row.rank}`}


                    />
                ),
                () => (
                    <div className="min-w-0 flex-1">
                        <UserCell
                            username={row.username}
                            avatar={row.avatar}
                            isOwnRow={row.isMe}
                            trailing={({ isSkeleton: slotSkeleton }: SkeletonProps) => (
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    tabularNums
                                    isSkeleton={slotSkeleton}
                                    text={slotSkeleton ? undefined : row.valueLabel}

                                />
                            )}
                            isSkeleton={isSkeleton}

                        />
                    </div>
                ),
                ...(row.isMe ? [() => <span className="sr-only">{meLabel}</span>] : []),
            ]}
        />
    ),
})

/**
 * Assembles the list's rows: the visible `rows`, then — only when the viewer's
 * own row isn't already among them — an ellipsis marker (skipped when the gap is
 * zero) and the pinned `selfRow` at the end.
 */
const buildListItems = (
    rows: Array<LeaderboardRow>,
    selfRow: LeaderboardRow | undefined,
    hiddenBetweenCount: number | undefined,
    meLabel: string,
    isSkeleton: boolean,
): Array<SurfaceCardListItem> => {
    const rowItems = rows.map((row) => rowItem(row, meLabel, isSkeleton))
    if (!selfRow) {
        return rowItems
    }
    const ellipsisItem: SurfaceCardListItem | null =
        hiddenBetweenCount != null && hiddenBetweenCount > 0
            ? {
                key: "ellipsis",
                content: () => (
                    <Typography
                        size="xs"
                        color="muted"
                        align="center"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : `⋯ ${hiddenBetweenCount} more in between`}

                    />
                ),
            }
            : null
    return [...rowItems, ...(ellipsisItem ? [ellipsisItem] : []), rowItem(selfRow, meLabel, isSkeleton)]
}

/** Standing + podium + ranked rows. The block's ONE leaf/state-switch content. */
export const Board = ({ standing, podiumEntries, rows, selfRow, hiddenBetweenCount, meLabel, isSkeleton }: BoardProps) => {
    const standingLabels = standing ? (
        <StackV
            gap={1}
            isSkeleton={isSkeleton}
            items={[
                // The rank NUMBER is typed data; "Rank #N" is the block's own wording (§14d.1).
                () => (
                    <Typography
                        size="base"
                        weight="bold"
                        tabularNums
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : `Rank #${standing.rank}`}

                    />
                ),
                () => (
                    <Typography
                        size="sm"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : standing.primaryLabel}

                    />
                ),
                ...(standing.secondaryLabel ? [() => (
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : standing.secondaryLabel}

                    />
                )] : []),
            ]}
        />
    ) : null

    const standingCard = standing ? (
        <SurfaceCard

            body={() => (
                <StackH
                    gap={3}
                    principles="identity"
                    align="center"
                    isSkeleton={isSkeleton}
                    items={[
                        () => <IconTile icon={TrophyIcon} tone="accent" size="sm" isSkeleton={isSkeleton} />,
                        () => standingLabels,
                    ]}
                />
            )}
        />
    ) : null

    return (
        <StackV
            gap={6}
            isSkeleton={isSkeleton}
            items={[
                () => standingCard,
                ...(podiumEntries.length > 0 ? [() => (
                    <Podium entries={podiumEntries} meLabel={meLabel} isSkeleton={isSkeleton} />
                )] : []),
                ({ isSkeleton }: SkeletonProps) => (
                    <SurfaceCardList
                        items={buildListItems(rows, selfRow, hiddenBetweenCount, meLabel, isSkeleton ?? false)}
                        isSkeleton={isSkeleton}
                    />
                ),
            ]}
        />
    )
}
