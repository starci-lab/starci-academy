import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    LearnerOverview,
    type LearnerOverviewLabels,
    type LearnerOverviewStats,
    type LearnerXpView,
} from "@sb-components/nivoexpert/blocks/learn/LearnerOverview/LearnerOverview"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LearnerOverview` — the student's dashboard-home header: a greeting, then two
 * headline tiles (enrolled courses, lessons completed), then an optional XP/level
 * strip. The two pictures — `xp present`, `xp unavailable` — are DATA, so they are
 * STATES of the single shape. Grounded in the real `myXp` query and the client's
 * own per-course progress count.
 */
const meta: Meta<typeof LearnerOverview> = {
    title: "NivoExpert/Blocks/Learn/LearnerOverview/LearnerOverview",
    component: LearnerOverview,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LearnerOverview>

const LABELS: LearnerOverviewLabels = {
    greetingPrefix: "Welcome back",
    enrolledLabel: "Enrolled courses",
    completedLabel: "Lessons completed",
    levelPrefix: "Level",
    xpSuffix: "XP",
    nextLevelPrefix: "to next level",
    maxLevelLabel: "Max level",
}

const RETURNING_STATS: LearnerOverviewStats = { enrolledCount: 2, completedLessons: 6 }
const NEW_STATS: LearnerOverviewStats = { enrolledCount: 0, completedLessons: 0 }

const RETURNING_XP: LearnerXpView = { xp: 340, level: 3, title: "Explorer", nextAt: 500 }
const NEW_XP: LearnerXpView = { xp: 0, level: 1, title: "Newcomer", nextAt: 100 }
const MAX_XP: LearnerXpView = { xp: 4200, level: 10, title: "Grandmaster", nextAt: null }

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Typography: { tier: "atom", role: "the greeting line and every value inside the tiles/XP strip" },
    MetricCard: { tier: "composite", role: "the two headline tiles — enrolled courses, lessons completed" },
    SurfaceCard: { tier: "composite", role: "the XP/level strip's card face" },
    Chip: { tier: "atom", role: "the level chip inside the XP strip" },
    ProgressBar: { tier: "atom", role: "the XP-to-next-level track inside the strip" },
}

/** LEAF — one shape; XP present / absent / max-level and skeleton are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LearnerOverview"
                tier="block"
                leaf="Overview"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                reason="Blocks take no `className`: the block owns the greeting, the two headline tiles, and the XP strip, so its pictures are states of one shape. `enrolledCount`/`completedLessons` are counted by the connected layer across every course's progress — there is no single `myEnrollments` BE field yet. The real `myXp` fetch runs independently and fails SILENTLY, so `xp: null` renders no strip at all rather than an error."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The overview's own first fetch is in flight: the greeting, both tiles, and the XP strip all draw their skeleton mirror, matching the resolved layout so nothing jumps when the data lands.",
                        code: "<LearnerOverview {...props} isSkeleton />",
                        render: <LearnerOverview learnerName="Minh Anh" stats={RETURNING_STATS} xp={RETURNING_XP} isSkeleton labels={LABELS} />,
                    },
                    {
                        name: "returning learner, mid-level",
                        why: "A member with real progress across two courses and an XP balance partway to the next level — the ordinary shape of this block.",
                        code: "<LearnerOverview learnerName={name} stats={stats} xp={xp} labels={labels} />",
                        render: <LearnerOverview learnerName="Minh Anh" stats={RETURNING_STATS} xp={RETURNING_XP} labels={LABELS} />,
                    },
                    {
                        name: "brand-new member, level 1",
                        why: "A freshly registered member: zero enrolled courses, zero completed lessons, and a starting XP balance at level 1 — every number reads honestly, not hidden.",
                        code: "<LearnerOverview learnerName={name} stats={zeroStats} xp={newXp} labels={labels} />",
                        render: <LearnerOverview learnerName="Minh Anh" stats={NEW_STATS} xp={NEW_XP} labels={LABELS} />,
                    },
                    {
                        name: "max level (nextAt = null)",
                        why: "Once `nextAt` is `null` there is no next level to progress toward, so the strip reads \"Max level\" instead of a countdown.",
                        code: "<LearnerOverview {...props} xp={maxLevelXp} />",
                        render: <LearnerOverview learnerName="Minh Anh" stats={RETURNING_STATS} xp={MAX_XP} labels={LABELS} />,
                    },
                    {
                        name: "xp = null (fetch failed silently)",
                        why: "The real client's `myXp()` call can fail independently of the rest of the overview and is swallowed on purpose — the strip is simply omitted, the tiles above still render.",
                        code: "<LearnerOverview {...props} xp={null} />",
                        render: <LearnerOverview learnerName="Minh Anh" stats={RETURNING_STATS} xp={null} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
