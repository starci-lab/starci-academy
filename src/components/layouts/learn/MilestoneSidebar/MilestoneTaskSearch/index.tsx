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
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/redux"
import { setSelectedTaskId } from "@/redux/slices"
import { pathConfig } from "@/resources/path"
import type { WithClassNames } from "@/modules/types"

/** One flattened milestone task fed into the autocomplete collection. */
interface MilestoneTaskSearchItem {
    /** Task id — the autocomplete key + select payload. */
    id: string
    /** Ordinal prefix "<milestone#>.<task#>", rendered semibold. */
    prefix: string
    /** Task title, rendered in the normal weight. */
    title: string
    /** Full "<prefix> <title>" string used as the filter/textValue. */
    label: string
}

/** Props for {@link MilestoneTaskSearch}. */
export interface MilestoneTaskSearchProps extends WithClassNames<undefined> {
    /** Extra classes for the root field. */
    className?: string
}

/**
 * Milestone-task search built on HeroUI's `Autocomplete` — mirrors the module
 * lesson search. Reads milestones and the selected task id from the Redux store;
 * choosing a row dispatches `setSelectedTaskId` and routes to that task.
 *
 * @param props - optional classes
 */
export const MilestoneTaskSearch = ({ className }: MilestoneTaskSearchProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()

    // read milestones and the selected task id from the Redux store
    const milestoneEntities = useAppSelector((state) => state.milestone.entities)
    const selectedTaskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    // sort milestones by their display order (mirrors MilestoneSidebar's milestones)
    const milestones = useMemo(
        () => [...milestoneEntities].sort((prev, next) => prev.sortIndex - next.sortIndex),
        [milestoneEntities],
    )

    /** Select a task: store the id in redux and route to its learn page. */
    const onSelectTask = useCallback(
        (taskId: string) => {
            dispatch(setSelectedTaskId(taskId))
            router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().personalProject(taskId).build(),
            )
        },
        [dispatch, router, locale, courseDisplayId],
    )

    // diacritic- + case-insensitive "contains" matcher (handles Vietnamese accents).
    const { contains } = useFilter({ sensitivity: "base" })

    const items = useMemo<Array<MilestoneTaskSearchItem>>(
        () =>
            milestones.flatMap((milestone) =>
                (milestone.tasks ?? [])
                    .slice()
                    .sort((prev, next) => prev.sortIndex - next.sortIndex)
                    .map((task) => {
                        const prefix = `${milestone.sortIndex}.${task.sortIndex}`
                        return {
                            id: String(task.id),
                            prefix,
                            title: task.title,
                            label: `${prefix} ${task.title}`,
                        }
                    }),
            ),
        [milestones],
    )

    const byId = useMemo(() => new Map(items.map((item) => [item.id, item])), [items])

    const [filterQuery, setFilterQuery] = useState("")

    const filteredItems = useMemo<Array<MilestoneTaskSearchItem>>(() => {
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
            aria-label={t("finalProject.page.searchTaskPlaceholder")}
            className={cn("w-full", className)}
            fullWidth
            placeholder={t("finalProject.page.searchTaskPlaceholder")}
            value={selectedTaskId ?? null}
            onChange={(nextValue) => {
                if (nextValue == null) {
                    return
                }
                const item = byId.get(String(nextValue))
                if (item) {
                    onSelectTask(item.id)
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
                {/* manual-filter pattern mirrored from ContentSearch: a controlled
                    SearchField drives filteredItems and the ListBox is rendered directly.
                    Using HeroUI's built-in Autocomplete.Filter here produced a different
                    DOM that rendered rows taller/looser than the lesson search. */}
                <SearchField
                    aria-label={t("finalProject.page.searchTaskPlaceholder")}
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
                            placeholder={t("finalProject.page.searchTaskPlaceholder")}
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
                                // matches ContentSearch: min-h-0 drops HeroUI's fixed 36px
                                // min-height so the box sizes to content, shrink-0 stops the
                                // scrolling flex column from compressing rows, py-1.5 sets the
                                // vertical breathing room (utilities win over base via layers)
                                className="min-h-0 shrink-0 py-1.5"
                            >
                                {/* wrap up to 2 lines, then ellipsise; full label on hover.
                                    popover is pinned to the trigger width so long task
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
