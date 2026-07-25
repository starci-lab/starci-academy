import React from "react"
import { CourseContents } from "./CourseContents"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * Shared anatomy parts + a per-device·per-state leaf renderer for the
 * `Layouts/CourseContents/<Device>/<State>` stories. NOT a story file (leading
 * `_` keeps it out of the `*.stories` glob) — device story files import from here
 * so the parts + framing live in ONE place.
 */

/** Content state — the 8-part dashboard (Feedback.Callout + TrialConversionStrip self-hide for paid). */
export const CONTENT_PARTS: Array<AnatomyNode> = [
    {
        // §11a — ở tầng SCREEN chỉ node CAO NHẤT: CourseBrief là MỘT node (khung
        // Page.Header + breadcrumb + chip trạng thái là nội bộ của nó → đào sâu ở story
        // riêng CourseBrief, không drill ở đây).
        name: "CourseBrief",
        tier: "block",
        role: "định danh khoá — breadcrumb + tên + mô tả + meta. Screen gọi BLOCK này, KHÔNG gọi khung Page.Header hay atom Breadcrumbs",
        storyId: "blocks-learn-coursebrief-base--full",
    },
    { name: "Feedback.Callout", tier: "primitive", role: "cảnh báo GitHub-team (STATE trial; ẩn khi paid)", state: "warning", storyId: "blocks-learn-courseteamgate-base--warning" },
    { name: "TrialConversionStrip", tier: "block", role: "strip đổi trial→enroll (STATE trial; ẩn khi paid)", storyId: "legacy-block-commerce-trialconversionstrip--price-loading" },
    { name: "ContinueCard", tier: "design", role: "tiếp tục + tiến độ + CTA — variant hero (khung HighlightCard ôm trọn), KHÔNG eyebrow (khung đã nói thay)", storyId: "legacy-design-cards-continuecard-hero-no-progress--not-started" },
    { name: "LearnNudges", tier: "block", role: "việc nên làm hôm nay — thẻ đến hạn · phỏng vấn · hạng. Screen đưa `kind` (ENUM), block tự chọn icon (§14b)", storyId: "blocks-learn-learnnudges-base--nudges" },
    { name: "KeepGoingPath", tier: "block", role: "bài của module hiện tại — SurfaceCard.List bordered, mỗi hàng: icon trạng thái · tên · thời lượng · DifficultyChip · LockIcon", storyId: "blocks-learn-keepgoingpath-base--path" },
]

/** Loading state — one skeleton node. */
export const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "primitive", role: "khung tải nội dung (mirror spine dashboard)" },
]

/** Empty state — one AsyncContent.Empty node. */
export const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "AsyncContent.Empty", tier: "primitive", role: "khoá chưa có bài — icon + tiêu đề + mô tả", storyId: "layouts-async-asynccontent-asynccontent-empty--basic" },
]

type LeafState = "content" | "loading" | "empty"

const partsFor = (state: LeafState, viewer: "trial" | "paid"): Array<AnatomyNode> => {
    if (state === "loading") {
        return LOADING_PARTS
    }
    if (state === "empty") {
        return EMPTY_PARTS
    }
    return viewer === "paid"
        ? CONTENT_PARTS.filter((p) => p.name !== "Feedback.Callout" && p.name !== "TrialConversionStrip")
        : CONTENT_PARTS
}

/** Args for {@link deviceLeaf}. */
export interface DeviceLeafArgs {
    /** Fixed container width (px) → the layout re-lays-out to it via `@app-*`. Omit = full (desktop). */
    width?: number
    /** Which async state to render. */
    state?: LeafState
    /** Content viewer (only matters for `state="content"`). */
    viewer?: "trial" | "paid"
    /** Story display name = leaf label (e.g. "Default", "Loading"). */
    leaf: string
    /** Optional rationale line. */
    reason?: React.ReactNode
}

/**
 * Render ONE CourseContents leaf: BlockAnatomy (anatomy is everywhere) wrapping the
 * layout inside its OWN `@container` at the device width, in the given state.
 */
export const deviceLeaf = ({ width, state = "content", viewer = "trial", leaf, reason }: DeviceLeafArgs) => (
    <div className="p-8">
        <BlockAnatomy
            name="CourseContents"
            tier="block"
            leaf={leaf}
            parts={partsFor(state, viewer)}
            reason={reason}
        >
            <div
                className="@container overflow-hidden rounded-none border border-dashed border-accent"
                style={width ? { width, maxWidth: "100%" } : undefined}
            >
                <CourseContents viewer={viewer} state={state} />
            </div>
        </BlockAnatomy>
    </div>
)
