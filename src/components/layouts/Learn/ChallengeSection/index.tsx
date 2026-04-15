"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/redux"
import { ChallengeCard } from "./ChallengeCard"
import { StarCiButton, StarCiSkeleton } from "@/components/atomic"
import { useQueryChallengesSwr } from "@/hooks/singleton"
import { ChallengeCardSkeleton } from "./ChallengeCardSkeleton"
import { SearchBar, Spacer } from "@/components/reuseable"
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
    return (
        <div>
            <SearchBar />
            <Spacer y={6} />
            {isLoading || !challenges ? (
                <StarCiSkeleton className="h-[14px] w-[150px] my-[3px]" />
            ) : (
                <div className="text-sm text-foreground-500">
                    {t("challenge.count", { count: challenges?.length ?? 0 })}
                </div>
            )}
            <Spacer y={4} />
            {isLoading || !challenges ? (
                <div className="flex flex-col gap-3 w-full">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <ChallengeCardSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <div>
                    <div className="flex flex-col gap-3 w-full">
                        {
                            _.sortBy(challenges, "orderIndex").map((challenge) => (
                                <ChallengeCard key={challenge.id} challenge={challenge} />
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
                                            onPress={() => dispatch(setChallengePageNumber(p))}
                                        >
                                            {p}
                                        </StarCiButton>
                                    ))}
                                </div>
                            </>
                        )
                    }
                </div>
            )}
        </div>
    )
}
