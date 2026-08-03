"use client"

import React, { useCallback, useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import {
    _PlaygroundHubPage,
    type PlaygroundExerciseGridItem,
} from "./component"
import { pathConfig } from "@/resources/path"
import { useQueryPlaygroundsSwr } from "@/hooks/swr/api/graphql/queries/useQueryPlaygroundsSwr"

/**
 * `PlaygroundHubPage` — the CONNECTED half of the SRC TWIN. Mirrors the data
 * wiring already proven in `src/components/features/learn/Playground/
 * PlaygroundHub` (v1) onto the storybook-driven block tree in `./component`
 * instead of that v1's hand-built layout — same route
 * (`.../learn/playground`, NOT swapped here), same SWR source
 * (`useQueryPlaygroundsSwr`).
 *
 * Course comes from the URL, NOT the store — playgrounds are shared by every
 * course, so a stale `state.course.displayId` would route the learner out of
 * theirs (same reasoning `PlaygroundHub` v1 already carried).
 */
export const PlaygroundHubPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const params = useParams()
    const courseDisplayId = String(params.courseId ?? "")

    const { data: playgrounds, isLoading } = useQueryPlaygroundsSwr()

    /** First load: nothing cached yet for the current key. */
    const isFirstLoad = isLoading && !playgrounds

    /** The course's exercises, mapped into the block's tile shape. */
    const exercises: Array<PlaygroundExerciseGridItem> = useMemo(
        () => (playgrounds ?? []).map((playground) => ({
            id: playground.id,
            title: playground.title,
            stepCount: playground.stepCount,
        })),
        [playgrounds],
    )

    /** Open the chosen exercise's session — same route `PlaygroundHub` v1 pushes. */
    const onSelectExercise = useCallback(
        (id: string) => {
            const playground = playgrounds?.find((item) => item.id === id)
            if (!playground) {
                return
            }
            router.push(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .learn()
                    .playground(playground.slug)
                    .build(),
            )
        },
        [courseDisplayId, locale, playgrounds, router],
    )

    return (
        <_PlaygroundHubPage
            title={t("playground.hub.title")}
            description={t("playground.hub.subtitle")}
            exercises={exercises}
            onSelectExercise={onSelectExercise}
            exerciseGridAriaLabel={t("playground.hub.title")}
            isSkeleton={isFirstLoad}
        />
    )
}
