import React from "react"
import { cn } from "@heroui/react"
import { SettingsSidebarNav, type SettingsNavGroup } from "@/components/starci/blocks/navigation/SettingsSidebarNav"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"

/**
 * `_SettingsLayout` — the chrome wrapping every route under `/profile/(settings)`
 * (edit profile, appearance, security, sessions, course history, AI settings,
 * bookmarks, membership, installments). Ported 1:1 from the storybook blueprint
 * `starci/layouts/SettingsLayout` — see that file for why the outer switch is
 * `StackV` (not `Split`) and why the nav is the block's own two-leaf
 * `SettingsSidebarNav` (desktop rail + mobile pill strip, both always in the DOM).
 * The layout is column-first on narrow screens, a row from `@app-md`.
 *
 * `children` is a BUILDABLE slot (`ComponentTypeWithSkeleton`, uncalled) handed
 * straight to `Container`'s own `body` slot — never a bare `ReactNode` — so the
 * connected {@link SettingsLayout} wraps whatever the Next.js route-group layout
 * hands it once, at the call site.
 */

/** Props for {@link _SettingsLayout}. */
export interface SettingsLayoutProps {
    /** The active settings page for the current route — a buildable slot, mandatory. */
    children: ComponentTypeWithSkeleton
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
    /** Where this layout sits inside its parent — placement only, never appearance. */
    classNames?: Array<AllowedClassName>
}

/**
 * The settings shell: nav beside content, column-first, row from `@app-md`.
 * See the blueprint's file header for why this is a `layouts/` file, why it has
 * only two leaves, and why the outer switch is `StackV` rather than `Split`.
 *
 * @param props - {@link SettingsLayoutProps}
 */
const _SettingsLayout = ({
    children: Children,
    groups,
    activeHref,
    onNavigate,
    title,
    collapseLabel,
    expandLabel,
    storageKey,
    classNames,
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
                body={Children}
            />
        ),
    ]

    return (
        <div data-tier="layout" data-component="SettingsLayout" className={cn(classNames)}>
            <div className="@app-md:flex-row @app-md:items-start">
                <StackV
                    gap={1}
                    items={navAndContent}
                />
            </div>
        </div>
    )
}

export { _SettingsLayout }
