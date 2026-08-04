import type { Meta, StoryObj } from "@storybook/nextjs"
import type { SkeletonProps } from "@sb-components/composites/_slot"
import { TenantLandingShell, type TenantNavLink } from "@sb-components/nivoexpert/layouts/TenantLandingShell/TenantLandingShell"
import type { LandingFooterLink, LandingFooterProps } from "@sb-components/nivoexpert/blocks/landing/LandingFooter/LandingFooter"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `TenantLandingShell` — the LAYOUT the public `apps/expert` `/` landing
 * route sits in: a sticky brand nav (brand mark, in-page anchors, sign-in +
 * enrol) on top, the route's own section stack in the CENTER, `LandingFooter`
 * closing it, a floating `BackToTopButton`, and a mobile-only sticky enrol
 * bar. `content` is the one slot a route's shape enters — mirrors
 * `nivo/layouts/MarketingLandingShell`'s own `content` slot, so `isSkeleton`
 * (loaded vs loading) is the only structural state a story maps.
 * `AnatomyTier` has no `layout` member, so this story passes `tier="screen"`
 * (story.md: a layout's story is the top arrangement tier).
 *
 * HeroUI: composes the house `Avatar`/`Button`/`Typography` atoms and
 * `Cluster`/`StackH` frames — every colour resolves through `apps/expert`'s
 * `--nivo-*` → HeroUI bridge, so the fixture below renders correctly with NO
 * host `:root` override present (this story), same as the real per-tenant
 * override would apply on top.
 */
const meta: Meta<typeof TenantLandingShell> = {
    title: "NivoExpert/Layouts/TenantLandingShell/TenantLandingShell",
    component: TenantLandingShell,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof TenantLandingShell>

/** The real app's three in-page anchors (proposal §4: courses / community / contact). */
const NAV_LINKS: Array<TenantNavLink> = [
    { id: "courses", label: "Courses", href: "#courses" },
    { id: "community", label: "Community", href: "#community" },
    { id: "contact", label: "Contact", href: "#contact" },
]

const FOOTER_LINKS: Array<LandingFooterLink> = [
    { id: "courses", label: "Courses", href: "#courses" },
    { id: "community", label: "Community", href: "#community" },
    { id: "contact", label: "Contact", href: "#contact" },
]

const FOOTER: LandingFooterProps = {
    brandName: "An Nguyen",
    links: FOOTER_LINKS,
    markLabel: "Made with nivo",
}

/**
 * Stand-in for the route's own section stack (hero → catalog → trust row →
 * lead capture, each built by its own block) — this shell never knows what
 * it is. Mirrors its own loaded shape while `isSkeleton`, so the center
 * column does not jump when the route resolves. House Tailwind tokens, the
 * same ones the real blocks in `content` would read.
 */
const MockRouteContent = ({ isSkeleton }: SkeletonProps) => (
    <div data-tier="fixture" className="flex flex-col gap-6 px-8 py-16">
        <div className={`mx-auto h-10 w-3/5 rounded-lg ${isSkeleton ? "bg-default" : "bg-accent/25"}`} />
        <div className="mx-auto h-4 w-2/5 rounded-md bg-default" />
        <div className="mt-4 grid grid-cols-3 gap-4">
            {[0, 1, 2].map((card) => (
                <div key={card} className={`h-36 rounded-3xl border border-default ${isSkeleton ? "bg-default" : "bg-surface"}`} />
            ))}
        </div>
    </div>
)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    LandingFooter: {
        tier: "block",
        role: "closes the route: brand name, the same three in-page anchors the nav offers, the closing mark",
        storyId: "nivoexpert-blocks-landing-landingfooter-landingfooter--default",
    },
    BackToTopButton: {
        tier: "atom",
        role: "floats bottom-end, revealed once the reader scrolls past the hero fold — this shell owns the fixed placement, the atom does not",
        storyId: "nivoexpert-atoms-backtotopbutton-backtotopbutton--default",
    },
}

/** LEAF — the shell has one shape; `isSkeleton` (loaded vs loading) is the only structural state. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TenantLandingShell"
                tier="screen"
                leaf="Tenant landing shell"
                annotate={ANNOTATE}
                reason="A layout composes CONNECTED children and owns the shell, not the content. Here the shell is the brand nav on top (anchors + sign-in + enrol, both actions always visible, only the anchor row drops below `@app-md`), the route's own section stack in the CENTER, `LandingFooter` at the foot, a floating `BackToTopButton`, and a mobile-only sticky enrol bar the shell places itself. `content` is a buildable `ComponentTypeWithSkeleton` slot (not a `ReactNode`), so one `isSkeleton` flag shimmers the center column from the same tree — the same convention `MarketingLandingShell` uses for its own `content` slot."
                states={[
                    {
                        name: "content resolved",
                        why: "The resolved shell: the sticky nav with the brand mark + three anchors + sign-in/enrol actions, the route's own section stack leading in the center, and the footer closing it. Shown inside a wide fixture so the shell reads at its real width.",
                        code: `<TenantLandingShell
    brandName="An Nguyen"
    navLinks={navLinks}
    loginLabel="Log in"
    onLogin={openAuth}
    enrolLabel="Start learning"
    onEnrol={scrollToCourses}
    footer={footer}
    content={RouteContent}
    backToTopLabel="Back to top"
/>`,
                        render: (
                            <div data-tier="fixture" style={{ width: "72rem", maxWidth: "100%" }}>
                                <TenantLandingShell
                                    brandName="An Nguyen"
                                    navLinks={NAV_LINKS}
                                    loginLabel="Log in"
                                    onLogin={() => {}}
                                    enrolLabel="Start learning"
                                    onEnrol={() => {}}
                                    footer={FOOTER}
                                    content={MockRouteContent}
                                    backToTopLabel="Back to top"
                                />
                            </div>
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The route's own section data has not resolved. The shell threads its own `isSkeleton` into ONLY the `content` slot: the center column mirrors its own loaded shape while the nav, footer and sticky bar stay live, since the shell's own brand name/anchors/links are resolved server-side before the shell ever paints (`apps/expert/app/page.tsx`) — the same split `MarketingLandingShell` makes between its always-known chrome and its routed content.",
                        code: `<TenantLandingShell
    brandName="An Nguyen"
    navLinks={navLinks}
    loginLabel="Log in"
    onLogin={openAuth}
    enrolLabel="Start learning"
    onEnrol={scrollToCourses}
    footer={footer}
    content={RouteContent}
    backToTopLabel="Back to top"
    isSkeleton
/>`,
                        render: (
                            <div data-tier="fixture" style={{ width: "72rem", maxWidth: "100%" }}>
                                <TenantLandingShell
                                    brandName="An Nguyen"
                                    navLinks={NAV_LINKS}
                                    loginLabel="Log in"
                                    onLogin={() => {}}
                                    enrolLabel="Start learning"
                                    onEnrol={() => {}}
                                    footer={FOOTER}
                                    content={MockRouteContent}
                                    backToTopLabel="Back to top"
                                    isSkeleton
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
