import type { Meta, StoryObj } from "@storybook/nextjs"
import { Footer, type FooterLink } from "@sb-components/nivo/blocks/landing/Footer/Footer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Footer` — the landing footer: a brand column beside the product route links,
 * closed by a contact line. One resting shape; the leaf renders its default,
 * with the streamlined two-product catalog as the links.
 */
const meta: Meta<typeof Footer> = {
    title: "Nivo/Blocks/Landing/Footer/Footer",
    component: Footer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Footer>

const LINKS: Array<FooterLink> = [
    { id: "nivo-ai-academy", label: "AI Academy", href: "/catalog?product=nivo-ai-academy" },
    { id: "nivo-ai-agent", label: "nivo AI Agent", href: "/catalog?product=nivo-ai-agent" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Container: { tier: "frame", role: "the width-capped footer column" },
    Grid: { tier: "frame", role: "the brand column beside the links column" },
    StackV: { tier: "frame", role: "each column's stack and the outer contact rhythm" },
    Typography: { tier: "atom", role: "the wordmark, tagline, links heading, each link, and the contact line" },
}

/** LEAF — the footer has one resting shape; this renders its default. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Footer"
                tier="block"
                leaf="Footer"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. Every route arrives as a resolved href, so the footer owns only the arrangement, never a destination of its own. Its one leaf renders the resting shape: the brand column, the two-product link column, and the contact line."
                states={[
                    {
                        name: "default",
                        why: "The landing footer with the streamlined catalog: the brand wordmark and tagline beside links to the two real products, closed by the contact line.",
                        code: `<Footer
    wordmark="nivo"
    tagline={tagline}
    linksHeading="Products"
    links={links}
    contact={contact}
/>`,
                        render: (
                            <Footer
                                wordmark="nivo"
                                tagline="The platform for launching AI products you actually own."
                                linksHeading="Products"
                                links={LINKS}
                                contact="Ho Chi Minh City, Vietnam - hello@nivo.vn"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
