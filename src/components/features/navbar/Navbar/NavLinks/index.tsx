"use client"

import React from "react"
import {
    Link,
    cn,
} from "@heroui/react"
import {
    useRouter,
} from "@/i18n/navigation"
import {
    useNavbarItems,
} from "../useNavbarItems"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Props for {@link NavLinks}.
 */
export type NavLinksProps = WithClassNames<undefined>

/**
 * Desktop navbar link group (hidden on small screens).
 *
 * Container: derives its entries + active-route state from the router/locale
 * itself and self-navigates on press. `"use client"` for the hooks + press
 * handlers.
 * @param props - optional root class name
 */
export const NavLinks = ({ className }: NavLinksProps) => {
    const router = useRouter()
    const items = useNavbarItems()

    return (
        <div className={cn("hidden flex-1 items-center justify-center gap-2 md:flex", className)}>
            {items.map((item) => (
                <Link key={item.path} onPress={() => router.push(item.path)}>
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
}
