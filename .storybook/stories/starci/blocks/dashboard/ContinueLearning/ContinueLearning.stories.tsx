import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContinueLearning, type ContinueLearningItem } from "@sb-components/starci/blocks/dashboard/ContinueLearning/ContinueLearning"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ContinueLearning` (dashboard) — the "Continue learning" slot: up to 3 resume
 * targets (lessons lead, at most one in-progress challenge as a nudge), or an
 * onboarding CTA when there is nothing to resume. Three leaves: `Content`
 * (1–3 tiles in a `Grid`), `Empty` (`AsyncContentEmpty`, wording forks on
 * `hasCourses`), and `Loading` (a 3-tile skeleton grid).
 */
const meta: Meta<typeof ContinueLearning> = {
    title: "StarCi/Blocks/Dashboard/ContinueLearning/ContinueLearning",
    component: ContinueLearning,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContinueLearning>

const THREE_ITEMS: Array<ContinueLearningItem> = [
    { id: "lesson-docker-compose", title: "Docker Compose: networking & volumes", kind: "lesson" },
    { id: "lesson-k8s-scheduling", title: "Advanced K8s scheduling", kind: "lesson" },
    { id: "challenge-dockerfile-optimize", title: "Optimize a production Dockerfile", kind: "challenge" },
]

const ONE_ITEM: Array<ContinueLearningItem> = [
    { id: "lesson-docker-compose", title: "Docker Compose: networking & volumes", kind: "lesson" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Grid": { tier: "frame", role: "the reflowing tile track — 1 column narrow, 2 from @app-sm, 3 from @app-lg, same steps the real dashboard grid uses", storyId: "frames-grid-grid--default" },
    "ContinueCardItem": { tier: "block", role: "one resume tile — design tier, already built for exactly this shape (\"ONE of N continue cards in a list/grid\"); this block only supplies the kind-word subtitle", storyId: "starci-blocks-learn-continuecard-continuecarditem--content" },
    "AsyncContentEmpty": { tier: "composite", role: "replaces the whole track with one message + one button when there is nothing to resume; wording forks on hasCourses, never the shape", storyId: "composites-async-asynccontent-asynccontent--empty" },
    "Button": { tier: "atom", role: "the onboarding CTA (\"Browse courses\"), shared by both empty wordings", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF 1 — 1–3 resume tiles inside a responsive `Grid`. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContinueLearning"
                tier="block"
                leaf="Content"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                states={[
                    {
                        name: "items = 3 (2 lessons + 1 challenge)",
                        why: "The common case — content-first: lessons lead, mixed with at most one in-progress challenge as a nudge (the caller caps + orders this before the block ever sees it).",
                        code: `<ContinueLearning
    items={items}
    hasCourses
    isLoading={false}
    onSelectItem={onSelectItem}
    onBrowseCourses={onBrowseCourses}
/>`,
                        render: (
                            <ContinueLearning


                                items={THREE_ITEMS}
                                hasCourses
                                isLoading={false}
                                onSelectItem={() => {}}
                                onBrowseCourses={() => {}}
                            />
                        ),
                    },
                    {
                        name: "items = 1",
                        why: "A viewer with a single lesson in progress still gets the same Grid — the track just has one cell, no special one-item layout.",
                        code: "<ContinueLearning items={[oneItem]} hasCourses isLoading={false} /* … */ />",
                        render: (
                            <ContinueLearning
                                items={ONE_ITEM}
                                hasCourses
                                isLoading={false}
                                onSelectItem={() => {}}
                                onBrowseCourses={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF 2 — the track becomes the onboarding message; wording forks on `hasCourses`. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContinueLearning"
                tier="block"
                leaf="Empty"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "hasCourses = true, items = []",
                        why: "Enrolled in at least one course but has neither read a lesson nor started a challenge yet — the message nudges to START, not to browse.",
                        code: "<ContinueLearning items={[]} hasCourses isLoading={false} /* … */ />",
                        render: (
                            <ContinueLearning


                                items={[]}
                                hasCourses
                                isLoading={false}
                                onSelectItem={() => {}}
                                onBrowseCourses={() => {}}
                            />
                        ),
                    },
                    {
                        name: "hasCourses = false, items = []",
                        why: "A brand-new account with zero enrollments — the message and CTA point at browsing courses, not \"resuming\" anything.",
                        code: "<ContinueLearning items={[]} hasCourses={false} isLoading={false} /* … */ />",
                        render: (
                            <ContinueLearning
                                items={[]}
                                hasCourses={false}
                                isLoading={false}
                                onSelectItem={() => {}}
                                onBrowseCourses={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF 3 — `items` still empty and `isLoading`; a guessed 3-tile grid mirrors the shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContinueLearning"
                tier="block"
                leaf="Loading"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-4xl"
                states={[
                    {
                        name: "isLoading = true, items = []",
                        why: "The three underlying leaf queries (courses / in-progress challenges / learned lessons) haven't resolved yet — three placeholder tiles reserve the real grid's height so nothing jumps once data lands; each tile is `ContinueCardItem`'s own mirror, never a fabricated title.",
                        code: "<ContinueLearning items={[]} hasCourses isLoading /* … */ />",
                        render: (
                            <ContinueLearning


                                items={[]}
                                hasCourses
                                isLoading
                                onSelectItem={() => {}}
                                onBrowseCourses={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
