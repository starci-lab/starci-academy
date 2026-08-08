import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ButtonRadioGroup } from "@sb-components/composites/buttons/ButtonRadioGroup/ButtonRadioGroup"
import { ShowFrom } from "@sb-components/frames/ShowFrom/ShowFrom"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `NavLinks` — the desktop primary-route row inside the site's top nav
 * ("Home / Courses / Community / Contact"), one pinned as current. The
 * presentational half of a container: it takes `items` already resolved
 * (label/path/isActive) and an `onNavigate` callback, leaving router wiring to
 * the caller. Rendered with `ButtonRadioGroup` (same pill vocabulary as
 * `Navbar`), not a tab compound — these are real routes, not panels under one
 * ARIA tablist. One leaf, `Row`; the current route is data, so it is a state.
 *
 * `ShowFrom` owns the md visibility switch so this block never writes
 * `hidden @app-md:flex` on a raw host.
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
}

/**
 * The desktop primary-route row. See the file header for why this is the
 * presentational half of the real `NavLinks` container, and why it composes
 * `ButtonRadioGroup` rather than a bare vendor `Link`.
 *
 * @param props - {@link NavLinksProps}
 */
const NavLinks = ({ items, onNavigate }: NavLinksProps) => {
    const activePath = items.find((item) => item.isActive)?.path ?? ""

    return (
        <StackH
            identity={{ tier: "block", component: "NavLinks" }}
            principle="flex-action"
            explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
            items={[
                () => (
                    <ShowFrom
                        at="md"
                        body={() => (
                            <ButtonRadioGroup
                                items={items.map((item) => ({
                                    value: item.path,
                                    content: <Typography size="sm" text={item.label} />,
                                }))}
                                value={activePath}
                                onChange={(path) => onNavigate(path)}
                                ariaLabel="Main navigation"
                            />
                        )}
                    />
                ),
            ]}
        />
    )
}

export { NavLinks }
