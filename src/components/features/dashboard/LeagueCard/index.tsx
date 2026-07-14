"use client"

import React from "react"
import { useTranslations } from "next-intl"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    LeagueCardSkeleton,
} from "./LeagueCardSkeleton"
import {
    LeagueCardContent,
} from "./LeagueCardContent"
import { useQueryMyLeagueSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyLeagueSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"

/** Props for {@link LeagueCard}. */
export interface LeagueCardProps extends WithClassNames<undefined> {
    /**
     * When true, render the league inside a `LabeledCard` (title as a Label OUTSIDE
     * the card) instead of the flat inline heading — used on the dashboard Community
     * tab so it matches the other LabeledCard sections. Defaults to the flat layout
     * (the standalone /league page).
     */
    framed?: boolean
}

/**
 * Compact weekly-league card for the dashboard. Thin container: self-fetches the
 * league leaf query and runs the standard {@link AsyncContent} switch — a
 * layout-mirroring {@link LeagueCardSkeleton} while loading, a translated
 * {@link EmptyContent} inviting the viewer to join a cohort when not yet placed
 * in one, then {@link LeagueCardContent} once resolved. `isLoading` uses the
 * nullish form so the skeleton holds until data actually arrives (and never on
 * a falsy-but-valid value).
 * @param props - {@link LeagueCardProps}
 */
export const LeagueCard = ({
    className,
    framed = false,
}: LeagueCardProps) => {
    const t = useTranslations()
    const { data, isLoading } = useQueryMyLeagueSwr()
    // not yet placed in a cohort → translated empty state (join hint), not self-hide
    const isEmpty = data === null || data === undefined || data.entries.length === 0

    return (
        <AsyncContent
            isLoading={data === null || data === undefined || isLoading}
            skeleton={<LeagueCardSkeleton className={className} />}
            isEmpty={isEmpty}
            emptyContent={{
                title: t("dashboard.league.emptyTitle"),
                description: t("dashboard.league.emptyDescription"),
            }}
        >
            {data ? (
                <LeagueCardContent
                    data={data}
                    framed={framed}
                    className={className}
                />
            ) : null}
        </AsyncContent>
    )
}

export default LeagueCard
