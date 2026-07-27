import React from "react"
import { StackIcon } from "@phosphor-icons/react"
import { CourseBrief } from "@sb-components/blocks/learn/CourseBrief/CourseBrief"
import { KeepGoingPath, type KeepGoingContent } from "@sb-components/blocks/learn/KeepGoingPath/KeepGoingPath"
import { LearnNudges, type LearnNudge } from "@sb-components/blocks/learn/LearnNudges/LearnNudges"
import { CourseTeamGate } from "@sb-components/blocks/learn/CourseTeamGate/CourseTeamGate"
import {
    TrialConversionStrip,
    type TrialConversionStripPrice,
} from "@sb-components/blocks/commerce/TrialConversionStrip/TrialConversionStrip"
import { PricingPhase } from "@sb-components/designs/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { ContinueLearning } from "@sb-components/blocks/learn/ContinueLearning/ContinueLearning"
import { AsyncContent } from "@sb-components/layouts/async/AsyncContent/AsyncContent"
import { Container } from "@sb-components/layouts/layout/Container/Container"
import { Stack } from "@sb-components/layouts/layout/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (page) — the `/learn/content` dashboard, rendered as a STATIC
 * presentational leaf (like the `Overlays/*` stories): the live feature
 * `src/components/features/learn/CourseContents` reads redux/SWR, so — same as
 * every layout/overlay story — this port composes the ALREADY-PORTED blocks with
 * demo data instead of mounting the store-coupled original.
 *
 * §14a — a screen is a LIST OF FEATURES. Six blocks, nothing else:
 * `CourseBrief` (what this course is) · `CourseTeamGate` (GitHub team gate) ·
 * `TrialConversionStrip` (trial→purchase conversion) · `ContinueLearning` (resume where
 * you left off) · `LearnNudges` (what to do today) · `KeepGoingPath` (keep going in the
 * chapter).
 *
 * The list above names BLOCKS. It used to say `Feedback.Callout` for the gate — that is
 * the FRAME the gate uses internally, not the block the screen calls. Naming the frame
 * here is the same mistake that keeps the node out of the anatomy tree (the DOM emits
 * `CourseTeamGate`), so the two must be kept in the same words.
 *
 * Screen IMPORT BOUNDARY (tightened 2026-07-27 — the old note said "no importing the
 * layout tier" but this very file already imports `Container`/`Stack`, so the rule
 * contradicted itself):
 *   ALLOWED: use the layout tier's FRAME (`Container`, `Stack`, `Grid`) to arrange —
 *      that's exactly where §10c's scale gets enforced by TYPE (`gap: SpaceScale`).
 *   FORBIDDEN: hand-rolling a `div` + layout class. No `mx-auto max-w-*`, no `flex gap-*`.
 *   FORBIDDEN: importing an ATOM. Text/buttons/chips are the block's job — a screen
 *      touching an atom means it's presenting itself, encroaching on the tier below.
 *   FORBIDDEN: passing JSX down to a block. Only TYPED DATA (§14d.1).
 *   FORBIDDEN: importing the DESIGN tier. Design is UI/UX ONLY (teacher's call
 *      2026-07-27) — it must not know what a "lesson"/"challenge" is. A screen touching
 *      design means the screen is writing domain copy itself. Anchor: `ContinueCard`
 *      (design) used to sit directly here with the screen assembling `"Read 8/23
 *      lessons"` itself; it now goes through the block `ContinueLearning`, and the
 *      screen only hands over NUMBERS.
 * ─────────────────────────────────────────────────────────────────────────────
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
    { id: "l1", title: "Docker là gì", minutes: 6, state: "done", difficulty: "beginner", onPress: () => {} },
    { id: "l2", title: "Viết Dockerfile tối ưu", minutes: 12, state: "active", difficulty: "intermediate", onPress: () => {} },
    { id: "l3", title: "Multi-stage build", minutes: 9, state: "todo", difficulty: "intermediate", locked: true, onPress: () => {} },
]

