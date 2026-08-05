import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseQaHeader } from "@sb-components/starci/blocks/learn/CourseQaHeader/CourseQaHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `CourseQaHeader`: the PAGE-IDENTITY cluster at the top of a course
 * Q&A screen — trail, title, description, nothing else.
 *
 * SIBLING OF `LeaderboardHeader`/`FoundationsHeader`, NOT A COPY. Every ported
 * screen wraps `PageHeader` in its own domain-named block rather than the
 * screen touching the composite directly (rule 1). This board carries no meta
 * row for the same reason `LeaderboardHeader` doesn't: the facts (question
 * count, filter, sort) live in the honest-strip/toolbar below, not the header.
 */
const meta: Meta<typeof CourseQaHeader> = {
    title: "StarCi/Blocks/Learn/CourseQaHeader/CourseQaHeader",
    component: CourseQaHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseQaHeader>

const CRUMBS = [
    { key: "home", label: "Home", onPress: () => {} },
    { key: "course", label: "Frontend Development", onPress: () => {} },
    { key: "qa", label: "Q&A" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the trail and the title/description column", storyId: "composites-layout-page-pageheader--full" },
    "Breadcrumbs": { tier: "atom", role: "the trail the block builds from crumb data handed down by the screen", storyId: "atoms-navigation-breadcrumbs-breadcrumbs--default" },
    "Typography": { tier: "atom", role: "the block's own title/description text, or its skeleton mirror while loading", storyId: "atoms-text-typography-typography--overview" },
}

/** LEAF — the whole header: trail → title → optional description. */
export const Header: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseQaHeader"
                tier="block"
                leaf="Header"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "description present",
                        why: "The full identity cluster: trail, title, and a one-sentence description of what this Q&A board is for. This is what a learner sees the first time they open the course's Q&A tab.",
                        code: `<CourseQaHeader
    breadcrumbItems={crumbs}
    title="Q&A"
    description="Ask questions and discuss with instructors, teaching assistants, and other learners in the course"
/>`,
                        render: (
                            <CourseQaHeader


                                breadcrumbItems={CRUMBS}
                                title="Q&A"
                                description="Ask questions and discuss with instructors, teaching assistants, and other learners in the course"
                            />
                        ),
                    },
                    {
                        name: "description omitted",
                        why: "A returning learner who already knows what the board is for does not need the sentence repeated on every visit, so the caller may drop it — the title alone still reads as a complete page identity.",
                        code: `<CourseQaHeader
    breadcrumbItems={crumbs}
    title="Q&A"
/>`,
                        render: (
                            <CourseQaHeader
                                breadcrumbItems={CRUMBS}
                                title="Q&A"
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The trail and the title/description swap to their own shimmer while the Q&A board's identity data is still loading, keeping the exact box each will hand back. The flag reaches the real atoms rather than a parallel skeleton tree, which is why the header does not jump when the data lands.",
                        code: "<CourseQaHeader breadcrumbItems={[]} title=\"\" isSkeleton />",
                        render: (
                            <CourseQaHeader
                                breadcrumbItems={[]}
                                title=""
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
