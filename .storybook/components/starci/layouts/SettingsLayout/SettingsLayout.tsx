import React from "react"
import { SettingsSidebarNav, type SettingsNavGroup } from "@sb-components/starci/blocks/navigation/SettingsSidebarNav/SettingsSidebarNav"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT — `SettingsLayout`: the chrome that wraps every route under
 * `/profile/(settings)` (edit profile, appearance, security, privacy,
 * sessions, course history, AI settings/subscription/usage, bookmarks,
 * membership, installments).
 *
 * WHY THIS IS A `layouts/` FILE, NOT A `blocks/` ONE (RULE 12 — canon
 * `steps/11-overlays-layouts-brainstorm.md` §4). The real
 * `profile/settings/layout.tsx` hands `children` straight through to this
 * component with no other content of its own, and `children` here is a REAL
 * slot — the active settings page renders inside it and swaps on every route
 * change while this shell itself stays mounted. That is "what wraps every
 * route in this scope", the layout test, not "what does the user come to
 * this route to do", the screen/page test. Unlike the two items the batch
 * flagged AMBIGUOUS (`PersonalProjectWorkspace`, `PublicProfile` — both sit
 * behind an empty `page.tsx` stub), `profile/settings/page.tsx` siblings are
 * NOT stubs, so there is no ambiguity to resolve here.
 *
 * TWO LEAVES, NOT FOUR. The real `src` component hand-rolls a SECOND nav
 * shape itself — a `@app-md:hidden` horizontal chip strip pinned inside
 * `<main>` — alongside the desktop `CollapsibleSidebar` rail. This block
 * folds BOTH shapes into one delegated leaf: `SettingsSidebarNav` owns every
 * way the settings nav can render (desktop rail, mobile strip), and this
 * layout only ever places ONE sidebar slot beside ONE content column. A
 * layout that reached into its child block's responsive internals to hand-rebuild
 * one of its two shapes would be duplicating a decision that block already owns.
 *
 * OUTER ROW/COLUMN SWITCH, NOT `Split`. `Split`'s two named sides carry FIXED
 * width strategies (`start` truncates, `end` never shrinks) that assume the
 * TRAILING side is the one to protect. Here it is the LEADING side (the nav)
 * that must hold its width and the TRAILING side (the content column) that
 * should flex — backwards from what `Split` bakes in — so this composes
 * `StackV` instead: full-width COLUMN on narrow screens (nav strip above,
 * content below) becoming a ROW at `@app-md` (nav rail beside content), via a
 * responsive override on the frame's own class list. `Flex` — the only other
 * frame that could express this — is internal-only to `components/frames/`
 * (see its own file header), so `StackV` + override is the public road.
 *
 * ⭐ `gap={1}` IS DELIBERATE, NOT AN OMISSION. The seam between the nav
 * and the content column is drawn by `SettingsSidebarNav`'s own border/divider
 * (mirroring the real `CollapsibleSidebar`'s `border-r`), not by empty space
 * this frame adds on top of it — two owners for one seam is exactly what
 * §10a forbids. The visible gutter the reader sees is the child's border,
 * this frame contributes zero.
 *
 * CONTENT COLUMN = `Container` DEFAULTS. `size="md"` is `max-w-app-md`
 * (48rem, the same measure `max-w-3xl` names, see `Container`'s own file
 * header) and `padding={6}` is `p-6` — exactly the "p-6/max-w-3xl" the
 * spec calls for, with no hand-written class needed. `classNames={["min-w-0",
 * "flex-1"]}` is placement (letting the column claim the row's remaining width
 * once the nav's own fixed rail has taken its share) — not a seam, so it
 * does not trip `check-seams`' hand-rolled-layout rule (no `gap-*` alongside
 * `flex`).
 *
 * ⭐ NO WORDING OF ITS OWN. Every settings-nav prop (`groups`/`activeHref`/
 * `onNavigate`/`title`/`collapseLabel`/`expandLabel`/`storageKey`) passes
 * straight through to `SettingsSidebarNav` unmodified — this layout adds no
 * label, no default, no branch on their values. It still earns its layer
 * (`check-passthrough-block`): it renders TWO composed children in a real
 * row/column arrangement, not one bare forward.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this layout so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: SettingsLayoutProps) => {
    const navAndContent = (
        <>
            <SettingsSidebarNav
                anatPart={showAnatomy ? "SettingsSidebarNav" : undefined}
                groups={groups}
                activeHref={activeHref}
                onNavigate={onNavigate}
                title={title}
                collapseLabel={collapseLabel}
                expandLabel={expandLabel}
                storageKey={storageKey}
            />
            <Container
                anatPart={showAnatomy ? "Container" : undefined}
                size="md"
                padding={6}
                classNames={["min-w-0", "flex-1"]}
                body={children}
            />
        </>
    )

    return (
        <div data-anat-part={anatPart}>
            <StackV
                gap={1}
                className="@app-md:flex-row @app-md:items-start"
                anatPart={showAnatomy ? "StackV" : undefined}
                body={navAndContent}
            />
        </div>
    )
}

export { SettingsLayout }
