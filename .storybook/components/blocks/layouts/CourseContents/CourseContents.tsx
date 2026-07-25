import React from "react"
import { Button, Typography } from "@heroui/react"
import {
    ArrowRightIcon,
    CardsIcon,
    CheckCircleIcon,
    CircleIcon,
    GithubLogoIcon,
    LockIcon,
    MicrophoneStageIcon,
    PlayIcon,
    StackIcon,
    TrophyIcon,
} from "@phosphor-icons/react"
import { Page } from "../../layout/Page/Page"
import { DifficultyChip, type Difficulty } from "../../chips/DifficultyChip/DifficultyChip"
import { Feedback } from "../../feedback/Feedback/Feedback"
import {
    TrialConversionStrip,
    type TrialConversionStripPrice,
} from "../../commerce/TrialConversionStrip/TrialConversionStrip"
import { PricingPhase } from "../../commerce/PhaseScarcityNote/PhaseScarcityNote"
import { ContinueCard } from "../../cards/ContinueCard/ContinueCard"
import { SurfaceCard } from "../../cards/SurfaceCard/SurfaceCard"
import { List } from "../../lists/List/List"
import { Breadcrumbs } from "../../../atoms/navigation/Breadcrumbs/Breadcrumbs"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { AsyncContent } from "../../async/AsyncContent/AsyncContent"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT (page) — the `/learn/content` dashboard, rendered as a STATIC
 * presentational leaf (like the `Overlays/*` stories): the live feature
 * `src/components/features/learn/CourseContents` reads redux/SWR, so — same as
 * every layout/overlay story — this port composes the ALREADY-PORTED blocks with
 * demo data instead of mounting the store-coupled original.
 *
 * ONE leaf ("Content home") — the page does NOT switch view. `viewer` toggles the
 * self-hiding strips (trial → conversion + gh-gate) which are STATE, not leaves.
 * Khung/block composed (all reuse, §step-2 reuse-first): Page.Header ·
 * Feedback.Callout · TrialConversionStrip · ContinueCard(variant="plain") ·
 * List.Row (as nudge / as lesson) · SurfaceCard.List · Breadcrumbs.Base
 * (collapse trail) · DifficultyChip.
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

interface DemoLesson {
    id: string
    title: string
    minutes: number
    state: "done" | "active" | "todo"
    difficulty: Difficulty
    locked?: boolean
}

const KEEP_GOING: Array<DemoLesson> = [
    { id: "l1", title: "Docker là gì", minutes: 6, state: "done", difficulty: "beginner" },
    { id: "l2", title: "Viết Dockerfile tối ưu", minutes: 12, state: "active", difficulty: "intermediate" },
    { id: "l3", title: "Multi-stage build", minutes: 9, state: "todo", difficulty: "intermediate", locked: true },
]

const lessonLeading = (state: DemoLesson["state"]): React.ReactNode => {
    if (state === "active") {
        return <PlayIcon aria-hidden focusable="false" className="size-5 text-accent-soft-foreground" />
    }
    if (state === "done") {
        return <CheckCircleIcon aria-hidden focusable="false" className="size-5 text-success-soft-foreground" />
    }
    return <CircleIcon aria-hidden focusable="false" className="size-5 text-foreground" />
}

/** Props for {@link CourseContents}. */
export interface CourseContentsLayoutProps {
    /** `"trial"` shows the gh-team gate + conversion strip; `"paid"` self-hides both. */
    viewer?: "trial" | "paid"
    /** Async state of the page: `"content"` (default) · `"loading"` (skeleton) · `"empty"` (no lessons). */
    state?: "content" | "loading" | "empty"
}

/** Loading state — skeleton mirror of the dashboard spine (data-anat-part "Skeleton"). */
const CourseContentsLoading = () => (
    <div data-anat-part="Skeleton" className="mx-auto flex max-w-3xl flex-col gap-10 p-6">
        <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-1/4 rounded" />
            <Skeleton className="h-7 w-1/2 rounded" />
            {/* description + meta = 2 dòng text (meta giờ là muted text dot-strip, KHÔNG chip). */}
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-2/5 rounded" />
        </div>
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-2/3 rounded" />
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-1/2 rounded" />
            </div>
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
    </div>
)

/** Empty state — course has no lessons yet (data-anat-part "AsyncContent.Empty"). */
const CourseContentsEmpty = () => (
    <div data-anat-part="AsyncContent.Empty" className="mx-auto max-w-3xl p-6">
        <AsyncContent.Empty
            icon={<StackIcon aria-hidden focusable="false" />}
            title="Khoá này chưa có bài học nào"
            description="Nội dung đang được biên soạn — quay lại sau nhé."
        />
    </div>
)

/**
 * The `/learn/content` dashboard leaf.
 *
 * @param props - {@link CourseContentsLayoutProps}
 */
