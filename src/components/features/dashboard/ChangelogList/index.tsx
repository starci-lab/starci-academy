"use client"

import React from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    cn,
} from "@heroui/react"
import {
    useQueryChangelogEntriesSwr,
} from "@/hooks"
import {
    ChangelogCategory,
} from "@/modules/api"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ChangelogList}. */
export type ChangelogListProps = WithClassNames<undefined>

/** Tailwind classes for each category chip. */
const CATEGORY_CLASS: Record<ChangelogCategory, string> = {
    [ChangelogCategory.Feature]: "bg-success/15 text-success",
    [ChangelogCategory.Fix]: "bg-warning/15 text-warning",
    [ChangelogCategory.Announcement]: "bg-secondary/15 text-secondary",
}

/**
 * GitHub-style "Latest from our changelog" list for the dashboard right rail.
 * Each row shows the published date, an optional colored category chip and the
 * title (linked when the entry has a destination). Self-fetches the recent
 * changelog entries (newest first) like every other sidebar block.
 * @param props - optional className for the root element
 */
export const ChangelogList = ({
    className,
}: ChangelogListProps = {}) => {
    const t = useTranslations()
    const locale = useLocale()
    const { data: changelog } = useQueryChangelogEntriesSwr()
    const entries = changelog ?? []

    if (entries.length === 0) {
        return null
    }

    return (
        <div className={cn("flex w-full flex-col gap-3", className)}>
            {/* heading (no card) */}
            <span className="text-base font-semibold text-foreground">
                {t("dashboard.changelog")}
            </span>
            <div className="flex flex-col gap-3">
                {entries.map((entry) => (
                    <div
                        key={entry.id}
                        className="flex flex-col gap-1.5"
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
