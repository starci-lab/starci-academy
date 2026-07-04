"use client"

import React, {
    useEffect,
    useMemo,
} from "react"
import { cn } from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import { dayjs } from "@/modules/dayjs"
import {
    CvFileCard,
} from "./CvFileCard"
import {
    GenerateSection,
} from "./GenerateSection"
import {
    UploadSection,
} from "./UploadSection"

import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { useCvUpdateOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryCvUrlSwr } from "@/hooks/swr/api/graphql/queries/useQueryCvUrlSwr"
import { useCvApplyStore } from "@/hooks/zustand/cvApply/store"
import { CvGenerationStatus } from "@/modules/types/enums/cv-generation-status"
import { useCvGenerationStore } from "@/hooks/zustand/cvGeneration/store"
import { useQueryCvGenerationSwr } from "@/hooks/swr/api/graphql/queries/useQueryCvGenerationSwr"
import { getFileNameFromUrl } from "@/utils/filename"

/** Props for {@link CVUpload}. */
export type CVUploadProps = WithClassNames<undefined>
/**
 * CV block: stored file card (upload/replace) plus the AI CV **generation** flow
 * (generate from StarCi activity / revise an uploaded CV) rendered as a read-only LaTeX
 * preview. Owns SWR/redux/store/derived state; renders presentational children.
 *
 * @param props - {@link CVUploadProps}
 */
export const CVUpload = ({ className }: CVUploadProps) => {
    /** Translations function. */
    const t = useTranslations()
    /** Current locale (dayjs month labels). */
    const locale = useLocale()
    /** Selected CV file — shared via zustand store (set by CvUpdateModal). */
    const cvFile = useCvApplyStore((state) => state.cvFile)
    /** Opens the CV update upload modal (also reused as the "revise" file picker). */
    const { open: openCvUpdateModal } = useCvUpdateOverlayState()
    /** Selected file URL. */
    const selectedFileUrl = useMemo(() => {
        if (!cvFile) return ""
        return URL.createObjectURL(cvFile)
    }, [
        cvFile,
    ])
    /** CV URL SWR. */
    const cvUrlSwr = useQueryCvUrlSwr()
    /** CV URL payload. */
    const cvUrlPayload = useAppSelector((state) => state.cvUrl.entity)
    /** Active CV generation id + its polled status (to refresh the stored CV on completion). */
    const activeCvGenerationId = useCvGenerationStore((state) => state.activeCvGenerationId)
    const generationSwr = useQueryCvGenerationSwr(activeCvGenerationId ?? undefined)
    const activeCvGenerationStatus = generationSwr.data?.status
    /** Current CV link. */
    const currentCvLink = selectedFileUrl || (cvUrlPayload?.cvUrl ?? "")
    /** Current CV link label. */
    const currentCvLinkLabel =
        cvFile?.name ||
        (
            cvUrlPayload?.cvUrl ?
                getFileNameFromUrl(cvUrlPayload.cvUrl)
                : t("cv.submission.defaultCvFileName")
        )
    /** Human-readable submission time: `HH:mm, D MMM YYYY` (e.g. `15:33, 23 Jan 2024`). */
    const submittedAtLabel = useMemo(() => {
        const raw = cvUrlPayload?.submittedAt
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
        cvUrlPayload?.submittedAt,
        locale,
        t,
    ])
    /** Refresh the stored CV metadata once a generation finishes. */
    useEffect(
        () => {
            if (activeCvGenerationStatus !== CvGenerationStatus.Done) {
                return
            }
            void cvUrlSwr.mutate()
        }, [
            activeCvGenerationStatus,
            cvUrlSwr,
        ]
    )

    /** Handle selected file URL cleanup. */
    useEffect(
        () => {
            return () => {
                if (selectedFileUrl) URL.revokeObjectURL(selectedFileUrl)
            }
        }, [
            selectedFileUrl,
        ]
    )

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <CvFileCard
                currentCvLink={currentCvLink}
                currentCvLinkLabel={currentCvLinkLabel}
                submittedAtLabel={submittedAtLabel}
                onOpenUpdate={openCvUpdateModal}
            />
            <UploadSection />
            <GenerateSection
                cvSubmissionId={cvUrlPayload?.id}
                onOpenUpload={openCvUpdateModal}
            />
        </div>
    )
}
