"use client"

import React, { useMemo } from "react"
import { Pagination, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/redux"
import { WithClassNames } from "@/modules/types"
import { useQueryChallengesSwr } from "@/hooks/singleton"
import { setChallengePageNumber } from "@/redux/slices"
import { ChallengeCard } from "./ChallengeCard"
import { ChallengeCardSkeleton } from "./ChallengeCardSkeleton"
import { ChallengeBodyEmpty } from "./Empty"
import _ from "lodash"
import { SearchBar } from "../../../reuseable"

export type ChallengeBodyProps = WithClassNames<undefined>

export const ChallengeBody = ({ className }: ChallengeBodyProps) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const queryChallengesSwr = useQueryChallengesSwr()
    const challenges = useAppSelector((state) => state.challenge.entities)
    const count = useAppSelector((state) => state.challenge.count)
    const limit = useAppSelector((state) => state.challenge.limit)
    const pageNumber = useAppSelector((state) => state.challenge.pageNumber)
    const isLoading = useMemo(() => queryChallengesSwr.isLoading || !challenges, [queryChallengesSwr.isLoading, challenges])
    const pageSize = limit ?? 10
    const totalPages = useMemo(() => {
        if (count == null || count <= 0) {
            return 0
        }
        return Math.max(1, Math.ceil(count / pageSize))
    }, [count, pageSize])
    const pageNumbers = useMemo(
        () => Array.from({ length: totalPages }, (_, index) => index + 1),
        [totalPages],
    )
    const currentPage = pageNumber ?? 1

    if (isLoading) {
        return (
            <div className={cn("flex flex-col gap-3", className)}>
                <ChallengeCardSkeleton />
                <ChallengeCardSkeleton />
            </div>
        )
    }
    if (!challenges?.length) {
        return (
            <div className={cn("", className)}>
                <ChallengeBodyEmpty />
            </div>
        )
    }

    return (
        <div>
            <SearchBar />
            <div className="h-6" />
            <div className="text-sm text-muted">
                {t("challenge.count", { count: count ?? 0 })}
            </div>
            <div className="h-3" />
            <div className={cn("flex flex-col gap-3", className)}>
                {
                    _.cloneDeep(challenges)
                        ?.sort((prev, next) => prev.orderIndex - next.orderIndex)
                        .map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)
                }
            </div>
            {count ? (
                <>
                    <div className="h-6" />
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
                                    onPress={() => dispatch(setChallengePageNumber(currentPage - 1))}
                                >
                                    <Pagination.PreviousIcon />
                                </Pagination.Previous>
                            </Pagination.Item>
                            {pageNumbers.map((pageNumber) => (
                                <Pagination.Item key={pageNumber}>
                                    <Pagination.Link
                                        isActive={pageNumber === currentPage}
                                        onPress={() => dispatch(setChallengePageNumber(pageNumber))}
                                    >
                                        {pageNumber}
                                    </Pagination.Link>
                                </Pagination.Item>
                            ))}
                            <Pagination.Item>
                                <Pagination.Next
                                    aria-label={t("common.pagination.next")}
                                    isDisabled={currentPage >= totalPages}
                                    onPress={() => dispatch(setChallengePageNumber(currentPage + 1))}
                                >
                                    <Pagination.NextIcon />
                                </Pagination.Next>
                            </Pagination.Item>
                        </Pagination.Content>
                    </Pagination>
                </>
            ) : null}
        </div>
    )
}
