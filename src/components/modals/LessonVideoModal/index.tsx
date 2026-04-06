"use client"

import React, { useMemo } from "react"
import {
    StarCiChip,
    StarCiModal,
    StarCiModalBody,
    StarCiModalContent,
    StarCiModalHeader,
    StarCiSpinner,
} from "../../atomic"
import { useLessonVideoDisclosure, useQueryLessonVideoSwr } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { ClockIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { Spacer } from "@heroui/react"
import { dayjs } from "@/modules/dayjs"
import { LessonVideoKind } from "@/modules/types"

const parseLessonVideoUrl = (): ParsedEmbed | null => {
    const trimmed = raw.trim()
    if (!trimmed) {
        return null
    }
    try {
        const u = new URL(trimmed)
        const host = u.hostname.replace(/^www\./, "")
        if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
            const v = u.searchParams.get("v")
            if (v) {
                return { kind: "youtube", src: `https://www.youtube.com/embed/${v}` }
            }
            const parts = u.pathname.split("/").filter(Boolean)
            if (parts[0] === "embed" && parts[1]) {
                return { kind: "youtube", src: `https://www.youtube.com/embed/${parts[1]}` }
            }
            if (parts[0] === "shorts" && parts[1]) {
                return { kind: "youtube", src: `https://www.youtube.com/embed/${parts[1]}` }
            }
        }
        if (host === "youtu.be") {
            const id = u.pathname.split("/").filter(Boolean)[0]
            if (id) {
                return { kind: "youtube", src: `https://www.youtube.com/embed/${id}` }
            }
        }
        if (host === "vimeo.com") {
            const parts = u.pathname.split("/").filter(Boolean)
            const id = parts.find((p) => /^\d+$/.test(p))
            if (id) {
                return { kind: "vimeo", src: `https://player.vimeo.com/video/${id}` }
            }
        }
        if (host === "player.vimeo.com") {
            return { kind: "vimeo", src: trimmed }
        }
        const path = u.pathname.toLowerCase()
        if (/\.(mp4|webm|ogg)(\?|$)/i.test(path)) {
            return { kind: "direct", src: trimmed }
        }
    } catch {
        return { kind: "iframe", src: trimmed }
    }
    return { kind: "iframe", src: trimmed }
}

const LessonVideoPlayer = ({ url }: { url: string }) => {
    const parsed = useMemo(() => parseLessonVideoUrl(url), [url])
    if (!parsed) {
        return null
    }
    if (parsed.kind === "direct") {
        return (
            <video
                className="aspect-video w-full max-h-[min(80vh,calc(100dvh-10rem))] rounded-medium bg-black object-contain"
                controls
                playsInline
                src={parsed.src}
            />
        )
    }
    return (
        <iframe
            title="Lesson video"
            className="aspect-video w-full max-h-[min(80vh,calc(100dvh-10rem))] rounded-medium border-0 bg-black"
            src={parsed.src}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
        />
    )
}

export const LessonVideoModal = () => {
    const { isOpen, onOpenChange } = useLessonVideoDisclosure()
    const lessonVideo = useAppSelector((state) => state.lessonVideo.entity)
    const lessonVideoId = useAppSelector((state) => state.lessonVideo.id)
    const { isLoading, error } = useQueryLessonVideoSwr()
    const t = useTranslations()

    const inSync =
        !lessonVideoId ||
        (lessonVideo?.id === lessonVideoId && Boolean(lessonVideo?.url))
    const showLoader = Boolean(lessonVideoId && !inSync && isLoading)
    const showFetchError = Boolean(lessonVideoId && !inSync && !isLoading && error)

    return (
        <StarCiModal
            isOpen={isOpen}
            size="full"
            scrollBehavior="inside"
            onOpenChange={onOpenChange}
            classNames={{
                base: "m-0 max-h-[100dvh] h-[100dvh]",
                header: "shrink-0 border-b border-divider",
                body: "flex-1 min-h-0 overflow-y-auto p-0",
            }}
        >
            <StarCiModalContent>
                <StarCiModalHeader
                    title={lessonVideo?.title ?? ""}
                    description={
                        lessonVideo?.durationMs != null ? (
                            <div className="flex flex-wrap justify-center gap-2">
                                <StarCiChip
                                    startContent={<ClockIcon className="size-4" />}
                                    color="primary"
                                    size="sm"
                                    variant="flat"
                                >
                                    {dayjs(lessonVideo.durationMs).format("HH:mm")}
                                </StarCiChip>
                            </div>
                        ) : undefined
                    }
                />
                <StarCiModalBody className="flex flex-col gap-0 p-0">
                    {showLoader ? (
                        <div className="flex min-h-[40vh] flex-1 items-center justify-center">
                            <StarCiSpinner size="lg" />
                        </div>
                    ) : showFetchError ? (
                        <div className="text-danger p-6 text-center text-sm">
                            {String(error?.message ?? error)}
                        </div>
                    ) : lessonVideo?.url ? (
                        <>
                            <div className="flex w-full flex-1 flex-col items-center justify-center bg-black px-4 py-6">
                                <div className="w-full max-w-[min(100%,120rem)]">
                                    <LessonVideoPlayer url={lessonVideo.url} />
                                </div>
                            </div>
                            {lessonVideo.description?.trim() ? (
                                <>
                                    <div className="bg-content1 max-w-[768px] px-4 py-6 mx-auto w-full">
                                        <div className="text-sm text-foreground-600 text-justify whitespace-pre-wrap">
                                            {lessonVideo.description}
                                        </div>
                                    </div>
                                    <Spacer y={6} />
                                </>
                            ) : null}
                        </>
                    ) : (
                        <div className="text-foreground-500 p-6 text-center text-sm">
                            {t("lesson.videoUnavailable")}
                        </div>
                    )}
                </StarCiModalBody>
            </StarCiModalContent>
        </StarCiModal>
    )
}
