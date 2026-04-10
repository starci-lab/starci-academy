import React from "react"
import { VideoLessionCard } from "./LessionVideoCard"
import { Spacer } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/redux"
import { StarCiPagination, StarCiSkeleton } from "@/components/atomic"
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
            <Spacer y={6} />
            <SearchBar />
            <Spacer y={6} />
            {
                isLoading || !lessionVideos ? (
                    <StarCiSkeleton className="h-[14px] w-[150px] my-[3px]" />
                ) : (
                    <div className="text-sm text-foreground-500">
                        {t("content.count", { count: lessionVideos?.length ?? 0 })}
                    </div>
                )
            }
            <Spacer y={4} />
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
                                    <Spacer y={4} />
                                    <StarCiPagination
                                        total={Math.ceil((count ?? 0) / (limit ?? 10))}
                                        page={pageNumber ?? 1}
                                        onChange={(page) => {
                                            dispatch(setContentPageNumber(page))
                                        }}
                                    />
                                </>
                            )
                        }
                    </div>
                )}
        </div>
    )
}