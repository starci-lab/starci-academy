"use client"

import { Magnifier as MagnifyingGlassIcon } from "@gravity-ui/icons"
import React, { useMemo } from "react"
import {
    Autocomplete,
    ListBox,
    SearchField,
    cn,
} from "@heroui/react"
import { useFilter } from "react-aria-components"
import { useTranslations } from "next-intl"
import type { ModuleEntity } from "@/modules/types"

/** One flattened lesson fed into the autocomplete collection. */
interface ContentSearchItem {
    /** Content id — the autocomplete key + select payload. */
    id: string
    /** Owning module id, needed to build the route on select. */
    moduleId: string
    /** Ordinal prefix "<module#>.<content#>", rendered semibold. */
    prefix: string
    /** Lesson title, rendered in the normal weight. */
    title: string
    /** Full "<prefix> <title>" string used as the filter/textValue. */
    label: string
}

/** Props for {@link ContentSearch}. */
export interface ContentSearchProps {
    /** Ordered modules whose contents populate the autocomplete collection. */
    modules: Array<ModuleEntity>
    /** The value of the autocomplete. */
    value: string | null
    /** Fired with (moduleId, contentId) when a lesson is chosen. */
    onSelectContent: (moduleId: string, contentId: string) => void
    /** Extra classes for the root field. */
    className?: string
}

/**
 * Content (lesson) search built on HeroUI's `Autocomplete`.
 *
 * Unlike the ES-backed typeahead, this loads the *entire* content collection
 * (flattened from the already-cached modules) into the Autocomplete and lets the
 * component filter it client-side as the user types — the native HeroUI pattern.
 * Choosing a row routes to that lesson via {@link onSelectContent}.
 *
 * @param props - modules to index, the value, the select callback, and optional classes
 */
export const ContentSearch = (
    { 
        modules, 
        value, 
        onSelectContent, 
        className 
    }: ContentSearchProps) => {
    const t = useTranslations()

    // diacritic- + case-insensitive "contains" matcher; `Autocomplete.Filter` only
    // filters its collection when handed a filter fn, otherwise it shows everything.
    // `sensitivity: "base"` lets "phong thu" match "Phòng thủ" (handy for Vietnamese).
    const { contains } = useFilter({ sensitivity: "base" })

    // flatten every module's lessons into a single client-side collection;
    // labels are prefixed with the "module.lesson" number for quick scanning
    const items = useMemo<Array<ContentSearchItem>>(
        () =>
            modules.flatMap((module) =>
                (module.contents ?? [])
                    .slice()
                    .sort((prev, next) => prev.sortIndex - next.sortIndex)
                    .map((content) => {
                        const prefix = `${module.sortIndex}.${content.sortIndex}`
                        return {
                            id: String(content.id),
                            moduleId: String(module.id),
                            prefix,
                            title: content.title,
                            label: `${prefix} ${content.title}`,
                        }
                    }),
            ),
        [modules],
    )

    // id -> item lookup so a selection can be routed without rescanning the list
    const byId = useMemo(() => new Map(items.map((item) => [item.id, item])), [items])

    return (
        <Autocomplete
            aria-label={t("module.searchContentsPlaceholder")}
            className={cn("w-full", className)}
            fullWidth
            placeholder={t("module.searchContentsPlaceholder")}
            // fully-controlled reset: we never keep a persistent selection — picking a
            // lesson fires navigation and the trigger falls back to the placeholder
            value={value}
            onChange={(value) => {
                if (value == null) {
                    return
                }
                const item = byId.get(String(value))
                if (item) {
                    onSelectContent(item.moduleId, item.id)
                }
            }}
        >
            <Autocomplete.Trigger className="flex h-10 w-full min-w-0 items-center gap-1.5 rounded-field border border-divider px-3 text-start text-sm text-muted">
                <MagnifyingGlassIcon className="size-4 shrink-0" />
                <Autocomplete.Value className="min-w-0 flex-1 truncate" />
                <Autocomplete.ClearButton />
                <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover className="w-[var(--trigger-width)]">
                <Autocomplete.Filter filter={contains}>
                    <SearchField className="px-2 pt-2">
                        <SearchField.Group>
                            <SearchField.SearchIcon />
                            <SearchField.Input placeholder={t("module.searchContentsPlaceholder")} />
                        </SearchField.Group>
                    </SearchField>
                    <ListBox className="max-h-72 overflow-auto p-1">
                        {items.map((item) => (
                            <ListBox.Item
                                key={item.id}
                                id={item.id}
                                textValue={item.label}
                                className="py-2"
                            >
                                {/* wrap up to 2 lines, then ellipsise; full label on hover.
                                    popover is pinned to the trigger width so long lesson
                                    titles wrap instead of stretching the dropdown */}
                                <span className="line-clamp-2 w-full" title={item.label}>
                                    <span className="font-semibold">{item.prefix}</span>
                                    {" "}
                                    {item.title}
                                </span>
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Autocomplete.Filter>
            </Autocomplete.Popover>
        </Autocomplete>
    )
}
