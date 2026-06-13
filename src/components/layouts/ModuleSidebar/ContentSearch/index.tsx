"use client"

import { Magnifier as MagnifyingGlassIcon } from "@gravity-ui/icons"
import React, { useCallback, useMemo, useState } from "react"
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
export const ContentSearch = ({
    modules,
    value,
    onSelectContent,
    className,
}: ContentSearchProps) => {
    const t = useTranslations()
    const [filterQuery, setFilterQuery] = useState("")

    // diacritic- + case-insensitive "contains" matcher; `sensitivity: "base"` lets "phong thu" match "Phòng thủ" (handy for Vietnamese).
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

    const filteredItems = useMemo<Array<ContentSearchItem>>(() => {
        const trimmed = filterQuery.trim()

        if (!trimmed) {
            return items
        }

        return items.filter((item) => contains(item.label, trimmed))
    }, [contains, filterQuery, items])

    const showEmpty = filterQuery.trim().length > 0 && filteredItems.length === 0

    const onFilterQueryChange = useCallback((next: string) => {
        setFilterQuery(next)
    }, [])

    const onPopoverOpenChange = useCallback((isOpen: boolean) => {
        if (!isOpen) {
            setFilterQuery("")
        }
    }, [])

    return (
        <Autocomplete
            allowsEmptyCollection
            aria-label={t("module.searchContentsPlaceholder")}
            className={cn("w-full", className)}
            fullWidth
            placeholder={t("module.searchContentsPlaceholder")}
            // fully-controlled reset: we never keep a persistent selection — picking a
            // lesson fires navigation and the trigger falls back to the placeholder
            value={value}
            onChange={(nextValue) => {
                if (nextValue == null) {
                    return
                }
                const item = byId.get(String(nextValue))
                if (item) {
                    onSelectContent(item.moduleId, item.id)
                    setFilterQuery("")
                }
            }}
            onOpenChange={onPopoverOpenChange}
        >
            <Autocomplete.Trigger className="flex h-10 w-full min-w-0 items-center gap-1.5 rounded-field border border-divider px-3 text-start text-sm text-muted">
                <MagnifyingGlassIcon className="size-5 shrink-0" />
                <Autocomplete.Value className="min-w-0 flex-1 truncate" />
                <Autocomplete.ClearButton />
                <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover className="w-[var(--trigger-width)] overflow-hidden p-0">
                <SearchField
                    aria-label={t("module.searchContentsPlaceholder")}
                    className="w-full p-0"
                    value={filterQuery}
                    onChange={onFilterQueryChange}
                >
                    <SearchField.Group className="relative w-full rounded-none border-0 border-b border-divider bg-transparent py-2 shadow-none ring-0 outline-none focus-within:border-divider focus-within:ring-0 focus-within:outline-none">
                        <MagnifyingGlassIcon
                            aria-hidden
                            className="pointer-events-none absolute top-1/2 left-2 size-5 -translate-y-1/2 shrink-0 text-muted"
                        />
                        <SearchField.Input
                            className="w-full border-0 bg-transparent py-0 pr-2 pl-9 shadow-none ring-0 focus:ring-0 outline-none"
                            placeholder={t("module.searchContentsPlaceholder")}
                        />
                    </SearchField.Group>
                </SearchField>
                {showEmpty ? (
                    <div className="px-4 py-9 text-center text-sm text-muted">
                        {t("search.noResults")}
                    </div>
                ) : (
                    <ListBox className="max-h-72 gap-0 overflow-auto p-1">
                        {filteredItems.map((item) => (
                            <ListBox.Item
                                key={item.id}
                                id={item.id}
                                textValue={item.label}
                                // min-h-0 drops HeroUI's fixed 36px min-height so the box
                                // sizes to its content; shrink-0 stops the scrolling flex
                                // column from compressing rows into each other once the list
                                // overflows; py-3 gives 1- and 2-line rows equal breathing
                                // room (utilities win over base .list-box-item via layer order)
                                className="min-h-0 shrink-0 py-1.5"
                            >
                                {/* wrap up to 2 lines, then ellipsise; full label on hover.
                                    popover is pinned to the trigger width so long lesson
                                    titles wrap instead of stretching the dropdown.
                                    leading-snug keeps the two wrapped lines reading as one
                                    block so the inter-row gap stays visually dominant */}
                                <span className="line-clamp-2 w-full leading-snug" title={item.label}>
                                    <span className="font-semibold">{item.prefix}</span>
                                    {" "}
                                    {item.title}
                                </span>
                            </ListBox.Item>
                        ))}
                    </ListBox>
                )}
            </Autocomplete.Popover>
        </Autocomplete>
    )
}
