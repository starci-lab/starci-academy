"use client"

import React, { useMemo } from "react"
import { Drawer, Pagination, ScrollShadow } from "@heroui/react"
import { useFeedbackDetailsOverlayState, useSubmissionAttemptsOverlayState } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import {
    setActiveChallengeSubmissionId,
    setSubmissionAttemptId,
    setSubmissionAttemptsPageNumber,
} from "@/redux/slices"
import { useTranslations } from "next-intl"
import { SubmissionAttemptCard } from "./SubmissionAttemptCard"
import { useQuerySubmissionAttemptsSwr } from "@/hooks/singleton"
import { SubmissionAttemptCardSkeleton } from "./SubmissionAttempCardSkeleton"
import { Empty } from "./Empty"

/**
 * Drawer listing submission attempts for the active challenge submission.
 */
export const SubmissionAttemptsDrawer = () => {
    const dispatch = useAppDispatch()
    const t = useTranslations()
    const { isOpen, onOpenChange } = useSubmissionAttemptsOverlayState()
    const { onOpen: onOpenFeedbackDetails } = useFeedbackDetailsOverlayState()
    const submissionAttempts = useAppSelector((state) => state.submissionAttempt.submissionAttempts)
    const count = useAppSelector((state) => state.submissionAttempt.count)
    const pageNumber = useAppSelector((state) => state.submissionAttempt.pageNumber)
    const limit = useAppSelector((state) => state.submissionAttempt.limit)
    const activeChallengeSubmissionId = useAppSelector(
        (state) => state.submissionAttempt.activeChallengeSubmissionId,
    )
    const challengeSubmissions = useAppSelector((state) => state.challenge.challengeSubmissions)
    const challengeSubmission = useMemo(
        () => challengeSubmissions?.find(
            (challengeSubmission) => challengeSubmission.id === activeChallengeSubmissionId,
        ),
        [challengeSubmissions, activeChallengeSubmissionId],
    )
    const pageSize = limit ?? 10
    const totalPages = useMemo(() => {
        if (count == null || count <= 0) {
            return 0
        }
        return Math.max(1, Math.ceil(count / pageSize))
    }, [count, pageSize])
    const pageNumbers = useMemo(
        () => Array.from({ length: totalPages }, (_, index) => index + 1),
        [totalPages],
    )
    const currentPage = pageNumber ?? 1
    const swr = useQuerySubmissionAttemptsSwr()
    const showSkeleton =
        isOpen
        && (swr.isLoading || swr.isValidating)
        && submissionAttempts.length === 0
    return (
        <Drawer>
            <Drawer.Backdrop
                isOpen={isOpen}
                onOpenChange={(open) => {
                    onOpenChange(open)
                    if (!open) {
                        dispatch(setActiveChallengeSubmissionId(undefined))
                    }
                }}
            >
                <Drawer.Content placement="right">
                    <Drawer.Dialog className="p-0">
                        <div className="p-3">
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>
                                    {t("submissionAttempts.title")}
                                </Drawer.Heading>
                            </Drawer.Header>
                        </div>
                        <div className="border-b "/>
                        <Drawer.Body>
                            {
                                showSkeleton ? (
                                    <ScrollShadow className="h-full p-3" hideScrollBar>
                                        <div className="flex flex-col gap-3">
                                            {Array.from({ length: 3 }).map((_, index) => (
                                                <SubmissionAttemptCardSkeleton key={index} />
                                            ))}
                                        </div>
                                    </ScrollShadow>
                                ) : 
                                    submissionAttempts.length ? (
                                        <ScrollShadow className="h-full p-3" hideScrollBar>
                                            <div className="flex flex-col gap-3">
                                                {
                                                    submissionAttempts.map(
                                                        (submissionAttempt) => (
                                                            <SubmissionAttemptCard
                                                                key={submissionAttempt.id}
                                                                maxScore={challengeSubmission?.score}
                                                                submissionAttempt={submissionAttempt}
                                                                onViewDetails={() => {
                                                                    dispatch(setSubmissionAttemptId(submissionAttempt.id))
                                                                    onOpenFeedbackDetails()
                                                                }}
                                                                onViewSubmission={() => {
                                                                    window.open(submissionAttempt.submissionUrl, "_blank")
                                                                }}
                                                            />
                                                        ),
                                                    )
                                                }
                                            </div>
                                        </ScrollShadow>
                                    ) : (
                                        <Empty />
                                    )
                            }
                        </Drawer.Body>
                        {count ? (
                            <Drawer.Footer className="border-t  h-[52px]">
                                <Pagination
                                    aria-label={t("common.pagination.navAria")}
                                    className="justify-center"
                                    size="sm"
                                >
                                    <Pagination.Content className="flex flex-wrap justify-center gap-1">
                                        <Pagination.Item>
                                            <Pagination.Previous
                                                aria-label={t("common.pagination.previous")}
                                                isDisabled={currentPage <= 1}
                                                onPress={() => dispatch(setSubmissionAttemptsPageNumber(currentPage - 1))}
                                            >
                                                <Pagination.PreviousIcon />
                                            </Pagination.Previous>
                                        </Pagination.Item>
                                        {pageNumbers.map((pageNumber) => (
                                            <Pagination.Item key={pageNumber}>
                                                <Pagination.Link
                                                    isActive={pageNumber === currentPage}
                                                    onPress={() => dispatch(setSubmissionAttemptsPageNumber(pageNumber))}
                                                >
                                                    {pageNumber}
                                                </Pagination.Link>
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Item>
                                            <Pagination.Next
                                                aria-label={t("common.pagination.next")}
                                                isDisabled={currentPage >= totalPages}
                                                onPress={() => dispatch(setSubmissionAttemptsPageNumber(currentPage + 1))}
                                            >
                                                <Pagination.NextIcon />
                                            </Pagination.Next>
                                        </Pagination.Item>
                                    </Pagination.Content>
                                </Pagination>
                            </Drawer.Footer>
                        ) : null}
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}
