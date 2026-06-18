"use client"

import React, {
    useMemo,
} from "react"
import {
    Accordion,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import _ from "lodash"
import {
    QuestionIcon,
} from "@phosphor-icons/react"
import {
    AsyncContent,
    LabeledCard,
    Skeleton,
} from "@/components/blocks"
import {
    MarkdownContent,
} from "@/components/reuseable"
import {
    useQueryCourseSwr,
} from "@/hooks"
import {
    useAppSelector,
} from "@/redux"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link CourseFaq}. */
export type CourseFaqProps = WithClassNames<undefined>

/**
 * FAQ section: the course Q&A pairs as an accordion (markdown answers). Removes a
 * common objection before the buy decision. Self-contained (reads redux + the
 * course SWR flags); hides entirely when the course has no Q&A.
 *
 * @param props - optional className (placement only).
 */
export const CourseFaq = ({ className }: CourseFaqProps) => {
    const t = useTranslations()
    const { isLoading, error, mutate } = useQueryCourseSwr()
    const rawQnas = useAppSelector((state) => state.course.entity?.qnas)

    const qnas = useMemo(
        () => _.cloneDeep(rawQnas ?? []).sort((a, b) => a.sortIndex - b.sortIndex),
        [rawQnas],
    )

    if (!isLoading && !error && qnas.length === 0) {
        return null
    }

    return (
        <LabeledCard
            className={className}
            label={t("courseLanding.faq")}
            icon={<QuestionIcon aria-hidden focusable="false" className="size-5" />}
            flushContent
        >
            <AsyncContent
                isLoading={isLoading && qnas.length === 0}
                skeleton={<Skeleton.Accordion items={3} />}
                error={error}
                errorContent={{
                    title: t("courseLanding.errorTitle"),
                    onRetry: () => mutate(),
                    retryLabel: t("courseLanding.retry"),
                }}
            >
                <Accordion variant="surface">
                    {qnas.map((qna) => (
                        <Accordion.Item key={qna.id} aria-label={qna.question}>
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    <Typography type="body-sm" weight="medium">
                                        {qna.question}
                                    </Typography>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body>
                                    <MarkdownContent markdown={qna.answer} />
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </AsyncContent>
        </LabeledCard>
    )
}
