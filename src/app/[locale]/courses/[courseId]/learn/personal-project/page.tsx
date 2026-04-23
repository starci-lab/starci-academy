"use client"

import React, { useMemo } from "react"
import { Breadcrumbs, Button, Card, CardContent, Chip, Input, Link, Table, TextField } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import { MarkdownContent } from "@/components/reuseable"
import { ClockIcon, SparkleIcon } from "@phosphor-icons/react"

interface PersonalProjectMilestoneRequirement {
    /** Requirement title shown under each milestone. */
    title: string
    /** Requirement description text. */
    description: string
}

interface PersonalProjectMilestone {
    /** Stable milestone id. */
    id: string
    /** Milestone title. */
    title: string
    /** Milestone due date label. */
    dueAt: string
    /** Milestone requirements list. */
    requirements: Array<PersonalProjectMilestoneRequirement>
}

interface PersonalProjectFeedbackHistoryItem {
    /** Stable row id. */
    id: string
    /** Submitted git url for the row. */
    gitUrl: string
    /** Submitted datetime label. */
    submittedAt: string
    /** Feedback summary for that submission. */
    feedback: string
}

const Page = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const milestones = useMemo<Array<PersonalProjectMilestone>>(() => [
        {
            id: "m1",
            title: t("finalProject.page.milestones.items.scope.title"),
            dueAt: t("finalProject.page.milestones.items.scope.dueAt"),
            requirements: [
                {
                    title: t("finalProject.page.milestones.items.scope.requirements.problem.title"),
                    description: t("finalProject.page.milestones.items.scope.requirements.problem.description"),
                },
                {
                    title: t("finalProject.page.milestones.items.scope.requirements.architecture.title"),
                    description: t("finalProject.page.milestones.items.scope.requirements.architecture.description"),
                },
            ],
        },
        {
            id: "m2",
            title: t("finalProject.page.milestones.items.implementation.title"),
            dueAt: t("finalProject.page.milestones.items.implementation.dueAt"),
            requirements: [
                {
                    title: t("finalProject.page.milestones.items.implementation.requirements.api.title"),
                    description: t("finalProject.page.milestones.items.implementation.requirements.api.description"),
                },
                {
                    title: t("finalProject.page.milestones.items.implementation.requirements.quality.title"),
                    description: t("finalProject.page.milestones.items.implementation.requirements.quality.description"),
                },
            ],
        },
        {
            id: "m3",
            title: t("finalProject.page.milestones.items.release.title"),
            dueAt: t("finalProject.page.milestones.items.release.dueAt"),
            requirements: [
                {
                    title: t("finalProject.page.milestones.items.release.requirements.deploy.title"),
                    description: t("finalProject.page.milestones.items.release.requirements.deploy.description"),
                },
                {
                    title: t("finalProject.page.milestones.items.release.requirements.readme.title"),
                    description: t("finalProject.page.milestones.items.release.requirements.readme.description"),
                },
            ],
        },
    ], [t])
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
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="col-span-3 lg:border-r lg:/60">
                <div className="p-6">
                    <Breadcrumbs>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale().build())}>
                            {t("nav.home")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course().build())}>
                            {t("nav.courses")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course(courseDisplayId).build())}>
                            {course?.title || t("nav.courses")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item>
                            <span>{t("course.finalProjectTitle")}</span>
                        </Breadcrumbs.Item>
                    </Breadcrumbs>

                    <div className="h-12" />

                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-3xl font-bold">{t("course.finalProjectTitle")}</h1>
                            <p className="text-muted mt-2 text-sm">{t("course.finalProjectDescription")}</p>
                        </div>

                        <div>
                            <div className="mb-3 text-base font-medium">{t("finalProject.page.submit.title")}</div>
                            <Card className="w-full">
                                <CardContent className="flex flex-col gap-3">
                                    <TextField className="w-full">
                                        <Input
                                            placeholder={t("finalProject.page.submit.placeholder")}
                                            value="https://github.com/your-account/personal-project"
                                            readOnly
                                        />
                                    </TextField>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1 text-sm text-muted">
                                            <ClockIcon className="size-4" />
                                            {t("finalProject.page.submit.lastSubmission")}
                                        </div>
                                        <Button variant="secondary">{t("finalProject.page.submit.cta")}</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

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
                    </div>
                </div>
            </div>

            <div className="col-span-2 lg:sticky lg:top-16 lg:self-start lg:h-[calc(100vh-64px)]">
                <div className="h-full p-3">
                    <div className="h-full overflow-y-auto rounded-3xl border  bg-surface p-4">
                        <div className="mb-3 text-base font-medium">{t("finalProject.page.milestones.title")}</div>
                        <div className="flex flex-col gap-3">
                            {milestones.map((milestone, milestoneIndex) => (
                                <Card key={milestone.id} className="w-full">
                                    <CardContent className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="text-sm font-semibold">
                                                {milestoneIndex + 1}
                                                {". "}
                                                {milestone.title}
                                            </div>
                                            <Chip variant="secondary" color="accent">
                                                {milestone.dueAt}
                                            </Chip>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {milestone.requirements.map((requirement, requirementIndex) => (
                                                <div key={`${milestone.id}-${requirementIndex}`} className="rounded-2xl border  p-2">
                                                    <div className="text-sm font-medium">{requirement.title}</div>
                                                    <div className="text-xs text-muted">{requirement.description}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