// Plain DATA — `kind` is an ENUM; the `LearnNudges` block decides the icon itself (§14b).
const NUDGES: Array<LearnNudge> = [
    { id: "flashcards", kind: "flashcards", title: "Ôn 12 thẻ đến hạn hôm nay", onPress: () => {} },
    { id: "mock-interview", kind: "interview", title: "Luyện phỏng vấn cho capstone", onPress: () => {} },
    { id: "league", kind: "league", title: "Bạn đang hạng #42 tuần này", onPress: () => {} },
]

/** Props for {@link CourseContents}. */
export interface CourseContentsLayoutProps {
    /** `"trial"` shows the gh-team gate + conversion strip; `"paid"` self-hides both. */
    viewer?: "trial" | "paid"
    /**
     * `true` → the whole screen is at REST. The flag flows straight down to every
     * block, and each block draws its OWN resting shape (§12c) — the screen builds
     * no shimmer tree of its own.
     *
     * 2026-07-27 (teacher: "the top tier needs isSkeleton too, for consistency"):
     * before this the screen used `state="loading"` — A SEPARATE VOCABULARY just for
     * this tier, while atom · layout · design · block all already say `isSkeleton`.
     * Same concept, different name at the top tier, and the reader has to translate
     * it every time they cross the boundary.
     */
    isSkeleton?: boolean
    /** `true` → the course has no lessons yet; `AsyncContent.Empty` replaces the ENTIRE spine. */
    isEmpty?: boolean
}

/**
 * Empty state — the course has no contents yet.
 *
 * The frame and the content each carry THEIR OWN name. Until 2026-07-27 the wrapping
 * `Container` wore `anatPart="AsyncContent.Empty"` while the real frame emitted nothing,
 * so the single node in the Empty tree was the CONTAINER wearing the name (and the story
 * link) of the thing inside it, and `Container` — a dep like any other frame — vanished
 * from this state even though the content state declares it.
 */
