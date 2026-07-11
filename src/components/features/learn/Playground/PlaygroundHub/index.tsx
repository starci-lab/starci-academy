"use client"

import React, { useCallback } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Typography } from "@heroui/react"
import { TerminalWindowIcon } from "@phosphor-icons/react"
import { PlaygroundCard } from "@/components/blocks/cards/PlaygroundCard"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"
import { useQueryPlaygroundsSwr } from "@/hooks/swr/api/graphql/queries/useQueryPlaygroundsSwr"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"

/**
 * Playground hub: a grid of hands-on Docker/K8s exercises for the active
 * course. Selecting a card routes to that exercise's full-bleed session
 * work surface. Modeled on `FoundationsCategoryGrid`'s grid-of-cards shape at
 * a much smaller scope (no search/pagination — the exercise list per course
 * is small).
 */
export const PlaygroundHub = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const { data: playgrounds, isLoading } = useQueryPlaygroundsSwr()

    const onOpen = useCallback(
        (slug: string) => {
            router.push(pathConfig().locale(locale).course(courseDisplayId).learn().playground(slug).build())
        },
        [router, locale, courseDisplayId],
    )

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Typography type="h5" weight="bold">
                    {t("playground.hub.title")}
                </Typography>
                <Typography type="body-sm" color="muted">
                    {t("playground.hub.subtitle")}
                </Typography>
            </div>

            {!isLoading && (playgrounds?.length ?? 0) === 0 ? (
                <EmptyContent
                    icon={<TerminalWindowIcon aria-hidden focusable="false" className="size-8 text-muted" />}
                    title={t("playground.hub.emptyTitle")}
                    description={t("playground.hub.emptyDescription")}
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {(playgrounds ?? []).map((playground) => (
                        <PlaygroundCard
                            key={playground.id}
                            title={playground.title}
                            stepCount={playground.stepCount}
                            onOpen={() => onOpen(playground.slug)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
