"use client"

import React from "react"
import { Drawer, ScrollShadow } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import { MockInterviewScorecard } from "@/components/features/learn/MockInterview/MockInterviewScorecard"
import { mapMockInterviewAttemptToGradeResult } from "@/components/features/learn/MockInterview/mapAttemptToGradeResult"
import type { MockInterviewAttemptItem } from "@/modules/api/graphql/queries/types/my-mock-interview-attempts"

/** Props for {@link MockInterviewAttemptDrawer}. */
export interface MockInterviewAttemptDrawerProps {
    /** Whether the drawer is open. */
    isOpen: boolean
    /** Open/close callback. */
    onOpenChange: (open: boolean) => void
    /** The past attempt to show, or `null` while closed/unselected. */
    attempt: MockInterviewAttemptItem | null
}

/**
 * Read-only detail drawer for ONE past mock-interview attempt, re-opened from
 * {@link import("@/components/features/learn/MockInterview/MockInterviewHistory").MockInterviewHistory}.
 * Renders the same {@link MockInterviewScorecard} the live post-grading screen
 * uses — history and "just finished" share one render (single source of
 * render). Right on desktop, bottom sheet on mobile.
 * @param props - {@link MockInterviewAttemptDrawerProps}
 */
export const MockInterviewAttemptDrawer = ({ isOpen, onOpenChange, attempt }: MockInterviewAttemptDrawerProps) => {
    const t = useTranslations()
    const { isMobile } = useSmViewpoint()

    return (
        <Drawer>
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange} className="backdrop-blur-sm">
                <Drawer.Content placement={isMobile ? "bottom" : "right"}>
                    <Drawer.Dialog className="p-0">
                        <div className="p-3">
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>{t("mockInterview.historyDetailTitle")}</Drawer.Heading>
                            </Drawer.Header>
                        </div>
                        <Drawer.Body>
                            <ScrollShadow hideScrollBar className="h-full p-4">
                                {attempt ? (
                                    <MockInterviewScorecard
                                        grade={mapMockInterviewAttemptToGradeResult(attempt)}
                                        promptTitle={attempt.promptTitle}
                                        createdAt={attempt.createdAt}
                                    />
                                ) : null}
                            </ScrollShadow>
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}
