import React from "react"
import {
    Link,
    cn,
} from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One resolved nav link entry. */
export interface NavLinkItem {
    /** Already-localized label. */
    label: string
    /** Navigation target path. */
    path: string
    /** Whether this entry matches the active route. */
    isActive: boolean
}

/** Props for {@link _NavLinks} — presentational; items + handler already resolved. */
export interface NavLinksProps extends WithClassNames<undefined> {
    /** Nav entries to render, already resolved (label + active state). */
    items: Array<NavLinkItem>
    /** Fired with the target path when an item is pressed. */
    onNavigate: (path: string) => void
}

/**
 * Desktop navbar link group (hidden on small screens).
 *
 * @param props - {@link NavLinksProps}
 */
export const _NavLinks = ({ items, onNavigate, className }: NavLinksProps) => (
    <div className={cn("hidden flex-1 items-center justify-center gap-2 @app-md:flex", className)}>
        {items.map((item) => (
            <Link key={item.path} onPress={() => onNavigate(item.path)}>
                <span
                    className={cn(
                        "whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors",
                        item.isActive
                            ? "bg-accent-soft text-accent-soft-foreground"
                            : "text-muted hover:text-foreground",
                    )}
                >
                    {item.label}
                </span>
            </Link>
        ))}
    </div>
)
