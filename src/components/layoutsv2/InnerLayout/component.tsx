import React from "react"
import type { ReactNode } from "react"
import { Navbar, type NavbarProps } from "@/components/starci/blocks/navigation/Navbar"
import { Footer, type FooterProps } from "@/components/starci/blocks/navigation/Footer"
import { StackV } from "@/components/frames/Stack"

/**
 * `InnerLayout` — the wrapper for every route in the app. `children` is a real
 * slot: the shell stays mounted while the routed page underneath changes. Two
 * structural leaves: `showFooter` gains or loses a whole composed node (the
 * Footer), so it is a leaf rather than a state — the Footer's own shape never
 * changes, it is simply present or gone.
 */

/** Props for {@link _InnerLayout}. */
export interface InnerLayoutProps extends Omit<NavbarProps, "className">, Omit<FooterProps, "className"> {
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
}

/**
 * The app-wide shell: sticky nav, routed content, conditional footer. See the
 * file header for why it is a layout, the deliberate `flush` seam, and the
 * documented gaps against the real `src/app/InnerLayout.tsx`.
 *
 * @param props - {@link InnerLayoutProps}
 */
const _InnerLayout = ({
    children,
    showFooter,
    exploreLinks,
    supportLinks,
    socials,
    onTermsPress,
    onPrivacyPress,
    ...navbarProps
}: InnerLayoutProps) => {
    const navMainFooter = [
        // Sticky positioning is a SHELL concern (only the root scroll container knows
        // where the nav should pin) — Navbar itself owns its own border/background.
        () => (
            <div className="sticky top-0 z-40">
                <Navbar {...(navbarProps as NavbarProps)} />
            </div>
        ),
        // CALLER SLOT — deliberately unbadged, see file header.
        () => <main className="min-w-0 flex-1">{children}</main>,
        ...(showFooter ? [() => (
            <Footer
                exploreLinks={exploreLinks}
                supportLinks={supportLinks}
                socials={socials}
                onTermsPress={onTermsPress}
                onPrivacyPress={onPrivacyPress}
            />
        )] : []),
        // Overlay/chat-rail/provider global mount points — intentionally NOT
        // rendered here, see file header's §B3 gap note.
    ]

    return (
        <div data-tier="layout" data-component="InnerLayout">
            <div className="min-h-dvh">
                <StackV gap={1} items={navMainFooter} />
            </div>
        </div>
    )
}

export { _InnerLayout }
