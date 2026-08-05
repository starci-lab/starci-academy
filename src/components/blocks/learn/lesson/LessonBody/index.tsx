"use client"

import React from "react"
import { LessonCard } from "./LessonCard"
import { LessonCardSkeleton } from "./LessonCardSkeleton"
import { Empty } from "./Empty"
import { useAppSelector } from "@/redux/hooks"
import { StackV } from "@/components/frames/Stack"
import { useQueryLessonVideosSwr } from "@/hooks/swr/api/graphql/queries/useQueryLessonVideosSwr"
import { SearchBar } from "@/components/blocks/form/SearchBar"

/**
 * Content tab body listing the lesson's videos, with search.
 *
 * First load, nothing in hand → the card list shimmers in place, co-located in the
 * SAME tree position the real cards occupy (`loading-and-skeleton.md`) rather than
 * through a separate skeleton branch.
 */
export const LessonBody = () => {
    const queryLessonVideosSwr = useQueryLessonVideosSwr()
    const lessonVideos = useAppSelector((state) => state.lessonVideo.entities)

    // `undefined` = redux has not hydrated the list yet → still loading; `[]` = the query
    // settled with nothing → the empty state. Only the first case shimmers.
    const isSkeleton = queryLessonVideosSwr.isLoading || !lessonVideos
    if (isSkeleton) {
        return <LessonCardSkeleton />
    }
    if (!lessonVideos.length) {
        return <Empty />
    }

    return (
        <StackV
            identity={{ tier: "block", component: "LessonBody" }}
            gap={6}
            items={[
                () => <SearchBar />,
                () => (
                    <StackV gap={4} items={lessonVideos.map((lessonVideo) => () => (
                        <LessonCard key={lessonVideo.id} lessonVideo={lessonVideo} />
                    ))} />
                ),
            ]}
        />
    )
}
