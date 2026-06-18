"use client"

import React, {
    useMemo,
} from "react"
import {
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    CircleCheck as AlmostDoneIcon,
} from "@gravity-ui/icons"
import {
    useQueryMyCoursesSwr,
} from "@/hooks"
import {
    EntityToken,
} from "../EntityToken"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Only surface a course once it is at least this fraction through its lessons. */
const NEAR_THRESHOLD = 0.5

/** Props for {@link NearCompletion}. */
export type NearCompletionProps = WithClassNames<undefined>

/**
 * Centre-column "almost there" nudge: the enrolled course the viewer is CLOSEST to
 * finishing (by lessons read), shown only once it is past {@link NEAR_THRESHOLD} so
 * the prompt always feels within reach ("just N lessons left"). A near-finish line
 * is one of the strongest completion motivators. Self-fetches its own leaf query;
 * renders nothing when no course is close enough.
 * @param props - optional className for the root element.
 */
export const NearCompletion = ({
    className,
}: NearCompletionProps) => {
    const t = useTranslations()
    const { data } = useQueryMyCoursesSwr()

    /** The most-complete unfinished course past the threshold, with lessons left. */
    const target = useMemo(
        () => {
            const rows = data ?? []
            const candidates = rows
                .filter((course) => course.contentTotal > 0
                    && course.contentCompleted < course.contentTotal
                    && course.contentCompleted / course.contentTotal >= NEAR_THRESHOLD)
                .map((course) => ({
                    globalId: course.globalId,
                    label: course.label,
                    remaining: course.contentTotal - course.contentCompleted,
                    ratio: course.contentCompleted / course.contentTotal,
                }))
            // closest to done first (highest ratio)
            candidates.sort((a, b) => b.ratio - a.ratio)
            return candidates[0] ?? null
        },
        [
            data,
        ],
    )

    // nothing close enough to nudge → render nothing
    if (!target) {
        return null
    }

    return (
        <div className={cn(
            "flex flex-wrap items-center gap-1.5 rounded-large bg-success/10 p-3 text-sm",
            className,
        )}
        >
            <AlmostDoneIcon className="size-5 shrink-0 text-success" />
            <span className="text-foreground">
                {t("dashboard.nearCompletion.text", {
                    count: target.remaining,
                })}
            </span>
            <EntityToken
                globalId={target.globalId}
                label={target.label}
            />
        </div>
    )
}
