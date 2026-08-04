import type { Meta, StoryObj } from "@storybook/nextjs"
import { PartnerStrip, type PartnerStripChip } from "@sb-components/nivo/blocks/landing/PartnerStrip/PartnerStrip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PartnerStrip` — the "partner nivo is not just a reseller" ecosystem beat:
 * a centered header over a wrapping row of ecosystem chips. Feeding a
 * shorter chip list proves the row reflows on real data, not a fixed
 * four-chip layout.
 */
const meta: Meta<typeof PartnerStrip> = {
    title: "Nivo/Blocks/Landing/PartnerStrip/PartnerStrip",
    component: PartnerStrip,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PartnerStrip>

const COPY = {
    eyebrow: "Ecosystem",
    title: "Partner nivo is not just a reseller.",
    intro: "Agencies, freelancers, and consultants deliver on the nivo platform and playbook — white-label and marketplace are opening up gradually.",
}

// The four ecosystem chips this row is grounded in (proposal §5 PartnerStrip
// brief) — the whole program is roadmap, no partner signup exists in the real
// catalog yet.
const FOUR_CHIPS: Array<PartnerStripChip> = [
    { key: "program", label: "Partner Program" },
    { key: "white-label", label: "White-label" },
    { key: "marketplace", label: "Marketplace" },
    { key: "certified", label: "Certified Partner" },
]

// A shorter row (two chips) — the strip reflows on real DATA, not a fixed
// four-chip shape.
const TWO_CHIPS: Array<PartnerStripChip> = FOUR_CHIPS.slice(0, 2)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SectionHeading: { tier: "block", role: "the centered eyebrow / title / intro header", storyId: "nivo-blocks-landing-sectionheading-sectionheading--align" },
    Cluster: { tier: "frame", role: "the wrapping row of ecosystem chips" },
    StackV: { tier: "frame", role: "the header / chip-row rhythm" },
    Chip: { tier: "atom", role: "each ecosystem chip" },
}

/** LEAF — `chips`: the ecosystem row; a shorter list proves the row is driven by data, not a fixed count. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PartnerStrip"
                tier="block"
                leaf="chips"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. The whole ecosystem program is roadmap today — that honesty lives in the caller's `intro` copy, never a badge this block invents. Feeding fewer chips reflows the same wrapping row instead of leaving a fixed four-chip shape, proving the count comes from `chips.length`."
                states={[
                    {
                        name: "four chips (the grounded default)",
                        why: "The real ecosystem row: Partner Program, White-label, Marketplace, and Certified Partner, all roadmap.",
                        code: `<PartnerStrip
    eyebrow="Ecosystem"
    title="Partner nivo is not just a reseller."
    intro={intro}
    chips={[
        { key: "program", label: "Partner Program" },
        { key: "white-label", label: "White-label" },
        { key: "marketplace", label: "Marketplace" },
        { key: "certified", label: "Certified Partner" },
    ]}
/>`,
                        render: <PartnerStrip {...COPY} chips={FOUR_CHIPS} />,
                    },
                    {
                        name: "two chips",
                        why: "A shorter ecosystem list still lays out cleanly — the row reflows from real data instead of assuming a fixed four-chip shape.",
                        code: "<PartnerStrip {...copy} chips={fourChips.slice(0, 2)} />",
                        render: <PartnerStrip {...COPY} chips={TWO_CHIPS} />,
                    },
                ]}
            />
        </div>
    ),
}
