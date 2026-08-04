import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CourseCatalogGrid,
    type CourseCatalogGridLabels,
} from "@sb-components/nivoexpert/blocks/landing/CourseCatalogGrid/CourseCatalogGrid"
import type { CourseOfferCardView } from "@sb-components/nivoexpert/blocks/landing/CourseOfferCard/CourseOfferCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CourseCatalogGrid` — the tenant landing's course catalog at the volume the
 * real backend and the researched platforms both assume: 2–6 courses
 * typical, more flowing to additional rows (`CoursesResolver.execute()` is
 * unpaginated). Each cell is a real `CourseOfferCard`; this block owns only
 * the responsive `Grid` arrangement around them. Never called with 0 courses
 * (`CatalogComingSoonPanel`'s job) or exactly 1 (`CourseFeaturedCard`'s job)
 * — see the component's file header for why those are siblings, not states
 * of this shape.
 */
const meta: Meta<typeof CourseCatalogGrid> = {
    title: "NivoExpert/Blocks/Landing/CourseCatalogGrid/CourseCatalogGrid",
    component: CourseCatalogGrid,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseCatalogGrid>

const LABELS: CourseCatalogGridLabels = {
    freeLabel: "Free",
    lessonsSuffix: "lessons",
}

const TYPICAL_COURSES: Array<CourseOfferCardView> = [
    { slug: "eight-session-launch", title: "Launch in Eight Sessions", summary: "From idea to a first product someone actually pays for.", priceText: "$129", lessonCount: 8 },
    { slug: "seed-round-pitch", title: "Seed Round Pitch Prep", summary: "Build the deck and the story that gets a first yes.", priceText: "$89", lessonCount: 6 },
    { slug: "no-code-first-mvp", title: "Build Your First MVP, No Code", summary: "Ship a working prototype with no-code tools before writing a line.", priceText: null, lessonCount: 5 },
    { slug: "first-three-hires", title: "Hiring Your First Three People", summary: "Write the job post, run the interview, keep them past month one.", priceText: "$99", lessonCount: 7 },
]

const OVERFLOW_COURSES: Array<CourseOfferCardView> = [
    ...TYPICAL_COURSES,
    { slug: "pricing-for-b2b", title: "Pricing for B2B", summary: "Set a price you can defend on a sales call.", priceText: "$79", lessonCount: 4 },
    { slug: "cold-outreach-that-works", title: "Cold Outreach That Works", summary: "Write the email that gets a reply, not a delete.", priceText: "$69", lessonCount: 5 },
    { slug: "founder-time-management", title: "Founder Time Management", summary: null, priceText: "$59", lessonCount: 4 },
    { slug: "reading-a-cap-table", title: "Reading a Cap Table", summary: "Understand dilution before you sign anything.", priceText: "$49", lessonCount: 3 },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Grid: { tier: "frame", role: "the responsive reflow — 1/2/3 columns by container step, never a hand-rolled grid-template-columns" },
    CourseOfferCard: {
        tier: "block",
        role: "each course cell — title, price chip, summary, lesson count",
        storyId: "nivoexpert-blocks-landing-courseoffercard-courseoffercard--default",
    },
}

/** LEAF — one shape; skeleton / typical / overflow are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="@container p-8">
            <BlockAnatomy
                name="CourseCatalogGrid"
                tier="block"
                leaf="Grid"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-5xl"
                reason="`CoursesResolver.execute()` returns every course unpaginated — a tenant's real catalog runs roughly 1 to 6 courses by construction, so a large roster is the SAME grid simply flowing to more rows, never a paged leaf. The 0-course and 1-course counts are NOT states of this block: the proposal's volume table (§3) routes those to `CatalogComingSoonPanel` and `CourseFeaturedCard` instead, one level up from here."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The catalog's own first fetch is in flight: a fixed 3-card grid renders with every cell shimmering, matching the loaded shape so nothing jumps when the courses land.",
                        code: "<CourseCatalogGrid courses={courses} onOpenCourse={onOpenCourse} isSkeleton labels={labels} />",
                        render: <CourseCatalogGrid courses={TYPICAL_COURSES} onOpenCourse={() => {}} isSkeleton labels={LABELS} />,
                    },
                    {
                        name: "4 courses (typical)",
                        why: "The ordinary shape a solo expert's catalog runs at — 3 columns wide, one free course among the priced ones, exactly the volume the backend and the researched platforms both assume.",
                        code: "<CourseCatalogGrid courses={courses} onOpenCourse={onOpenCourse} labels={labels} />",
                        render: <CourseCatalogGrid courses={TYPICAL_COURSES} onOpenCourse={() => {}} labels={LABELS} />,
                    },
                    {
                        name: "8 courses (overflow)",
                        why: "More courses than fit one row: the SAME grid, simply reflowing to more rows and scrolling with the page — never a separate paged arrangement or a capped \"view all\", matching the backend's un-paginated `courses()` and the proposal's §3/§7 note that no catalog route exists yet to cap into.",
                        code: "<CourseCatalogGrid courses={manyCourses} onOpenCourse={onOpenCourse} labels={labels} />",
                        render: <CourseCatalogGrid courses={OVERFLOW_COURSES} onOpenCourse={() => {}} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
