import React from "react"
import { VideoLessionCard } from "./LessionVideoCard"
import { Spacer } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
// import { useQueryLessonVideosSwr } from "@/hooks/singleton"

/**
 * Learn tab “Videos”: exclusive lesson videos (title + body, optional thumbnail).
 */
export const LessonVideoSection = () => {
    const t = useTranslations()
    const lessionVideos = useAppSelector((state) => state.lessonVideo.entities)
    //const swr = useQueryLessonVideosSwr()
    return (
        <div>
            <div className="text-sm text-foreground-500">{
                t(
                    "lesson.videosCount",
                    {
                        count: lessionVideos?.length ?? 0
                    }
                )
            }</div>
            <Spacer y={3}/>
            <div className="flex flex-col gap-3">
                {lessionVideos?.map((lessonVideo) => (
                    <VideoLessionCard key={lessonVideo.id} lessonVideo={lessonVideo} />
                ))}
            </div>
        </div>
    )
}