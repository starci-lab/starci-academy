import React from "react"
import { Link as HeroUILink, cn } from "@heroui/react"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `NavLinks`: the desktop primary-route row inside the site's top nav
 * (`Navbar`) — "Home / Courses / Community / Contact", one of them pinned
 * as the active route.
 *
 * Storybook-local port of `src/components/blocks/layout/shell/Navbar/NavLinks`
 * (already a REUSE of the same idea, renamed from the earlier
 * `src/components/features/navbar/Navbar/NavLinks` — same shape, moved folder).
 *
 * ⭐ THE REAL COMPONENT IS A CONTAINER; THIS ONE IS NOT, ON PURPOSE. The `src`
 * version derives its own `items` from `next-intl` + `usePathname()` and
 * self-navigates with `useRouter().push(...)` — none of that exists in a
 * Storybook tree. Stripping it down to `items` (typed domain data, already
 * resolved to label/path/isActive) + `onNavigate` is not a smaller version of
 * the same block, it is the presentational HALF of it — the container's job
 * (reading the route, localizing labels) is app wiring, same discipline as a
 * screen never wiring a real router (see canon rule 13 on overlays, the same
 * argument applies to any container→presentational split).
 *
 * ⭐ WHY `Link` (HeroUI) DIRECTLY, AND NOT `Toolbar` OR `Tabs`. These are real
 * ROUTES, each its own page with its own URL — not panels switching under one
 * ARIA tablist. `ContentModeNav` reuses `Toolbar` for its mode row even though
 * mode-switching is also navigation, because that row is shaped like two tab
 * groups; this row has no such second group and no tab semantics to borrow, so
 * composing the tab compound here would claim `role="tab"` behaviour (arrow-key
 * roving, `aria-selected`) this row never had. A plain `Link` per item, exactly
 * what the real component renders, is the honest primitive for "a set of real
 * links, one of them current".
 *
 * ⛔ NO ICON/LABEL TABLE HERE, unlike `LeaderboardCategoryNav`'s category table.
 * A nav item is not a closed enum this block knows the vocabulary of — the
 * caller (the real `Navbar` container) owns which routes exist and their
 * copy, sourced from i18n. This block's only domain knowledge is what an
 * active pill looks like versus an inactive one.
 *
 * DESKTOP-ONLY BY DEFAULT: `hidden @app-md:flex` on the row itself, matching
 * the real `Navbar`'s companion (a separate mobile drawer trigger, out of
 * scope here — this block only ever renders the inline desktop row or nothing).
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
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
