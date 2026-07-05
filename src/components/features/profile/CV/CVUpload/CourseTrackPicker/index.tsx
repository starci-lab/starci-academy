"use client"

import React, { useMemo } from "react"
import {
    Label,
    ListBox,
    Select,
    Typography,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useQueryMyCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCoursesSwr"
import { fromGlobalId } from "@/modules/utils/globalId"

/** Sentinel Select item id for "no track" (maps to `courseId: undefined`). */
const NONE_KEY = "__none__"

/** Props for {@link CourseTrackPicker}. */
export interface CourseTrackPickerProps extends WithClassNames<undefined> {
    /** `courses.id` (raw, decoded) the CV is tied to; `undefined` when untied. */
    value: string | undefined
    /** Fired with the raw `courses.id`, or `undefined` for "no track". */
    onChange: (courseId: string | undefined) => void
    /** Disable while a generate/upload/revise is in flight. */
    isDisabled?: boolean
}

/**
 * Optional course/track picker for the CV generate/upload forms — sets
 * `courseId` so this CV counts toward that track's JobReadiness CV pillar
 * (untied CVs only feed the global foundation score). Lists the caller's
 * enrolled courses ({@link useQueryMyCoursesSwr}); "no track" stays the default.
 *
 * @param props - {@link CourseTrackPickerProps}
 */
export const CourseTrackPicker = ({
    value,
    onChange,
    isDisabled,
    className,
}: CourseTrackPickerProps) => {
    const t = useTranslations()
    const { data: courses, isLoading } = useQueryMyCoursesSwr()

    // decode each course's opaque global id to the raw `courses.id` the CV
    // mutations expect (never pass a global id into a raw-id mutation field).
    const items = useMemo(
        () => (courses ?? [])
            .map((course) => {
                const decoded = fromGlobalId(course.globalId)?.id
                return decoded ? { id: decoded, title: course.label } : null
            })
            .filter((item): item is { id: string, title: string } => item !== null),
        [courses],
    )

    const selectedKey = value ?? NONE_KEY
    const selectedTitle = items.find((item) => item.id === value)?.title

    return (
        <div className={className}>
            <div className="flex flex-col gap-2">
                <Label htmlFor="cv-course-track-select">
                    {t("cv.courseTrack.label")}
                </Label>
                <Select.Root<{ id: string }, "single">
                    id="cv-course-track-select"
                    aria-label={t("cv.courseTrack.label")}
                    isDisabled={isDisabled || isLoading}
                    selectedKey={selectedKey}
                    onSelectionChange={(key) => {
                        const raw = key ? String(key) : NONE_KEY
                        onChange(raw === NONE_KEY ? undefined : raw)
                    }}
                >
                    <Select.Trigger aria-label={t("cv.courseTrack.label")}>
                        <Select.Value>
                            {() => (
                                selectedTitle ? (
                                    <span>{selectedTitle}</span>
                                ) : (
                                    <Typography type="body-sm" color="muted">
                                        {isLoading
                                            ? t("cv.courseTrack.loading")
                                            : t("cv.courseTrack.noneOption")}
                                    </Typography>
                                )
                            )}
                        </Select.Value>
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox.Root
                            aria-label={t("cv.courseTrack.label")}
                            items={[{ id: NONE_KEY, title: t("cv.courseTrack.noneOption") }, ...items]}
                        >
                            {(item) => (
                                <ListBox.Item
                                    key={item.id}
                                    id={item.id}
                                    textValue={item.title}
                                    aria-label={item.title}
                                >
                                    <span>{item.title}</span>
                                </ListBox.Item>
                            )}
                        </ListBox.Root>
                    </Select.Popover>
                </Select.Root>
            </div>
        </div>
    )
}
