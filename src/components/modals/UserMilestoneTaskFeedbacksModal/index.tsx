"use client"

import type { UserMilestoneTaskAttemptFeedbackEntity } from "@/modules/types"
import {
    defaultUserMilestoneTaskFeedbacksListSorts,
    GraphQLHeadersKey,
    queryUserMilestoneTaskFeedbacks,
} from "@/modules/api"
import { useUserMilestoneTaskFeedbacksModalOverlayState } from "@/hooks"
import { useAppSelector } from "@/redux"
import { cn, Modal, ScrollShadow } from "@heroui/react"
import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import useSWR from "swr"
import { MilestoneFeedbackCard } from "./MilestoneFeedbackCard"
import { MilestoneFeedbackCardSkeleton } from "./MilestoneFeedbackCardSkeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

const FEEDBACK_PAGE_LIMIT = 100

/**
 * Modal listing detailed feedback rows for the user's latest attempt on the selected milestone task.
 */
export const UserMilestoneTaskFeedbacksModal = ({ className }: WithClassNames<undefined>) => {
    const { isOpen, setOpen } = useUserMilestoneTaskFeedbacksModalOverlayState()
    const t = useTranslations()
    const course = useAppSelector((state) => state.course.entity)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)

    const swr = useSWR(
        authenticated && course?.id && selectedTaskId && isOpen
            ? [
                "QUERY_USER_MILESTONE_TASK_FEEDBACKS_MODAL",
                course.id,
                selectedTaskId,
            ]
            : null,
        async () => {
            if (!course?.id || !selectedTaskId) {
                throw new Error("Course ID or Task ID not found")
            }
            const res = await queryUserMilestoneTaskFeedbacks({
                request: {
                    courseId: course.id,
                    taskId: selectedTaskId,
                    filters: {
                        limit: FEEDBACK_PAGE_LIMIT,
                        pageNumber: 0,
                        sorts: defaultUserMilestoneTaskFeedbacksListSorts,
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course.id,
                },
            })
            const payload = res.data?.userMilestoneTaskFeedbacks?.data
            if (!payload) {
                throw new Error("Milestone task feedbacks not found")
            }
            return payload
        },
    )

    const feedbackRows = useMemo(
        (): Array<UserMilestoneTaskAttemptFeedbackEntity> => swr.data?.data ?? [],
        [swr.data?.data],
    )

    const showSkeleton =
        isOpen
        && swr.isLoading
        && feedbackRows.length === 0
        && !swr.error

    const skeletonPlaceholders = useMemo(
        () => Array.from({ length: 4 }),
        [],
    )

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container size="lg">
                    <Modal.Dialog className={cn(className)}>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="text-2xl font-bold">{t("task.feedbackDetailsModalTitle")}</div>
                        </Modal.Header>
                        <Modal.Body>
                            {swr.error ? (
                                <div className="p-3 text-sm text-danger">
                                    {t("task.feedbackDetailsLoadError")}
                                </div>
                            ) : showSkeleton ? (
                                <ScrollShadow className="max-h-[500px]" hideScrollBar>
                                    <div className="flex flex-col gap-3 p-3">
                                        {skeletonPlaceholders.map((_, index) => (
                                            <MilestoneFeedbackCardSkeleton key={index} />
                                        ))}
                                    </div>
                                </ScrollShadow>
                            ) : feedbackRows.length > 0 ? (
                                <ScrollShadow className="max-h-[500px]" hideScrollBar>
                                    <div className="flex flex-col gap-3 p-3">
                                        {feedbackRows.map((row) => (
                                            <MilestoneFeedbackCard key={row.id} feedback={row} />
                                        ))}
                                    </div>
                                </ScrollShadow>
                            ) : (
                                <div className="p-3 text-sm text-muted">
                                    {t("task.noFeedback")}
                                </div>
                            )}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
