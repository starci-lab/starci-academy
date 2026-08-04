"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { _SearchInput, type SearchInputProps } from "./component"

/** Props the connected {@link SearchInput} takes from its caller. */
export type SearchInputConnectedProps = Omit<SearchInputProps, "placeholder"> & {
    /** Placeholder override; omit to fall back to the generic search placeholder. */
    placeholder?: string
}

/**
 * Generic, reusable search input — the CONNECTED half: resolves the fallback
 * placeholder via `t()` when the caller doesn't override it. See
 * `design/storybook/architecture/split.md`.
 *
 * @param props - {@link SearchInputConnectedProps}
 */
export const SearchInput = ({ placeholder, ...props }: SearchInputConnectedProps) => {
    const t = useTranslations()
    return <_SearchInput {...props} placeholder={placeholder ?? t("search.placeholder")} />
}
