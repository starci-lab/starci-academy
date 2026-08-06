import React from "react"
import { Link as HeroUILink, cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { StackH } from "@/components/frames/Stack"

/**
 * `NavLinks` — the desktop primary-route row inside the site's top nav
 * ("Home / Courses / Community / Contact"), one pinned as current. The
 * presentational half of a container: it takes `items` already resolved
 * (label/path/isActive) and an `onNavigate` callback, leaving router wiring to
 * the caller. Rendered with `Link` (HeroUI), not a tab compound — these are
 * real routes, not panels under one ARIA tablist. One leaf, `Row`; the current
 * route is data, so it is a state.
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
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}

/**
 * The desktop primary-route row. See the file header for why this is the
 * presentational half of the real `NavLinks` container, and why it composes a
 * bare `Link` rather than `Toolbar`/`Tabs`.
 *
 * @param props - {@link NavLinksProps}
 */
const NavLinks = ({ items, onNavigate, classNames }: NavLinksProps) => (
    <div className="hidden @app-md:flex">
        <StackH
            gap={3}
            principle="flex-action"
            explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
            justify="center"
            classNames={classNames}

            items={items.map((item) => () => (
                <HeroUILink
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
