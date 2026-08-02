"use client"

import React, { useMemo } from "react"
import { useLessonVideoOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useAppSelector } from "@/redux/hooks"
import {
    _LessonVideoModal,
    type LessonVideo,
} from "./component"
import { toLessonVideoKind, toVideoHostPlatform } from "./map"

/**
 * Full-screen lesson video dialog — the CONNECTED half of `LessonVideoModal`: reads the
 * overlay open-state (`useLessonVideoOverlayState`, zustand) and the active lesson video
 * entity (redux `state.lessonVideo.entity`, kept warm by whichever screen opened it —
 * mirrors `src/components/modals/LessonVideoModal/index.tsx`), converts the two enums
 * across the real/blueprint type boundary (see `./map`), and hands fully-typed data to
 * the presentational {@link _LessonVideoModal}.
 */
export const LessonVideoModal = () => {
    const { isOpen, setOpen } = useLessonVideoOverlayState()
    const lessonVideo = useAppSelector((state) => state.lessonVideo.entity)

    const video = useMemo<LessonVideo | undefined>(() => {
        if (!lessonVideo) {
            return undefined
        }
        return {
            title: lessonVideo.title,
            kind: toLessonVideoKind(lessonVideo.kind),
            durationMs: lessonVideo.durationMs,
            hostPlatform: toVideoHostPlatform(lessonVideo.hostPlatform),
            url: lessonVideo.url,
            description: lessonVideo.description ?? undefined,
            caption: lessonVideo.caption ?? undefined,
        }
    }, [lessonVideo])

    // TODO(i18n): the blueprint's `HOST_PLATFORM_LABEL`/`KIND_MAP` are still hardcoded
    // English strings ported from the storybook source (which itself notes there's no
    // `videoHostPlatform.other` key upstream) — `t("videoHostPlatform.*")` /
    // `t("lessonVideoKind.*.label|tooltip")` already exist in en/vi.json and should
    // replace them once the presentational file takes localized label/tooltip props
    // instead of owning its own English copy. Not done here — out of this pilot's scope
    // (no i18n-json edits) and `_LessonVideoModal`'s prop surface doesn't take them yet.

    return (
        <_LessonVideoModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            video={video}
        />
    )
}
