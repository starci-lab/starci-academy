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
    AsyncContent,
    LabeledCard,
    Skeleton,
} from "@/components/blocks"
import {
    useQueryCourseSwr,
} from "@/hooks"
import {
    useAppSelector,
} from "@/redux"
import {
    ModuleAccordionItem,
} from "./ModuleAccordionItem"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link CourseCurriculum}. */
export type CourseCurriculumProps = WithClassNames<undefined>

/**
 * Curriculum section: every module as an accordion row (tier badge, premium lock,
 * lesson/minute meta, free preview bullets) so a prospect can scan exactly what's
 * inside. Self-contained (reads redux + the course SWR flags); hides when empty.
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

    if (!isLoading && !error && modules.length === 0) {
        return null
    }

    return (
        <LabeledCard
            className={className}
            label={t("courseLanding.curriculum")}
            icon={<ListChecksIcon aria-hidden focusable="false" className="size-5" />}
            flushContent
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
                <Accordion variant="surface">
                    {modules.map((module) => (
                        <ModuleAccordionItem key={module.id} module={module} />
                    ))}
                </Accordion>
            </AsyncContent>
        </LabeledCard>
    )
}
