"use client"

import React, {
    useMemo,
} from "react"
import {
    Accordion,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import _ from "lodash"
import {
    ListChecksIcon,
} from "@phosphor-icons/react"
import {
    ModuleAccordionItem,
} from "./ModuleAccordionItem"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useQueryCourseSwr } from "@/hooks/swr/api/graphql/queries/useQueryCourseSwr"
import { useAppSelector } from "@/redux/hooks"

/** Props for {@link CourseCurriculum}. */
export type CourseCurriculumProps = WithClassNames<undefined>

/**
 * Curriculum section: every module as an accordion row (tier badge, premium lock,
 * lesson/minute meta, free preview bullets) so a prospect can scan exactly what's
 * inside. Self-contained (reads redux + the course SWR flags); shows a standard
 * empty-state when the course has no modules yet (this is a labeled section the
 * user opens, not a self-hiding secondary widget).
 *
 * @param props - optional className (placement only).
 */
export const CourseCurriculum = ({ className }: CourseCurriculumProps) => {
    const t = useTranslations()
    const { isLoading, error, mutate } = useQueryCourseSwr()
    const rawModules = useAppSelector((state) => state.course.entity?.modules)

    const modules = useMemo(
        () => _.cloneDeep(rawModules ?? []).sort((a, b) => a.sortIndex - b.sortIndex),
        [rawModules],
    )

    // frameless ONLY once the accordion itself self-frames (surface variant); while
    // loading/erroring there is no bounded surface, so LabeledCard's own Card must
    // frame it — otherwise the skeleton/error renders bare on the page background.
    const hasModules = !isLoading && !error && modules.length > 0

    return (
        <LabeledCard
            className={className}
            label={t("courseLanding.curriculum")}
            icon={<ListChecksIcon aria-hidden focusable="false" className="size-5" />}
            frameless={hasModules}
        >
            <AsyncContent
                isLoading={isLoading && modules.length === 0}
                skeleton={<Skeleton.Accordion items={3} />}
                error={error}
                errorContent={{
                    title: t("courseLanding.errorTitle"),
                    onRetry: () => mutate(),
                    retryLabel: t("courseLanding.retry"),
                }}
            >
                {hasModules ? (
                    // Accordion Card: surface accordion đặt thẳng trên nền trang (frameless,
                    // KHÔNG lồng trong Card → tránh surface-in-surface phẳng) + viền card.
                    // Ref elements/card.md §3 + draft accordion-card-surface-on-standalone-pages.
                    <Accordion variant="surface" className="overflow-hidden shadow-surface">
                        {modules.map((module) => (
                            <ModuleAccordionItem key={module.id} module={module} />
                        ))}
                    </Accordion>
                ) : (
                    <EmptyState
                        icon={<ListChecksIcon aria-hidden focusable="false" />}
                        title={t("courseLanding.empty.curriculum.title")}
                        description={t("courseLanding.empty.curriculum.hint")}
                    />
                )}
            </AsyncContent>
        </LabeledCard>
    )
}
