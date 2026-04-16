"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/redux"
import { ChallengeCard } from "./ChallengeCard"
import { Pagination, Skeleton } from "@heroui/react"
import { useQueryChallengesSwr } from "@/hooks/singleton"
import { ChallengeCardSkeleton } from "./ChallengeCardSkeleton"
import { SearchBar } from "@/components/reuseable"
import { setChallengePageNumber } from "@/redux/slices"
import _ from "lodash"

/**
 * Learn tab “Challenges”: ordered module challenges (title, brief, input count).
 */
export const ChallengeSection = () => {
    const t = useTranslations()
    const challenges = useAppSelector((state) => state.challenge.entities)
    const { isLoading } = useQueryChallengesSwr()
    const count = useAppSelector((state) => state.challenge.count)
    const limit = useAppSelector((state) => state.challenge.limit)
    const pageNumber = useAppSelector((state) => state.challenge.pageNumber)
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
            {isLoading || !challenges ? (
                <Skeleton className="h-[14px] w-[150px] my-[3px]" />
            ) : (
                <div className="text-sm text-muted">
                    {t("challenge.count", { count: count ?? 0 })}
                </div>
            )}
            <div className="h-6" />
            {isLoading || !challenges ? (
                <div className="flex flex-col gap-3 w-full">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <ChallengeCardSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <div>
                    <div className="flex flex-col gap-3 w-full">
                        {_.cloneDeep(challenges)
                            ?.sort((prev, next) => prev.orderIndex - next.orderIndex)
                            .map((challenge) => (
                                <ChallengeCard key={challenge.id} challenge={challenge} />
                            ))}
                    </div>
                    {count ? (
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
                                            onPress={() =>
                                                dispatch(setChallengePageNumber(currentPage - 1))
                                            }
                                        >
                                            <Pagination.PreviousIcon />
                                        </Pagination.Previous>
                                    </Pagination.Item>
                                    {pageNumbers.map((p) => (
                                        <Pagination.Item key={p}>
                                            <Pagination.Link
                                                isActive={p === currentPage}
                                                onPress={() => dispatch(setChallengePageNumber(p))}
                                            >
                                                {p}
                                            </Pagination.Link>
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Item>
                                        <Pagination.Next
                                            aria-label={t("common.pagination.next")}
                                            isDisabled={currentPage >= totalPages}
                                            onPress={() =>
                                                dispatch(setChallengePageNumber(currentPage + 1))
                                            }
                                        >
                                            <Pagination.NextIcon />
                                        </Pagination.Next>
                                    </Pagination.Item>
                                </Pagination.Content>
                            </Pagination>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    )
}
