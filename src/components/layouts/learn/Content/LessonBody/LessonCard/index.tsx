"use client"

import React from "react"
import { Card, CardContent, Link } from "@heroui/react"
import type { LessonVideoEntity } from "@/modules/types"

export interface LessonCardProps {
    /** Lesson video row for lesson tab. */
    lessonVideo: LessonVideoEntity
}

/**
 * Render one lesson video card item.
 * @param {LessonCardProps} props Lesson video card props.
 */
export const LessonCard = ({ lessonVideo }: LessonCardProps) => {
    return (
        <Card>
            <CardContent className="p-3">
                <Link href={lessonVideo.url} target="_blank" className="text-sm font-medium text-accent">
                    {lessonVideo.title}
                </Link>
                <div className="text-xs text-muted">{lessonVideo.description}</div>
            </CardContent>
        </Card>
    )
}
