"use client"

import React, {
    useMemo,
    useState,
} from "react"
import {
    Breadcrumbs,
    Input,
    TextField,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
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
import {
    pathConfig,
} from "@/resources"
import {
    BookmarkCard,
} from "./BookmarkCard"

/**
 * Bookmarks ("Đã lưu") page. A searchable, infinite-scrolling library of the
 * viewer's saved contents. Owns the page chrome (breadcrumb + {@link PageHeader}
 * with the saved count, matching sibling settings pages), a client-side search
 * filter over the loaded items, and the offset-paginated list (compact rows that
 * self-navigate). Data states go through {@link AsyncContent}; more pages load as
 * the {@link InfiniteScrollSentinel} scrolls into view. Mounted by
 * `/profile/bookmarks`.
 */
export const Bookmarks = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
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

    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
            <PageHeader
                breadcrumb={(
                    <Breadcrumbs>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).build())}>
                            {t("nav.home")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).profile().build())}>
                            {t("nav.profile")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item>
                            {t("content.saved")}
                        </Breadcrumbs.Item>
                    </Breadcrumbs>
                )}
                title={t("content.saved")}
                description={t("bookmarks.count", { count })}
            />

            {/* search — filters the loaded items by title / description */}
            <TextField>
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
                    <div className="flex flex-col gap-2">
                        {filtered.map((content) => (
                            <BookmarkCard key={content.id} content={content} />
                        ))}
                    </div>
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
