"use client"

import React from "react"
import {
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    CheckIcon,
    SealCheckIcon,
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

/** Props for {@link CourseValueProps}. */
export type CourseValuePropsProps = WithClassNames<undefined>

/**
 * "What you'll get" section: the course value propositions as a checked grid —
 * placed high (right after the hero) so the benefit lands before the price.
 * Self-contained (reads redux + the course SWR flags); hides entirely when the
 * course has no value props.
 *
 * @param props - optional className (placement only).
 */
export const CourseValueProps = ({ className }: CourseValuePropsProps) => {
    const t = useTranslations()
    const { isLoading, error, mutate } = useQueryCourseSwr()
    const items = useAppSelector((state) => state.course.entity?.valuePropositions) ?? []

    // settled + genuinely empty → hide the whole section (no empty card)
    if (!isLoading && !error && items.length === 0) {
        return null
    }

    return (
        <LabeledCard
            className={className}
            label={t("courseLanding.valueProps")}
            icon={<SealCheckIcon aria-hidden focusable="false" className="size-5" />}
        >
            <AsyncContent
                isLoading={isLoading && items.length === 0}
                skeleton={(
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[0, 1, 2, 3].map((row) => (
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
                <ul className="grid gap-3 sm:grid-cols-2">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-start gap-2">
                            <CheckIcon aria-hidden focusable="false" className="size-5 shrink-0 text-success" />
                            <Typography type="body-sm">{item.text}</Typography>
                        </li>
                    ))}
                </ul>
            </AsyncContent>
        </LabeledCard>
    )
}
