"use client"

import { Magnifier as MagnifyingGlassIcon } from "@gravity-ui/icons"
import React from "react"
import { Input, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"

/** Props for {@link FoundationsCategoryGridSearch}. */
export interface FoundationsCategoryGridSearchProps {
    /** Current search query (controlled). */
    value: string
    /** Fired with the new query on every keystroke. */
    onValueChange: (value: string) => void
}

/**
 * Search box for the foundations category hub.
 *
 * Presentational: a controlled HeroUI text field with a leading magnifier icon,
 * mirroring the navbar search affordance. Filtering happens in the parent layout.
 * @param props - controlled value + change handler
 */
export const FoundationsCategoryGridSearch = ({
    value,
    onValueChange,
}: FoundationsCategoryGridSearchProps) => {
    const t = useTranslations()

    return (
        <TextField aria-label={t("foundations.searchPlaceholder")} className="w-full sm:max-w-sm">
            <div className="relative">
                <MagnifyingGlassIcon className="text-muted pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                    type="search"
                    placeholder={t("foundations.searchPlaceholder")}
                    className="pl-9"
                    value={value}
                    onChange={(event) => onValueChange(event.target.value)}
                />
            </div>
        </TextField>
    )
}
