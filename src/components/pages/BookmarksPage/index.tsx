"use client"

import React, {
    useEffect,
    useState,
} from "react"
import {
    Button,
    Input,
    Pagination,
    TextField,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    SettingsBreadcrumb,
} from "@/components/blocks/settings/SettingsBreadcrumb"
import {
    BookmarkCard,
} from "./BookmarkCard"
import { pathConfig } from "@/resources/path"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import { EmptyState } from "@/components/composites/feedback/EmptyState"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"
import { Cluster } from "@/components/frames/Cluster"
import { SAVED_CONTENTS_PAGE_SIZE, useQuerySavedContentsSwr } from "@/hooks/swr/api/graphql/queries/useQuerySavedContentsSwr"

/**
 * Bookmark page — a searchable, paginated library of the viewer's saved contents.
 * Follows the list-surface anatomy: a primary search input balanced by the result
 * count, one {@link SurfaceListCard} of saved-lesson rows, and a left-aligned
 * {@link Pagination} (hidden on a single page). Search + paging are resolved
 * server-side (`savedContents(skip, take, search)`); typing snaps back to page 1.
 * Data states go through {@link AsyncContent}. A truly-empty library (never
 * bookmarked, no active search) renders {@link EmptyState} with a "browse
 * courses" CTA instead of a dead end; a zero-match search stays inline with
 * {@link AsyncContentEmpty} so the search box remains reachable. Mounted by
 * `/profile/bookmarks`.
 */
export const BookmarksPage = () => {
    const t = useTranslations()
    const router = useRouter()

    // search input (debounced → server-side title filter) + 1-based page
    const [search, setSearch] = useState("")
    const [debounced, setDebounced] = useState("")
    const [page, setPage] = useState(1)

    // debounce keystrokes before hitting the server
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(search.trim()), 300)
        return () => clearTimeout(timer)
    }, [search])

    // a new search shrinks the list — snap back to the first page
    useEffect(() => {
        setPage(1)
    }, [debounced])

    const {
        data,
        isLoading,
        error,
        mutate,
    } = useQuerySavedContentsSwr(page, debounced)

    const contents = data?.contents ?? []
    const count = data?.count ?? 0
    const totalPages = Math.ceil(count / SAVED_CONTENTS_PAGE_SIZE)
    const pageNumbers = Array.from({ length: totalPages }, (_unused, index) => index + 1)

    const skeletonRows = [0, 1, 2, 3, 4].map((row) => () => (
        <Box key={row} principle="card-padding" className="p-4"
            explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
            <StackH
                gap={4}
                align="center"
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                items={[
                    () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                    () => (
                        <StackV
                            gap={3}
                            principle="sibling-stack"
                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                            classNames={["flex-1"]}
                            items={[
                                () => <Skeleton className="h-4 w-1/2 rounded-medium" />,
                                () => <Skeleton className="h-3 w-1/3 rounded-medium" />,
                            ]}
                        />
                    ),
                ]}
            />
        </Box>
    ))

    const listBodyItems = [
        () => (
            <Cluster
                gap={4}
                justify="between"
                align="center"
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                items={[
                    () => (
                        <TextField className="w-full @app-sm:max-w-sm">
                            <Input
                                type="search"
                                aria-label={t("bookmarks.searchPlaceholder")}
                                placeholder={t("bookmarks.searchPlaceholder")}
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </TextField>
                    ),
                    () => (
                        <Typography type="body-sm" color="muted" className="shrink-0">
                            {t("bookmarks.found", { count })}
                        </Typography>
                    ),
                ]}
            />
        ),
        () => (
            contents.length === 0 ? (
                <AsyncContentEmpty title={t("bookmarks.noMatch")} />
            ) : (
                <>
                    <SurfaceListCard>
                        {contents.map((content) => (
                            <BookmarkCard key={content.id} content={content} />
                        ))}
                    </SurfaceListCard>

                    {totalPages > 1 ? (
                        <Pagination
                            aria-label={t("common.pagination.navAria")}
                            className="justify-start"
                            size="sm"
                        >
                            <Pagination.Content className="flex flex-wrap justify-start gap-2" data-principle="flex-action">
                                <Pagination.Item>
                                    <Pagination.Previous
                                        aria-label={t("common.pagination.previous")}
                                        isDisabled={page <= 1}
                                        className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                        onPress={() => setPage((current) => Math.max(1, current - 1))}
                                    >
                                        <Pagination.PreviousIcon />
                                    </Pagination.Previous>
                                </Pagination.Item>
                                {pageNumbers.map((pageNumber) => (
                                    <Pagination.Item key={pageNumber}>
                                        <Pagination.Link
                                            isActive={pageNumber === page}
                                            className="cursor-pointer rounded-medium transition-colors hover:bg-default data-[active=true]:hover:bg-accent"
                                            onPress={() => setPage(pageNumber)}
                                        >
                                            {pageNumber}
                                        </Pagination.Link>
                                    </Pagination.Item>
                                ))}
                                <Pagination.Item>
                                    <Pagination.Next
                                        aria-label={t("common.pagination.next")}
                                        isDisabled={page >= totalPages}
                                        className="cursor-pointer rounded-medium transition-colors hover:bg-default"
                                        onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
                                    >
                                        <Pagination.NextIcon />
                                    </Pagination.Next>
                                </Pagination.Item>
                            </Pagination.Content>
                        </Pagination>
                    ) : null}
                </>
            )
        ),
    ]

    return (
        <Box identity={{ tier: "page", component: "BookmarksPage" }} principle="center-measure" className="mx-auto max-w-4xl"
            explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport.">
            <Box principle="page-pad" className="p-6"
                explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
                <div className="flex flex-col gap-10">
                    <PageHeader
                        breadcrumb={<SettingsBreadcrumb current={t("bookmarks.heading")} />}
                        title={t("bookmarks.heading")}
                        description={t("bookmarks.subtitle")}
                    />
                    <AsyncContent
                        isLoading={isLoading && !data}
                        skeleton={(
                            <SurfaceListCard>
                                {skeletonRows.map((Row, index) => (
                                    <Row key={index} />
                                ))}
                            </SurfaceListCard>
                        )}
                        error={error}
                        errorContent={{
                            title: t("bookmarks.errorTitle"),
                            onRetry: () => { void mutate() },
                            retryLabel: t("dashboard.retry"),
                        }}
                    >
                        {!debounced && count === 0 ? (
                            <EmptyState
                                title={t("bookmarks.empty")}
                                description={t("bookmarks.emptyHint")}
                                action={() => (
                                    <Button
                                        variant="primary"
                                        onPress={() => router.push(pathConfig().locale().course().build())}
                                    >
                                        {`${t("dashboard.browseCourses")} →`}
                                    </Button>
                                )}
                            />
                        ) : (
                            <StackV gap={4} items={listBodyItems} />
                        )}
                    </AsyncContent>
                </div>
            </Box>
        </Box>
    )
}
