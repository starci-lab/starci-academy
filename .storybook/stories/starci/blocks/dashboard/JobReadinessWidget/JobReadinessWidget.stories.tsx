import type { Meta, StoryObj } from "@storybook/nextjs"
import { JobReadinessWidget, type JobReadinessTrack } from "@sb-components/starci/blocks/dashboard/JobReadinessWidget/JobReadinessWidget"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `JobReadinessWidget`: "Độ sẵn sàng của tôi" — the self job-readiness
 * summary for the viewer's strongest purchased-course track. See the
 * component's own file header for the full contract; this file only adds the
 * states.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): which pillar bars render is a DATA condition
 * (a pillar with no score is omitted, never zero-filled), not a different
 * shape this block draws — so loading / empty / error / content-with-various-
 * pillars are all states of the same one leaf ("Content").
 */
const meta: Meta<typeof JobReadinessWidget> = {
    title: "StarCi/Blocks/Dashboard/JobReadinessWidget/JobReadinessWidget",
    component: JobReadinessWidget,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof JobReadinessWidget>

const TRACK_ALL_PILLARS: JobReadinessTrack = {
    courseTitle: "Fullstack Mastery",
    depthScore: 78,
    band: "building",
    capstoneScore: 82,
    interviewScore: 65,
    cvScore: 74,
}

const TRACK_MISSING_CV: JobReadinessTrack = {
    courseTitle: "Fullstack Mastery",
    depthScore: 41,
    band: "needsWork",
    capstoneScore: 55,
    interviewScore: 48,
    cvScore: null,
    nextAction: { label: "Chấm điểm CV của bạn", onPress: () => {} },
}

const TRACK_JOB_READY: JobReadinessTrack = {
    courseTitle: "Backend Mastery",
    depthScore: 91,
    band: "jobReady",
    capstoneScore: 95,
    interviewScore: 88,
    cvScore: 90,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the labeled card face, drawing the \"Độ sẵn sàng của tôi\" label above the headline, chip and pillar bars", storyId: "composites-cards-surfacecard-surfacecard--with-label" },
    "StackV": { tier: "frame", role: "the vertical frame stacking the headline row above the foundation line and each pillar meter", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the headline row, holding the depth-score stat pair beside the band chip", storyId: "frames-stack-stackh--default" },
    "StatPair": { tier: "composite", role: "the headline depth score with the course title as its caption", storyId: "composites-stats-statpair--single" },
    "EnumChip": { tier: "composite", role: "the readiness band, mapped from the closed needsWork/building/jobReady set to a soft chip tone", storyId: "composites-chips-enumchip--gallery" },
    "Typography": { tier: "atom", role: "the foundation-percentile line, or a pillar's skeleton label", storyId: "atoms-text-typography-typography--plain" },
    "ProgressMeter": { tier: "composite", role: "one pillar's bar (capstone / phỏng vấn thử / CV), omitted entirely when that pillar has no score yet", storyId: "composites-stats-progressmeter--label-and-value" },
    "Button": { tier: "atom", role: "the single next-step CTA, fully pre-built by the caller (label + onPress) and omitted once every pillar has a score", storyId: "atoms-buttons-button-button--default" },
    "Skeleton": { tier: "heroui", role: "the loading mirror standing in for a pillar's meter — `ProgressMeter` has no `isSkeleton` shape of its own yet, so this block substitutes a bar-shaped shimmer matching the real track's height" },
}

/** LEAF — the readiness widget: async lifecycle, headline, foundation line and pillar bars, all as states of one shape. */
export const Content: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="JobReadinessWidget"
                tier="block"
                leaf="Content"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "content, every pillar attempted",
                        why: "The everyday shape once the learner has attempted all three pillars: all three bars render, the band chip reads \"building\" (depth score below the job-ready bar), and — because every pillar already has a score — `nextAction` is omitted, so no CTA renders (this widget never re-suggests a pillar that already has a result).",
                        code: `<JobReadinessWidget
    isLoading={false}
    isEmpty={false}
    onRetry={refetch}
    codingPercentile={62}
    track={{
        courseTitle: "Fullstack Mastery",
        depthScore: 78,
        band: "building",
        capstoneScore: 82,
        interviewScore: 65,
        cvScore: 74,
    }}
/>`,
                        render: (
                            <JobReadinessWidget
                                anatPart="JobReadinessWidget"
                                showAnatomy
                                isLoading={false}
                                isEmpty={false}
                                onRetry={() => {}}
                                codingPercentile={62}
                                track={TRACK_ALL_PILLARS}
                            />
                        ),
                    },
                    {
                        name: "content, one pillar missing (CTA present)",
                        why: "The CV pillar has never been scored, so its meter is OMITTED (never zero-filled — a 0/100 bar would read as a failed attempt, not a missing one) and the caller-built `nextAction` renders as the single CTA pointing at exactly that pillar.",
                        code: `<JobReadinessWidget
    isLoading={false}
    isEmpty={false}
    onRetry={refetch}
    codingPercentile={38}
    track={{
        courseTitle: "Fullstack Mastery",
        depthScore: 41,
        band: "needsWork",
        capstoneScore: 55,
        interviewScore: 48,
        cvScore: null,
        nextAction: { label: "Chấm điểm CV của bạn", onPress: () => router.push(cvHref) },
    }}
/>`,
                        render: (
                            <JobReadinessWidget
                                isLoading={false}
                                isEmpty={false}
                                onRetry={() => {}}
                                codingPercentile={38}
                                track={TRACK_MISSING_CV}
                            />
                        ),
                    },
                    {
                        name: "content, job-ready band, no foundation percentile",
                        why: "A track that clears every bar reads \"jobReady\" (success tone). `codingPercentile` is `null` here (the viewer hasn't ranked on practice problems) — the foundation line is a course-independent SEPARATE signal, so its absence never blocks the track's own headline/pillars from rendering.",
                        code: `<JobReadinessWidget
    isLoading={false}
    isEmpty={false}
    onRetry={refetch}
    codingPercentile={null}
    track={{ courseTitle: "Backend Mastery", depthScore: 91, band: "jobReady", capstoneScore: 95, interviewScore: 88, cvScore: 90 }}
/>`,
                        render: (
                            <JobReadinessWidget
                                isLoading={false}
                                isEmpty={false}
                                onRetry={() => {}}
                                codingPercentile={null}
                                track={TRACK_JOB_READY}
                            />
                        ),
                    },
                    {
                        name: "isLoading = true",
                        why: "Before the first `myJobReadiness` response lands, `AsyncContent` picks the loading branch and this block hands it a fixed-shape skeleton mirror — headline, chip and three pillar bars — so the card doesn't resize once the real track lands.",
                        code: "<JobReadinessWidget isLoading isEmpty={false} onRetry={refetch} />",
                        render: (
                            <JobReadinessWidget
                                isLoading
                                isEmpty={false}
                                onRetry={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isEmpty = true",
                        why: "The viewer owns no purchased-course track yet, so `AsyncContent` falls to its empty branch instead of drawing a headline with nothing behind it — the fairness model this widget follows never invites buying a course from inside this nudge, so the empty message only explains what unlocks it.",
                        code: "<JobReadinessWidget isLoading={false} isEmpty onRetry={refetch} />",
                        render: (
                            <JobReadinessWidget
                                isLoading={false}
                                isEmpty
                                onRetry={() => {}}
                            />
                        ),
                    },
                    {
                        name: "error present",
                        why: "A failed `myJobReadiness` fetch beats loading/empty/content in `AsyncContent`'s priority order, so a stale snapshot never sits under a silent spinner. `onRetry` is the caller's own refetch — the block only supplies the wording and the button.",
                        code: "<JobReadinessWidget isLoading={false} isEmpty={false} error={fetchError} onRetry={refetch} />",
                        render: (
                            <JobReadinessWidget
                                isLoading={false}
                                isEmpty={false}
                                error={new Error("network")}
                                onRetry={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
