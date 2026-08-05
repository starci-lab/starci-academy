"use client"

import React from "react"
import { useLocale, useTranslations } from "next-intl"
import { useQueryChangelogEntriesSwr } from "@/hooks/swr/api/graphql/queries/useQueryChangelogEntriesSwr"
import { _ChangelogList, type ChangelogListEntry, type ChangelogListProps as PresentationalProps } from "./component"

/** Props for {@link ChangelogList} — the caller-facing subset of {@link PresentationalProps}. */
export type ChangelogListProps = Pick<PresentationalProps, "framed">

/**
 * GitHub-style "Latest from our changelog" list for the dashboard right rail — the
 * CONNECTED half: it fetches the recent changelog entries (newest first) like every
 * other sidebar block, resolves each entry's date + category label, and hands them to
 * the presentational {@link _ChangelogList}. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link ChangelogListProps}
 */
export const ChangelogList = ({ framed = false }: ChangelogListProps = {}) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data: changelog, isLoading, error, mutate } = useQueryChangelogEntriesSwr()
    const rawEntries = changelog ?? []

    const entries: Array<ChangelogListEntry> = rawEntries.map((entry) => ({
        id: entry.id,
        formattedDate: new Date(entry.publishedAt).toLocaleDateString(locale),
        category: entry.category ?? undefined,
        categoryLabel: entry.category ? t(`dashboard.changelogCategory.${entry.category}`) : undefined,
        linkUrl: entry.linkUrl ?? undefined,
        title: entry.title,
        body: entry.body ?? undefined,
    }))

    return (
        <_ChangelogList
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={isLoading && entries.length === 0}
            // settled with a resolved-but-empty list — the connected error itself is passed separately below
            isEmpty={entries.length === 0}
            error={error}
            onRetry={() => { void mutate() }}
            entries={entries}
            framed={framed}
            labels={{
                title: t("dashboard.changelog"),
                loadError: t("dashboard.changelogList.loadError"),
                retry: t("common.retry"),
            }}
        />
    )
}
