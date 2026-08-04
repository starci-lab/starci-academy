import type { Meta, StoryObj } from "@storybook/nextjs"
import { FaqAccordion } from "@sb-components/nivo/blocks/landing/FaqAccordion/FaqAccordion"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `FaqAccordion`: the landing's Q/A section — a `SectionHeading` over
 * the shared `Accordion` atom. Static marketing copy (proposal §2, row 15 —
 * REAL, no vision badge), so only the accordion's own rows carry
 * `isSkeleton`; the heading text is always known up front, the same split
 * `DashboardShell` makes for its top bar.
 *
 * Leaf set: `Default` (prop `items` — the content leaf, §12g.2) + `Skeleton`
 * (prop `isSkeleton`).
 */

const meta: Meta<typeof FaqAccordion> = {
    title: "Nivo/Blocks/Landing/FaqAccordion/FaqAccordion",
    component: FaqAccordion,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FaqAccordion>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SectionHeading": { tier: "block", role: "the eyebrow + title + intro above the panel list — always live, never shimmered here", storyId: "nivo-blocks-landing-sectionheading-sectionheading--align" },
    "Accordion": { tier: "atom", role: "one panel per FAQ entry — carries the block's own `isSkeleton` down to its collapsed-row shimmer", storyId: "atoms-navigation-accordion-accordion--default" },
}

const FAQ_ITEMS = [
    { id: "accounts", question: "Do I need an account to see pricing?", answer: "No. All 6 tiers across both products are public — sign in only when you start a purchase." },
    { id: "ai-first", question: "What does \"AI-First system\" mean?", answer: "Website → Lead → CRM → Workflow → AI Agent → Dashboard chained into one operating loop. You start small with one product and connect the rest as your business is ready." },
    { id: "ai-autonomy", question: "Does the AI decide and send on its own?", answer: "No. AI assists — suggests, summarizes, drafts — but a human reviews and is accountable before anything is sent." },
]

/** The BARE leaf — only `items` (+ the required heading text), `isSkeleton` unset. This is the leaf for prop `items` (§12g.2: a content prop → Default IS its leaf). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="dark bg-background p-8">
            <BlockAnatomy
                name="FaqAccordion"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `items`"
                reason="The landing's one FAQ section, composed from two reused parts: `SectionHeading` for the eyebrow/title/intro, and the shared `Accordion` atom for the panel list. Every string arrives already resolved — the block owns only the arrangement."
                states={[
                    {
                        name: "items = 3 FAQ entries",
                        why: "Three panels render, all collapsed until the reader opens one — the shape a caller reaches for with real copy in hand, before any loading state applies.",
                        code: `<FaqAccordion
    eyebrow="Still have questions?"
    title="Frequently asked questions"
    items={faqItems}
/>`,
                        render: (
                            <FaqAccordion
                                eyebrow="Still have questions?"
                                title="Frequently asked questions"
                                items={FAQ_ITEMS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Skeleton — the block threads `isSkeleton` into ONLY the `Accordion` rows; the heading stays live, mirroring `DashboardShell`'s own top-bar-stays-live split. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="dark bg-background p-8">
            <BlockAnatomy
                name="FaqAccordion"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="The block's own async decision: only the panel list — the part that could plausibly be CMS-sourced — carries a first-load shimmer. The heading is marketing copy the caller always has in hand, so it renders live in both states."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The heading renders normally while the three panel rows swap to `Accordion`'s own collapsed-row shimmer — the same co-located mirror the atom draws for any caller, not a separate skeleton tree this block invented.",
                        code: `<FaqAccordion
    eyebrow="Still have questions?"
    title="Frequently asked questions"
    items={faqItems}
    isSkeleton
/>`,
                        render: (
                            <FaqAccordion
                                eyebrow="Still have questions?"
                                title="Frequently asked questions"
                                items={FAQ_ITEMS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
