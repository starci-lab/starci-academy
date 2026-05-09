"use client"

import React, { useMemo } from "react"
import { Breadcrumbs, Button, Chip, FieldError, Input, Link, Table, TextArea, TextField } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources"
import { useAppSelector } from "@/redux"
import { MarkdownContent } from "@/components/reuseable"
import { SparkleIcon } from "@phosphor-icons/react"
import { usePersonalProjectIdeaFormik, usePersonalProjectGithubUrlFormik } from "@/hooks/singleton"
import { Milestones } from "../Milestones"

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

export const PersonalProject = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const ideaFormik = usePersonalProjectIdeaFormik()
    const githubUrlFormik = usePersonalProjectGithubUrlFormik()
    const isIdeaSubmitted = Boolean(ideaFormik.status?.submitted)
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
                            <div className="text-3xl font-bold">{t("course.finalProjectTitle")}</div>
                            <div className="text-muted mt-2 text-sm">{t("course.finalProjectDescription")}</div>
                        </div>
                        <div>
                            <div className="mb-3 text-base font-medium">{t("finalProject.page.submit.title")}</div>
                            <TextField isInvalid={!!(ideaFormik.touched.ideaText && ideaFormik.errors.ideaText)}>
                                <TextArea
                                    variant="secondary"
                                    placeholder={t("finalProject.page.submit.ideaPlaceholder")}
                                    name="ideaText"
                                    value={ideaFormik.values.ideaText}
                                    disabled={isIdeaSubmitted}
                                    onChange={(event) => ideaFormik.setFieldValue("ideaText", event.target.value)}
                                    onBlur={() => ideaFormik.setFieldTouched("ideaText", true)}
                                />
                                <FieldError>{ideaFormik.errors.ideaText || ideaFormik.status?.error}</FieldError>
                            </TextField>
                            <div className="flex items-center gap-2 mt-3">
                                <Button
                                    isPending={ideaFormik.isSubmitting}
                                    isDisabled={!ideaFormik.isValid || isIdeaSubmitted}
                                    onPress={() => ideaFormik.submitForm()}
                                >
                                    {t("finalProject.page.submit.cta")}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <div className="mb-3 text-base font-medium">{t("finalProject.page.submitGithub.title")}</div>
                            <TextField isInvalid={!!(githubUrlFormik.touched.githubUrl && githubUrlFormik.errors.githubUrl)}>
                                <Input
                                    variant="secondary"
                                    placeholder={t("finalProject.page.submitGithub.placeholder")}
                                    name="githubUrl"
                                    value={githubUrlFormik.values.githubUrl}
                                    onChange={(event) => githubUrlFormik.setFieldValue("githubUrl", event.target.value)}
                                    onBlur={() => githubUrlFormik.setFieldTouched("githubUrl", true)}
                                />
                                <FieldError>{githubUrlFormik.errors.githubUrl || githubUrlFormik.status?.error}</FieldError>
                            </TextField>
                            <div className="flex items-center gap-2 mt-3">
                                <Button
                                    isPending={githubUrlFormik.isSubmitting}
                                    isDisabled={!githubUrlFormik.isValid}
                                    onPress={() => githubUrlFormik.submitForm()}
                                >
                                    {t("finalProject.page.submitGithub.cta")}
                                </Button>
                            </div>
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
            <Milestones className="col-span-2" />
        </div>
    )
}