export const CourseContents = ({ viewer = "trial", state = "content" }: CourseContentsLayoutProps) => {
    if (state === "loading") {
        return <CourseContentsLoading />
    }
    if (state === "empty") {
        return <CourseContentsEmpty />
    }
    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-10 p-6">
            {/* data-anat-part on each part so BlockAnatomy can badge it (§strict: the
            ported blocks have no `anatPart` prop, so tag a tight wrapper — a
            block-level box coincident with the part, nothing shifts). */}
            {/* §11a — ở tầng LAYOUT chỉ badge node CAO NHẤT (Page.Header). Breadcrumb /
            HighlightChips là NỘI BỘ của Page.Header → đào sâu ở story riêng của
            Page.Header, KHÔNG badge lại ở đây. */}
            <div data-anat-part="Page.Header">
                <Page.Header
                    breadcrumb={
                        <div className="w-fit">
                            {/* collapse: dưới @app-sm hoặc trail ≥ 4 crumb → back-link (năng lực
                            cũ của ResponsiveBreadcrumb, nay là prop của atom Breadcrumbs.Base). */}
                            <Breadcrumbs.Base
                                collapseOnMobile
                                collapseFrom={4}
                                items={[
                                    { key: "courses", label: "Khoá học", onPress: () => {} },
                                    { key: "course", label: "DevOps Mastery" },
                                ]}
                            />
                        </div>
                    }
                    title="DevOps Mastery"
                    description="Từ CI/CD tới Kubernetes production — lộ trình thực chiến."
                    meta={
                        // §1 — scalar tự do (đếm/giờ/học viên) = muted text dot-separated, KHÔNG chip.
                        <Typography type="body-xs" color="muted">8 chương · ~14 giờ học · 2,481 học viên</Typography>
                    }
                />
            </div>

            <div className="flex flex-col gap-6">
                {viewer === "trial" ? (
                    <div data-anat-part="Feedback.Callout">
                        <Feedback.Callout
                            status="warning"
                            icon={GithubLogoIcon}
                            title="Bạn chưa vào GitHub team của khoá"
                            description="Một số bài lab cần quyền repo — bấm để tham gia."
                            action={<Button variant="secondary" size="sm">Vào team</Button>}
                        />
                    </div>
                ) : null}

                {viewer === "trial" ? (
                    <div data-anat-part="TrialConversionStrip">
                        <TrialConversionStrip
                            freeLessonsRemaining={9}
                            price={SAMPLE_PRICE}
                            onEnroll={() => {}}
                        />
                    </div>
                ) : null}

                <div data-anat-part="ContinueCard">
                    <ContinueCard
                        variant="plain"
                        eyebrow="Tiếp tục học"
                        title="Bài 4 · Viết Dockerfile tối ưu"
                        value={34}
                        max={100}
                        ctaLabel="Tiếp tục"
                        meta={["Đã đọc 8/23 bài", "Hoàn thành 2/9 thử thách"]}
                        onPress={() => {}}
                    />
                </div>

                <div data-anat-part="LearnNudges">
                    <SurfaceCard.List
                        bordered
                        items={[
                            {
                                key: "flashcards",
                                leading: <CardsIcon aria-hidden focusable="false" className="size-5 text-muted" />,
                                title: "Ôn 12 thẻ đến hạn hôm nay",
                                meta: <Typography type="body-sm" weight="medium" className="text-accent-soft-foreground">12</Typography>,
                                trailing: <ArrowRightIcon aria-hidden focusable="false" className="size-4 text-muted" />,
                                onPress: () => {},
                            },
                            {
                                key: "mock-interview",
                                leading: <MicrophoneStageIcon aria-hidden focusable="false" className="size-5 text-muted" />,
                                title: "Luyện phỏng vấn cho capstone",
                                trailing: <ArrowRightIcon aria-hidden focusable="false" className="size-4 text-muted" />,
                                onPress: () => {},
                            },
                            {
                                key: "league",
                                leading: <TrophyIcon aria-hidden focusable="false" className="size-5 text-muted" />,
                                title: "Bạn đang hạng #42 tuần này",
                                trailing: <ArrowRightIcon aria-hidden focusable="false" className="size-4 text-muted" />,
                                onPress: () => {},
                            },
                        ]}
                    />
                </div>

                <div data-anat-part="KeepGoingPath" className="flex flex-col gap-3">
                    <Typography type="body-sm" weight="semibold" color="muted">
                    Tiếp tục · Chương 2 · Container hoá
                    </Typography>
                    <div className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-default">
                        {KEEP_GOING.map((lesson) => (
                            <List.Row
                                key={lesson.id}
                                className="px-3"
                                leading={lessonLeading(lesson.state)}
                                title={lesson.title}
                                subtitle={`${lesson.minutes} phút đọc`}
                                onPress={() => {}}
                                meta={
                                    <div className="flex items-center gap-2">
                                        <DifficultyChip difficulty={lesson.difficulty} />
                                        {lesson.locked ? (
                                            <LockIcon aria-label="Premium" focusable="false" className="size-5 text-muted" />
                                        ) : null}
                                    </div>
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
