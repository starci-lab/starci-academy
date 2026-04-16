"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/redux"
import { ContentCard } from "./ContentCard"
import { useQueryContentsSwr } from "@/hooks/singleton"
import { ContentCardSkeleton } from "./ContentCardSkeleton"
import { Pagination, Skeleton } from "@heroui/react"
import _ from "lodash"
import { SearchBar } from "@/components/reuseable"
import { setContentPageNumber } from "@/redux/slices/content"

/**
 * Learn tab “Content”: ordered module contents (title + body, optional thumbnail).
 */
export const ContentSection = () => {
    const t = useTranslations()
    const contents = useAppSelector((state) => state.content.entities)
    const count = useAppSelector((state) => state.content.count)
    const limit = useAppSelector((state) => state.content.limit)
    const pageNumber = useAppSelector((state) => state.content.pageNumber)
    const { isLoading } = useQueryContentsSwr()
    const dispatch = useAppDispatch()

    const pageSize = limit ?? 10
    const totalPages = useMemo(() => {
        if (count == null || count <= 0) {
            return 0
        }
        return Math.max(1, Math.ceil(count / pageSize))
    }, [count, pageSize])

    const pageNumbers = useMemo(
        () => Array.from({ length: totalPages }, (_, index) => index + 1),
        [totalPages]
    )

    const currentPage = pageNumber ?? 1

    return (
        <div>
            <SearchBar />
            <div className="h-6" />
            {
                isLoading || !contents ? (
                    <Skeleton className="h-[14px] w-[150px] my-[3px]" />
                ) : (
                    <div className="text-sm text-muted">
                        {t("content.count", { count: count ?? 0 })}
                    </div>
                )
            }
            <div className="h-6" />
            {
                isLoading || !contents ? (
                    <div className="flex flex-col gap-3 w-full">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <ContentCardSkeleton key={index} />
                        ))}
                    </div>
                )
                    : (
                        <div>
                            <div className="flex flex-col gap-3 w-full">
                                {
                                    _.cloneDeep(contents)?.sort(
                                        (prev, next) => prev.orderIndex - next.orderIndex
                                    ).map((content) => (
                                        <ContentCard key={content.id} content={content} />
                                    )
                                    )
                                }
                            </div>
                            {
                                count ? (
                                    <>
                                        <div className="h-12" />
                                        <Pagination
                                            aria-label={t("common.pagination.navAria")}
                                            className="justify-center"
                                            size="sm"
                                        >
                                            <Pagination.Content className="flex flex-wrap justify-center gap-1">
                                                <Pagination.Item>
                                                    <Pagination.Previous
                                                        aria-label={t("common.pagination.previous")}
                                                        isDisabled={currentPage <= 1}
                                                        onPress={() => dispatch(setContentPageNumber(currentPage - 1))}
                                                    >
                                                        <Pagination.PreviousIcon />
                                                    </Pagination.Previous>
                                                </Pagination.Item>
                                                {pageNumbers.map((p) => (
                                                    <Pagination.Item key={p}>
                                                        <Pagination.Link
                                                            isActive={p === currentPage}
                                                            onPress={() => dispatch(setContentPageNumber(p))}
                                                        >
                                                            {p}
                                                        </Pagination.Link>
                                                    </Pagination.Item>
                                                ))}
                                                <Pagination.Item>
                                                    <Pagination.Next
                                                        aria-label={t("common.pagination.next")}
                                                        isDisabled={currentPage >= totalPages}
                                                        onPress={() => dispatch(setContentPageNumber(currentPage + 1))}
                                                    >
                                                        <Pagination.NextIcon />
                                                    </Pagination.Next>
                                                </Pagination.Item>
                                            </Pagination.Content>
                                        </Pagination>
                                    </>
                                ) : null
                            }
                        </div>
                    )
            }
        </div>
    )
}
