"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useSearchOverlayState } from "@/hooks/zustand/overlay/hooks"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _SearchButton } from "./component"

/** Props the connected {@link SearchButton} takes from its caller. */
export type SearchButtonConnectedProps = WithClassNames<undefined>

/**
 * Navbar search trigger — the CONNECTED half: resolves the label via `t()`
 * and opens the search overlay singleton on press. See
 * `design/storybook/architecture/split.md`.
 *
 * @param props - {@link SearchButtonConnectedProps}
 */
export const SearchButton = ({ className }: SearchButtonConnectedProps) => {
    const t = useTranslations()
    const { open: onOpenSearch } = useSearchOverlayState()
    return <_SearchButton label={t("search.label")} onPress={onOpenSearch} className={className} />
}
