import React from "react"
import type { ReactNode } from "react"
import { Navbar, type NavbarProps } from "@/components/starci/blocks/navigation/Navbar"
import { Footer, type FooterProps } from "@/components/starci/blocks/navigation/Footer"
import { StackV } from "@/components/frames/Stack"
import { PinnedTrack } from "@/components/frames/PinnedTrack"
import { Box } from "@/components/frames/Box"

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
    const trackAndFooter = [
        // Sticky nav pinned above the flex-1 routed content — a `PinnedTrack`
        // (pin-then-fill vertical track). `landmark` renders the fill member as this
        // page's ONE `<main>`; `classNames={["flex-1"]}` lets the whole track (not just
        // its own inner `body`) grow to fill the remaining height at THIS level, the
        // same role `main`'s own `flex-1` played before the shape moved into the frame.
        () => (
            <PinnedTrack
                pinned={() => <Navbar {...(navbarProps as NavbarProps)} />}
                body={() => <>{children}</>}
                landmark
                classNames={["flex-1"]}
            />
        ),
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
        <Box className="min-h-dvh" identity={{ tier: "layout", component: "InnerLayout" }}>
            <StackV gap={1} items={trackAndFooter} />
        </Box>
    )
}

export { _InnerLayout }
