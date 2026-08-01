import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Navbar, type NavbarProps } from "@sb-components/starci/blocks/navigation/Navbar/Navbar"
import { Footer, type FooterProps } from "@sb-components/starci/blocks/navigation/Footer/Footer"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT — `InnerLayout`: the wrapper for EVERY route in the app. Sticky nav
 * band on top, the routed page in between, a marketing Footer that shows or
 * hides per route — nothing else.
 *
 * NAMED AFTER THE REAL FILE ON PURPOSE. The real sibling is
 * `src/app/InnerLayout.tsx`, mounted once by `src/app/[locale]/layout.tsx` —
 * `steps/11-overlays-layouts-brainstorm.md` §4–§5 measured and named this
 * exact file. ⚠️ CONSOLIDATION NOTE: an earlier pass in this same run built
 * this identical component under the name `AppShell` (its own file header
 * already pointed at `InnerLayout` as "the real sibling", i.e. it was this
 * component wearing the wrong name) — REUSE FIRST means finishing that file
 * under its correct name rather than standing up a second wrapper beside it,
 * which would only earn a `check-passthrough-block` violation (a layer that
 * renders exactly one child). `AppShell/AppShell.tsx` +
 * `AppShell.stories.tsx` are deleted as part of this same change, not left
 * behind as a duplicate.
 *
 * WHY THIS IS A LAYOUT AND NOT A PAGE (RULE 12). It answers "what wraps every
 * route", not "what does the user come here to do": it mounts once at the
 * root and outlives every route the router swaps underneath it. `children`
 * is MANDATORY and real — this is the one place `ReactNode` is valid above
 * frame tier.
 *
 * ⭐ WHAT THE REAL `InnerLayout.tsx` ALSO DOES, DELIBERATELY NOT REBUILT HERE
 * (§B3 scope discipline, documented gaps rather than faked with a div):
 *   • Provider tree (`NextThemesProvider`/`HeroUIProvider`/`ReduxProvider`/
 *     `SwrProvider` + their side-effect hooks) — app wiring, not a design-
 *     system concern; a Storybook tree supplies its own provider shell.
 *   • `ContentAiChatRail` docked beside the app column, gated by viewport +
 *     route (`isAssessmentLive`) + the chat-open Zustand store — same
 *     "global mount point, no honest placeholder" gap `AppShell`'s own
 *     header already flagged.
 *   • `ModalContainer`/`DrawerContainer`/`CookieConsentBanner`/`ToastProvider`/
 *     `SocketConnectionStatus` — the 26-overlay global mount surface (canon
 *     Rule 13) plus app-level side-effect widgets; none of these are blocks
 *     this layout composes, they are siblings mounted at the same level in
 *     the real tree.
 *   • `showFooter` in the real file is COMPUTED from `usePathname()` (footer
 *     only on `/`, `/home` and their locale variants); this layout takes it
 *     as a plain boolean prop instead — router access is app wiring, the
 *     same discipline `NavLinks`/`Navbar` already apply to their own
 *     navigation callbacks.
 *
 * `gap={1}` IS DELIBERATE, NOT AN OMISSION. Navbar and Footer are
 * expected to draw their OWN edge (`border-b` / `border-t`) — confirmed
 * against the real component's own borders on both blocks. A `section`-gap
 * here would show a blank strip before the sticky nav's border starts,
 * which is wrong for site chrome (as opposed to `HeadhuntingCompaniesLayout`'s
 * rail-beside-content, which genuinely wants a visible gutter).
 *
 * `<main className="flex-1">` GROWS TO PUSH THE FOOTER DOWN on a short page —
 * the same `flex-1` idiom `HeadhuntingCompaniesLayout`'s content column and
 * `WorkSessionHeader`'s spacer already use, not a new hand-rolled flex box:
 * the `flex flex-col` direction and the (zero) gap both come from the
 * `StackV` this sits inside.
 *
 * ⭐ ANATOMY. `Navbar`/`Footer` are badged DIRECTLY on themselves (not on a
 * synthetic wrapper `div`) — the corrected pattern `HeadhuntingCompaniesLayout`
 * settled on. `children` is a CALLER SLOT and is deliberately left unbadged.
 *
 * TWO LEAVES, by STRUCTURE: `Footer` shown vs. hidden (`showFooter` gains or
 * loses a whole composed node). `children` always renders and Navbar always
 * renders — neither ever disappears, so neither earns a leaf of its own,
 * only whatever `children` demo content a story chooses to show as a STATE.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link InnerLayout}. */
export interface InnerLayoutProps extends NavbarProps, Omit<FooterProps, "className" | "anatPart" | "showAnatomy"> {
    /**
     * The active route's content. MANDATORY (RULE 12) — the shell itself
     * never changes shape across routes; only what fills this slot does.
     */
    children: ReactNode
    /**
     * Whether the marketing Footer renders below the content for this route.
     * The CALLER computes the pathname match (the real `InnerLayout` derives
     * this from `usePathname()`, which is app wiring, out of scope here) —
     * this layout only obeys the flag.
     */
    showFooter: boolean
    /** Extra class on the root track. */
    className?: string
}

/**
 * The app-wide shell: sticky nav, routed content, conditional footer. See the
 * file header for why it is a layout, the deliberate `flush` seam, and the
 * documented gaps against the real `src/app/InnerLayout.tsx`.
 *
 * @param props - {@link InnerLayoutProps}
 */
const InnerLayout = ({
    children,
    showFooter,
    exploreLinks,
    supportLinks,
    socials,
    onTermsPress,
    onPrivacyPress,
    className,
    ...navbarProps
}: InnerLayoutProps) => {
    const navMainFooter = (
        <>
            {/* Sticky positioning is a SHELL concern (only the root scroll container knows
                where the nav should pin) — Navbar itself owns its own border/background. */}
            <div className="sticky top-0 z-40">
                <Navbar
                    {...(navbarProps as NavbarProps)}


                />
            </div>
            {/* CALLER SLOT — deliberately unbadged, see file header. */}
            <main className="min-w-0 flex-1">{children}</main>
            {showFooter ? (
                <Footer
                    exploreLinks={exploreLinks}
                    supportLinks={supportLinks}
                    socials={socials}
                    onTermsPress={onTermsPress}
                    onPrivacyPress={onPrivacyPress}


                />
            ) : null}
            {/* Overlay/chat-rail/provider global mount points — intentionally NOT
                rendered here, see file header's §B3 gap note. */}
        </>
    )

    return (
        <StackV gap={1} className={cn("min-h-dvh", className)} body={navMainFooter} />
    )
}

export { InnerLayout }
