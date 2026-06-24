"use client"

import React from "react"
import { useAppSelector } from "@/redux"
import { WithClassNames } from "@/modules/types"
import { cn } from "@heroui/react"
import { AsyncContent } from "@/components/blocks"
import { useQueryLessonVideosSwr } from "@/hooks"
import { LessonCard } from "./LessonCard"
import { LessonCardSkeleton } from "./LessonCardSkeleton"
import { LessonBodyEmpty } from "./Empty"
import { SearchBar } from "@/components/reuseable"

export type LessonBodyProps = WithClassNames<undefined>

export const LessonBody = ({ className }: LessonBodyProps) => {
    const queryLessonVideosSwr = useQueryLessonVideosSwr()
    const lessonVideos = useAppSelector((state) => state.lessonVideo.entities)

    // loading gate: skeleton until the query settles AND redux has hydrated the
    // list (undefined = not yet hydrated → skeleton; [] = settled-but-empty → empty state)
    const body = !lessonVideos?.length ? (
        <div className={cn("", className)}>
            <LessonBodyEmpty />
        </div>
    ) : (
        <div className={cn("flex flex-col gap-6", className)}>
            <SearchBar />
            <div className="flex flex-col gap-3">
                {lessonVideos.map((lessonVideo) => (
                    <LessonCard key={lessonVideo.id} lessonVideo={lessonVideo} />
                ))}
            </div>
        </div>
    )

    return (
        <AsyncContent
            isLoading={queryLessonVideosSwr.isLoading || !lessonVideos}
            skeleton={(
                <div className={cn("", className)}>
                    <LessonCardSkeleton />
                </div>
            )}
        >
            {body}
        </AsyncContent>
    )
}
