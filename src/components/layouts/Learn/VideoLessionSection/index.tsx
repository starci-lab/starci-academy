import React, { useMemo } from "react"
import { VideoLessionCard } from "./VideoLessionCard"
import { Spacer } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
export const VideoLessionSection = () => {
    const t = useTranslations()
    const module = useAppSelector((state) => state.module.entity)
    const lessonVideos = useMemo(() => {
        return [...(module?.lessonVideos ?? [])].sort((a, b) => a.orderIndex - b.orderIndex)
    }, [module?.lessonVideos])
    return (
        <div>
            <div className="text-sm text-foreground-500">{
                t(
                    "lesson.videosCount",
                    {
                        count: lessonVideos.length
                    }
                )
            }</div>
            <Spacer y={3}/>
            <div className="flex flex-col gap-3">
                {lessonVideos.map((lessonVideo) => (
                    <VideoLessionCard key={lessonVideo.id} lessonVideo={lessonVideo} />
                ))}
            </div>
        </div>
    )
}