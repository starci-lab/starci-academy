import React from "react"
import { SettingsSidebarNav, type SettingsNavGroup } from "@sb-components/starci/blocks/navigation/SettingsSidebarNav/SettingsSidebarNav"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `SettingsLayout` — the chrome around every `/profile/(settings)` route: a nav
 * rail beside a centered content column, column-first on a narrow screen and a
 * row from `@app-md`. `children` is a real slot — the shell stays put while the
 * active page changes underneath. One leaf: the nav-plus-content arrangement
 * never loses a region on data, so which page is active and what it renders are
 * states.
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
 * leaves, and why the outer switch is `StackV` rather than `Split`.
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
    const navAndContent = [
        () => (
            <SettingsSidebarNav

                groups={groups}
                activeHref={activeHref}
                onNavigate={onNavigate}
                title={title}
                collapseLabel={collapseLabel}
                expandLabel={expandLabel}
                storageKey={storageKey}
            />
        ),
        () => (
            <Container

                size="md"
                padding={6}
                classNames={["min-w-0", "flex-1"]}
                body={() => children}
            />
        ),
    ]

    return (
        <div>
            <div className="@app-md:flex-row @app-md:items-start">
                <StackV
                    gap={1}
                    items={navAndContent}
                />
            </div>
        </div>
    )
}

export { SettingsLayout }
