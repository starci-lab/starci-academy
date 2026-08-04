import type { Meta, StoryObj } from "@storybook/nextjs"
import { LandingFooter, type LandingFooterLink } from "@sb-components/nivoexpert/blocks/landing/LandingFooter/LandingFooter"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LandingFooter` — closes the tenant landing: the expert's brand name beside
 * the same in-page anchors the nav offers, over a quiet "made with nivo"
 * mark. One resting shape; the leaf renders its default. Formalises the
 * `<footer>` markup (a quiet "made with nivo" mark) duplicated across the
 * three retiring presets (`app/landings/Classic.tsx`, `Bold.tsx`, `Minimal.tsx`)
 * into one component the single `TenantLandingShell` renders once.
 *
 * HeroUI: composes the house `Typography` atom and `Container`/`Cluster`/
 * `StackV` frames — the same vocabulary `nivo/blocks/landing/Footer` builds
 * its own footer from. Every colour resolves through `apps/expert`'s
 * `--nivo-*` → HeroUI bridge (`globals.css`), so this fixture renders
 * correctly with no host `:root` override present.
 */
const meta: Meta<typeof LandingFooter> = {
    title: "NivoExpert/Blocks/Landing/LandingFooter/LandingFooter",
    component: LandingFooter,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LandingFooter>

const LINKS: Array<LandingFooterLink> = [
    { id: "courses", label: "Courses", href: "#courses" },
    { id: "community", label: "Community", href: "#community" },
    { id: "contact", label: "Contact", href: "#contact" },
]

/** LEAF — the footer has one resting shape; this renders its default. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LandingFooter"
                tier="block"
                leaf="LandingFooter"
                reason="Blocks take no `className`. Every link arrives as a resolved href, so the footer owns only the arrangement, never a destination of its own — the same `Cluster` `separator` prop puts a `·` between the brand name and each link, N items get N-1 marks, without the footer hand-writing a dot span. No `isSkeleton`: the brand name is resolved server-side before the shell ever paints, so — like the shell's own nav — the footer's shape is always known."
                states={[
                    {
                        name: "default",
                        why: "The closing footer: the expert's brand name, the same three in-page anchors the nav offers, and the quiet closing mark.",
                        code: `<LandingFooter
    brandName="An Nguyen"
    links={links}
    markLabel="Made with nivo"
/>`,
                        render: (
                            <div data-tier="fixture" className="bg-background">
                                <LandingFooter brandName="An Nguyen" links={LINKS} markLabel="Made with nivo" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
