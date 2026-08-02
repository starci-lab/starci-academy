import React from "react"
import { Link as HeroUILink, cn } from "@heroui/react"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `NavLinks` — the desktop primary-route row inside `Navbar` (Home / Courses /
 * Community / Contact, one pinned active). The presentational half:
 * `items` (resolved label/path/isActive) + `onNavigate`, with route reading and
 * localization left to the caller/container. Each item is a plain HeroUI `Link`
 * (real routes, not tab panels), so no tab semantics are claimed. No
 * icon/label table — a nav item isn't a closed enum this block owns. Desktop-only
 * (`hidden @app-md:flex`).
 */

/** One route entry in the nav row — TYPED DOMAIN DATA, never a pre-formatted node. */
export interface NavLinkItem {
    /** Already-localized label, e.g. "Courses". */
    label: string
    /** Route path, also the stable React key (paths are unique by construction). */
    path: string
    /** `true` → rendered as the current-route pill; the caller decides via its own routing. */
    isActive: boolean
}

/** Props for {@link NavLinks}. */
export interface NavLinksProps {
    /** Routes offered, in display order. */
    items: Array<NavLinkItem>
    /** Fired with the pressed item's `path` — the caller owns the actual navigation. */
    onNavigate: (path: string) => void
    className?: string
}

/**
 * The desktop primary-route row. See the file header for why this is the
 * presentational half of the real `NavLinks` container, and why it composes a
 * bare `Link` rather than `Toolbar`/`Tabs`.
 *
 * @param props - {@link NavLinksProps}
 */
const NavLinks = ({ items, onNavigate, className }: NavLinksProps) => (
    <div>
        <StackH
            gap={3}
            justify="center"
            className={cn("hidden @app-md:flex", className)}

            body={items.map((item) => (
                <HeroUILink
                    key={item.path}
                    onPress={() => onNavigate(item.path)}
                    aria-current={item.isActive ? "page" : undefined}

                >
                    <span
                        className={cn(
                            "whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors",
                            item.isActive ? "bg-accent-soft text-accent-soft-foreground" : "text-muted hover:text-foreground",
                        )}
                    >
                        {item.label}
                    </span>
                </HeroUILink>
            ))}
        />
    </div>
)

export { NavLinks }
