import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { FillAvailable } from "@/components/frames/FillAvailable"
import { PinnedTrack } from "@/components/frames/PinnedTrack"
import { ViewportShell } from "@/components/frames/ViewportShell"

/**
 * `InnerLayout` — the wrapper for every route in the app. It only composes
 * shell regions: sticky nav, routed body, conditional footer. Callers build
 * those regions (or the connected twin wires their data) and pass them as
 * typed slots — this layout does not inherit Navbar/Footer props.
 */

/** Props for {@link _InnerLayout}. */
export interface InnerLayoutProps {
    /** Sticky top chrome region (typically a built `Navbar`). */
    navbar: ComponentTypeWithSkeleton
    /** Active route content region. */
    body: ComponentTypeWithSkeleton
    /**
     * Marketing footer region. Rendered only when `showFooter` is true — pass
     * the built footer whenever the route may opt in.
     */
    footer?: ComponentTypeWithSkeleton
    /**
     * Whether the marketing Footer renders below the content for this route.
     * The CALLER computes the pathname match (the real `InnerLayout` derives
     * this from `usePathname()`, which is app wiring, out of scope here) —
     * this layout only obeys the flag.
     */
    showFooter: boolean
}

/**
 * The app-wide shell: sticky nav, routed content, conditional footer.
 *
 * @param props - {@link InnerLayoutProps}
 */
const _InnerLayout = ({
    navbar: NavbarSlot,
    body: BodySlot,
    footer: FooterSlot,
    showFooter,
}: InnerLayoutProps) => {
    return (
        <ViewportShell
            identity={{ tier: "layout", component: "InnerLayout" }}
            body={() => (
                <FillAvailable
                    at="base"
                    explain="Shell track consumes remaining viewport height beside the optional footer — not a fixed-size peer."
                    body={() => (
                        <PinnedTrack
                            pinned={NavbarSlot}
                            body={BodySlot}
                            landmark
                            principle="layout-split"
                            explain="Pin-then-fill roles inside one track — not sibling-stack, because nav and body are complementary halves of one shell column rather than same-kind peers."
                        />
                    )}
                />
            )}
            footer={showFooter ? FooterSlot : undefined}
        />
    )
}

export { _InnerLayout }
