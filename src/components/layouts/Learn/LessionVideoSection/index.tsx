import React from "react"
import { VideoLessionCard } from "./LessionVideoCard"
import { Spacer } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { StarCiSkeleton } from "@/components/atomic"
import { useQueryLessonVideosSwr } from "@/hooks/singleton"
import { LessionVideoCardSkeleton } from "../LessionVideoSection/LessionVideoCardSkeleton"

/**
 * Learn tab “Videos”: exclusive lesson videos (title + body, optional thumbnail).
 */
export const LessonVideoSection = () => {
    const t = useTranslations()
    const lessionVideos = useAppSelector((state) => state.lessonVideo.entities)
    const { isLoading } = useQueryLessonVideosSwr()
    return (
        <div>
            {
                isLoading || !lessionVideos ? (
                    <StarCiSkeleton className="h-[14px] w-[150px] my-[3px]" />
                ) : (
                    <div className="text-sm text-foreground-500">
                        {t("content.count", { count: lessionVideos?.length ?? 0 })}
                    </div>
                )
            }
            <Spacer y={6} />
            {isLoading || !lessionVideos ? (
                <div className="flex flex-col gap-3 w-full">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <LessionVideoCardSkeleton key={index} />
                    ))}
                </div>
            )
                : (
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
                )}
        </div>
    )
}