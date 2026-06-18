"use client"

import React, {
    useMemo,
} from "react"
import {
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import _ from "lodash"
import {
    DotOutlineIcon,
    ListBulletsIcon,
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
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link CoursePrerequisites}. */
export type CoursePrerequisitesProps = WithClassNames<undefined>

/**
 * "Before you start" section: the course prerequisites as a neutral bullet list
 * (informational, NOT a warning alert). Self-contained (reads redux + the course
 * SWR flags); hides entirely when the course lists none.
 *
 * @param props - optional className (placement only).
 */
export const CoursePrerequisites = ({ className }: CoursePrerequisitesProps) => {
    const t = useTranslations()
    const { isLoading, error, mutate } = useQueryCourseSwr()
    const rawItems = useAppSelector((state) => state.course.entity?.prerequisites)

    const items = useMemo(
        () => _.cloneDeep(rawItems ?? []).sort((a, b) => a.sortIndex - b.sortIndex),
        [rawItems],
    )

    if (!isLoading && !error && items.length === 0) {
        return null
    }

    return (
        <LabeledCard
            className={className}
            label={t("courseLanding.prerequisites")}
            icon={<ListBulletsIcon aria-hidden focusable="false" className="size-5" />}
        >
            <AsyncContent
                isLoading={isLoading && items.length === 0}
                skeleton={(
                    <div className="flex flex-col gap-3">
                        {[0, 1, 2].map((row) => (
                            <Skeleton.Typography key={row} type="body-sm" />
                        ))}
                    </div>
                )}
                error={error}
                errorContent={{
                    title: t("courseLanding.errorTitle"),
                    onRetry: () => mutate(),
                    retryLabel: t("courseLanding.retry"),
                }}
            >
                <ul className="flex flex-col gap-2">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-start gap-2">
                            <DotOutlineIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" weight="fill" />
                            <Typography type="body-sm">{item.text}</Typography>
                        </li>
                    ))}
                </ul>
            </AsyncContent>
        </LabeledCard>
    )
}
