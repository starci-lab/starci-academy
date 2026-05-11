"use client"

import React, { useMemo } from "react"
import { Button, Chip, Link, Table } from "@heroui/react"
import { useTranslations } from "next-intl"
import { MarkdownContent } from "@/components/reuseable"
import { SparkleIcon } from "@phosphor-icons/react"

interface PersonalProjectFeedbackHistoryItem {
    id: string
    gitUrl: string
    submittedAt: string
    feedback: string
}

const Page = () => {
    const t = useTranslations()

    const feedbackHistory = useMemo<Array<PersonalProjectFeedbackHistoryItem>>(() => [
        {
            id: "1",
            gitUrl: "https://github.com/starci-academy/personal-project-v1",
            submittedAt: t("finalProject.page.history.items.v1.submittedAt"),
            feedback: t("finalProject.page.history.items.v1.feedback"),
        },
        {
            id: "2",
            gitUrl: "https://github.com/starci-academy/personal-project-v2",
            submittedAt: t("finalProject.page.history.items.v2.submittedAt"),
            feedback: t("finalProject.page.history.items.v2.feedback"),
        },
    ], [t])

    return (
        <>
            <div>
                <div className="mb-3 flex items-center gap-2 text-base font-medium">
                    {t("finalProject.page.feedback.title")}
                    <Chip variant="secondary" color="accent">
                        <SparkleIcon className="size-5" />
                        StarCi AI
                    </Chip>
                </div>
                <div className="rounded-3xl border  p-3">
                    <MarkdownContent markdown={t("finalProject.page.feedback.content")} />
                </div>
            </div>
            <div>
                <div className="mb-3 text-base font-medium">{t("finalProject.page.history.title")}</div>
                <Table variant="primary">
                    <Table.Content aria-label={t("finalProject.page.history.title")}>
                        <Table.Header>
                            <Table.Column>{t("finalProject.page.history.columns.gitUrl")}</Table.Column>
                            <Table.Column>{t("finalProject.page.history.columns.submittedAt")}</Table.Column>
                            <Table.Column>{t("finalProject.page.history.columns.feedback")}</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {feedbackHistory.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell>
                                        <Link href={item.gitUrl} target="_blank" className="text-sm font-medium text-accent underline">
                                            {item.gitUrl}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{item.submittedAt}</Table.Cell>
                                    <Table.Cell>{item.feedback}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table>
                <div className="h-3" />
                <Button variant="secondary">{t("finalProject.page.history.viewDetails")}</Button>
            </div>
        </>
    )
}

export default Page
