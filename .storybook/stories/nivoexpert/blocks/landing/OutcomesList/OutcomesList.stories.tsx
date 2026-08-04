import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    OutcomesList,
    type OutcomesListItem,
    type OutcomesListLabels,
} from "@sb-components/nivoexpert/blocks/landing/OutcomesList/OutcomesList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `OutcomesList` — the landing's "what you'll learn" section: a scannable grid of
 * skill/habit/career-gain bullets, each a success-toned check glyph beside one line
 * of copy. Grounded in the expert's own config copy — the real `Brand`/`Course`
 * shape carries no `outcomes` field, so this block never derives or fabricates a
 * bullet; zero items is a real, honest state for a tenant who has not written any
 * yet. Built on the shared HeroUI atom system (`Typography` / `IconTile` /
 * `EmptyState`).
 */
const meta: Meta<typeof OutcomesList> = {
    title: "NivoExpert/Blocks/Landing/OutcomesList/OutcomesList",
    component: OutcomesList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof OutcomesList>

const LABELS: OutcomesListLabels = {
    eyebrow: "What you'll learn",
    title: "You'll walk away able to",
    intro: "Every line below is copy the expert wrote — this section renders it verbatim, never a generated claim.",
    emptyTitle: "The outcomes list is still being written",
    emptyDescription: "The expert hasn't published what this leads to yet — check the curriculum below in the meantime.",
}

const ITEMS: Array<OutcomesListItem> = [
    { id: "pitch", text: "Pitch a seed round without freezing on the numbers slide" },
    { id: "mvp", text: "Ship a working MVP with a no-code stack in under two weeks" },
    { id: "hire", text: "Write a job post that a strong first hire actually answers" },
    { id: "pricing", text: "Set a launch price you can defend to your first ten customers" },
    { id: "story", text: "Turn a rough idea into a story investors repeat to each other" },
    { id: "cashflow", text: "Read your own cash runway without waiting on a bookkeeper" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Typography: { tier: "atom", role: "the eyebrow/title/intro header and each outcome's own line of copy" },
    IconTile: { tier: "atom", role: "the success-toned check glyph beside each outcome" },
    EmptyState: { tier: "composite", role: "the honest zero-outcomes branch — no fabricated bullet" },
}

/** LEAF — one shape; the bullet grid / empty / isSkeleton are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="OutcomesList"
                tier="block"
                leaf="Outcomes"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                reason="Every bullet is copy the expert authored, resolved by the connected layer from the expert's own config — the real `Brand`/`Course` shape carries no `outcomes` field, so this block never derives or invents a claim of its own. Zero items is a real state, not a defect: a brand-new tenant who hasn't written any outcomes yet gets an honest `EmptyState`, never a placeholder bullet standing in for content that doesn't exist."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The expert's own copy hasn't resolved yet: six placeholder bullets hold the loaded grid's shape while every line shimmers.",
                        code: "<OutcomesList items={items} isSkeleton labels={labels} />",
                        render: <OutcomesList items={ITEMS} isSkeleton labels={LABELS} />,
                    },
                    {
                        name: "items = [6 outcomes]",
                        why: "The typical case: a two-column grid of the expert's own scannable benefit bullets, each with its own check glyph.",
                        code: "<OutcomesList items={items} labels={labels} />",
                        render: <OutcomesList items={ITEMS} labels={LABELS} />,
                    },
                    {
                        name: "items = [] (no outcomes authored yet)",
                        why: "A brand-new tenant who hasn't written any outcomes yet — the section collapses to an honest 'still being written' message instead of a fabricated bullet or a bare gap.",
                        code: "<OutcomesList items={[]} labels={labels} />",
                        render: <OutcomesList items={[]} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
