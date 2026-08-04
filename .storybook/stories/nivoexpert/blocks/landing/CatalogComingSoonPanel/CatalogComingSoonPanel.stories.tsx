import type { Meta, StoryObj } from "@storybook/nextjs"
import { CatalogComingSoonPanel } from "@sb-components/nivoexpert/blocks/landing/CatalogComingSoonPanel/CatalogComingSoonPanel"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CatalogComingSoonPanel` — the honest 0-course empty state for a brand-new
 * tenant's catalog section, per `nivo-expert-landing.proposal.md` §3/§5/§6.
 * Built on the shared `EmptyState` composite — a grid with one "no items"
 * caption inside it reads as a broken grid, so the empty case gets this
 * purpose-built panel instead, with one onward action that routes into the
 * page's lead capture section so the empty catalog is never a dead end.
 */
const meta: Meta<typeof CatalogComingSoonPanel> = {
    title: "NivoExpert/Blocks/Landing/CatalogComingSoonPanel/CatalogComingSoonPanel",
    component: CatalogComingSoonPanel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CatalogComingSoonPanel>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    EmptyState: { tier: "composite", role: "the centered icon + title + description + action shell — the same empty-spot vocabulary ExpertDashboardOverview's zero-course funnel already uses" },
    Button: { tier: "atom", role: "the one onward action, routing into the page's lead capture section" },
}

/** LEAF — one shape; the onward action is the only thing that varies in kind. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CatalogComingSoonPanel"
                tier="block"
                leaf="Panel"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Grounded in `CoursesResolver.execute()` (`expert-api`) — courses are unpaginated and `SeedService.seedClassroom()` confirms a brand-new tenant seeds zero. No `Course`/`Brand`/`Theme` field reachable from this page carries a launch date, so the copy never invents one; the one real, reproducible hook is the onward action itself. `onExploreLead` is a callback rather than an `href` because the shared `Button` atom has no link variant — the connected layer scrolls/navigates to the page's lead capture section."
                states={[
                    {
                        name: "default",
                        why: "The panel as it renders once the catalog's own fetch has resolved to zero real courses — heading, honest supporting line, and the one onward CTA into the lead form.",
                        code: '<CatalogComingSoonPanel\n    title="First course coming soon"\n    description="No course is public yet — leave your contact below and you\'ll hear the moment the first one opens for enrollment."\n    onwardLabel="Notify me when it launches"\n    onExploreLead={scrollToLeadCapture}\n/>',
                        render: (
                            <CatalogComingSoonPanel
                                title="First course coming soon"
                                description="No course is public yet — leave your contact below and you'll hear the moment the first one opens for enrollment."
                                onwardLabel="Notify me when it launches"
                                onExploreLead={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
