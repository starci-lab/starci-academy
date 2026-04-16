"use client"

import React from "react"
import { VideoLessionCard } from "./LessionVideoCard"
import { useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/redux"
import { Button, Skeleton } from "@heroui/react"
import { useQueryLessonVideosSwr } from "@/hooks/singleton"
import { LessionVideoCardSkeleton } from "./LessionVideoCardSkeleton"
import { LivestreamCalendar } from "./LivestreamCalendar"
import { SearchBar } from "@/components/reuseable"
import { setContentPageNumber } from "@/redux/slices/content"

/**
 * Learn tab “Videos”: exclusive lesson videos (title + body, optional thumbnail).
 */
export const LessonVideoSection = () => {
    const t = useTranslations()
    const lessionVideos = useAppSelector((state) => state.lessonVideo.entities)
    const { isLoading } = useQueryLessonVideosSwr()
    const count = useAppSelector((state) => state.lessonVideo.count)
    const limit = useAppSelector((state) => state.lessonVideo.limit)
    const pageNumber = useAppSelector((state) => state.lessonVideo.pageNumber)
    const dispatch = useAppDispatch()
    return (
        <div>
            <LivestreamCalendar />
            <div className="h-12" />
            <SearchBar />
            <div className="h-12" />
            {
                isLoading || !lessionVideos ? (
                    <Skeleton className="h-[14px] w-[150px] my-[3px]" />
                ) : (
                    <div className="text-sm text-foreground-500">
                        {t("content.count", { count: lessionVideos?.length ?? 0 })}
                    </div>
                )
            }
            <div className="h-12" />
            {isLoading || !lessionVideos ? (
                <div className="flex flex-col gap-3 w-full">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <LessionVideoCardSkeleton key={index} />
                    ))}
                </div>
            )
                : (
                    <div>
                        <div className="flex flex-col gap-3 w-full">
                            {
                                lessionVideos?.sort(
                                    (prev, next) => prev.orderIndex - next.orderIndex
                                ).map((lessonVideo) => (
                                    <VideoLessionCard key={lessonVideo.id} lessonVideo={lessonVideo} />
                                )
                                )
                            }
                        </div>
                        {
                            count && (
                                <>
                                    <div className="h-12" />
                                    <div className="flex gap-2 items-center justify-center">
                                        {Array.from({ length: Math.ceil((count ?? 0) / (limit ?? 10)) }, (_, i) => i + 1).map(p => (
                                            <Button
                                                key={p}
                                                size="sm"
                                                variant={p === (pageNumber ?? 1) ? "primary" : "ghost"}
                                                isIconOnly
                                                onPress={() => dispatch(setContentPageNumber(p))}
                                            >
                                                {p}
                                            </Button>
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
