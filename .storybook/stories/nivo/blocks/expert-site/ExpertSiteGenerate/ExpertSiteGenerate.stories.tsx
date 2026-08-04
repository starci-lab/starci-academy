import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ExpertSiteGenerate,
    type ExpertSiteGenerateLabels,
    type ExpertSiteGeneratedDraft,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteGenerate/ExpertSiteGenerate"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertSiteGenerate` — the "AI drafts your site" block. The expert writes a
 * brief and presses Generate; a DRAFT (name/headline/bio/template/offerings)
 * comes back for the editor to fill in. The three phases — `empty`,
 * `isGenerating`, `draft` present — are DATA, so they are STATES of the single
 * shape. Grounded in the real `ExpertSiteGenerate`; the draft maps onto
 * `ExpertSiteConfig` + `ExpertSiteOfferingEntity` fields.
 */
const meta: Meta<typeof ExpertSiteGenerate> = {
    title: "Nivo/Blocks/ExpertSite/ExpertSiteGenerate/ExpertSiteGenerate",
    component: ExpertSiteGenerate,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertSiteGenerate>

const LABELS: ExpertSiteGenerateLabels = {
    title: "Let AI draft your site",
    description: "Describe yourself in a sentence or two and we'll draft a starting point you can edit.",
    briefLabel: "About you",
    briefPlaceholder: "e.g. I'm a full-stack mentor who has shipped SaaS for eight years…",
    submitLabel: "Generate draft",
    draftHeading: "Draft",
    offeringsHeading: "Suggested offerings",
}

const DRAFT: ExpertSiteGeneratedDraft = {
    displayName: "Le Quang",
    headline: "Full-stack mentor · 8 years shipping SaaS",
    bio: "I help mid-level engineers level up to senior through project-based mentoring, code review, and system-design drills.",
    templateKey: "consultant",
    offerings: [
        { title: "1:1 Mentoring", subtitle: "Weekly 60-min calls", priceText: "2,000,000 VND / month" },
        { title: "System Design Intensive", subtitle: "4-week cohort", priceText: "5,000,000 VND" },
    ],
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the generator card, and the nested read-only draft preview" },
    InputTextarea: { tier: "atom", role: "the brief the expert writes — the generator's only input" },
    Button: { tier: "atom", role: "the Generate action; shows a spinner while the draft is being produced" },
    Chip: { tier: "atom", role: "the template the draft picked" },
    Typography: { tier: "atom", role: "the title, description, and every line of the returned draft" },
}

/** LEAF — the generator has one shape; the three phases are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteGenerate"
                tier="block"
                leaf="Generator"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the draft entity, so the three phases are states of one shape. `Generate` is offered only once the brief clears a minimum length — presentation logic the block derives from its own props, never a request."
                states={[
                    {
                        name: "brief empty, no draft",
                        why: "The resting state: an empty brief and no draft yet, so only the header, the textarea, and a disabled Generate button show. Nothing has been produced, so there is no preview to render.",
                        code: `<ExpertSiteGenerate
    brief="" onBriefChange={setBrief}
    onGenerate={run}
    draft={null}
    labels={labels}
/>`,
                        render: (
                            <ExpertSiteGenerate
                                brief=""
                                onBriefChange={NOOP}
                                onGenerate={NOOP}
                                draft={null}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isGenerating = true",
                        why: "The generator is running against the brief. The button shows a spinner and the textarea locks, so the expert cannot fire a second run over the first.",
                        code: "<ExpertSiteGenerate {...props} brief={brief} isGenerating />",
                        render: (
                            <ExpertSiteGenerate
                                brief="I'm a full-stack mentor who has shipped SaaS for eight years."
                                onBriefChange={NOOP}
                                onGenerate={NOOP}
                                draft={null}
                                labels={LABELS}
                                isGenerating
                            />
                        ),
                    },
                    {
                        name: "draft present",
                        why: "A draft came back. The read-only preview shows what the editor will be filled with — display name, headline, bio, the picked template as a chip, and the suggested offering titles — while the brief stays editable for another run.",
                        code: "<ExpertSiteGenerate {...props} draft={draft} />",
                        render: (
                            <ExpertSiteGenerate
                                brief="I'm a full-stack mentor who has shipped SaaS for eight years."
                                onBriefChange={NOOP}
                                onGenerate={NOOP}
                                draft={DRAFT}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
