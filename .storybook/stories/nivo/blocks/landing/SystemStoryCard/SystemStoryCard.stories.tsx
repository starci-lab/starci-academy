import type { Meta, StoryObj } from "@storybook/nextjs"
import { SystemStoryCard } from "@sb-components/nivo/blocks/landing/SystemStoryCard/SystemStoryCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `SystemStoryCard` — the landing's honest before/after narrative: a
 * pain-point column, an outcome column, and a disclaimer making clear the
 * story is illustrative, never a specific customer's numbers. `eyebrow` is
 * the one optional prop, so its presence is the leaf.
 */
const meta: Meta<typeof SystemStoryCard> = {
    title: "Nivo/Blocks/Landing/SystemStoryCard/SystemStoryCard",
    component: SystemStoryCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof SystemStoryCard>

const TITLE = "Real results come from a real system."

const BEFORE = {
    label: "Before",
    points: [
        "Leads scattered across inbox, Zalo, and spreadsheets",
        "Sales forgets to follow up",
        "The founder has to ask everyone just to see where things stand",
    ],
}

const AFTER = {
    label: "After the system",
    points: [
        "Leads land in one CRM, sorted by source",
        "Workflow reminds sales to follow up on time",
        "The founder reads the pipeline and its bottlenecks on a dashboard",
    ],
}

const DISCLAIMER = "An illustrative system story — not tied to a specific customer's numbers."

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SectionHeading: { tier: "block", role: "the centered eyebrow / title header", storyId: "nivo-blocks-landing-sectionheading-sectionheading--align" },
    StackH: { tier: "frame", role: "the before / arrow / after row, wrapping below `md`" },
    StackV: { tier: "frame", role: "the header/row/disclaimer rhythm, and each panel's point list" },
    SurfaceCard: { tier: "composite", role: "each labeled before/after panel" },
    InlineIconLabel: { tier: "composite", role: "each point — a warning marker before, a success marker after" },
    Typography: { tier: "atom", role: "the disclaimer line under the panels" },
}

/** LEAF — `eyebrow`: full coverage of both members of the optional-string union. */
export const Eyebrow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SystemStoryCard"
                tier="block"
                leaf="eyebrow"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. Every point on both sides, both labels, and the disclaimer arrive already resolved — this card fabricates no client metric of its own and invents no separate 'illustrative' badge; the honesty framing is the passed `disclaimer` string. The one prop this card leaves optional is `eyebrow`, so its presence is the leaf."
                states={[
                    {
                        name: "eyebrow set",
                        why: "The default marketing placement: a small kicker sits above the headline, matching the other centered beats on the page.",
                        code: `<SystemStoryCard
    eyebrow="Before & after"
    title="Real results come from a real system."
    before={{ label: "Before", points: painPoints }}
    after={{ label: "After the system", points: outcomes }}
    disclaimer="An illustrative system story — not tied to a specific customer's numbers."
/>`,
                        render: <SystemStoryCard eyebrow="Before & after" title={TITLE} before={BEFORE} after={AFTER} disclaimer={DISCLAIMER} />,
                    },
                    {
                        name: "eyebrow omitted",
                        why: "A bare variant with no kicker line — the headline sits alone above the panels.",
                        code: `<SystemStoryCard title="Real results come from a real system." before={before} after={after} disclaimer={disclaimer} />`,
                        render: <SystemStoryCard title={TITLE} before={BEFORE} after={AFTER} disclaimer={DISCLAIMER} />,
                    },
                ]}
            />
        </div>
    ),
}
