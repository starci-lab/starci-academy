import React from "react"
import { SettingsSidebarNav, type SettingsNavGroup } from "@/components/blocks/navigation/SettingsSidebarNav"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { Container } from "@/components/frames/Container"
import { RailShell } from "@/components/frames/RailShell"

/**
 * `_SettingsLayout` — the chrome wrapping every route under `/profile/(settings)`
 * (edit profile, appearance, security, sessions, course history, AI settings,
 * bookmarks, membership, installments). Ported 1:1 from the storybook blueprint
 * `starci/layouts/SettingsLayout`. The nav is the block's own two-leaf
 * `SettingsSidebarNav` (desktop rail + mobile pill strip, both always in the DOM)
 * beside a centered content measure, composed through `RailShell` — the exact
 * leading-rail-beside-a-growing-body shape that frame's own header names this
 * file's legacy source as one of the two real call sites that motivated it.
 * Column-first on narrow screens, a row from `@app-md`.
 *
 * `body` is a BUILDABLE slot (`ComponentTypeWithSkeleton`, uncalled) handed
 * straight to `Container`'s own `body` slot — never a bare `ReactNode` — so the
 * connected {@link SettingsLayout} wraps whatever the Next.js route-group layout
 * hands it once, at the call site. It is deliberately NOT named `children`: React
 * reserves that name for nested elements, and a ComponentType handed in under it
 * reads as an element to every linter and every reader.
 */

/** Props for {@link _SettingsLayout}. */
export interface SettingsLayoutProps {
    /** The active settings page for the current route — a buildable slot, mandatory. */
    body: ComponentTypeWithSkeleton
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
 * The settings shell: nav rail beside a content measure, column-first, row from
 * `@app-md` — `RailShell`'s own contract. See that frame's header for why this is
 * its own khung and why the rail never shrinks while the body absorbs the rest.
 *
 * @param props - {@link SettingsLayoutProps}
 */
const _SettingsLayout = ({
    body: Body,
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
            principle="page-pad"
            explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface."
            body={Body}
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

export { _SettingsLayout }
