import { StarCiCard, StarCiImage } from "@/components/atomic"
import { LessonVideoEntity } from "@/modules/types"
import { useRouter } from "next/navigation"
import React from "react"

export interface VideoLessionCardProps {
    /** The video lesson. */
    videoLesson: LessonVideoEntity
}

export const VideoLessionCard = ({ videoLesson }: VideoLessionCardProps) => {
    const router = useRouter()  
    return (
        <StarCiCard isPressable={true} onPress={
            () => {
                router.push(videoLesson.url)
            }
        }
        >
            <StarCiImage src={videoLesson.url} alt={videoLesson.title} />
        </StarCiCard>
    )
}