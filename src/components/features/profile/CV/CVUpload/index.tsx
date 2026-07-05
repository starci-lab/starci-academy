"use client"

import React, {
    useEffect,
    useMemo,
    useState,
} from "react"
import { cn } from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { dayjs } from "@/modules/dayjs"
import { pathConfig } from "@/resources/path"
import {
    CvFileCard,
} from "./CvFileCard"
import {
    CourseTrackPicker,
} from "./CourseTrackPicker"
import {
    GenerateSection,
} from "./GenerateSection"
import {
    UploadSection,
} from "./UploadSection"

import type { WithClassNames } from "@/modules/types/base/class-name"
import { CvGenerationStatus } from "@/modules/types/enums/cv-generation-status"
import { CvSource } from "@/modules/api/graphql/queries/types/cv-generation"
import { useCvGenerationStore } from "@/hooks/zustand/cvGeneration/store"
import { useQueryCvGenerationSwr } from "@/hooks/swr/api/graphql/queries/useQueryCvGenerationSwr"
import { useQueryMyCvGenerationsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCvGenerationsSwr"

/** Props for {@link CVUpload}. */
export type CVUploadProps = WithClassNames<undefined>
/**
 * CV block: stored file card (upload/replace) plus the AI CV **generation** flow
 * (generate from StarCi activity / revise an existing CV) rendered as a read-only LaTeX
 * preview. Owns SWR/store/derived state; renders presentational children. Lives on the
 * dedicated `/profile/cv/edit` page — once a run finishes it navigates back to
 * `/profile/cv` so the caller sees the fresh score/feedback/preview immediately.
 *
 * Targets a SPECIFIC CV when the caller arrives with `?cvId=<id>` (e.g. "Sửa" on a
 * given entry in the history dial) — falls back to the newest CV otherwise (the
 * "+ Thêm CV mới" entry point, which has no CV to target yet).
 *
 * @param props - {@link CVUploadProps}
 */
export const CVUpload = ({ className }: CVUploadProps) => {
    /** Translations function. */
    const t = useTranslations()
    /** Current locale (dayjs month labels). */
    const locale = useLocale()
    const router = useRouter()
    const searchParams = useSearchParams()
    /** `cv_generations.id` to target (from `?cvId=`), when the caller scoped this page to one. */
    const targetCvId = searchParams.get("cvId") ?? undefined
    /** Course/track the NEXT upload/generate/revise ties this CV to — shared by both
        actions so the picker appears once, not once per action. */
    const [courseId, setCourseId] = useState<string | undefined>(undefined)
    /** The caller's CV generation history (newest first). */
    const myCvGenerationsSwr = useQueryMyCvGenerationsSwr()
    /** The targeted CV — `?cvId=` if it resolves, else the newest one. */
    const target = myCvGenerationsSwr.data?.find((cv) => cv.id === targetCvId)
        ?? myCvGenerationsSwr.data?.[0]
    /** Full detail (resolved `latexSource`/`uploadedCvUrl`) for the targeted CV row. */
    const targetDetailSwr = useQueryCvGenerationSwr(target?.id)
    const targetDetail = targetDetailSwr.data
    /** Active CV generation id + its polled status (to navigate back to the review page once a run finishes). */
    const activeCvGenerationId = useCvGenerationStore((state) => state.activeCvGenerationId)
    const setActiveCvGenerationId = useCvGenerationStore((state) => state.setActiveCvGenerationId)
    const generationSwr = useQueryCvGenerationSwr(activeCvGenerationId ?? undefined)
    const activeCvGenerationStatus = generationSwr.data?.status
    /** Current CV link — only uploaded CVs have a raw downloadable file. */
    const currentCvLink = target?.source === CvSource.Uploaded
        ? (targetDetail?.uploadedCvUrl ?? "")
        : ""
    /** Current CV link label. */
    const currentCvLinkLabel = target?.label || t("cv.submission.defaultCvFileName")
    /** Human-readable submission time: `HH:mm, D MMM YYYY` (e.g. `15:33, 23 Jan 2024`). */
    const submittedAtLabel = useMemo(() => {
        const raw = target?.processedAt ?? target?.createdAt
        if (!raw) {
            return t("cv.submission.submittedAtPending")
        }
        const d = dayjs(raw)
        if (!d.isValid()) {
            return t("cv.submission.submittedAtPending")
        }
        const dayjsLocale = locale.startsWith("vi") ? "vi" : "en"
        return d.locale(dayjsLocale).format("HH:mm, D MMMM YYYY")
    }, [
        target?.processedAt,
        target?.createdAt,
        locale,
        t,
    ])
    /**
     * Once a generation finishes, refresh the CV history and jump back to the review
     * page (`/profile/cv`) — the caller came here to act, not to linger; the fresh
     * score/feedback/preview is what they actually want to see next.
     */
    useEffect(
        () => {
            if (activeCvGenerationStatus !== CvGenerationStatus.Done) {
                return
            }
            void myCvGenerationsSwr.mutate()
            setActiveCvGenerationId(null)
            router.push(pathConfig().locale(locale).profile().cv().build())
        }, [
            activeCvGenerationStatus,
            myCvGenerationsSwr,
            setActiveCvGenerationId,
            router,
            locale,
        ]
    )

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <CvFileCard
                currentCvLink={currentCvLink}
                currentCvLinkLabel={currentCvLinkLabel}
                submittedAtLabel={submittedAtLabel}
            />
            <CourseTrackPicker
                value={courseId}
                onChange={setCourseId}
            />
            <UploadSection courseId={courseId} />
            <GenerateSection
                sourceCvGenerationId={target?.id}
                courseId={courseId}
            />
        </div>
    )
}
