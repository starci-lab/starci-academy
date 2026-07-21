"use client"

import React, {
    useMemo,
} from "react"
import {
    useTranslations,
} from "next-intl"
import _ from "lodash"
import {
    QuestionIcon,
} from "@phosphor-icons/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { LabeledAccordionCard } from "@/components/blocks/cards/LabeledAccordionCard"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { useQueryCourseSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseSwr"
import { useAppSelector } from "@/redux/hooks"

/** Props for {@link CourseFaq}. */
export type CourseFaqProps = WithClassNames<undefined>

/**
 * FAQ section: the course Q&A pairs as an accordion (markdown answers). Removes a
 * common objection before the buy decision. Self-contained (reads redux + the
 * course SWR flags); shows a standard empty-state when the course has no Q&A yet
 * (this is a labeled section the user opens, not a self-hiding secondary widget).
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

    const hasQnas = !isLoading && !error && qnas.length > 0

    // Q&As present → the accordion card IS the frame + owns its own label.
    if (hasQnas) {
        return (
            <LabeledAccordionCard
                className={className}
                label={t("courseLanding.faq")}
                items={qnas.map((qna) => ({
                    id: qna.id,
                    title: qna.question,
                    body: <MarkdownContent markdown={qna.answer} />,
                }))}
            />
        )
    }

    // loading / error / empty → LabeledCard's own Card frames the skeleton/state,
    // otherwise it would render bare on the page background.
    return (
        <LabeledCard className={className} label={t("courseLanding.faq")}>
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
                <EmptyState
                    icon={<QuestionIcon aria-hidden focusable="false" />}
                    title={t("courseLanding.empty.faq.title")}
                    description={t("courseLanding.empty.faq.hint")}
                />
            </AsyncContent>
        </LabeledCard>
    )
}
