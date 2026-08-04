"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { _SearchBar, type SearchBarProps, type SearchBarSuggestion } from "./component"

/** Props the connected {@link SearchBar} takes from its caller. */
export type SearchBarConnectedProps = Omit<
    SearchBarProps,
    "fieldLabel" | "placeholder" | "filtersAriaLabel" | "suggestionItems"
>

/**
 * Search field — the CONNECTED half: resolves the field/placeholder/aria labels
 * and the demo suggestion list via `t()`. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link SearchBarConnectedProps}
 */
export const SearchBar = ({ className }: SearchBarConnectedProps) => {
    const t = useTranslations()

    const suggestionItems = useMemo<Array<SearchBarSuggestion>>(
        () => [
            { id: "courses", label: t("search.suggestions.courses") },
            { id: "modules", label: t("search.suggestions.modules") },
            { id: "videos", label: t("search.suggestions.videos") },
        ],
        [t],
    )

    return (
        <_SearchBar
            className={className}
            fieldLabel={t("search.label")}
            placeholder={t("search.placeholder")}
            filtersAriaLabel={t("search.filtersAria")}
            suggestionItems={suggestionItems}
        />
    )
}
