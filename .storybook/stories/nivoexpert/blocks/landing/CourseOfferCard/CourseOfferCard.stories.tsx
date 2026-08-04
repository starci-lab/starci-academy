import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CourseOfferCard,
    type CourseOfferCardLabels,
    type CourseOfferCardView,
} from "@sb-components/nivoexpert/blocks/landing/CourseOfferCard/CourseOfferCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CourseOfferCard` — one course in the public tenant landing's catalog:
 * title, a price chip (verbatim `Course.priceText`, or the free-course label
 * when unset), an optional summary, and the real lesson count. The whole card
 * is one press target, matching the real `landings/Classic.tsx`'s
 * card-as-link convention. Built on the shared HeroUI atom system
 * (`SurfaceCard` / `Typography` / `Chip`) — the tenant-landing tier moved
 * onto it once `apps/expert` wired the HeroUI theme bridge; the atoms still
 * read the app's per-tenant `--nivo-*` runtime tokens, one indirection later.
 */
const meta: Meta<typeof CourseOfferCard> = {
    title: "NivoExpert/Blocks/Landing/CourseOfferCard/CourseOfferCard",
    component: CourseOfferCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseOfferCard>

const LABELS: CourseOfferCardLabels = {
    freeLabel: "Free",
    lessonsSuffix: "lessons",
}

const PRICED_COURSE: CourseOfferCardView = {
    slug: "eight-session-launch",
    title: "Launch in Eight Sessions",
    summary: "From idea to a first product someone actually pays for.",
    priceText: "$129",
    lessonCount: 8,
}

const FREE_COURSE: CourseOfferCardView = {
    slug: "no-code-first-mvp",
    title: "Build Your First MVP, No Code",
    summary: "Ship a working prototype with no-code tools before writing a line.",
    priceText: null,
    lessonCount: 5,
}

const NO_SUMMARY_COURSE: CourseOfferCardView = {
    slug: "seed-round-pitch",
    title: "Seed Round Pitch Prep",
    summary: null,
    priceText: "$89",
    lessonCount: 6,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the whole-card press target — routes to /classroom/[slug] on press" },
    Chip: { tier: "atom", role: "the price chip; falls back to the free-course label when priceText is null" },
    Typography: { tier: "atom", role: "the title, optional summary, and lesson-count meta line" },
}

/** LEAF — one shape; skeleton / priced / free / no-summary are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CourseOfferCard"
                tier="block"
                leaf="Course"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="The whole card is one press target — matching the real `landings/Classic.tsx` card-as-link convention — rather than a title link plus a separate open button, since nothing else on the card is independently actionable. `priceText` renders VERBATIM when set; a null price renders the free-course label, a copy decision the expert's own config already implies, never a fabricated number."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The catalog's own first fetch is in flight: title, price chip, summary and lesson count all shimmer at the loaded shape's geometry, so nothing jumps when the course lands.",
                        code: "<CourseOfferCard course={course} onOpenCourse={onOpenCourse} isSkeleton labels={labels} />",
                        render: <CourseOfferCard course={PRICED_COURSE} onOpenCourse={() => {}} isSkeleton labels={LABELS} />,
                    },
                    {
                        name: "priceText set, summary set",
                        why: "The typical course: a real price chip and a one-line summary drawn straight from `CourseEntity`.",
                        code: "<CourseOfferCard course={course} onOpenCourse={onOpenCourse} labels={labels} />",
                        render: <CourseOfferCard course={PRICED_COURSE} onOpenCourse={() => {}} labels={LABELS} />,
                    },
                    {
                        name: "priceText = null (free course)",
                        why: "`Course.priceText` is nullable — the chip falls back to `labels.freeLabel` instead of inventing a price or hiding the chip.",
                        code: "<CourseOfferCard course={freeCourse} onOpenCourse={onOpenCourse} labels={labels} />",
                        render: <CourseOfferCard course={FREE_COURSE} onOpenCourse={() => {}} labels={LABELS} />,
                    },
                    {
                        name: "summary = null",
                        why: "`Course.summary` is nullable — the summary line is omitted entirely rather than rendering an empty paragraph.",
                        code: "<CourseOfferCard course={noSummaryCourse} onOpenCourse={onOpenCourse} labels={labels} />",
                        render: <CourseOfferCard course={NO_SUMMARY_COURSE} onOpenCourse={() => {}} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
