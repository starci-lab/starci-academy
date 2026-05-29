"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
} from "react"
import {
    Drawer,
} from "@heroui/react"
import {
    useCvSubmissionAttemptAnalysisOverlayState,
    useCvSubmissionAttemptsDrawerOverlayState,
    useQueryUserCvSubmissionAttemptsSwr,
} from "@/hooks/singleton"
import {
    useAppDispatch,
} from "@/redux"
import {
    setSelectedCvSubmissionAttemptAnalysis,
} from "@/redux/slices"
import { dayjs } from "@/modules/dayjs"
import { getFileNameFromUrl } from "@/utils"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import type {
    AttemptRow,
} from "./types"
import {
    FEEDBACK_PREVIEW_MAX,
    MAX_VISIBLE_PAGES,
} from "./constants"
import {
    isPublicUrl,
} from "./utils"
import {
    AttemptsSkeleton,
} from "./AttemptsSkeleton"
import {
    AttemptsList,
} from "./AttemptsList"
import {
    AttemptsPagination,
} from "./AttemptsPagination"

/** No caller props; the drawer reads singleton overlay + SWR. */
export interface UserCvSubmissionAttemptsDrawerProps {
    /** Reserved for future shell wiring. */
    readonly _reserved?: undefined
}

/**
 * Drawer listing a user's CV submission attempts with server pagination.
 *
 * Container: owns SWR/redux/overlay state and derives display rows; renders
 * presentational children (skeleton / list / pagination).
 */
export const UserCvSubmissionAttemptsDrawer = () => {
    const t = useTranslations()
    const locale = useLocale()
    const dispatch = useAppDispatch()
    const {
        isOpen,
        setOpen,
    } = useCvSubmissionAttemptsDrawerOverlayState()
    const {
        setOpen: setAnalysisModalOpen,
    } = useCvSubmissionAttemptAnalysisOverlayState()
    const swr = useQueryUserCvSubmissionAttemptsSwr()
    const payload = swr.data
    const attemptList = payload?.data
    const dayjsLocale = locale.startsWith("vi") ? "vi" : "en"

    /** API attempts mapped into display-ready rows. */
    const rows = useMemo<Array<AttemptRow>>(
        () => (attemptList ?? []).map((attempt) => {
            const raw = attempt.submittedAt
            const d = dayjs(raw)
            const submittedAtLabel = d.isValid()
                ? d.locale(dayjsLocale).format("HH:mm, D MMMM YYYY")
                : t("cv.submission.submittedAtPending")
            const detail = attempt.detailFeedback?.trim() ?? ""
            const feedbackPreview = detail.length > FEEDBACK_PREVIEW_MAX
                ? `${detail.slice(0, FEEDBACK_PREVIEW_MAX)}…`
                : detail
            const fileLabel = getFileNameFromUrl(attempt.fileKey) || attempt.fileKey
            return {
                key: attempt.attemptId,
                attemptNumber: attempt.attemptNumber,
                fileLabel,
                fileUrl: attempt.fileUrl,
                fileUrlIsPublic: isPublicUrl(attempt.fileUrl),
                submittedAtLabel,
                status: attempt.status,
                feedbackPreview: feedbackPreview || t("cv.submission.attemptsDrawer.feedbackEmpty"),
                detailFeedback: detail,
            }
        }),
        [
            attemptList,
            dayjsLocale,
            t,
        ],
    )

    /** Number of page buttons to render, capped at {@link MAX_VISIBLE_PAGES}. */
    const totalPages = useMemo(
        () => Math.min(
            Math.max(1, Math.ceil((payload?.totalCount ?? 0) / swr.pageSize)),
            MAX_VISIBLE_PAGES,
        ),
        [
            payload?.totalCount,
            swr.pageSize,
        ],
    )

    /** 1-based current page, clamped to the visible range. */
    const currentPage = Math.min(swr.pageNumber + 1, totalPages)

    /** 1-based page numbers rendered as pagination links. */
    const pageNumbers = useMemo<Array<number>>(
        () => Array.from({ length: totalPages }, (_, index) => index + 1),
        [
            totalPages,
        ],
    )

    /** Open the analysis modal for the chosen attempt. */
    const onOpenAnalysis = useCallback(
        (attemptId: string) => {
            const selectedAttempt = rows.find((row) => row.key === attemptId)
            if (!selectedAttempt) {
                return
            }
            dispatch(setSelectedCvSubmissionAttemptAnalysis({
                attemptId: selectedAttempt.key,
                attemptNumber: selectedAttempt.attemptNumber,
                fileLabel: selectedAttempt.fileLabel,
                fileUrl: selectedAttempt.fileUrl,
                fileUrlIsPublic: selectedAttempt.fileUrlIsPublic,
                submittedAtLabel: selectedAttempt.submittedAtLabel,
                status: selectedAttempt.status,
                detailFeedback: selectedAttempt.detailFeedback,
            }))
            setAnalysisModalOpen(true)
        },
        [
            rows,
            dispatch,
            setAnalysisModalOpen,
        ],
    )

    /** Navigate to a specific 1-based page. */
    const onPageChange = useCallback(
        (pageNumber: number) => swr.setPageNumber(pageNumber - 1),
        [
            swr,
        ],
    )

    /** Navigate to the previous page. */
    const onPreviousPage = useCallback(
        () => swr.setPageNumber(currentPage - 2),
        [
            swr,
            currentPage,
        ],
    )

    /** Navigate to the next page. */
    const onNextPage = useCallback(
        () => swr.setPageNumber(currentPage),
        [
            swr,
            currentPage,
        ],
    )

    useEffect(
        () => {
            if (swr.pageNumber + 1 <= totalPages) {
                return
            }
            swr.setPageNumber(totalPages - 1)
        },
        [
            swr,
            totalPages,
        ],
    )

    /** Whether to show the loading skeleton instead of content. */
    const showSkeleton = isOpen && (swr.isLoading || swr.isValidating) && !(attemptList?.length) && !swr.error

    /** Avoid mounting a closed drawer (backdrop / scroll-lock layers) on every page. */
    if (!isOpen) {
        return null
    }

    return (
        <Drawer>
            <Drawer.Backdrop
                isOpen
                onOpenChange={setOpen}
            >
                <Drawer.Content placement="right">
                    <Drawer.Dialog className="flex h-full flex-col p-0">
                        <div className="shrink-0 p-3">
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>
                                    {t("cv.submission.attemptsDrawer.title")}
                                </Drawer.Heading>
                            </Drawer.Header>
                        </div>
                        <div className="border-b" />
                        <Drawer.Body className="flex min-h-0 flex-1 flex-col">
                            {
                                swr.error ? (
                                    <div className="p-3 text-sm text-danger">
                                        {t("cv.submission.attemptsDrawer.loadError")}
                                    </div>
                                ) : showSkeleton ? (
                                    <AttemptsSkeleton />
                                ) : rows.length ? (
                                    <>
                                        <AttemptsList
                                            rows={rows}
                                            onOpenAnalysis={onOpenAnalysis}
                                        />
                                        <AttemptsPagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            pageNumbers={pageNumbers}
                                            onPageChange={onPageChange}
                                            onPrevious={onPreviousPage}
                                            onNext={onNextPage}
                                        />
                                    </>
                                ) : (
                                    <div className="p-6 text-center text-sm text-muted">
                                        {t("cv.submission.attemptsDrawer.empty")}
                                    </div>
                                )
                            }
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}
