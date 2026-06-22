"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    Accordion,
    Input,
    TextField,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    AsyncContent,
    EmptyContent,
    InfiniteScrollSentinel,
    PageHeader,
    Skeleton,
} from "@/components/blocks"
import {
    useQuerySavedContentsInfiniteSwr,
} from "@/hooks"
import type {
    ContentEntity,
} from "@/modules/types"
import {
    SettingsBreadcrumb,
} from "../Settings/SettingsBreadcrumb"
import {
    BookmarkCard,
} from "./BookmarkCard"

/** Saved contents grouped under one course. */
interface BookmarkGroup {
    /** Course id (or a sentinel for contents with no resolvable course). */
    id: string
    /** Course title, or undefined when unknown. */
    title?: string
    /** The saved contents in this course. */
    items: Array<ContentEntity>
}

/**
 * Bookmarks ("Đã lưu") page. A searchable library of the viewer's saved contents,
 * GROUPED BY COURSE: each course is a collapsible section showing how many lessons
 * are saved in it; expanding reveals the saved-lesson rows. Owns the page chrome
 * (breadcrumb + {@link PageHeader} with the total saved count), a client-side search
 * filter, and offset pagination. Data states go through {@link AsyncContent}; more
 * pages load as the {@link InfiniteScrollSentinel} scrolls into view. Mounted by
 * `/profile/bookmarks`.
 */
export const Bookmarks = () => {
    const t = useTranslations()
    const [search, setSearch] = useState("")

    const {
        data,
        isLoading,
        isValidating,
        error,
        size,
        setSize,
        mutate,
    } = useQuerySavedContentsInfiniteSwr()

    const pages = useMemo(() => data ?? [], [data])
    // flatten all loaded pages into one list
    const contents = useMemo(() => pages.flatMap((page) => page.contents), [pages])
    const count = pages[0]?.count ?? 0
    // more rows remain when we've loaded fewer than the reported total
    const hasMore = count > 0 && contents.length < count
    const isLoadingMore = isValidating && size > 0

    // search filters the loaded items (title + description), client-side
    const query = search.trim().toLowerCase()
    const filtered = useMemo(
        () => (query
            ? contents.filter((content) =>
                content.title?.toLowerCase().includes(query)
                || content.description?.toLowerCase().includes(query))
            : contents),
        [contents, query],
    )

    // group the (filtered) saved contents by their owning course, preserving the
    // load order so the most-recently-saved course surfaces first
    const groups = useMemo<Array<BookmarkGroup>>(() => {
        const byCourse = new Map<string, BookmarkGroup>()
        for (const content of filtered) {
            const course = content.module?.course
            const key = course?.id ?? "__none__"
            const existing = byCourse.get(key)
            if (existing) {
                existing.items.push(content)
            } else {
                byCourse.set(key, { id: key, title: course?.title, items: [content] })
            }
        }
        return Array.from(byCourse.values())
    }, [filtered])

    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
            <SettingsBreadcrumb current={t("content.saved")} />
            <PageHeader
                title={t("content.saved")}
                description={t("bookmarks.count", { count })}
            />

            {/* search — filters the loaded items by title / description */}
            <TextField variant="secondary">
                <Input
                    aria-label={t("bookmarks.searchPlaceholder")}
                    placeholder={t("bookmarks.searchPlaceholder")}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </TextField>

            <AsyncContent
                isLoading={isLoading && contents.length === 0}
                skeleton={(
                    <div className="flex flex-col gap-2">
                        {[0, 1, 2, 3, 4].map((row) => (
                            <Skeleton key={row} className="h-16 w-full rounded-large" />
                        ))}
                    </div>
                )}
                isEmpty={contents.length === 0}
                emptyContent={{ title: t("content.empty") }}
                error={error}
                errorContent={{
                    title: t("content.saved"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("dashboard.retry"),
                }}
            >
                {filtered.length === 0 ? (
                    // loaded but the current search matches nothing
                    <EmptyContent title={t("bookmarks.noMatch")} />
                ) : (
                    // grouped by course: collapse shows the per-course saved count,
                    // expand reveals the saved-lesson rows (first course open by default)
                    <Accordion
                        variant="surface"
                        defaultExpandedKeys={groups[0] ? new Set([groups[0].id]) : undefined}
                    >
                        {groups.map((group) => (
                            <Accordion.Item
                                key={group.id}
                                id={group.id}
                                aria-label={group.title ?? t("bookmarks.otherCourse")}
                            >
                                <Accordion.Heading className="min-w-0">
                                    <Accordion.Trigger className="min-w-0 w-full">
                                        <div className="flex w-full min-w-0 items-center justify-between gap-3 text-start">
                                            <Typography type="body-sm" weight="semibold" truncate title={group.title}>
                                                {group.title ?? t("bookmarks.otherCourse")}
                                            </Typography>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <Typography type="body-xs" color="muted">
                                                    {t("bookmarks.savedCount", { count: group.items.length })}
                                                </Typography>
                                                <Accordion.Indicator />
                                            </div>
                                        </div>
                                    </Accordion.Trigger>
                                </Accordion.Heading>
                                <Accordion.Panel>
                                    <Accordion.Body>
                                        <div className="flex flex-col gap-2">
                                            {group.items.map((content) => (
                                                <BookmarkCard key={content.id} content={content} />
                                            ))}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
                {/* grow the list as the sentinel scrolls into view */}
                <InfiniteScrollSentinel
                    onReach={() => setSize((current) => current + 1)}
                    disabled={!hasMore || isLoadingMore}
                />
            </AsyncContent>
        </div>
    )
}
