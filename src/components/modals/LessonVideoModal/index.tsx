"use client"
import React from "react"
import {
    StarCiChip,
    StarCiLink,
    StarCiModal,
    StarCiModalBody,
    StarCiModalContent,
    StarCiModalHeader,
} from "../../atomic"
import { useLessonVideoOverlayState } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { ClockIcon, LinkIcon } from "@phosphor-icons/react"
import { dayjs } from "@/modules/dayjs"
import { HostPlatformChip, LessonVideoKindChip, Spacer, VideoRenderer } from "@/components/reuseable"
import { LessonVideoKind, VideoHostPlatform } from "@/modules/types"
/**
 * The modal for the lesson video.
 * @returns The modal for the lesson video.
 */
export const LessonVideoModal = () => {
    const { isOpen, onOpenChange } = useLessonVideoOverlayState()
    const lessonVideo = useAppSelector((state) => state.lessonVideo.entity)
    return (
        <StarCiModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <StarCiModalContent size="full" className="[&_header]:max-w-[640px] [&_header]:mx-auto [&_.modal-body]:max-w-[640px] [&_.modal-body]:mx-auto">
                <StarCiModalHeader
                    title={lessonVideo?.title ?? ""}
                    description={
                        <div className="w-full place-content-center flex">
                            <div className="flex items-center gap-2">
                                <StarCiChip
                                    color="accent"
                                    size="sm"
                                    variant="soft"
                                >
                                    <ClockIcon className="size-4" />{" "}
                                    {dayjs.duration(lessonVideo?.durationMs ?? 0).format("HH:mm")}
                                </StarCiChip>
                                <HostPlatformChip hostPlatform={lessonVideo?.hostPlatform ?? VideoHostPlatform.Youtube} />
                                <LessonVideoKindChip kind={lessonVideo?.kind ?? LessonVideoKind.RawStream} />
                            </div>
                        </div>
                    }
                />
                <StarCiModalBody>
                    <div className="flex flex-col items-center">
                        <VideoRenderer
                            hostPlatform={lessonVideo?.hostPlatform ?? VideoHostPlatform.Youtube}
                            title={lessonVideo?.title}
                            url={lessonVideo?.url ?? ""}
                        />
                        <Spacer y={3} />
                        <StarCiLink
                            href={lessonVideo?.url ?? ""}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm"
                        >
                            <span className="flex items-center gap-1">
                                {lessonVideo?.url ?? ""}
                                <LinkIcon className="size-5" />
                            </span>
                        </StarCiLink>
                    </div>
                    <Spacer y={6} />
                    {lessonVideo?.description?.trim() ? (
                        <div className="text-foreground-500 w-full text-justify text-sm whitespace-pre-wrap">
                            {lessonVideo.description}
                        </div>
                    ) : null}
                    {lessonVideo?.caption?.trim() ? (
                        <div className="text-foreground-500 w-full text-sm italic">
                            {lessonVideo.caption}
                        </div>
                    ) : null}
                </StarCiModalBody>
            </StarCiModalContent>
        </StarCiModal>
    )
}
