import React from "react"
import { CourseContents } from "./CourseContents"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * Shared anatomy parts + a per-device·per-state leaf renderer for the
 * `Layouts/CourseContents/<Device>/<State>` stories. NOT a story file (leading
 * `_` keeps it out of the `*.stories` glob) — device story files import from here
 * so the parts + framing live in ONE place.
 */

/** Content state — the 8-part dashboard (Callout + TrialConversionStrip self-hide for paid). */
export const CONTENT_PARTS: Array<AnatomyNode> = [
    {
        name: "PageHeader",
        tier: "block",
        role: "breadcrumb + tiêu đề khoá + mô tả + meta chips",
        storyId: "primitives-layouts-pageheader--overview",
        children: [
            { name: "Breadcrumb", tier: "design", role: "đường dẫn khoá (ResponsiveBreadcrumb)", storyId: "primitives-navigation-responsivebreadcrumb--overview" },
            { name: "HighlightChips", tier: "design", role: "chương · giờ học · học viên (learners ẩn nếu 0)", storyId: "primitives-chips-highlightchip--overview" },
        ],
    },
    { name: "Callout", tier: "block", role: "cảnh báo GitHub-team (STATE trial; ẩn khi paid)", state: "warning", storyId: "primitives-feedback-callout--overview" },
    { name: "TrialConversionStrip", tier: "block", role: "strip đổi trial→enroll (STATE trial; ẩn khi paid)", storyId: "block-commerce-trialconversionstrip--price-loaded-with-free-left" },
    { name: "ContinueCard", tier: "design", role: "tiếp tục + progress + CTA — variant plain (frameless spine) + eyebrow", storyId: "design-cards-continuecard-plain--progress" },
    { name: "LearnNudges", tier: "block", role: "thẻ đến hạn · phỏng vấn · hạng (mỗi hàng = SurfaceListCardRow/ListRow reuse)", storyId: "primitives-cards-surfacelistcard--overview" },
    { name: "KeepGoingPath", tier: "block", role: "bài của module hiện tại — ListRow: Play/Check/Circle · DifficultyChip · Lock", storyId: "primitives-lists-listrow--overview" },
]

/** Loading state — one skeleton node. */
export const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "primitive", role: "khung tải nội dung (mirror spine dashboard)", storyId: "primitives-skeletons-skeleton--overview" },
]

/** Empty state — one EmptyContent node. */
export const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "EmptyContent", tier: "block", role: "khoá chưa có bài — icon + tiêu đề + mô tả", storyId: "design-async-emptycontent--overview" },
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
        ? CONTENT_PARTS.filter((p) => p.name !== "Callout" && p.name !== "TrialConversionStrip")
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
                className="@container overflow-hidden rounded-none border-2 border-dashed border-accent"
                style={width ? { width, maxWidth: "100%" } : undefined}
            >
                <CourseContents viewer={viewer} state={state} />
            </div>
        </BlockAnatomy>
    </div>
)
