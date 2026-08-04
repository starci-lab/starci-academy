import type { Meta, StoryObj } from "@storybook/nextjs"
import { SolutionByIndustry, type SolutionByIndustryItem } from "@sb-components/nivo/blocks/landing/SolutionByIndustry/SolutionByIndustry"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SolutionByIndustry` — the "every industry needs a different playbook"
 * roadmap beat: one card per industry line the operating loop is heading
 * toward. Exactly one card (`nivo Academy`) is buyable today, and that is
 * DATA (`isAvailableToday`) — feeding the same six industries with the flag
 * cleared everywhere proves the "available today" badge is never hardcoded
 * to a fixed card.
 */
const meta: Meta<typeof SolutionByIndustry> = {
    title: "Nivo/Blocks/Landing/SolutionByIndustry/SolutionByIndustry",
    component: SolutionByIndustry,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SolutionByIndustry>

const COPY = {
    eyebrow: "Solutions by industry",
    title: "Every industry needs a different playbook.",
    intro: "Where nivo's system is heading, industry by industry. Today it starts with AI Academy and AI Agent; the rest opens up as the operating loop grows.",
}

// The six industry lines this grid is grounded in (proposal §5): only Academy
// is buyable today (business-parity, the real two-product catalog), the
// other five are the roadmap the same loop grows into.
const SIX_INDUSTRIES_ACADEMY_AVAILABLE: Array<SolutionByIndustryItem> = [
    {
        key: "academy",
        industry: "nivo Academy",
        statusLabel: "Available today",
        isAvailableToday: true,
        painPoint: "Enrollment leads fall through the cracks",
        systemLine: "Landing → Student CRM → automation → dashboard",
    },
    {
        key: "web",
        industry: "nivo Web",
        statusLabel: "Not buyable yet",
        painPoint: "The website doesn't generate leads",
        systemLine: "Website + form + CRM + follow-up + dashboard",
    },
    {
        key: "b2b",
        industry: "nivo B2B Service",
        statusLabel: "Not buyable yet",
        painPoint: "High-ticket leads get forgotten",
        systemLine: "Website + audit form + CRM pipeline + AI sales",
    },
    {
        key: "booking",
        industry: "nivo Booking",
        statusLabel: "Not buyable yet",
        painPoint: "No-shows, customers don't come back",
        systemLine: "Booking + reminder + CRM + after-care",
    },
    {
        key: "expert",
        industry: "nivo Expert",
        statusLabel: "Not buyable yet",
        painPoint: "Expertise hasn't become a funnel",
        systemLine: "Expert site + lead magnet + booking + AI content",
    },
    {
        key: "partner",
        industry: "nivo Partner",
        statusLabel: "Not buyable yet",
        painPoint: "One-off projects, hard to make recurring",
        systemLine: "White-label + marketplace + partner dashboard",
    },
]

// Same six industries, `isAvailableToday` cleared on every one — proves the
// success-toned badge is per-item data, not fixed to the first card's position.
const SIX_INDUSTRIES_NONE_AVAILABLE: Array<SolutionByIndustryItem> = SIX_INDUSTRIES_ACADEMY_AVAILABLE.map((item) => ({
    ...item,
    isAvailableToday: false,
    statusLabel: "Not buyable yet",
}))

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SectionHeading: { tier: "block", role: "the centered eyebrow / title / intro header", storyId: "nivo-blocks-landing-sectionheading-sectionheading--align" },
    Grid: { tier: "frame", role: "the six industry cards, 3 columns from `md`" },
    SurfaceCard: { tier: "composite", role: "each industry's card" },
    StackH: { tier: "frame", role: "each card's industry name + status badge row" },
    StackV: { tier: "frame", role: "the header/grid rhythm, and each card's name-row / pain-point / system-line stack" },
    Typography: { tier: "atom", role: "each industry's name, pain point, and system line" },
    Chip: { tier: "atom", role: "each card's status badge — success tone when available today, warning tone as the roadmap default" },
}

/** LEAF — `isAvailableToday`: full coverage of both values of the per-item availability flag. */
export const Availability: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SolutionByIndustry"
                tier="block"
                leaf="isAvailableToday"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. Whether a card's status badge reads as buyable-today (success tone) or roadmap (warning tone, the default) is DATA — the block never hardcodes which position is `the real one`. Feeding the same six industries with the flag cleared everywhere proves the badge is per-item data, not a fixed first-card rule."
                states={[
                    {
                        name: "nivo Academy isAvailableToday",
                        why: "The real catalog: only nivo Academy is buyable today, so it is the one card carrying the success-toned \"Available today\" badge among the six.",
                        code: `<SolutionByIndustry
    eyebrow="Solutions by industry"
    title="Every industry needs a different playbook."
    intro={intro}
    items={[
        { key: "academy", industry: "nivo Academy", statusLabel: "Available today", isAvailableToday: true, painPoint: "Enrollment leads fall through the cracks", systemLine: "Landing → Student CRM → automation → dashboard" },
        { key: "web", industry: "nivo Web", statusLabel: "Not buyable yet", painPoint: "The website doesn't generate leads", systemLine: "Website + form + CRM + follow-up + dashboard" },
        // …
    ]}
/>`,
                        render: <SolutionByIndustry {...COPY} items={SIX_INDUSTRIES_ACADEMY_AVAILABLE} />,
                    },
                    {
                        name: "isAvailableToday unset on every card",
                        why: "No industry stands out — every card reads as roadmap, proving the availability badge is a per-item flag the caller controls rather than a fixed first-card rule.",
                        code: "<SolutionByIndustry {...copy} items={sixIndustriesWithNoAvailability} />",
                        render: <SolutionByIndustry {...COPY} items={SIX_INDUSTRIES_NONE_AVAILABLE} />,
                    },
                ]}
            />
        </div>
    ),
}
