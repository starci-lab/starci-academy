import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    OfferSection,
    type OfferSectionCourseRow,
    type OfferSectionLabels,
} from "@sb-components/nivoexpert/blocks/landing/OfferSection/OfferSection"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `OfferSection` — the landing's closing pricing/enrol push: every real course
 * restated as one compact row (title · real lesson count · real price) with its
 * own Enrol CTA, inside a single surface. A nivo tenant sells single courses, not
 * tiers, so this restates each course's real price instead of a tier grid. An
 * optional risk-reversal `guarantee` line renders ONLY when the connected layer
 * hands one in from a real refund policy. Built on the shared HeroUI
 * atom/composite system (`SurfaceCard` / `List.Row` / `Chip` / `Button`).
 */
const meta: Meta<typeof OfferSection> = {
    title: "NivoExpert/Blocks/Landing/OfferSection/OfferSection",
    component: OfferSection,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof OfferSection>

const LABELS: OfferSectionLabels = {
    eyebrow: "Enrol",
    title: "Ready to start?",
    intro: "Every price below is Course.priceText, verbatim — no tier grid, no invented plan.",
    freeLabel: "Free",
    lessonsSuffix: "lessons",
    enrolLabel: "Enrol now",
    emptyTitle: "The first course is still being built",
    emptyDescription: "Nothing is open for enrolment yet — leave your contact below and you'll hear the moment it is.",
    emptyCtaLabel: "Get notified",
}

const COURSES: Array<OfferSectionCourseRow> = [
    { slug: "eight-session-launch", title: "Launch in Eight Sessions", priceText: "$129", lessonCount: 8 },
    { slug: "seed-round-pitch", title: "Seed Round Pitch Prep", priceText: "$89", lessonCount: 6 },
    { slug: "no-code-first-mvp", title: "Build Your First MVP, No Code", priceText: null, lessonCount: 5 },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Typography: { tier: "atom", role: "the eyebrow/title/intro header" },
    SurfaceCard: { tier: "composite", role: "the single surface every course row lives inside" },
    ListRow: { tier: "composite", role: "one course per row — title, real lesson count, price chip, Enrol CTA", storyId: "composites-lists-list-listrow--meta-trailing" },
    Chip: { tier: "atom", role: "each row's price — `Course.priceText` verbatim, or the free-course label" },
    Button: { tier: "atom", role: "each row's own Enrol CTA, and the empty branch's contact CTA" },
    EmptyState: { tier: "composite", role: "the honest zero-course branch — no fabricated waitlist count" },
    InlineIconLabel: { tier: "composite", role: "the optional risk-reversal line — only rendered with a REAL guarantee" },
}

/** LEAF — one shape; the row list / guarantee / empty / isSkeleton are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="OfferSection"
                tier="block"
                leaf="Offer"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="Blocks take no `className`. Every row restates a REAL `CourseEntity` — title, lesson count, and `priceText` verbatim (or the free-course label when unset) — never a tier grid a single-course tenant doesn't have. `guarantee` is an OPTIONAL prop the connected layer only ever fills from a real refund policy; omitted, no risk-reversal line renders at all rather than a stock guarantee sentence."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The catalog's own first fetch is in flight: three placeholder rows hold the loaded shape while every title/price shimmers and every CTA stops accepting presses.",
                        code: "<OfferSection courses={courses} onEnrol={onEnrol} onContact={onContact} labels={labels} isSkeleton />",
                        render: <OfferSection courses={COURSES} onEnrol={() => {}} onContact={() => {}} isSkeleton labels={LABELS} />,
                    },
                    {
                        name: "courses = [3 real courses], no guarantee",
                        why: "The typical case: no real refund policy exists yet, so the section stops at the row list — no invented guarantee sentence underneath it.",
                        code: "<OfferSection courses={courses} onEnrol={onEnrol} onContact={onContact} labels={labels} />",
                        render: <OfferSection courses={COURSES} onEnrol={() => {}} onContact={() => {}} labels={LABELS} />,
                    },
                    {
                        name: "guarantee = real refund policy",
                        why: "Only rendered when the connected layer hands in an ACTUAL policy the expert has committed to — this is the one state that shows it, so a reader can see it never appears unprompted.",
                        code: `<OfferSection
    courses={courses}
    onEnrol={onEnrol}
    onContact={onContact}
    guarantee="14-day money-back guarantee on every course"
    labels={labels}
/>`,
                        render: (
                            <OfferSection
                                courses={COURSES}
                                onEnrol={() => {}}
                                onContact={() => {}}
                                guarantee="14-day money-back guarantee on every course"
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "courses = [] (nothing open for enrolment yet)",
                        why: "The state every new tenant starts in — the section collapses to an honest 'still being built' message with a contact CTA instead of a bare gap or a fabricated waitlist count.",
                        code: "<OfferSection courses={[]} onEnrol={onEnrol} onContact={onContact} labels={labels} />",
                        render: <OfferSection courses={[]} onEnrol={() => {}} onContact={() => {}} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
