"use client"

import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import React from "react"
import {
    Kbd,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import { useSearchOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useIsMacPlatform } from "@/hooks/useIsMacPlatform"
import { InputButtonLike } from "@/components/blocks/buttons/InputButtonLike"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Props for {@link SearchButton}.
 */
export type SearchButtonProps = WithClassNames<undefined>

/**
 * Navbar search trigger — looks like a native input field (via the
 * {@link InputButtonLike} block) but opens the search overlay on press. Shows
 * the search label and the Ctrl/Cmd+K shortcut hint.
 *
 * Self-contained section (single-use): reads the search overlay singleton itself
 * and opens it on press. `"use client"` for the singleton hook + press handler.
 * @param props - optional root class name (placement only)
 */
export const SearchButton = ({ className }: SearchButtonProps) => {
    const t = useTranslations()
    const { open: onOpenSearch } = useSearchOverlayState()
    const isMac = useIsMacPlatform()
    return (
        <InputButtonLike
            className={className}
            onPress={onOpenSearch}
            placeholder={t("search.label")}
            icon={<MagnifyingGlassIcon className="size-5 text-muted" />}
            suffix={(
                // one combined Kbd chip (per HeroUI docs — a shortcut combo is a single
                // Kbd wrapping its parts, not one chip per key); the modifier is
                // OS-adaptive: ⌘ (Kbd.Abbr) on Mac, the word "Ctrl" everywhere else
                // (HeroUI's `keyValue="ctrl"` renders the Mac Control glyph ⌃, wrong here)
                <Kbd>
                    {isMac ? <Kbd.Abbr keyValue="command" /> : <Kbd.Content>Ctrl</Kbd.Content>}
                    <Kbd.Content>K</Kbd.Content>
                </Kbd>
            )}
        />
    )
}
