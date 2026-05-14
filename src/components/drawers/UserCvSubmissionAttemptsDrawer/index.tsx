"use client"

import React, {
    useEffect,
    useMemo,
} from "react"
import {
    Drawer,
    Pagination,
    ScrollShadow,
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
import { CVCard } from "./CVCard"

const isPublicUrl = (value: string) => value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:") || value.startsWith("data:")

/** No caller props; the drawer reads singleton overlay + SWR. */
export interface UserCvSubmissionAttemptsDrawerProps {
    /** Reserved for future shell wiring. */
    readonly _reserved?: undefined
}

type AttemptRow = {
    /** Table row key. */
    key: string
    /** Attempt version number from API. */
    attemptNumber: number
    /** Display file label. */
    fileLabel: string
    /** URL to open the CV file. */
    fileUrl: string
    /** Whether `fileUrl` can be opened in a new tab. */
    fileUrlIsPublic: boolean
    /** Formatted submitted time. */
    submittedAtLabel: string
    /** Raw processing status from API. */
    status: string
    /** Truncated feedback preview. */
    feedbackPreview: string
    /** Full feedback markdown for details modal. */
    detailFeedback: string
}

const FEEDBACK_PREVIEW_MAX = 120
const MAX_VISIBLE_PAGES = 10

export const UserCvSubmissionAttemptsDrawer = (
) => {
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

    const rows: Array<AttemptRow> = useMemo(
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

    const currentPage = Math.min(swr.pageNumber + 1, totalPages)

    const pageNumbers = useMemo<Array<number>>(
        () => Array.from({ length: totalPages }, (_, index) => index + 1),
        [
            totalPages,
        ],
    )

    const handleOpenAnalysis = (attemptId: string) => {
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
    }

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
                                    <ScrollShadow
                                        className="min-h-0 flex-1 overflow-x-hidden p-3"
                                        hideScrollBar
                                    >
                                        <div className="flex flex-col gap-2">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <div
                                                    key={index}
                                                    className="h-12 animate-pulse rounded-lg bg-default-100"
                                                />
                                            ))}
                                        </div>
                                    </ScrollShadow>
                                ) : rows.length ? (
                                    <>
                                        <ScrollShadow
                                            className="min-h-0 flex-1 overflow-x-hidden p-3"
                                            hideScrollBar
                                        >
                                            <div className="flex flex-col gap-3">
                                                {rows.map((row) => (
                                                    <CVCard
                                                        key={row.key}
                                                        attemptId={row.key}
                                                        attemptNumber={row.attemptNumber}
                                                        fileLabel={row.fileLabel}
                                                        fileUrl={row.fileUrl}
                                                        fileUrlIsPublic={row.fileUrlIsPublic}
                                                        submittedAtLabel={row.submittedAtLabel}
                                                        status={row.status}
                                                        feedbackPreview={row.feedbackPreview}
                                                        onOpenAnalysis={handleOpenAnalysis}
                                                    />
                                                ))}
                                            </div>
                                        </ScrollShadow>
                                        <div className="shrink-0 border-t bg-content1 px-3 py-3">
                                            <Pagination
                                                aria-label={t("common.pagination.navAria")}
                                                className="w-full justify-center"
                                                size="sm"
                                            >
                                                <Pagination.Content className="flex flex-wrap justify-center gap-1">
                                                    <Pagination.Item>
                                                        <Pagination.Previous
                                                            aria-label={t("common.pagination.previous")}
                                                            isDisabled={currentPage <= 1}
                                                            onPress={() => swr.setPageNumber(currentPage - 2)}
                                                        >
                                                            <Pagination.PreviousIcon />
                                                        </Pagination.Previous>
                                                    </Pagination.Item>
                                                    {pageNumbers.map((pageNumber) => (
                                                        <Pagination.Item key={pageNumber}>
                                                            <Pagination.Link
                                                                isActive={pageNumber === currentPage}
                                                                onPress={() => swr.setPageNumber(pageNumber - 1)}
                                                            >
                                                                {pageNumber}
                                                            </Pagination.Link>
                                                        </Pagination.Item>
                                                    ))}
                                                    <Pagination.Item>
                                                        <Pagination.Next
                                                            aria-label={t("common.pagination.next")}
                                                            isDisabled={currentPage >= totalPages}
                                                            onPress={() => swr.setPageNumber(currentPage)}
                                                        >
                                                            <Pagination.NextIcon />
                                                        </Pagination.Next>
                                                    </Pagination.Item>
                                                </Pagination.Content>
                                            </Pagination>
                                        </div>
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
