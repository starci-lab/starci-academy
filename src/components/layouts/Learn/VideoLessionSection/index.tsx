import React from "react"
import { LessonVideoEntity } from "@/modules/types"
import { VideoLessionCard } from "./VideoLessionCard"

export interface VideoLessionSectionProps {
    /** The video lessons. */
    videoLessons: Array<LessonVideoEntity>
}

export const VideoLessionSection = ({ videoLessons }: VideoLessionSectionProps) => {
    return (
        <div>
            {videoLessons.map((videoLesson) => (
                <VideoLessionCard key={videoLesson.id} videoLesson={videoLesson} />
            ))}
        </div>
    )
}