"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/redux"
import { ContentCard } from "./ContentCard"
import { useQueryContentsSwr } from "@/hooks/singleton"
import { ContentCardSkeleton } from "./ContentCardSkeleton"
import { StarCiButton, StarCiSkeleton } from "@/components/atomic"
import _ from "lodash"
import { SearchBar, Spacer } from "@/components/reuseable"
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

    return (
        <div>
            <SearchBar />
            <Spacer y={6} />
            {
                isLoading || !contents ? (
                    <StarCiSkeleton className="h-[14px] w-[150px] my-[3px]" />
                ) : (
                    <div className="text-sm text-foreground-500">
                        {t("content.count", { count: count ?? 0 })}
                    </div>
                )
            }
            <Spacer y={4} />
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
                                count && (
                                    <>
                                        <Spacer y={4} />
                                        <div className="flex gap-2 items-center justify-center">
                                            {Array.from({ length: Math.ceil((count ?? 0) / (limit ?? 10)) }, (_, i) => i + 1).map(p => (
                                                <StarCiButton
                                                    key={p}
                                                    size="sm"
                                                    variant={p === (pageNumber ?? 1) ? "primary" : "ghost"}
                                                    isIconOnly
                                                    onPress={() => dispatch(setContentPageNumber(p))}
                                                >
                                                    {p}
                                                </StarCiButton>
                                            ))}
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    )
            }
        </div>
    )
}
