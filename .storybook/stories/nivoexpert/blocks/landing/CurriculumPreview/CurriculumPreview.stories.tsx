import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CurriculumPreview,
    type CurriculumPreviewCourse,
    type CurriculumPreviewLabels,
} from "@sb-components/nivoexpert/blocks/landing/CurriculumPreview/CurriculumPreview"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CurriculumPreview` — the landing's curriculum-transparency block: every
 * real course, expanding to its real lesson titles, straight from
 * `CourseEntity`/`LessonEntity`. Grounded in the research annex's converged
 * finding — "give away module/lesson TITLES… people buy when they know
 * exactly what they get" — this is the PUBLIC, pre-enrollment picture: no
 * status glyph, no press handler, just the ordered title list, unlike
 * `LessonTOC` inside the classroom. Never called with 0 courses
 * (`CatalogComingSoonPanel`'s job) — see the component's file header.
 */
const meta: Meta<typeof CurriculumPreview> = {
    title: "NivoExpert/Blocks/Landing/CurriculumPreview/CurriculumPreview",
    component: CurriculumPreview,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CurriculumPreview>

const LABELS: CurriculumPreviewLabels = {
    lessonsSuffix: "lessons",
}

const EIGHT_SESSION_LAUNCH: CurriculumPreviewCourse = {
    id: "eight-session-launch",
    title: "Launch in Eight Sessions",
    lessons: [
        { id: "esl-1", title: "Finding a problem worth solving" },
        { id: "esl-2", title: "Talking to your first 10 customers" },
        { id: "esl-3", title: "Sketching the leanest possible offer" },
        { id: "esl-4", title: "Pricing without guessing" },
        { id: "esl-5", title: "Building the landing page that sells" },
        { id: "esl-6", title: "Getting your first paying customer" },
        { id: "esl-7", title: "Turning one sale into a repeatable process" },
        { id: "esl-8", title: "Deciding what to build next" },
    ],
}

const SEED_ROUND_PITCH: CurriculumPreviewCourse = {
    id: "seed-round-pitch",
    title: "Seed Round Pitch Prep",
    lessons: [
        { id: "srp-1", title: "Telling the story investors actually want" },
        { id: "srp-2", title: "Building a pitch deck that survives scrutiny" },
        { id: "srp-3", title: "Sizing the market without hand-waving" },
        { id: "srp-4", title: "Handling the \"why now\" question" },
        { id: "srp-5", title: "Running the first investor meeting" },
        { id: "srp-6", title: "Following up without being annoying" },
    ],
}

const SINGLE_COURSE: Array<CurriculumPreviewCourse> = [EIGHT_SESSION_LAUNCH]
const TWO_COURSES: Array<CurriculumPreviewCourse> = [EIGHT_SESSION_LAUNCH, SEED_ROUND_PITCH]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Accordion: {
        tier: "atom",
        role: "one panel per course, first panel open by default; lesson titles as the panel body",
        storyId: "atoms-navigation-accordion-accordion--default",
    },
    Typography: { tier: "atom", role: "heading, panel titles, lesson-count captions, and numbered lesson rows", storyId: "atoms-text-typography-typography--default" },
}

/** LEAF — one shape; 1 course / 2 courses / `isSkeleton` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CurriculumPreview"
                tier="block"
                leaf="Curriculum accordion"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                reason="Every lesson title rendered is the exact `LessonEntity.title` string, in `sortIndex` order — never summarized or invented, the same business-parity rule `CourseOfferCard`/`LessonTOC` already hold. Unlike `LessonTOC` (inside the classroom, tracking the enrolled learner's per-lesson completion), a landing visitor has completed nothing and cannot open a lesson from here, so rows carry no status glyph and no press handler — title only. The first course panel opens by default so a visitor sees real lesson titles without an extra click, matching the research annex's finding that curriculum transparency converts."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The catalog's own first fetch is in flight: two collapsed, course-shaped panels shimmer in place of real titles — the same fixed-count mirror `CourseCatalogGrid`'s own skeleton draws.",
                        code: "<CurriculumPreview title=\"See exactly what you'll learn\" courses={courses} isSkeleton labels={labels} />",
                        render: (
                            <CurriculumPreview
                                eyebrow="Curriculum"
                                title="See exactly what you'll learn"
                                intro="Every module, every lesson title — real, not a teaser."
                                courses={TWO_COURSES}
                                isSkeleton
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "1 course",
                        why: "A new tenant's first course: one accordion panel, open by default since there is nothing else to compare it against.",
                        code: "<CurriculumPreview title=\"See exactly what you'll learn\" courses={[course]} labels={labels} />",
                        render: (
                            <CurriculumPreview
                                eyebrow="Curriculum"
                                title="See exactly what you'll learn"
                                intro="Every module, every lesson title — real, not a teaser."
                                courses={SINGLE_COURSE}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "2 courses",
                        why: "The typical shape: several real courses stacked as panels, the first expanded, the rest one click away — the everyday picture of a multi-course tenant's curriculum preview.",
                        code: "<CurriculumPreview title=\"See exactly what you'll learn\" courses={courses} labels={labels} />",
                        render: (
                            <CurriculumPreview
                                eyebrow="Curriculum"
                                title="See exactly what you'll learn"
                                intro="Every module, every lesson title — real, not a teaser."
                                courses={TWO_COURSES}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
