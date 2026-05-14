"use client"

import React from "react"
import { Button, Link, Table } from "@heroui/react"
import { useTranslations } from "next-intl"

const isPublicUrl = (value: string) => value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:") || value.startsWith("data:")

/** One row in the CV submission attempts table. */
export interface UserCvSubmissionAttemptRow {
    /** Stable row id (e.g. attempt id). */
    id: string
    /** CV filename shown in the file column. */
    fileName: string
    /** Link or path used to open/download the CV. */
    fileUrl: string
    /** Submitted time as formatted text. */
    submittedAt: string
    /** Short feedback or status text for this attempt. */
    feedback: string
}

export interface UserCvSubmissionAttemptsProps {
    /** Attempt rows to render. */
    items: Array<UserCvSubmissionAttemptRow>
}

/**
 * Renders a table of the learner's CV submission attempts (file, time, feedback).
 * @param props.items Rows supplied by the parent after mapping API data.
 */
export const UserCvSubmissionAttempts = (props: UserCvSubmissionAttemptsProps) => {
    const { items } = props
    const t = useTranslations()
    return (
        <div>
            <Table variant="primary">
                <Table.Content aria-label={t("cv.submission.attemptsTitle")}>
                    <Table.Header>
                        <Table.Column>{t("cv.submission.attempts.file")}</Table.Column>
                        <Table.Column>{t("cv.submission.attempts.submittedAt")}</Table.Column>
                        <Table.Column>{t("cv.submission.attempts.feedback")}</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {items.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>
                                    {isPublicUrl(item.fileUrl) ? (
                                        <Link className="text-sm font-medium text-accent underline" href={item.fileUrl} target="_blank">{item.fileName}</Link>
                                    ) : (
                                        <span className="text-sm font-medium text-foreground-500">{item.fileName}</span>
                                    )}
                                </Table.Cell>
                                <Table.Cell>{item.submittedAt}</Table.Cell>
                                <Table.Cell>{item.feedback}</Table.Cell>
                            </Table.Row>
                        ))}
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
