"use client"

import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import React from "react"
import {
    Button,
    Kbd,
    cn,
} from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link _SearchButton} — presentational; the label already resolved. */
export interface SearchButtonProps extends WithClassNames<undefined> {
    /** Already-localized search label. */
    label: string
    /** Fired when the button is pressed — opens the search overlay. */
    onPress: () => void
}

/**
 * Navbar search trigger showing the label and the Ctrl/Cmd+K shortcut hint.
 *
 * @param props - {@link SearchButtonProps}
 */
export const _SearchButton = ({ label, onPress, className }: SearchButtonProps) => (
    <Button className={cn("w-[300px] justify-between px-3", className)} variant="outline" onPress={onPress}>
        <span className="inline-flex items-center gap-2">
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span className="text-sm">{label}</span>
        </span>
        <div className="flex items-center gap-2 hidden @app-md:inline-flex">
            <Kbd>
                <Kbd.Content>Ctrl</Kbd.Content>
            </Kbd>
            <Kbd>
                <Kbd.Content>K</Kbd.Content>
            </Kbd>
        </div>
    </Button>
)
