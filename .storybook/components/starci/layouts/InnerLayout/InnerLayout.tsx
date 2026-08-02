import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Navbar, type NavbarProps } from "@sb-components/starci/blocks/navigation/Navbar/Navbar"
import { Footer, type FooterProps } from "@sb-components/starci/blocks/navigation/Footer/Footer"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `InnerLayout` — the root wrapper for every route: a sticky Navbar on top, the
 * routed page in between, and a marketing Footer shown or hidden per route via
 * `showFooter`. `main` grows to push the footer down on short pages. Takes a
 * mandatory `children`; Navbar and Footer draw their own edges, so the stack sits
 * flush against them.
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
    const navMainFooter = [
        // Sticky positioning is a SHELL concern (only the root scroll container knows
        // where the nav should pin) — Navbar itself owns its own border/background.
        () => (
            <div className="sticky top-0 z-40">
                <Navbar
                    {...(navbarProps as NavbarProps)}


                />
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
        <StackV gap={1} className={cn("min-h-dvh", className)} items={navMainFooter} />
    )
}

export { InnerLayout }
