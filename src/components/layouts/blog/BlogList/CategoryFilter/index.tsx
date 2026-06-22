"use client"

import React from "react"
import { Chip, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { BlogCategory } from "@/modules/api/graphql"
import { CATEGORY_FILTERS, CATEGORY_COLOR } from "../../shared/category"

/** Props for {@link CategoryFilter}. */
export interface CategoryFilterProps {
    /** Active pillar (`null` = "All"). */
    value: BlogCategory | null
    /** Called when the reader picks a different pillar. */
    onChange: (next: BlogCategory | null) => void
}

/**
 * Editorial-pillar filter row. Each pillar is a `cursor-pointer` chip button with
 * a hover affordance; the active one is filled, the rest soft. Controlled — the
 * container owns the selected value + data fetch.
 */
export const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
    const t = useTranslations("blog")
    return (
        <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label={t("title")}
        >
            {CATEGORY_FILTERS.map((filter) => {
                const selected = filter === value
                return (
                    <button
                        key={filter ?? "all"}
                        type="button"
                        onClick={() => onChange(filter)}
                        aria-pressed={selected}
                        className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <Chip
                            size="md"
                            variant={selected ? "primary" : "soft"}
                            color={filter ? CATEGORY_COLOR[filter] : "accent"}
                            className={cn(
                                !selected && "opacity-75 transition-opacity hover:opacity-100",
                            )}
                        >
                            {filter ? t(`categories.${filter}`) : t("categories.all")}
                        </Chip>
                    </button>
                )
            })}
        </div>
    )
}
