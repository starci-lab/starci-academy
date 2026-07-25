import React from "react"
import { GithubLogoIcon, StackIcon } from "@phosphor-icons/react"
import { CourseBrief } from "@sb-components/_blocks/learn/CourseBrief/CourseBrief"
import { KeepGoingPath, type KeepGoingLesson } from "@sb-components/_blocks/learn/KeepGoingPath/KeepGoingPath"
import { LearnNudges, type LearnNudge } from "@sb-components/_blocks/learn/LearnNudges/LearnNudges"
import { Feedback } from "@sb-components/layouts/feedback/Feedback/Feedback"
import {
    TrialConversionStrip,
    type TrialConversionStripPrice,
} from "@sb-components/_blocks/commerce/TrialConversionStrip/TrialConversionStrip"
import { PricingPhase } from "@sb-components/_designs/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { ContinueCard } from "@sb-components/_designs/cards/ContinueCard/ContinueCard"
import { Skeleton } from "@sb-components/atoms/display/Skeleton/Skeleton"
import { AsyncContent } from "@sb-components/layouts/async/AsyncContent/AsyncContent"

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
 * §14a — screen là DANH SÁCH CHỨC NĂNG. Sáu block, không gì khác:
 * `CourseBrief`(khoá này là gì) · `Feedback.Callout`(gate GitHub team) ·
 * `TrialConversionStrip`(đổi trial→mua) · `ContinueCard`(quay lại chỗ dở) ·
 * `LearnNudges`(hôm nay làm gì) · `KeepGoingPath`(đi tiếp trong chương).
 * KHÔNG import tầng layout, KHÔNG import atom, KHÔNG truyền JSX xuống block.
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

// DỮ LIỆU thuần — hình (icon theo trạng thái, chip độ khó, dấu khoá) do block
// `KeepGoingPath` sở hữu. Screen không biết bài "đang học" trông thế nào.
const KEEP_GOING: Array<KeepGoingLesson> = [
    { id: "l1", title: "Docker là gì", minutes: 6, state: "done", difficulty: "beginner", onPress: () => {} },
    { id: "l2", title: "Viết Dockerfile tối ưu", minutes: 12, state: "active", difficulty: "intermediate", onPress: () => {} },
    { id: "l3", title: "Multi-stage build", minutes: 9, state: "todo", difficulty: "intermediate", locked: true, onPress: () => {} },
]

// DỮ LIỆU thuần — `kind` là ENUM, block `LearnNudges` tự quyết icon (§14b).
const NUDGES: Array<LearnNudge> = [
    { id: "flashcards", kind: "flashcards", title: "Ôn 12 thẻ đến hạn hôm nay", count: 12, onPress: () => {} },
    { id: "mock-interview", kind: "interview", title: "Luyện phỏng vấn cho capstone", onPress: () => {} },
    { id: "league", kind: "league", title: "Bạn đang hạng #42 tuần này", onPress: () => {} },
]

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
            icon={StackIcon}
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
            {/* §11a — badge dừng ở node CAO NHẤT `CourseBrief` (BLOCK). Khung `Page.Header`
            nằm BÊN TRONG block đó → đào sâu ở story riêng của CourseBrief, KHÔNG drill ở
            đây. Thầy chốt 2026-07-25: cụm này mang business (đã/chưa đọc) nên là BLOCK,
            screen KHÔNG gọi thẳng khung layout nữa. */}
            <CourseBrief
                anatPart="CourseBrief"
                breadcrumbItems={[
                    { key: "courses", label: "Khoá học", onPress: () => {} },
                    { key: "course", label: "DevOps Mastery" },
                ]}
                title="DevOps Mastery"
                description="Từ CI/CD tới Kubernetes production — lộ trình thực chiến."
                meta="8 chương · ~14 giờ học · 2,481 học viên"
            />

            <div className="flex flex-col gap-6">
                {viewer === "trial" ? (
                    <Feedback.Callout
                        anatPart="Feedback.Callout"
                        status="warning"
                        icon={GithubLogoIcon}
                        title="Bạn chưa vào GitHub team của khoá"
                        description="Một số bài lab cần quyền repo — bấm để tham gia."
                        actionLabel="Vào team"
                        onAction={() => {}}
                    />
                ) : null}

                {viewer === "trial" ? (
                    <TrialConversionStrip
                        anatPart="TrialConversionStrip"
                        freeLessonsRemaining={9}
                        price={SAMPLE_PRICE}
                        onEnroll={() => {}}
                    />
                ) : null}

                {/* `hero` chứ KHÔNG `plain` (thầy chốt 2026-07-25): bản frameless để
                thanh tiến độ trôi ra ngoài, không có gì ôm nó lại nên đọc như thuộc
                khối bên dưới. Khung hero gom trọn tiêu đề · meta · tiến độ · CTA thành
                MỘT khối — đây cũng là ca chuẩn của `HighlightCard`: một điểm nhấn duy
                nhất "tiếp tục phiên đang dở" trên trang.

                KHÔNG `eyebrow` (thầy soi mắt 2026-07-25): eyebrow sinh ra để THAY cho
                cái khung — frameless mới cần một dòng nhãn nhẹ nói cụm này là gì. Hero
                đã có khung + vành arc + nút "Tiếp tục" nên thêm "Tiếp tục học" là nói
                hai lần. */}
                <ContinueCard
                    anatPart="ContinueCard"
                    variant="hero"
                    title="Bài 4 · Viết Dockerfile tối ưu"
                    value={34}
                    max={100}
                    ctaLabel="Tiếp tục"
                    meta={["Đã đọc 8/23 bài", "Hoàn thành 2/9 thử thách"]}
                    onPress={() => {}}
                />

                <LearnNudges
                    anatPart="LearnNudges"
                    heading="Việc nên làm hôm nay"
                    items={NUDGES}
                />

                <KeepGoingPath
                    anatPart="KeepGoingPath"
                    heading="Tiếp tục · Chương 2 · Container hoá"
                    lessons={KEEP_GOING}
                />
            </div>
        </div>
    )
}
