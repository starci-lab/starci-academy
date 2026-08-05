"use client"

import React from "react"
import {
    Button,
    Label,
    ListBox,
    SearchField,
    Select,
    Typography,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    RowsIcon,
    SquaresFourIcon,
} from "@phosphor-icons/react"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { usePracticeFilters } from "../hooks/usePracticeFilters"
import {
    CODING_DIFFICULTY_META,
    DIFFICULTY_FILTERS,
    SORT_KEYS,
    STATUS_FILTERS,
} from "../constants"
import type {
    DifficultyFilter,
    SortKey,
    StatusFilter,
} from "../types"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link PracticeFilters}. */
export type PracticeFiltersProps = WithClassNames<undefined>

/**
 * The PracticeHubPage catalog filter bar — a title search box plus difficulty / status
 * filter chips (HeroUI Buttons, secondary when active / ghost when not), a sort
 * `Select`, and a group-by-domain toggle. The topic (domain) filter lives in the
 * {@link import("../PracticeRail").PracticeRail} sidebar, not here. Reads + writes
 * the URL-backed filter state itself ({@link usePracticeFilters}); composes blocks
 * + HeroUI only.
 *
 * @param props - optional className for the root element.
 */
export const PracticeFilters = ({
    className,
}: PracticeFiltersProps) => {
    const t = useTranslations()
    const { filters, setFilters } = usePracticeFilters()

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {/* title search — client-side filter over loaded problems */}
            <SearchField
                aria-label={t("PracticeHubPage.filters.searchPlaceholder")}
                value={filters.q}
                onChange={(value) => setFilters({ q: value })}
            >
                <Label className="sr-only">{t("PracticeHubPage.filters.searchPlaceholder")}</Label>
                <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder={t("PracticeHubPage.filters.searchPlaceholder")} />
                    <SearchField.ClearButton />
                </SearchField.Group>
            </SearchField>

            {/* difficulty + status chip groups */}
            <div className="flex flex-col gap-3">
                {/* difficulty chips */}
                <FlexWrapButtonRadio
                    ariaLabel={t("PracticeHubPage.filters.difficultyAria")}
                    value={filters.difficulty}
                    onChange={(value) => setFilters({ difficulty: value as DifficultyFilter })}
                    items={DIFFICULTY_FILTERS.map((value) => ({
                        value,
                        content: value === "all"
                            ? t("PracticeHubPage.filters.allDifficulties")
                            : t(CODING_DIFFICULTY_META[value].labelKey),
                    }))}
                />
                {/* status chips */}
                <FlexWrapButtonRadio
                    ariaLabel={t("PracticeHubPage.filters.statusAria")}
                    value={filters.status}
                    onChange={(value) => setFilters({ status: value as StatusFilter })}
                    items={STATUS_FILTERS.map((value) => ({
                        value,
                        content: t(`PracticeHubPage.filters.status.${value}`),
                    }))}
                />
            </div>

            {/* sort dropdown + group toggle */}
            <div className="flex flex-wrap items-center gap-3">
                {/* sort dropdown */}
                <div className="flex flex-col gap-2">
                    <Label className="sr-only">{t("PracticeHubPage.filters.sortAria")}</Label>
                    <Select.Root<{ id: string }, "single">
                        aria-label={t("PracticeHubPage.filters.sortAria")}
                        selectedKey={filters.sort}
                        onSelectionChange={(key) => setFilters({ sort: String(key) as SortKey })}
                    >
                        <Select.Trigger aria-label={t("PracticeHubPage.filters.sortAria")} className="w-fit min-w-40">
                            <Select.Value>
                                {() => (
                                    <Typography type="body-sm">
                                        {t(`PracticeHubPage.filters.sort.${filters.sort}`)}
                                    </Typography>
                                )}
                            </Select.Value>
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox.Root aria-label={t("PracticeHubPage.filters.sortAria")}>
                                {SORT_KEYS.map((value) => (
                                    <ListBox.Item
                                        key={value}
                                        id={value}
                                        textValue={t(`PracticeHubPage.filters.sort.${value}`)}
                                    >
                                        {t(`PracticeHubPage.filters.sort.${value}`)}
                                    </ListBox.Item>
                                ))}
                            </ListBox.Root>
                        </Select.Popover>
                    </Select.Root>
                </div>

                {/* group-by-domain toggle — flat list vs domain sections */}
                <Button
                    size="sm"
                    variant={filters.group ? "secondary" : "ghost"}
                    aria-pressed={filters.group}
                    onPress={() => setFilters({ group: !filters.group })}
                >
                    {filters.group ? (
                        <SquaresFourIcon aria-hidden focusable="false" className="size-5" />
                    ) : (
                        <RowsIcon aria-hidden focusable="false" className="size-5" />
                    )}
                    {filters.group
                        ? t("PracticeHubPage.filters.grouped")
                        : t("PracticeHubPage.filters.flat")}
                </Button>
            </div>
        </div>
    )
}
