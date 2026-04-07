import { StarCiCard, StarCiCardBody, StarCiChip, StarCiImage } from "@/components/atomic"
import { HostPlatformChip, LessonVideoKindChip } from "@/components/reuseable"
import { useLessonVideoDisclosure } from "@/hooks/singleton"
import { dayjs } from "@/modules/dayjs"
import { LessonVideoEntity, LessonVideoKind, VideoHostPlatform } from "@/modules/types"
import { useAppDispatch } from "@/redux"
import { setLessonVideo, setLessonVideoId } from "@/redux/slices"
import { ClockIcon } from "@phosphor-icons/react"
import React from "react"

/**
 * The props for the VideoLessionCard component.
 * @param lessonVideo - The lesson video.
 */
export interface VideoLessionCardProps {
    /** The video lesson. */
    lessonVideo: LessonVideoEntity
}

/**
 * The card for the lesson video.
 * @param lessonVideo - The lesson video.
 * @returns The card for the lesson video.
 */
export const VideoLessionCard = ({ lessonVideo }: VideoLessionCardProps) => {
    const { onOpen } = useLessonVideoDisclosure()
    const dispatch = useAppDispatch()
    return (
        <StarCiCard
            isPressable={true}
            onPress={() => {
                dispatch(setLessonVideoId(lessonVideo.id))
                dispatch(setLessonVideo(lessonVideo))
                onOpen()
            }}
        >
            <StarCiCardBody>
                <div className="grid grid-cols-3 gap-4">
                    <StarCiImage src={lessonVideo.thumbnailUrl} alt={lessonVideo.title} className="aspect-video h-full object-cover rounded-md" />
                    <div className="flex flex-col gap-3 col-span-2">
                        <div className="line-clamp-1">{lessonVideo.title}</div>
                        <div className="text-sm text-foreground-500 text-justify italic line-clamp-3">{lessonVideo.description}</div>
                        <div className="flex items-center gap-2">
                            <StarCiChip
                                startContent={<ClockIcon className="size-4" />}
                                color="primary"
                                size="sm"
                                variant="flat"
                            >
                                {dayjs.duration(lessonVideo?.durationMs ?? 0).format("HH:mm")}
                            </StarCiChip>
                            <HostPlatformChip hostPlatform={lessonVideo?.hostPlatform ?? VideoHostPlatform.Youtube} />
                            <LessonVideoKindChip kind={lessonVideo?.kind ?? LessonVideoKind.RawStream} />
                        </div>
                    </div>
                </div>
            </StarCiCardBody>
        </StarCiCard>
    )
}