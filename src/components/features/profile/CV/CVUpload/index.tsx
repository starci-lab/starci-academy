"use client"

import React, {
    useEffect,
    useMemo,
    useState,
} from "react"
import {
    Card,
    CardContent,
    Chip,
    Link,
    Typography,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import { useSearchParams } from "next/navigation"
import { ArrowRightIcon, SealCheckIcon, UploadSimpleIcon } from "@phosphor-icons/react"
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
export interface CVUploadProps extends WithClassNames<undefined> {
    /**
     * Fired once a generation/upload run finishes (`CvGenerationStatus.Done`) —
     * the caller (compose mode of `CvWorkspace`) uses this to strip `?edit=true`
     * and drop back to review, where the fresh score/feedback/preview show up.
     */
    onDone?: () => void
}

/**
 * CV **compose** surface: two hierarchically-ordered cards reusing the same
 * building blocks as before (`CvFileCard` / `CourseTrackPicker` / `GenerateSection` /
 * `UploadSection`) — just regrouped so the business priority reads visually:
 *
 * 1. **"Tạo CV từ thành tích" (PRIMARY)** — generate/revise a CV from the learner's
 *    real StarCi work (capstone/challenges/coding). This is the ONLY path whose
 *    score counts toward the recruiter gate + job-readiness pillar (verified —
 *    see `cv.scoring.service` + `consultant-contact-gate.service`), so it leads,
 *    on top, with a "tính điểm recruiter" badge. Includes the course/track picker
 *    (which CV this ties to) and a course funnel hint for learners with nothing
 *    to draw on yet — never fabricated from a "has achievements" signal that
 *    doesn't exist server-side; it's a standing secondary link.
 * 2. **"Tải CV có sẵn" (SECONDARY, quiet)** — upload an existing file. Scored with
 *    the same rubric, but self-reported/unverified: it never unlocks the
 *    recruiter gate or counts toward job-readiness (source-blind gate — see
 *    `CRITIQUE.md`), so it sits below, quieter, with a "chưa xác minh" badge.
 *
 * Rendered inline as the **edit mode** (`?edit=true`) of `CvWorkspace` — NOT a
 * separate route/page anymore (the old `/profile/cv/edit` route now just
 * redirects here). Once a run finishes, calls `onDone` so the caller can drop
 * `?edit=true` and show the fresh result immediately.
 *
 * Targets a SPECIFIC CV when the caller arrives with `?cvId=<id>` (e.g. "Sửa" on a
 * given entry in the history dial) — falls back to the newest CV otherwise (the
 * "+ Thêm CV mới" / "Chỉnh sửa CV" entry points, which have no CV to target yet).
 *
 * @param props - {@link CVUploadProps}
 */
export const CVUpload = ({ className, onDone }: CVUploadProps) => {
    /** Translations function. */
    const t = useTranslations()
    /** Current locale (dayjs month labels). */
    const locale = useLocale()
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
    /** Full detail (resolved `latexSource`/`uploadedCvUrl`) for the targeted CV row — only
     *  fetched (and only shown) when the caller scoped this page to a specific existing CV. */
    const targetDetailSwr = useQueryCvGenerationSwr(targetCvId ? target?.id : undefined)
    const targetDetail = targetDetailSwr.data
    /** Active CV generation id + its polled status (to fire `onDone` once a run finishes). */
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
     * Once a generation finishes, refresh the CV history and let the caller
     * (`CvWorkspace`) drop `?edit=true` — it came here to act, not to linger;
     * the fresh score/feedback/preview is what it actually wants to see next.
     */
    useEffect(
        () => {
            if (activeCvGenerationStatus !== CvGenerationStatus.Done) {
                return
            }
            void myCvGenerationsSwr.mutate()
            setActiveCvGenerationId(null)
            onDone?.()
        }, [
            activeCvGenerationStatus,
            myCvGenerationsSwr,
            setActiveCvGenerationId,
            onDone,
        ]
    )

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* "CV hiện tại" — only when the caller scoped this page to ONE specific
                existing CV (`?cvId=`), e.g. via the history dial's "Sửa" action. */}
            {targetCvId && target ? (
                <CvFileCard
                    currentCvLink={currentCvLink}
                    currentCvLinkLabel={currentCvLinkLabel}
                    submittedAtLabel={submittedAtLabel}
                />
            ) : null}

            {/* Card 1 — PRIMARY: generate from real StarCi achievements. The ONLY path
                whose score counts toward the recruiter gate + job-readiness pillar. */}
            <Card className="border border-success/30">
                <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Typography type="h4">{t("cv.generate.title")}</Typography>
                        <Chip size="sm" className="bg-success/10 text-success">
                            <SealCheckIcon aria-hidden focusable="false" className="size-3" />
                            <Chip.Label>{t("cv.scorecard.sourceGenerated")}</Chip.Label>
                        </Chip>
                    </div>
                    <Typography type="body-sm" color="muted">
                        {t("cv.generate.description")}
                    </Typography>

                    <CourseTrackPicker
                        value={courseId}
                        onChange={setCourseId}
                    />

                    <GenerateSection
                        sourceCvGenerationId={target?.id}
                        courseId={courseId}
                    />

                    {/* Course funnel hint — always visible (no cheap "has achievements"
                        signal exists server-side to gate this on, so it stays a standing
                        secondary link rather than a fabricated conditional). */}
                    <Link
                        href={pathConfig().locale(locale).course().build()}
                        className="group inline-flex w-fit items-center gap-2 text-sm text-accent"
                    >
                        {t("cv.generate.noAchievementsHint")}
                        <ArrowRightIcon aria-hidden focusable="false" className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </CardContent>
            </Card>

            {/* Card 2 — SECONDARY, quiet: upload an existing file. Scored, but
                self-reported/unverified — never counts toward the recruiter gate or
                job-readiness (source-blind gate, see `CRITIQUE.md`). */}
            <Card className="border border-warning/20 shadow-none">
                <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Typography type="h4">{t("cv.upload.title")}</Typography>
                        <Chip size="sm" className="bg-warning/10 text-warning">
                            <UploadSimpleIcon aria-hidden focusable="false" className="size-3" />
                            <Chip.Label>{t("cv.scorecard.sourceUploaded")}</Chip.Label>
                        </Chip>
                    </div>
                    <Typography type="body-sm" color="muted">
                        {t("cv.upload.unverifiedHint")}
                    </Typography>

                    <UploadSection courseId={courseId} />
                </CardContent>
            </Card>
        </div>
    )
}
