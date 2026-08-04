import type { Meta, StoryObj } from "@storybook/nextjs"
import { MarketingNavbar, type MarketingNavbarAnchor } from "@sb-components/nivo/blocks/landing/MarketingNavbar/MarketingNavbar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `MarketingNavbar` — the public landing top bar: wordmark + in-page anchors +
 * a secondary sign-in button (no primary — that lives in the hero). It has one
 * resting shape, so the one leaf renders its default state.
 */
const meta: Meta<typeof MarketingNavbar> = {
    title: "Nivo/Blocks/Landing/MarketingNavbar/MarketingNavbar",
    component: MarketingNavbar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MarketingNavbar>

const NOOP = () => {}

const ANCHORS: Array<MarketingNavbarAnchor> = [
    { id: "products", label: "Products" },
    { id: "how-it-works", label: "How it works" },
    { id: "faq", label: "FAQ" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    StackH: { tier: "frame", role: "the left group: wordmark beside the anchor row" },
    Cluster: { tier: "frame", role: "the in-page section anchors" },
    Typography: { tier: "atom", role: "the wordmark and each anchor link" },
    Button: { tier: "atom", role: "the secondary sign-in action" },
}

/** LEAF — the navbar has one resting shape; this renders its default. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MarketingNavbar"
                tier="block"
                leaf="Navbar"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. The navbar carries no primary CTA — the landing's one primary belongs to the hero — so its shape does not vary with auth or scroll state: a wordmark, the in-page section anchors, and a single secondary sign-in button. Its one leaf renders that resting default."
                states={[
                    {
                        name: "default",
                        why: "The public landing top bar as a guest sees it: the wordmark, three section anchors, and the sign-in affordance on the right.",
                        code: `<MarketingNavbar
    wordmark="nivo"
    anchors={anchors}
    signInLabel="Sign in"
    onSignIn={openAuth}
/>`,
                        render: (
                            <MarketingNavbar
                                wordmark="nivo"
                                anchors={ANCHORS}
                                signInLabel="Sign in"
                                onSignIn={NOOP}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
