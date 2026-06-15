"use client"

import React from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import type {
    QueryChangelogEntryData,
} from "@/modules/api"
import {
    ChangelogCategory,
} from "@/modules/api"

/** Props for {@link ChangelogList}. */
export interface ChangelogListProps {
    /** Recent changelog entries, newest first. */
    entries: Array<QueryChangelogEntryData>
}

/** Tailwind classes for each category chip. */
const CATEGORY_CLASS: Record<ChangelogCategory, string> = {
    [ChangelogCategory.Feature]: "bg-success/15 text-success",
    [ChangelogCategory.Fix]: "bg-warning/15 text-warning",
    [ChangelogCategory.Announcement]: "bg-secondary/15 text-secondary",
}

/**
 * GitHub-style "Latest from our changelog" list for the dashboard right rail.
 * Each row shows the published date, an optional colored category chip and the
 * title (linked when the entry has a destination).
 * @param props - the changelog entries
 */
export const ChangelogList = ({
    entries,
}: ChangelogListProps) => {
    const t = useTranslations()
    const locale = useLocale()

    if (entries.length === 0) {
        return null
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="text-base font-semibold text-foreground">
                {t("dashboard.changelog")}
            </div>
            <div className="flex flex-col gap-3">
                {entries.map((entry) => (
                    <div
                        key={entry.id}
                        className="flex flex-col gap-1"
                    >
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted">
                                {new Date(entry.publishedAt).toLocaleDateString(locale)}
                            </span>
                            {entry.category ? (
                                <span
                                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                                        CATEGORY_CLASS[entry.category]
                                    }`}
                                >
                                    {t(`dashboard.changelogCategory.${entry.category}`)}
                                </span>
                            ) : null}
                        </div>
                        {entry.linkUrl ? (
                            <a
                                href={entry.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                {entry.title}
                            </a>
                        ) : (
                            <span className="text-sm font-medium text-foreground">
                                {entry.title}
                            </span>
                        )}
                        {entry.body ? (
                            <span className="text-xs text-muted">
                                {entry.body}
                            </span>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}
