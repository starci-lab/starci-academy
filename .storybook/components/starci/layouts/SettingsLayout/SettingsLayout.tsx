import React from "react"
import { SettingsSidebarNav, type SettingsNavGroup } from "@sb-components/starci/blocks/navigation/SettingsSidebarNav/SettingsSidebarNav"
import { Container } from "@sb-components/frames/Container/Container"
import { RailShell } from "@sb-components/frames/RailShell/RailShell"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"

/**
 * `SettingsLayout` — the chrome around every `/profile/(settings)` route: a nav
 * rail beside a centered content column, column-first on a narrow screen and a
 * row from `@app-md`. `children` is a real slot — the shell stays put while the
 * active page changes underneath. One leaf: the nav-plus-content arrangement
 * never loses a region on data, so which page is active and what it renders are
 * states.
 *
 * Mirrored from src `layouts/SettingsLayout`: `RailShell` owns the stacked→row
 * switch and the growing content column.
 */

/** Props for {@link SettingsLayout}. */
export interface SettingsLayoutProps {
    /** The active settings page for the current route. Mandatory — RULE 12. */
    children: React.ReactNode
    /** Grouped settings destinations, forwarded to {@link SettingsSidebarNav} untouched. */
    groups: Array<SettingsNavGroup>
    /** Which destination's route is active right now. */
    activeHref: string
    /** Fired with the href the reader picked in the nav. */
    onNavigate: (href: string) => void
    /** Sidebar heading, e.g. "Settings". */
    title: string
    /** Localized label for the collapse control. */
    collapseLabel: string
    /** Localized label for the expand control. */
    expandLabel: string
    /** `localStorage` key persisting the collapsed flag. */
    storageKey: string
}

/**
 * The settings shell: nav beside content, column-first, row from `@app-md`.
 * See the file header for why this is a `layouts/` file, why it has only two
 * leaves, and why the outer switch is `RailShell` rather than a raw host.
 *
 * @param props - {@link SettingsLayoutProps}
 */
const SettingsLayout = ({
    children,
    groups,
    activeHref,
    onNavigate,
    title,
    collapseLabel,
    expandLabel,
    storageKey,
}: SettingsLayoutProps) => {
    const navSlot: ComponentTypeWithSkeleton = () => (
        <SettingsSidebarNav
            groups={groups}
            activeHref={activeHref}
            onNavigate={onNavigate}
            title={title}
            collapseLabel={collapseLabel}
            expandLabel={expandLabel}
            storageKey={storageKey}
        />
    )

    const contentSlot: ComponentTypeWithSkeleton = () => (
        <Container
            size="md"
            padding={6}
            body={() => children}
        />
    )

    return (
        <RailShell
            rail={navSlot}
            body={contentSlot}
            at="md"
            principle="layout-split"
            explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
            identity={{ tier: "layout", component: "SettingsLayout" }}
        />
    )
}

export { SettingsLayout }
