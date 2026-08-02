import React from "react"
import { StackIcon } from "@phosphor-icons/react"
import { CourseBrief } from "@sb-components/starci/blocks/learn/CourseBrief/CourseBrief"
import { KeepGoingPath, type KeepGoingContent } from "@sb-components/starci/blocks/learn/KeepGoingPath/KeepGoingPath"
import { LearnNudges, type LearnNudge } from "@sb-components/starci/blocks/learn/LearnNudges/LearnNudges"
import { CourseTeamGate } from "@sb-components/starci/blocks/learn/CourseTeamGate/CourseTeamGate"
import { TrialConversionStrip, type TrialConversionStripPrice } from "@sb-components/starci/blocks/commerce/TrialConversionStrip/TrialConversionStrip"
import { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { ContinueLearning } from "@sb-components/starci/blocks/learn/ContinueLearning/ContinueLearning"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"
/**
 * `CourseContents` — the `/learn/content` dashboard screen, rendered as a static
 * presentational leaf (the live feature reads Redux/SWR; this composes the ported
 * blocks with demo data).
 *
 * Six blocks, nothing else: `CourseBrief` (what this course is), `CourseTeamGate`
 * (GitHub team gate), `TrialConversionStrip` (trial → purchase), `ContinueLearning`
 * (resume where you left off), `LearnNudges` (what to do today), `KeepGoingPath` (keep
 * going in the chapter). A screen arranges blocks in frames and hands them typed data
 * only — no atoms, no design tier, no hand-rolled layout divs.
 */
const SAMPLE_PRICE: TrialConversionStripPrice = {
    discountedPriceVnd: 1_990_000,
    originalPriceVnd: 2_990_000,
    phasePriceVnd: 2_490_000,
    discountPercent: 33,
    currentPhase: PricingPhase.EarlyBird,
    seatsRemainingInCurrentPhase: 14,
    nextPhasePriceVnd: 2_490_000,
}
// Plain DATA — the visuals (state icon, difficulty chip, lock mark) are owned by the
// `KeepGoingPath` block. The screen doesn't know what an "in-progress" lesson looks like.
const KEEP_GOING: Array<KeepGoingContent> = [
    { id: "l1", title: "What is Docker", minutes: 6, state: "done", difficulty: "beginner", onPress: () => {} },
    { id: "l2", title: "Writing an optimized Dockerfile", minutes: 12, state: "active", difficulty: "intermediate", onPress: () => {} },
    { id: "l3", title: "Multi-stage build", minutes: 9, state: "todo", difficulty: "intermediate", locked: true, onPress: () => {} },
]
// Plain DATA — `kind` is an ENUM; the `LearnNudges` block decides the icon itself (§14b).
const NUDGES: Array<LearnNudge> = [
    { id: "flashcards", kind: "flashcards", title: "Review 12 cards due today", onPress: () => {} },
    { id: "mock-interview", kind: "interview", title: "Practice interviewing for your capstone", onPress: () => {} },
    { id: "league", kind: "league", title: "You're ranked #42 this week", onPress: () => {} },
]
/** Props for {@link CourseContents}. */
export interface CourseContentsLayoutProps {
    /** `"trial"` shows the gh-team gate + conversion strip; `"paid"` self-hides both. */
    viewer?: "trial" | "paid"
    /**
     * `true` → the whole screen is at REST. The flag flows straight down to every
     * block, and each block draws its OWN resting shape — the screen builds
     * no shimmer tree of its own.
     */
    isSkeleton?: boolean
    /** `true` → the course has no lessons yet; `AsyncContentEmpty` replaces the ENTIRE spine. */
    isEmpty?: boolean
}
/**
 * Empty state — the course has no contents yet.
 *
 * The frame and the content each carry THEIR OWN name.
 */
const CourseContentsEmpty = () => (
    <Container

        size="md"
        padding={6}
        body={
            <AsyncContentEmpty

                icon={StackIcon}
                title="This course has no lessons yet"
                description="Content is still being written — check back later."
            />
        }
    />
)
/**
 * The `/learn/content` dashboard leaf.
 *
 * @param props - {@link CourseContentsLayoutProps}
 */
export const CourseContents = ({ viewer = "trial", isSkeleton = false, isEmpty = false }: CourseContentsLayoutProps) => {
    if (isEmpty) {
        return <CourseContentsEmpty />
    }
    // The resting state is not a separate tree: every block takes `isSkeleton` and
    // draws its OWN resting shape, so there is only ONE tree left — it can no longer
    // drift.
    //
    // VERTICAL rhythm owned by ONE party. Two deliberately different steps:
    // `8` separates the course IDENTITY cluster from the content below (seam between two
    // REGIONS), `6` is the rhythm between blocks within the same region —
    // "sections-wide vs related-tight", uniform spacing is forbidden.
    const learnSection = (
        <>
            {/* Gate is for people who ALREADY BOUGHT (backend scopes the team by
            is_enrolled). The old version gated it backwards, on `viewer === "trial"`. The
            block hides itself, so the screen just hands over the facts. */}
            <CourseTeamGate

                isEnrolled={viewer === "paid"}
                isInTeam={false}
                onJoin={() => {}}
                isSkeleton={isSkeleton}
            />
            {viewer === "trial" ? (
                <TrialConversionStrip

                    freeLessonsRemaining={9}
                    price={SAMPLE_PRICE}
                    onEnroll={() => {}}
                    isSkeleton={isSkeleton}
                />
            ) : null}
            {/* `hero`, NOT `plain`: the frameless version
            lets the progress bar drift outside, with nothing holding it in place so it
            reads as belonging to the block below. The hero frame gathers title · meta ·
            progress · CTA into ONE block — this is also the canonical case for
            `HighlightCard`: a single "resume the in-progress session" highlight on the page.
            NO `eyebrow`: eyebrow exists to STAND IN for
            the frame — a frameless block is what needs a light label line saying what this
            cluster is. The hero already has a frame + arc ring + a "Continue" button, so
            adding "Continue learning" would be saying it twice. */}
            <ContinueLearning

                lessonIndex={4}
                lessonTitle="Writing an optimized Dockerfile"
                lessonsRead={8}
                lessonsTotal={23}
                challengesDone={2}
                challengesTotal={9}
                progressPercent={34}
                onResume={() => {}}
                isSkeleton={isSkeleton}
            />
            <LearnNudges

                items={NUDGES}
                isSkeleton={isSkeleton}
            />
            <KeepGoingPath

                module={{ index: 2, name: "Containerization" }}
                contents={KEEP_GOING}
                isSkeleton={isSkeleton}
            />
        </>
    )

    const courseContentsSections = (
        <>
            {/* The badge stops at the HIGHEST node `CourseBrief` (BLOCK). The
            `PageHeader` composite lives INSIDE that block → drill down in CourseBrief's own
            story, NOT here. This cluster carries business meaning
            (read/unread) so it's a BLOCK. */}
            <CourseBrief

                breadcrumbItems={[
                    { key: "courses", label: "Courses", onPress: () => {} },
                    { key: "course", label: "DevOps Mastery" },
                ]}
                title="DevOps Mastery"
                description="From CI/CD to production Kubernetes — a hands-on learning path."
                moduleCount={8}
                hours={14}
                learnerCount={2481}
                isSkeleton={isSkeleton}
            />
            <StackV gap={6} body={learnSection} />
        </>
    )

    const courseContentsBody = <StackV gap={7} body={courseContentsSections} />

    return (
        // The FRAME goes through the frame tier, the screen does NOT hand-roll a `div`:
        //   • `mx-auto max-w-3xl p-6` → `Container size="md" padding={6}` — `md` reads
        //     from the token `--container-app-md`, the same 768px but from the RIGHT SOURCE;
        //     `max-w-3xl` is a different scale, and if the token changes it drifts silently
        //     (see the `SIZE_CLASS` JSDoc).
        //   • `gap-10` → `gap={7}`. `10` is NOT on the scale (0·1·2·3·6·8) — the frame's
        //     `InsetScale` type means an off-scale value is a TYPE ERROR at the call site,
        //     it can no longer slip through. This is exactly where the spacing rule gets enforced.
        // NOTE — `Container` only applies `gap` when using the `header`/`footer` slots; passing
        // `body` directly means that prop is DROPPED SILENTLY. Writing `gap={7}` with nothing to
        // receive it is worse than not writing it at all: reading the code makes it look like the
        // rhythm was already set.
        <Container size="md" padding={6} body={courseContentsBody} />
    )
}