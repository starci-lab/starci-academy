"use client"

import React from "react"
import { Button, Link, Table } from "@heroui/react"
import { useTranslations } from "next-intl"

const isPublicUrl = (value: string) => value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:") || value.startsWith("data:")

export interface CvReviewHistoryItem {
    /** Unique id for table row. */
    id: string
    /** Submitted CV filename shown to user. */
    fileName: string
    /** Submitted CV file URL. */
    fileUrl: string
    /** Submitted datetime text. */
    submittedAt: string
    /** Feedback summary text. */
    feedback: string
}

export interface CvReviewHistoryProps {
    /** Rows shown in the review history table. */
    items: Array<CvReviewHistoryItem>
}

/**
 * Render CV review history table with latest rows.
 * @param {CvReviewHistoryProps} props Review history rows.
 */
export const CvReviewHistory = ({ items }: CvReviewHistoryProps) => {
    const t = useTranslations()
    return (
        <div>
            <Table variant="primary">
                <Table.Content aria-label={t("cv.submission.historyTitle")}>
                    <Table.Header>
                        <Table.Column>{t("cv.submission.history.file")}</Table.Column>
                        <Table.Column>{t("cv.submission.history.submittedAt")}</Table.Column>
                        <Table.Column>{t("cv.submission.history.feedback")}</Table.Column>
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
                Xem chi tiết
            </Button>
        </div>
    )
}
