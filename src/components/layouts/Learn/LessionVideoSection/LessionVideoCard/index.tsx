import { StarCiCard, StarCiCardBody, StarCiChip, StarCiImage } from "@/components/atomic"
import { dayjs } from "@/modules/dayjs"
import { LessonVideoEntity } from "@/modules/types"
import { ClockIcon } from "@phosphor-icons/react"
import React from "react"

export interface VideoLessionCardProps {
    /** The video lesson. */
    lessonVideo: LessonVideoEntity
}

export const VideoLessionCard = ({ lessonVideo }: VideoLessionCardProps) => {
    return (
        <StarCiCard 
            isPressable={true} 
            onPress={
                () => {
                    window.open(lessonVideo.url, "_blank")
                }
            }
        >
            <StarCiCardBody>
                <div className="grid grid-cols-3 gap-4">
                    <StarCiImage src={lessonVideo.thumbnailUrl} alt={lessonVideo.title} className="aspect-video h-full object-cover rounded-md" />
                    <div className="flex flex-col gap-3 col-span-2">
                        <div className="line-clamp-1">{lessonVideo.title}</div>
                        <div className="text-sm text-foreground-500 text-justify italic line-clamp-3">{lessonVideo.description}</div>
                        <StarCiChip startContent={<ClockIcon className="size-5" />} color="primary" size="sm" variant="flat">
                            {dayjs(lessonVideo.durationMs).format("HH:mm")}
                        </StarCiChip>
                    </div>
                </div>
            </StarCiCardBody>
        </StarCiCard>
    )
}