const CourseContentsEmpty = () => (
    <Container.Base anatPart="Container" size="md" padding={6}>
        <AsyncContent.Empty
            anatPart="AsyncContent.Empty"
            icon={StackIcon}
            title="Khoá này chưa có bài học nào"
            description="Nội dung đang được biên soạn — quay lại sau nhé."
        />
    </Container.Base>
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
    // 2026-07-27: the resting state is NO LONGER a separate tree. Before this there
    // was a whole `CourseContentsLoading` hand-building a set of gray bars with HeroUI's
    // `Skeleton` — meaning a SECOND TREE had to be kept in sync with the real tree by
    // hand, and it HAD DRIFTED: the mirror drew 2 blocks while the real tree has 5.
    // Now every block takes `isSkeleton` and draws its OWN resting shape (§12c), so
    // there's only ONE tree left — it can no longer drift.
    return (
        // The FRAME goes through the layout tier, the screen does NOT hand-roll a `div` (§13):
        //   • `mx-auto max-w-3xl p-6` → `Container.Base size="md" padding={6}` — `md` reads
        //     from the token `--container-app-md`, the same 768px but from the RIGHT SOURCE;
        //     `max-w-3xl` is a different scale, and if the token changes it drifts silently
        //     (see the `SIZE_CLASS` JSDoc).
        //   • `gap-10` → `gap={8}`. `10` is NOT on the §10c scale (0·1·2·3·6·8) — the frame's
        //     `SpaceScale` type means an off-scale value is now a TYPE ERROR at the call site,
        //     it can no longer slip through. This is exactly where the §10 rule gets enforced.
        // WARNING, 2026-07-27 — `gap` has been REMOVED from this call: `Container.Base` only applies
        // `gap` when using the `header`/`footer` slots; passing `children` directly means that
        // prop is DROPPED SILENTLY. Measured consequence: the seam between `CourseBrief` and
        // the block below it was EXACTLY 0 — the page read as if the title were stuck to the
        // card. Writing `gap={8}` with nothing to receive it is worse than not writing it at
        // all: reading the code makes it look like the rhythm was already set.
        <Container.Base size="md" padding={6} anatPart="Container">
            {/* VERTICAL rhythm owned by ONE party (§10a). Two deliberately different steps:
            `8` separates the course IDENTITY cluster from the content below (seam between two
            REGIONS), `6` is the rhythm between blocks within the same region — §10
            "sections-wide vs related-tight", uniform spacing is forbidden. */}
            <Stack.V gap={8} anatPart="Stack.V.Page">
                {/* 2026-07-26: dropped the old note "blocks have no `anatPart` yet so they need
            a div wrapper" — all six blocks now take `anatPart` directly, no wrapper left. */}
                {/* §11a — the badge stops at the HIGHEST node `CourseBrief` (BLOCK). The
            `Page.Header` frame lives INSIDE that block → drill down in CourseBrief's own
            story, NOT here. Teacher's call 2026-07-25: this cluster carries business meaning
            (read/unread) so it's a BLOCK, the screen no longer calls the layout frame directly. */}
                <CourseBrief.Base
                    anatPart="CourseBrief"
                    breadcrumbItems={[
                        { key: "courses", label: "Khoá học", onPress: () => {} },
                        { key: "course", label: "DevOps Mastery" },
                    ]}
                    title="DevOps Mastery"
                    description="Từ CI/CD tới Kubernetes production — lộ trình thực chiến."
                    moduleCount={8}
                    hours={14}
                    learnerCount={2481}
                    isSkeleton={isSkeleton}
                />

                <Stack.V gap={6} anatPart="Stack.V">
                    {/* Gate is for people who ALREADY BOUGHT (backend scopes the team by
                is_enrolled). The old version gated it backwards, on `viewer === "trial"`. The
                block hides itself, so the screen just hands over the facts. */}
                    <CourseTeamGate.Base
                        anatPart="CourseTeamGate"
                        isEnrolled={viewer === "paid"}
                        isInTeam={false}
                        onJoin={() => {}}
                        isSkeleton={isSkeleton}
                    />

                    {viewer === "trial" ? (
                        <TrialConversionStrip.Base
                            anatPart="TrialConversionStrip"
                            freeLessonsRemaining={9}
                            price={SAMPLE_PRICE}
                            onEnroll={() => {}}
                            isSkeleton={isSkeleton}
                        />
                    ) : null}

                    {/* `hero`, NOT `plain` (teacher's call 2026-07-25): the frameless version
                lets the progress bar drift outside, with nothing holding it in place so it
                reads as belonging to the block below. The hero frame gathers title · meta ·
                progress · CTA into ONE block — this is also the canonical case for
                `HighlightCard`: a single "resume the in-progress session" highlight on the page.

                NO `eyebrow` (teacher's eye check 2026-07-25): eyebrow exists to STAND IN for
                the frame — a frameless block is what needs a light label line saying what this
                cluster is. The hero already has a frame + arc ring + a "Continue" button, so
                adding "Continue learning" would be saying it twice. */}
                    <ContinueLearning.Base
                        anatPart="ContinueLearning"
                        lessonIndex={4}
                        lessonTitle="Viết Dockerfile tối ưu"
                        lessonsRead={8}
                        lessonsTotal={23}
                        challengesDone={2}
                        challengesTotal={9}
                        progressPercent={34}
                        onResume={() => {}}
                        isSkeleton={isSkeleton}
                    />

                    <LearnNudges.Base
                        anatPart="LearnNudges"
                        items={NUDGES}
                        isSkeleton={isSkeleton}
                    />

                    <KeepGoingPath.Base
                        anatPart="KeepGoingPath"
                        module={{ index: 2, name: "Container hoá" }}
                        contents={KEEP_GOING}
                        isSkeleton={isSkeleton}
                    />
                </Stack.V>
            </Stack.V>
        </Container.Base>
    )
}
