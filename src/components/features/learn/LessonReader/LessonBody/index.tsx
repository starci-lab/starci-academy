"use client"

import React from "react"
import { cn } from "@heroui/react"
import { LessonCard } from "./LessonCard"
import { LessonCardSkeleton } from "./LessonCardSkeleton"
import { Empty } from "./Empty"
import { useAppSelector } from "@/redux/hooks"
import { WithClassNames } from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { useQueryLessonVideosSwr } from "@/hooks/swr/api/graphql/queries/useQueryLessonVideosSwr"
import { SearchBar } from "@/components/blocks/form/SearchBar"

/** Props for {@link LessonBody}. */
export type LessonBodyProps = WithClassNames<undefined>

/** Content tab body listing the lesson's videos, with search. */
export const LessonBody = ({ className }: LessonBodyProps) => {
    const queryLessonVideosSwr = useQueryLessonVideosSwr()
    const lessonVideos = useAppSelector((state) => state.lessonVideo.entities)

    // loading gate: skeleton until the query settles AND redux has hydrated the
    // list (undefined = not yet hydrated → skeleton; [] = settled-but-empty → empty state)
    const body = !lessonVideos?.length ? (
        <div className={cn("", className)}>
            <Empty />
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
