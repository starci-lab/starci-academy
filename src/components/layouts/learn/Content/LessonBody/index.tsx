"use client"

import React from "react"
import { useAppSelector } from "@/redux"
import { WithClassNames } from "@/modules/types"
import { cn } from "@heroui/react"
import { useQueryLessonVideosSwr } from "@/hooks"
import { LessonCard } from "./LessonCard"
import { LessonCardSkeleton } from "./LessonCardSkeleton"
import { LessonBodyEmpty } from "./Empty"
import { SearchBar } from "../../../../reuseable"

export type LessonBodyProps = WithClassNames<undefined>

export const LessonBody = ({ className }: LessonBodyProps) => {
    const queryLessonVideosSwr = useQueryLessonVideosSwr()
    const lessonVideos = useAppSelector((state) => state.lessonVideo.entities)

    // loading gate: skeleton until the query settles AND redux has hydrated the
    // list (undefined = not yet hydrated → skeleton; [] = settled-but-empty → empty state)
    if (queryLessonVideosSwr.isLoading || !lessonVideos) {
        return (
            <div className={cn("", className)}>
                <LessonCardSkeleton />
            </div>
        )
    }

    if (!lessonVideos?.length) {
        return (
            <div className={cn("", className)}>
                <LessonBodyEmpty />
            </div>
        )
    }

    return (
        <div>
            <SearchBar />
            <div className="h-6" />
            <div className={cn("flex flex-col gap-3", className)}>
                {lessonVideos.map((lessonVideo) => (
                    <LessonCard key={lessonVideo.id} lessonVideo={lessonVideo} />
                ))}
            </div>
        </div>
    )
}
