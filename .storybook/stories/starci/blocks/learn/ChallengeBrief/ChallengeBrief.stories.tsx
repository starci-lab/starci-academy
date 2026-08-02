import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChallengeBrief } from "@sb-components/starci/blocks/learn/ChallengeBrief/ChallengeBrief"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ChallengeBrief` — the reading column of a challenge: prerequisites,
 * requirements (points-per-row), guided steps, expected outputs, and a hint,
 * each present only when the challenge carries it. One leaf: which of the five
 * sections show up is data. States: every section present, some genuinely
 * absent, and the loading mirror.
 */
const meta: Meta<typeof ChallengeBrief> = {
    title: "StarCi/Blocks/Learn/ChallengeBrief/ChallengeBrief",
    component: ChallengeBrief,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChallengeBrief>

const PREREQUISITES = [
    { key: "prereq-1", body: "Node.js 20 or later installed" },
    { key: "prereq-2", body: "A GitHub account and know how to create a new repo" },
]

const REQUIREMENTS = [
    {
        key: "req-1",
        title: "Build a CRUD API for Task",
        points: 40,
        body: "Build a REST API `/tasks` supporting create, read, update, delete — each route returns the correct HTTP status code.",
    },
    {
        key: "req-2",
        title: "Write tests for each route",
        points: 30,
        body: "At least one integration test per route, runnable with `npm test`.",
    },
    {
        key: "req-3",
        title: "Validate input",
        body: "Reject a payload missing a required field with a clear 400 error — no separate points, but still graded during review.",
    },
]

const STEPS = [
    { key: "step-1", title: "Initialize the project", body: "Run `npm init` then install Express and TypeORM." },
    { key: "step-2", body: "Define the `Task` entity with the `title`, `done`, `createdAt` fields." },
    { key: "step-3", title: "Wire routes to the controller", body: "Map each `/tasks/*` route to its corresponding handler function." },
]

const OUTPUTS = [
    { key: "out-1", body: "`GET /tasks` returns a JSON array of the existing tasks" },
    { key: "out-2", body: "`POST /tasks` returns the newly created task along with its `id`" },
]

const HINT = "If a route returns 500 during testing, check whether you `await` the migration before the server starts listening for requests."

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame stacking the (up to) five sections, owning the section-wide seam between them", storyId: "frames-stack-stackv--default" },
    "SurfaceCardList": { tier: "composite", role: "the prerequisites/outputs card — free-form rows so this block can lead an outputs row with a check and leave a prerequisites row bare", storyId: "composites-cards-surfacecard-surfacecardlist--free-form" },
    "SurfaceCardAccordion": { tier: "composite", role: "the requirements/steps card — collapsible rows, the requirements instance carrying a points chip on its trigger via `titleEnd`", storyId: "composites-cards-surfacecard-surfacecardaccordion--with-title-end" },
    "SurfaceCard": { tier: "composite", role: "the hint card — a labelled face holding ONE markdown paragraph, no rows and no collapse (AUDIT 2026-07-30, feedback ChallengePage/Graded round-12)", storyId: "composites-cards-surfacecard-surfacecard--with-label" },
    "MarkdownContent": { tier: "composite", role: "a requirement/step/hint panel body — the ONLY three sections that stay markdown", storyId: "composites-viewers-markdowncontent--compact" },
    "Typography": { tier: "atom", role: "a prerequisite/output row — plain text, no markdown (AUDIT 2026-07-30, feedback ChallengePage/Graded round-3: backend content schema names this field \"text\", not \"body\" — a different tier from requirements/steps)", storyId: "atoms-text-typography-typography--plain" },
    "ScoreValue": { tier: "composite", role: "a requirement's point value, riding on its accordion trigger via `titleEnd`", storyId: "composites-texts-scorevalue--default" },
    "CheckCircleIcon": { tier: "heroui", role: "the leading mark on an expected-output row — only drawn once the row is real, never on its shimmer" },
}

/** LEAF — full set: prerequisites → requirements → steps → outputs → hint. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChallengeBrief"
                tier="block"
                leaf="ChallengeBrief"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "all five sections present",
                        why: "The challenge carries every section it can, so the reading column shows all five cards in their fixed order. Requirements without a `points` value (Validate input) simply have no trailing chip — the chip is not a placeholder, it only exists when there is a number to show.",
                        code: `<ChallengeBrief
    prerequisites={prerequisites}
    requirements={requirements}
    steps={steps}
    outputs={outputs}
    hint={hint}
/>`,
                        render: (
                            <ChallengeBrief

                               
                                prerequisites={PREREQUISITES}
                                requirements={REQUIREMENTS}
                                steps={STEPS}
                                outputs={OUTPUTS}
                                hint={HINT}
                            />
                        ),
                    },
                    {
                        name: "only requirements + steps present",
                        why: "Prerequisites, outputs and hint all come back empty for this challenge, so those three cards are not drawn at all — the column goes straight from requirements to steps with no gap or placeholder standing in for the missing sections. This is the real conditional path `src` takes, not a degraded version of the full state.",
                        code: `<ChallengeBrief
    requirements={requirements}
    steps={steps}
/>`,
                        render: (
                            <ChallengeBrief
                                requirements={REQUIREMENTS}
                                steps={STEPS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Before the challenge entity hydrates, every section renders its own shimmer — all five, since the block cannot yet know which of them this challenge will end up having. The two list sections build their own placeholder rows (two apiece); the three accordion sections mirror themselves, and hint always guesses exactly one collapsible row, never a generic count.",
                        code: "<ChallengeBrief isSkeleton />",
                        render: <ChallengeBrief isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
