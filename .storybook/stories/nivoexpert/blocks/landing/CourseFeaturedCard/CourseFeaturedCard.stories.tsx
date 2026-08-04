import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CourseFeaturedCard,
    type CourseFeaturedCardLabels,
} from "@sb-components/nivoexpert/blocks/landing/CourseFeaturedCard/CourseFeaturedCard"
import type { CourseOfferCardView } from "@sb-components/nivoexpert/blocks/landing/CourseOfferCard/CourseOfferCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CourseFeaturedCard` — the 1-course arrangement of the tenant landing's
 * catalog: a full-measure two-pane card, never a one-cell grid. A sibling of
 * `CourseCatalogGrid` (2+ courses) and `CatalogComingSoonPanel` (0 courses),
 * not a variant of either — the proposal's §3 volume table forces exactly
 * this shape at a count of 1. The right pane shows the real lesson count as
 * a `MetricCard` stat rather than an invented image, since `CourseEntity`
 * has no thumbnail field.
 */
const meta: Meta<typeof CourseFeaturedCard> = {
    title: "NivoExpert/Blocks/Landing/CourseFeaturedCard/CourseFeaturedCard",
    component: CourseFeaturedCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseFeaturedCard>

const LABELS: CourseFeaturedCardLabels = {
    freeLabel: "Free",
    lessonsSuffix: "lessons",
    ctaLabel: "View course",
}

const PRICED_COURSE: CourseOfferCardView = {
    slug: "eight-session-launch",
    title: "Launch in Eight Sessions",
    summary: "From idea to a first product someone actually pays for — the only course open today.",
    priceText: "$129",
    lessonCount: 8,
}

const FREE_COURSE: CourseOfferCardView = {
    slug: "no-code-first-mvp",
    title: "Build Your First MVP, No Code",
    summary: null,
    priceText: null,
    lessonCount: 5,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the whole-card press target; isHighlight draws the accent sweep for this one-course picture" },
    Grid: { tier: "frame", role: "the two-pane split — copy left, stat right — collapsing to stacked at the same width CourseCatalogGrid reflows to one column" },
    MetricCard: { tier: "composite", role: "the real lesson count as a stat, never a fabricated image or icon" },
    Chip: { tier: "atom", role: "the price chip; falls back to the free-course label when priceText is null" },
    Typography: { tier: "atom", role: "the title, optional summary, and the sliding view-course affordance" },
}

/** LEAF — one shape; skeleton / priced / free are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="@container p-8">
            <BlockAnatomy
                name="CourseFeaturedCard"
                tier="block"
                leaf="Course"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="A little data centres and fills rather than scattering thin across a 3-column track — this is the ONE-course picture, reached only when the tenant's real catalog holds exactly one course, and it collapses to a stacked layout at the same width `CourseCatalogGrid` reflows to a single column, so the two blocks read as one family at every width."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The catalog's own first fetch is in flight: price chip, title, summary, CTA and the lesson-count stat all shimmer at the loaded shape's geometry.",
                        code: "<CourseFeaturedCard course={course} onOpenCourse={onOpenCourse} isSkeleton labels={labels} />",
                        render: <CourseFeaturedCard course={PRICED_COURSE} onOpenCourse={() => {}} isSkeleton labels={LABELS} />,
                    },
                    {
                        name: "priceText set, summary set",
                        why: "The typical single-course tenant: a real price chip, a summary line, and the real lesson count as the visual pane's stat.",
                        code: "<CourseFeaturedCard course={course} onOpenCourse={onOpenCourse} labels={labels} />",
                        render: <CourseFeaturedCard course={PRICED_COURSE} onOpenCourse={() => {}} labels={LABELS} />,
                    },
                    {
                        name: "priceText = null, summary = null",
                        why: "Both `Course.priceText` and `Course.summary` are nullable — the chip falls back to `labels.freeLabel` and the summary line is omitted entirely, never a fabricated placeholder for either.",
                        code: "<CourseFeaturedCard course={freeCourse} onOpenCourse={onOpenCourse} labels={labels} />",
                        render: <CourseFeaturedCard course={FREE_COURSE} onOpenCourse={() => {}} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
