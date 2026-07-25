import React from "react"
import { CourseContents } from "./CourseContents"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * Shared anatomy parts + a per-device·per-state leaf renderer for the
 * `Layouts/CourseContents/<Device>/<State>` stories. NOT a story file (leading
 * `_` keeps it out of the `*.stories` glob) — device story files import from here
 * so the parts + framing live in ONE place.
 */

/** Content state — the 8-part dashboard (Feedback.Callout + TrialConversionStrip self-hide for paid). */
export const CONTENT_PARTS: Array<AnatomyNode> = [
    {
        // §11a — ở tầng LAYOUT chỉ node CAO NHẤT: Page.Header là MỘT node (breadcrumb +
        // title + meta là nội bộ của nó → đào sâu ở story riêng Page.Header, không drill ở đây).
        name: "Page.Header",
        tier: "primitive",
        role: "header khoá — breadcrumb + tiêu đề + mô tả + meta (1 khung Page.Header dùng chung)",
        storyId: "layouts-layout-page-page-header--full",
    },
    { name: "Feedback.Callout", tier: "primitive", role: "cảnh báo GitHub-team (STATE trial; ẩn khi paid)", state: "warning", storyId: "layouts-feedback-feedback-feedback-callout--warning" },
    { name: "TrialConversionStrip", tier: "block", role: "strip đổi trial→enroll (STATE trial; ẩn khi paid)", storyId: "block-commerce-trialconversionstrip--price-loaded-with-free-left" },
    { name: "ContinueCard", tier: "design", role: "tiếp tục + progress + CTA — variant plain (frameless spine) + eyebrow", storyId: "design-cards-continuecard-plain--progress" },
    { name: "LearnNudges", tier: "block", role: "thẻ đến hạn · phỏng vấn · hạng (mỗi hàng = SurfaceCard.List row reuse)", storyId: "layouts-cards-surfacecard-surfacecard-list--leading-meta" },
    { name: "KeepGoingPath", tier: "block", role: "bài của module hiện tại — List.Row: Play/Check/Circle · DifficultyChip · Lock", storyId: "layouts-lists-list-list-row--title-only" },
]

/** Loading state — one skeleton node. */
export const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "primitive", role: "khung tải nội dung (mirror spine dashboard)", storyId: "primitives-skeletons-skeleton--overview" },
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
