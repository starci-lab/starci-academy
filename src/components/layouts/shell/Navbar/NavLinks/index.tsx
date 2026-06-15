"use client"

import React from "react"
import {
    Link,
    cn,
} from "@heroui/react"
import type {
    NavbarItem,
} from "../types"

/**
 * Props for {@link NavLinks}.
 */
export interface NavLinksProps {
    /** Navigation entries to render. */
    items: Array<NavbarItem>
    /** Fired with the chosen path when an entry is pressed. */
    onSelectItem: (path: string) => void
}

/**
 * Desktop navbar link group (hidden on small screens).
 *
 * Presentational: maps entries → links, delegating navigation via `onSelectItem`.
 * `"use client"` for the press handlers.
 * @param props - entries and select callback
 */
export const NavLinks = ({
    items,
    onSelectItem,
}: NavLinksProps) => {
    return (
        <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {items.map((item) => (
                <Link key={item.path} onPress={() => onSelectItem(item.path)}>
                    <span
                        className={cn(
                            "whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors",
                            item.isActive
                                ? "bg-accent/10 text-accent"
                                : "text-muted hover:text-foreground",
                        )}
                    >
                        {item.label}
                    </span>
                </Link>
            ))}
        </div>
    )
}
