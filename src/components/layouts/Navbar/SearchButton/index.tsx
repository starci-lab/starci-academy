"use client"

import { Magnifier as MagnifyingGlassIcon } from "@gravity-ui/icons"
import React from "react"
import {
    Button,
    Kbd,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useSearchOverlayState,
} from "@/hooks"

/**
 * Navbar search trigger showing the label and the Ctrl/Cmd+K shortcut hint.
 *
 * Self-contained section (single-use): reads the search overlay singleton
 * itself and opens it on press, so the navbar just renders `<SearchButton />`.
 * `"use client"` for the singleton hook + press handler.
 */
export const SearchButton = () => {
    const t = useTranslations()
    const { open: onOpenSearch } = useSearchOverlayState()
    return (
        <Button className="w-[300px] justify-between px-3" variant="outline" onPress={onOpenSearch}>
            <span className="inline-flex items-center gap-2">
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span className="text-sm">{t("search.label")}</span>
            </span>
            <div className="flex items-center gap-1 hidden md:inline-flex">
                <Kbd>
                    <Kbd.Content>Ctrl</Kbd.Content>
                </Kbd>
                <Kbd>
                    <Kbd.Content>K</Kbd.Content>
                </Kbd>
            </div>
        </Button>
    )
}
