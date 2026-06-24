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
            frameless
        >
            <AsyncContent
                isLoading={isLoading && items.length === 0}
                skeleton={(
                    <div className="overflow-hidden rounded-3xl border border-default bg-surface">
                        {[0, 1, 2].map((row) => (
                            <div key={row} className="px-4 py-4">
                                <Skeleton.Typography type="body-sm" />
                            </div>
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
                {/* List Card: list TĨNH (không click/expand) nhưng "da" y chang Accordion surface —
                    surface card frameless + viền, mỗi row px-4 py-4 + separator inset
                    (bg-surface-foreground/6, left-3% w-94%, row cuối ẩn). Ref elements/card.md §3. */}
                <ul className="overflow-hidden rounded-3xl border border-default bg-surface">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="relative px-4 py-4 after:absolute after:bottom-0 after:left-[3%] after:h-px after:w-[94%] after:bg-surface-foreground/6 after:content-[''] last:after:hidden"
                        >
                            <Typography type="body-sm">{item.text}</Typography>
                        </li>
                    ))}
                </ul>
            </AsyncContent>
        </LabeledCard>
    )
}
