import type { Meta, StoryObj } from "@storybook/nextjs"
import { ModulePage } from "@sb-components/starci/pages/ModulePage/ModulePage"
import { CourseContentTier } from "@sb-components/starci/blocks/learn/ModuleHeader/ModuleHeader"
import { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ModulePage` — the screen for one module's own page: orient, resume, then
 * browse everything it contains. A screen owns a list of functions: it calls
 * blocks, places them in frames, and hands each typed data. Five functions, in
 * reading order: orient · gate (paywall, reused from `ContentPaywall`) · resume
 * + completion · browse lessons · browse challenges. The paywall replaces
 * browsing rather than sitting above it (the `Locked` leaf). The challenge list
 * is a screen-owned structural switch worth its own leaf (`NoChallenges`), on
 * the `challenges.length > 0` branch the screen itself makes.
 */
const meta: Meta<typeof ModulePage> = {
    title: "StarCi/Pages/ModulePage/ModulePage",
    component: ModulePage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ModulePage>

const BASE = {
    breadcrumbItems: [
        { key: "courses", label: "Courses", onPress: () => {} },
        { key: "course", label: "DevOps Mastery", onPress: () => {} },
        { key: "module", label: "Chapter 2 · Containerization" },
    ],
    title: "Chapter 2 · Containerization",
    description: "From optimized images to multi-stage builds — everything you need to package an app for production.",
    tier: CourseContentTier.Intermediate,
    lessonCount: 6,
    minutesTotal: 78,
    challengeCount: 4,
    resumeLessonTitle: "Writing an optimized Dockerfile",
    lessonsRead: 2,
    lessonsTotal: 6,
    challengesDone: 1,
    challengesTotal: 4,
    onResume: () => {},
    lessons: [
        { id: "l1", title: "What is Docker", minutesRead: 6, challengeCount: 1, isRead: true, isPremium: false, difficulty: "beginner" as const },
        { id: "l2", title: "Writing an optimized Dockerfile", minutesRead: 12, challengeCount: 1, isRead: false, isPremium: false, difficulty: "intermediate" as const },
        { id: "l3", title: "Multi-stage build", minutesRead: 9, challengeCount: 1, isRead: false, isPremium: true, difficulty: "intermediate" as const },
        { id: "l4", title: "Pinning tags for production", minutesRead: 7, challengeCount: 1, isRead: false, isPremium: true, difficulty: "advanced" as const },
    ],
    resumeLessonId: "l2",
    onSelectLesson: () => {},
    challenges: [
        { id: "c1", title: "Write a Dockerfile for a Node app", difficulty: "beginner" as const, completed: true, lessonId: "l1" },
        { id: "c2", title: "Trim an image down below 100MB", difficulty: "intermediate" as const, completed: false, lessonId: "l2" },
        { id: "c3", title: "Separate the build stage from the runtime stage", difficulty: "advanced" as const, completed: false, lessonId: "l3" },
    ],
    onSelectChallenge: () => {},
}

const PAYWALL = {
    isLocked: true,
    paywallTitle: "The rest is for enrolled learners",
    paywallDescription: "Unlock every lesson, challenge, and sandbox in this course.",
    discountedPriceVnd: 1290000,
    originalPriceVnd: 1990000,
    currentPhase: PricingPhase.Pioneer,
    seatsRemaining: 12,
    nextPhasePriceVnd: 1590000,
    paywallCtaLabel: "Unlock this course",
    onPurchase: () => {},
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Container": { tier: "frame", role: "the content measure that caps and centers the whole module page", storyId: "frames-container-container--default" },
    "StackV": { tier: "frame", role: "the vertical frame that owns every seam on this screen — between the header, the gate/browsing region, and the blocks inside it", storyId: "frames-stack-stackv--default" },
    "ModuleHeader": { tier: "block", role: "what this module is: trail, title, description, tier, and its three headline counts", storyId: "starci-blocks-learn-moduleheader-moduleheader--full" },
    "ContentPaywall": { tier: "block", role: "the offer where an unpurchased module stops — REUSED from the lesson reader, same wall, same reason", storyId: "starci-blocks-learn-contentpaywall-contentpaywall--full" },
    "ModuleContinueBand": { tier: "block", role: "resume where the learner left off, and how much of the module is done", storyId: "starci-blocks-learn-modulecontinueband-modulecontinueband--resume-available" },
    "ModuleLessonList": { tier: "block", role: "the module's full, ordered lesson table of contents", storyId: "starci-blocks-learn-modulelessonlist-modulelessonlist--list" },
    "ModuleChallengeList": { tier: "block", role: "every challenge across this module's lessons, flattened into one solve-me list", storyId: "starci-blocks-learn-modulechallengelist-modulechallengelist--list" },
    "AsyncContentEmpty": { tier: "composite", role: "the empty-message frame shown when the module has no lessons at all", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
}

/** LEAF — an UNLOCKED module with challenges: the whole spine, header to challenge list. */
export const Full: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModulePage"
                tier="screen"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isLocked = false, challenges.length > 0",
                        why: "Every function of the screen is present: orient, resume + completion, browse lessons, browse challenges. Each of the five nodes below is a block or a frame — the screen itself draws no shape of its own.",
                        code: `<ModulePage
    title="Chapter 2 · Containerization"
    lessons={lessons}
    challenges={challenges}
    …
/>`,
                        render: <ModulePage {...BASE} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — an unlocked module with NO challenges yet ⇒ **loses one whole block**, a screen-owned decision. */
export const NoChallenges: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModulePage"
                tier="screen"
                leaf="NoChallenges"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "challenges = []",
                        why: "A module with no challenges yet does not earn an empty challenge list on its own page — the same 'a count of zero is not news' idiom `ModuleHeader` already applies to its own chips, extended here to a whole block's presence. This is the screen's own condition, not something delegated into the block.",
                        code: `<ModulePage
    {...props}
    challenges={[]}
/>`,
                        render: <ModulePage {...BASE} challenges={[]} challengeCount={0} challengesTotal={0} challengesDone={0} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a LOCKED module ⇒ **the paywall replaces resume + both lists**, not stacked above them. */
export const Locked: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModulePage"
                tier="screen"
                leaf="Locked"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isLocked = true",
                        why: "The resume band, the lesson list and the challenge list are all gone — three functions replaced by one offer. A learner who has not bought the course has one decision to make, and leaving three more things to browse underneath would either leak content or dangle controls that go nowhere.",
                        code: `<ModulePage
    {...props}
    isLocked
    paywallTitle="The rest is for enrolled learners"
    discountedPriceVnd={1290000}
    …
/>`,
                        render: <ModulePage {...BASE} {...PAYWALL} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the module has no lessons at all ⇒ **the entire spine is replaced**, not just one block. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModulePage"
                tier="screen"
                leaf="Empty"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isEmpty = true",
                        why: "There is no header, no gate, no lists — the whole spine is swapped for one empty message, because a module with nothing in it has nothing to orient toward yet either.",
                        code: "<ModulePage {...props} isEmpty />",
                        render: <ModulePage {...BASE} isEmpty />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; every block draws its own resting shape. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModulePage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every block that can mirror itself does (§12c) — the screen builds no separate shimmer tree. The challenge list keeps its guessed rows during loading even though the real `challenges` array is empty, so the page does not lose a block only to gain it back once data lands.",
                        code: "<ModulePage {...props} isSkeleton />",
                        render: <ModulePage {...BASE} isSkeleton challenges={[]} />,
                    },
                ]}
            />
        </div>
    ),
}
