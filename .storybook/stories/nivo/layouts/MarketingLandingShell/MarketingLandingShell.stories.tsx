import type { Meta, StoryObj } from "@storybook/nextjs"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { MarketingLandingShell } from "@sb-components/nivo/layouts/MarketingLandingShell/MarketingLandingShell"
import type { FooterProps } from "@sb-components/nivo/blocks/landing/Footer/Footer"
import type { MarketingNavbarProps } from "@sb-components/nivo/blocks/landing/MarketingNavbar/MarketingNavbar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `MarketingLandingShell` — the LAYOUT the public `/` landing route sits in:
 * `MarketingNavbar` on top, the route's own section stack in the CENTER,
 * `Footer` closing it, and a floating `BackToTop`. `content` is the one slot
 * a route's shape enters — mirrors `DashboardShell`'s own `content` slot, so
 * `isSkeleton` (loaded vs loading) is the only structural state a story maps.
 * `AnatomyTier` has no `layout` member, so this story passes `tier="screen"`
 * (story.md: a layout's story is the top arrangement tier).
 */
const meta: Meta<typeof MarketingLandingShell> = {
    title: "Nivo/Layouts/MarketingLandingShell/MarketingLandingShell",
    component: MarketingLandingShell,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MarketingLandingShell>

/** The real app's four in-page anchors, matching `MarketingNavbar`'s own story. */
const NAVBAR: MarketingNavbarProps = {
    wordmark: "nivo",
    anchors: [
        { id: "how", label: "How it works" },
        { id: "pricing", label: "Pricing" },
        { id: "solutions", label: "Solutions" },
        { id: "faq", label: "FAQ" },
    ],
    signInLabel: "Log in",
    onSignIn: () => {},
}

const FOOTER: FooterProps = {
    wordmark: "nivo",
    tagline: "AI-First business infrastructure for Vietnamese SMEs.",
    linksHeading: "Products",
    links: [
        { id: "academy", label: "AI Academy", href: "#products" },
        { id: "agent", label: "nivo AI Agent", href: "#products" },
        { id: "pricing", label: "Pricing", href: "#pricing" },
    ],
    contact: "© nivo · Need help? Sign in and open Support in your account.",
}

/**
 * Stand-in for the real route's own section stack — this shell never knows
 * what it is. Mirrors its own loaded shape while `isSkeleton`, so the center
 * column does not jump when the route resolves. Same restraint as
 * `DashboardShell`'s own `MockRouteContent`.
 */
const MockRouteContent = ({ isSkeleton }: SkeletonProps) => (
    <div data-tier="fixture" className="flex flex-col gap-6 px-6 py-16">
        <div className={`h-10 w-2/3 rounded-lg ${isSkeleton ? "animate-pulse bg-default" : "bg-surface-secondary"}`} />
        <div className={`h-5 w-1/2 rounded-md ${isSkeleton ? "animate-pulse bg-default" : "bg-surface-secondary"}`} />
        <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1].map((panel) => (
                <div key={panel} className={`h-40 rounded-2xl ${isSkeleton ? "animate-pulse bg-default" : "bg-surface shadow-surface"}`} />
            ))}
        </div>
    </div>
)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "MarketingNavbar": { tier: "block", role: "the dark top bar — wordmark, in-page anchors, sign-in — pinned above the section stack", storyId: "nivo-blocks-landing-marketingnavbar-marketingnavbar--default" },
    "Footer": { tier: "block", role: "closes the route: brand + tagline, product links, contact line", storyId: "nivo-blocks-landing-footer-footer--default" },
    "BackToTop": { tier: "atom", role: "floats bottom-end, revealed once the reader scrolls past the fold — this shell owns the fixed placement, the atom does not", storyId: "atoms-buttons-backtotop-backtotop--default" },
}

/** LEAF — the shell has one shape; `isSkeleton` (loaded vs loading) is the only structural state. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MarketingLandingShell"
                tier="screen"
                leaf="Marketing landing shell"
                annotate={ANNOTATE}
                reason="A layout composes CONNECTED children and owns the shell, not the content. Here the shell is `MarketingNavbar` on top, the route's section stack in the CENTER, `Footer` at the foot, and a floating `BackToTop` this shell places itself. `content` is a buildable `ComponentTypeWithSkeleton` slot (not a `ReactNode`), so one `isSkeleton` flag shimmers the center column from the same tree — the same convention `DashboardShell` uses for its own `content` slot."
                states={[
                    {
                        name: "content resolved",
                        why: "The resolved shell: the dark navbar, the route's own section stack leading in the center, and the footer closing it. Shown inside a wide fixture so the shell reads at its real width.",
                        code: `<MarketingLandingShell
    navbar={navbar}
    footer={footer}
    content={RouteContent}
    backToTopLabel="Back to top"
/>`,
                        render: (
                            <div data-tier="fixture" style={{ width: "72rem", maxWidth: "100%" }}>
                                <MarketingLandingShell navbar={NAVBAR} footer={FOOTER} content={MockRouteContent} backToTopLabel="Back to top" />
                            </div>
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The route's section data has not resolved. The shell threads its own `isSkeleton` into ONLY the `content` slot: the center column mirrors its own loaded shape while the navbar and footer stay live, since the shell's own wordmark/anchors/links are always known — the same split `DashboardShell` makes for its top bar.",
                        code: `<MarketingLandingShell
    navbar={navbar}
    footer={footer}
    content={RouteContent}
    backToTopLabel="Back to top"
    isSkeleton
/>`,
                        render: (
                            <div data-tier="fixture" style={{ width: "72rem", maxWidth: "100%" }}>
                                <MarketingLandingShell navbar={NAVBAR} footer={FOOTER} content={MockRouteContent} backToTopLabel="Back to top" isSkeleton />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
