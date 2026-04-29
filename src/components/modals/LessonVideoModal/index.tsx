"use client"

import React from "react"
import { Chip, Link, Modal } from "@heroui/react"
import { useLessonVideoOverlayState } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { ClockIcon, LinkIcon } from "@phosphor-icons/react"
import { dayjs } from "@/modules/dayjs"
import { HostPlatformChip, LessonVideoKindChip, Spacer, VideoRenderer } from "@/components/reuseable"
import { LessonVideoKind, VideoHostPlatform } from "@/modules/types"

/**
 * Full-screen lesson video dialog with metadata and external link.
 */
export const LessonVideoModal = () => {
    const { isOpen, setOpen } = useLessonVideoOverlayState()
    const lessonVideo = useAppSelector((state) => state.lessonVideo.entity)
    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container className="modal__container--narrow" size="full">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="text-2xl font-bold">{lessonVideo?.title ?? ""}</div>
                        </Modal.Header>
                        <Modal.Body className="gap-0 p-4">
                            <div className="flex w-full place-content-center">
                                <div className="flex flex-wrap items-center justify-center gap-2">
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
                                    <span className="flex items-center gap-1">
                                        {lessonVideo?.url ?? ""}
                                        <LinkIcon className="size-5" />
                                    </span>
                                </Link>
                            </div>
                            <Spacer y={6} />
                            {lessonVideo?.description?.trim() ? (
                                <div className="w-full whitespace-pre-wrap text-justify text-sm text-foreground-500">
                                    {lessonVideo.description}
                                </div>
                            ) : null}
                            {lessonVideo?.caption?.trim() ? (
                                <div className="w-full text-sm italic text-foreground-500">
                                    {lessonVideo.caption}
                                </div>
                            ) : null}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
