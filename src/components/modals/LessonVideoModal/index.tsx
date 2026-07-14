"use client"

import { ClockIcon, LinkIcon } from "@phosphor-icons/react"
import React from "react"
import { Link } from "@heroui/react"
import { useTranslations } from "next-intl"
import { dayjs } from "@/modules/dayjs"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useLessonVideoOverlayState } from "@/hooks/zustand/overlay/hooks"
import { ModalShell } from "@/components/blocks/layout/ModalShell"
import { useAppSelector } from "@/redux/hooks"
import { LessonVideoKindChip } from "@/components/reuseable/LessonVideoKindChip"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { VideoRenderer } from "@/components/reuseable/VideoRenderer"
import { LessonVideoKind } from "@/modules/types/enums/lesson-video-kind"
import { VideoHostPlatform } from "@/modules/types/enums/video-host-platform"

/** i18n key per host platform — mirrors the label set `HostPlatformChip` uses. */
const HOST_PLATFORM_LABEL_KEY: Record<VideoHostPlatform, string> = {
    [VideoHostPlatform.Youtube]: "videoHostPlatform.youtube",
    [VideoHostPlatform.GoogleDrive]: "videoHostPlatform.googleDrive",
    [VideoHostPlatform.Vimeo]: "videoHostPlatform.vimeo",
    [VideoHostPlatform.CloudflareStream]: "videoHostPlatform.cloudflareStream",
    [VideoHostPlatform.Other]: "videoHostPlatform.other",
}

/**
 * Full-screen lesson video dialog with metadata and external link.
 */
export const LessonVideoModal = ({ className }: WithClassNames<undefined>) => {
    const t = useTranslations()
    const { isOpen, setOpen } = useLessonVideoOverlayState()
    const lessonVideo = useAppSelector((state) => state.lessonVideo.entity)
    const hostPlatform = lessonVideo?.hostPlatform ?? VideoHostPlatform.Youtube
    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={className}
            containerClassName="modal__container--narrow"
            size="full"
            title={lessonVideo?.title ?? ""}
        >
            <div className="flex w-full flex-col gap-6">
                <div className="flex w-full place-content-center">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <LessonVideoKindChip kind={lessonVideo?.kind ?? LessonVideoKind.RawStream} />
                        <span className="flex items-center gap-2 text-sm text-muted">
                            <ClockIcon className="size-4" />
                            {dayjs.duration(lessonVideo?.durationMs ?? 0).format("HH:mm")}
                        </span>
                        <span className="text-sm text-muted">
                            {t(HOST_PLATFORM_LABEL_KEY[hostPlatform])}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <VideoRenderer
                        hostPlatform={hostPlatform}
                        videoType={lessonVideo?.videoType}
                        title={lessonVideo?.title}
                        url={lessonVideo?.url ?? ""}
                    />
                    <Link
                        className="text-sm"
                        href={lessonVideo?.url ?? ""}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <span className="flex items-center gap-2">
                            {lessonVideo?.url ?? ""}
                            <LinkIcon className="size-4" />
                        </span>
                    </Link>
                </div>
                {lessonVideo?.description?.trim() || lessonVideo?.caption?.trim() ? (
                    <div className="flex w-full flex-col gap-3">
                        {lessonVideo?.description?.trim() ? (
                            <MarkdownContent
                                markdown={lessonVideo.description}
                                className="text-sm text-muted"
                            />
                        ) : null}
                        {lessonVideo?.caption?.trim() ? (
                            <MarkdownContent
                                markdown={lessonVideo.caption}
                                className="text-sm italic text-muted"
                            />
                        ) : null}
                    </div>
                ) : null}
            </div>
        </ModalShell>
    )
}
