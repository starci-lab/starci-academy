"use client"

import { BookOpen as BookOpenIcon, CurlyBrackets as BracketsCurlyIcon } from "@gravity-ui/icons"
import React, { useCallback, useEffect, useState } from "react"
import { Chip, Skeleton } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import _ from "lodash"
import { useAppSelector } from "@/redux"
import { useQueryContentSuggestionsSwr, useQueryModuleSwr } from "@/hooks"
import { pathConfig } from "@/resources/path"
import { useRouter } from "next/navigation"
import { SearchInput } from "@/components/reuseable"
import { ContentCard } from "./ContentCard"
import { ContentCardSkeleton } from "./ContentCardSkeleton"
import { Empty } from "./Empty"

/** Debounce window (ms) before a typed search hits the suggestions backend. */
const SEARCH_DEBOUNCE_MS = 350

/**
 * Render module overview with preview bullets and content cards.
 *
 * A debounced, ES-backed autocomplete sits above the list: typing a prefix
 * surfaces lesson suggestions and selecting one deep-links to that content.
 * The list itself is unchanged — the `contents` GraphQL query is page/sort only
 * (no server-side search), so this stays autocomplete-only.
 */
export const Module = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const module = useAppSelector((state) => state.module.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const moduleId = useAppSelector((state) => state.module.id)
    const { isLoading: isModuleLoading } = useQueryModuleSwr()
    const isLoading = isModuleLoading || !module
    const contentsFromRedux = useAppSelector((state) => state.content.entities)
    const contents = (contentsFromRedux?.length ?? 0) > 0 ? contentsFromRedux : module?.contents

    /** Immediate input value (drives the field). */
    const [query, setQuery] = useState("")
    /** Debounced query that actually hits the suggestions backend. */
    const [debouncedQuery, setDebouncedQuery] = useState("")

    // debounce the search input before it reaches the suggestions query
    useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedQuery(query)
        }, SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(handle)
    }, [query])

    // ES Completion Suggester (typeahead): clean { id, label } lesson items from
    // the BE, gated on the module being loaded.
    const { data: suggestionItems } = useQueryContentSuggestionsSwr(debouncedQuery, {
        enabled: Boolean(moduleId),
    })
    const suggestions = suggestionItems ?? []

    /** Deep-link to the chosen lesson (suggestion id is the content id). */
    const onSelectSuggestion = useCallback(
        (suggestion: { id: string; label: string }) => {
            router.push(
                pathConfig()
                    .locale(locale)
                    .course(courseDisplayId)
                    .learn()
                    .module(moduleId)
                    .content(suggestion.id)
                    .build(),
            )
        },
        [courseDisplayId, locale, moduleId, router],
    )
    if (isLoading) {
        return (
            <div>
                <div className="h-3" />
                <div className="p-3">
                    <Skeleton className="h-6 my-1 w-3/4 rounded" />
                    <div className="h-2" />
                    <div className="flex flex-col">
                        <Skeleton className="h-[14px] my-[3px] w-full rounded-sm" />
                        <Skeleton className="h-[14px] my-[3px] w-5/6 rounded-sm" />
                    </div>
                    <div className="h-3" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <div className="h-6" />
                    <div className="text-lg font-semibold">{t("module.pathIntroduction")}</div>
                    <div className="h-3" />
                    <div className="text-sm text-start w-full gap-3 flex flex-col text-muted">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-5 rounded-full" />
                                <Skeleton className="h-[14px] my-[3px] w-2/3 rounded-sm" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-5 rounded-full" />
                                <Skeleton className="h-[14px] my-[3px] w-2/3 rounded-sm" />
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-5 rounded-full" />
                                <Skeleton className="h-[14px] my-[3px] w-2/3 rounded-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="h-6" />
                    <div className="text-lg font-semibold">{t("content.tabs.content")}</div>
                    <div className="h-3" />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2"> 
                        {
                            Array.from({ length: 3 }).map((_, index) => (
                                <ContentCardSkeleton key={index} />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div>
            <div className="h-3" />
            <div className="p-3">
                <div className="text-2xl font-bold">{module?.title}</div>
                <div className="h-2" />
                <div className="text-sm text-muted">{module?.description}</div>
                <div className="h-3" />
                <div className="flex items-center gap-2">
                    <Chip variant="secondary" color="accent">
                        <BookOpenIcon className="size-5" />
                        <Chip.Label>
                            {t(
                                "module.numContents", {
                                    count: module?.numContents || 0,
                                })
                            }
                        </Chip.Label>
                    </Chip>
                </div>
                <div className="h-6" />
                <div className="font-semibold text-base">{t("module.pathIntroduction")}</div>
                <div className="h-3" />
                <div className="text-sm text-start w-full gap-3 flex flex-col text-muted">
                    {_.cloneDeep(module?.previewContents ?? [])
                        .sort((previous, current) => previous.orderIndex - current.orderIndex)
                        .map((content) => (
                            <div key={content.id} className="flex items-center gap-3">
                                <BracketsCurlyIcon className="w-5 h-5 min-w-5 min-h-5" />
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: content.text,
                                    }}
                                />
                            </div>
                        ))} 
                </div>
                <div className="h-6" />
                <div className="font-semibold text-base">{t("content.tabs.content")}</div>
                <div className="h-3" />
                {/* debounced, ES-backed autocomplete; selecting a lesson deep-links to it */}
                <SearchInput
                    value={query}
                    onValueChange={setQuery}
                    placeholder={t("module.searchContentsPlaceholder")}
                    suggestions={suggestions}
                    onSelectSuggestion={onSelectSuggestion}
                />
                <div className="h-3" />
                {
                    contents?.length && contents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {_.cloneDeep(contents)?.sort((prev, next) => prev.orderIndex - next.orderIndex).map((content) => (
                                <ContentCard key={content.id} content={content} onPress={
                                    () => router.push(pathConfig().locale(locale).course(courseDisplayId).learn().module(moduleId).content(content.id).build())
                                } />
                            ))}
                        </div>
                    ) : <Empty />
                }
            </div>
        </div>
    )
}
