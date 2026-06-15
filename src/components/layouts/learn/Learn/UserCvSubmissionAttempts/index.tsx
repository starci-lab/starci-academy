"use client"

import React from "react"
import { Button, cn, Link, Skeleton, Table } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useQueryUserCvSubmissionAttemptsSwr } from "@/hooks"
import type { WithClassNames } from "@/modules/types"

/** Props for {@link UserCvSubmissionAttempts}. */
export interface UserCvSubmissionAttemptsProps extends WithClassNames<undefined> {
    /** Reserved — no caller data props; component self-fetches via SWR. */
    readonly _reserved?: undefined
}

/**
 * Renders a table of the learner's CV submission attempts (file, time, feedback).
 *
 * Container: self-fetches via {@link useQueryUserCvSubmissionAttemptsSwr} and
 * derives display rows internally. No data props accepted from the parent.
 */
export const UserCvSubmissionAttempts = ({ className }: UserCvSubmissionAttemptsProps) => {
    const t = useTranslations()
    const swr = useQueryUserCvSubmissionAttemptsSwr()
    const attempts = swr.data?.data ?? []
    const isLoading = swr.isLoading && !swr.data

    if (isLoading) {
        return (
            <div className={cn("flex flex-col gap-3", className)}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full rounded-xl" />
                ))}
            </div>
        )
    }

    return (
        <div className={cn(className)}>
            <Table variant="primary">
                <Table.Content aria-label={t("cv.submission.attemptsTitle")}>
                    <Table.Header>
                        <Table.Column>{t("cv.submission.attempts.file")}</Table.Column>
                        <Table.Column>{t("cv.submission.attempts.submittedAt")}</Table.Column>
                        <Table.Column>{t("cv.submission.attempts.feedback")}</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {attempts.map((attempt) => {
                            const isPublicUrl = attempt.fileUrl.startsWith("http://") ||
                                attempt.fileUrl.startsWith("https://") ||
                                attempt.fileUrl.startsWith("blob:") ||
                                attempt.fileUrl.startsWith("data:")
                            return (
                                <Table.Row key={attempt.attemptId}>
                                    <Table.Cell>
                                        {isPublicUrl ? (
                                            <Link
                                                className="text-sm font-medium text-accent underline"
                                                href={attempt.fileUrl}
                                                target="_blank"
                                            >
                                                {attempt.fileKey}
                                            </Link>
                                        ) : (
                                            <span className="text-sm font-medium text-muted">{attempt.fileKey}</span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>{attempt.submittedAt}</Table.Cell>
                                    <Table.Cell>{attempt.detailFeedback ?? ""}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table.Content>
            </Table>
            <div className="h-3" />
            <Button variant="secondary">
                {t("cv.submission.attempts.viewDetails")}
            </Button>
        </div>
    )
}
