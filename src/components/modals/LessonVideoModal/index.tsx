"use client"

import { Clock as ClockIcon, Link as LinkIcon } from "@gravity-ui/icons"
import React from "react"
import { Chip, Link } from "@heroui/react"
import { dayjs } from "@/modules/dayjs"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useLessonVideoOverlayState } from "@/hooks/zustand/overlay/hooks"
import { ModalShell } from "@/components/blocks/layout/ModalShell"
import { useAppSelector } from "@/redux/hooks"
import { HostPlatformChip } from "@/components/reuseable/HostPlatformChip"
import { LessonVideoKindChip } from "@/components/reuseable/LessonVideoKindChip"
import { Spacer } from "@/components/reuseable/Spacer"
import { VideoRenderer } from "@/components/reuseable/VideoRenderer"
import { LessonVideoKind } from "@/modules/types/enums/lesson-video-kind"
import { VideoHostPlatform } from "@/modules/types/enums/video-host-platform"

/**
 * Full-screen lesson video dialog with metadata and external link.
 */
export const LessonVideoModal = ({ className }: WithClassNames<undefined>) => {
    const { isOpen, setOpen } = useLessonVideoOverlayState()
    const lessonVideo = useAppSelector((state) => state.lessonVideo.entity)
    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={className}
            containerClassName="modal__container--narrow"
            size="full"
            title={lessonVideo?.title ?? ""}
            titleClassName="text-2xl font-bold"
            bodyClassName="gap-0 p-4"
        >
            <div className="flex w-full place-content-center">
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                    <Chip color="accent" size="sm" variant="soft">
                        <ClockIcon className="size-4" />
                        <Chip.Label>
                            {dayjs.duration(lessonVideo?.durationMs ?? 0).format("HH:mm")}
                        </Chip.Label>
                    </Chip>
                    <HostPlatformChip hostPlatform={lessonVideo?.hostPlatform ?? VideoHostPlatform.Youtube} />
                    <LessonVideoKindChip kind={lessonVideo?.kind ?? LessonVideoKind.RawStream} />
                </div>
            </div>
            <div className="flex flex-col items-center">
                <VideoRenderer
                    hostPlatform={lessonVideo?.hostPlatform ?? VideoHostPlatform.Youtube}
                    videoType={lessonVideo?.videoType}
                    title={lessonVideo?.title}
                    url={lessonVideo?.url ?? ""}
                />
                <Spacer y={3} />
                <Link
                    className="text-sm"
                    href={lessonVideo?.url ?? ""}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <span className="flex items-center gap-1.5">
                        {lessonVideo?.url ?? ""}
                        <LinkIcon className="size-5" />
                    </span>
                </Link>
            </div>
            <Spacer y={6} />
            {lessonVideo?.description?.trim() ? (
                <div className="w-full whitespace-pre-wrap text-justify text-sm text-muted">
                    {lessonVideo.description}
                </div>
            ) : null}
            {lessonVideo?.caption?.trim() ? (
                <div className="w-full text-sm italic text-muted">
                    {lessonVideo.caption}
                </div>
            ) : null}
        </ModalShell>
    )
}
