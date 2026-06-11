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
import type { MilestoneEntity } from "@/modules/types"

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
export interface MilestoneTaskSearchProps {
    /** Ordered milestones whose tasks populate the autocomplete collection. */
    milestones: Array<MilestoneEntity>
    /** Fired with the task id when a task is chosen. */
    onSelectTask: (taskId: string) => void
    /** Extra classes for the root field. */
    className?: string
}

/**
 * Milestone-task search built on HeroUI's `Autocomplete` — mirrors the module
 * lesson search. Flattens every milestone's tasks into one client-side collection
 * and filters as the user types; choosing a row selects that task.
 *
 * @param props - milestones to index, the select callback, and optional classes
 */
export const MilestoneTaskSearch = ({ milestones, onSelectTask, className }: MilestoneTaskSearchProps) => {
    const t = useTranslations()

    // diacritic- + case-insensitive "contains" matcher (handles Vietnamese accents).
    const { contains } = useFilter({ sensitivity: "base" })

    const items = useMemo<Array<MilestoneTaskSearchItem>>(
        () =>
            milestones.flatMap((milestone) =>
                (milestone.tasks ?? [])
                    .slice()
                    .sort((prev, next) => prev.orderIndex - next.orderIndex)
                    .map((task) => {
                        const prefix = `${milestone.orderIndex + 1}.${task.orderIndex + 1}`
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

    return (
        <Autocomplete
            aria-label={t("finalProject.page.searchTaskPlaceholder")}
            className={cn("w-full", className)}
            fullWidth
            placeholder={t("finalProject.page.searchTaskPlaceholder")}
            variant="secondary"
            selectedKey={null}
            onSelectionChange={(key) => {
                if (key == null) {
                    return
                }
                const item = byId.get(String(key))
                if (item) {
                    onSelectTask(item.id)
                }
            }}
        >
            <Autocomplete.Trigger className="flex h-10 w-full min-w-0 items-center gap-2 rounded-xl border border-divider px-3 text-start text-sm text-muted">
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
                            <SearchField.Input placeholder={t("finalProject.page.searchTaskPlaceholder")} />
                        </SearchField.Group>
                    </SearchField>
                    <ListBox className="max-h-72 overflow-auto p-1">
                        {items.map((item) => (
                            <ListBox.Item
                                key={item.id}
                                id={item.id}
                                textValue={item.label}
                            >
                                {/* wrap up to 2 lines, then ellipsise; full label on hover.
                                    popover is pinned to the trigger width so long task
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
