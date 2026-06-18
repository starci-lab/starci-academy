"use client"

import React from "react"
import {
    Typography,
    cn,
} from "@heroui/react"
import {
    useAppSelector,
} from "@/redux"
import {
    CourseTrustStats,
} from "../CourseTrustStats"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link CourseHero}. */
export type CourseHeroProps = WithClassNames<undefined>

/**
 * Above-the-fold hero copy: title + the headline value proposition + trust-stats.
 * Intentionally carries NO price / CTA / cover — those live once in the sticky
 * purchase card (right column) so the page never shows two competing buy boxes.
 * Self-contained (reads the course from redux).
 *
 * @param props - optional className (placement only).
 */
export const CourseHero = ({ className }: CourseHeroProps) => {
    const title = useAppSelector((state) => state.course.entity?.title)
    const description = useAppSelector((state) => state.course.entity?.description)
    const lead = useAppSelector((state) => state.course.entity?.valuePropositions?.[0]?.text)

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <div className="flex flex-col gap-3">
                <Typography type="h2" weight="bold">
                    {title}
                </Typography>
                <Typography type="body" color="muted">
                    {lead ?? description}
                </Typography>
            </div>
            <CourseTrustStats />
        </div>
    )
}
