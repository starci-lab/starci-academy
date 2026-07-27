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
    // ⭐ 2026-07-27 (mentor: "a screen has layout components too, and they update the
    // deps tree, then RECURSE into its children"): a FRAME is a DEP too. Before, the
    // screen tree only listed blocks, so reading the tree gave no idea what laid this
    // page out — `Container` (reading width + page padding) and `Stack.V` (rhythm
    // between blocks) were invisible even though they decide the entire page frame.
    {
        name: "Container",
        tier: "primitive",
        role: "reading width + page padding — `size=\"md\"` for a text column; `padding` is pinned to the §10 scale",
        storyId: "layouts-layout-container-container-base--default",
    },
    {
        // Different name from the `Stack.V` inside it: the panel groups nodes BY NAME, so a matching name would merge them into one.
        name: "Stack.V.Page",
        tier: "primitive",
        role: "rhythm between two REGIONS — `gap=8` separates the course-identity cluster from the content (§10: sections-wide)",
        storyId: "layouts-layout-stack-stack-v--default",
    },
    {
        name: "Stack.V",
        tier: "primitive",
        role: "VERTICAL rhythm between blocks — one seam, one owner (§10a)",
        storyId: "layouts-layout-stack-stack-v--default",
    },
    {
        // §11a — at the SCREEN tier, only the HIGHEST node: CourseBrief is ONE node (the
        // Page.Header frame + breadcrumb + status chip are internal to it → drill deeper
        // in CourseBrief's own story, not here).
        name: "CourseBrief",
        tier: "block",
        role: "course identity — breadcrumb + title + description + meta. The screen calls THIS BLOCK, never the Page.Header frame or the Breadcrumbs atom",
        storyId: "blocks-learn-coursebrief-base--full",
    },
    // ⚠️ The node name must match EXACTLY the `data-anat-part` the component emits: the
    // DOM emits `CourseTeamGate`, not `Feedback.Callout` (that's the FRAME the block
    // uses internally). Declaring the wrong name ⇒ the node never makes it into the
    // tree. The tier would be wrong too: `primitive` while `storyId` points to a BLOCK.
    { name: "CourseTeamGate", tier: "block", role: "GitHub-team warning — self-hides once the viewer is in the team", state: "warning", storyId: "blocks-learn-courseteamgate-base--warning" },
    { name: "TrialConversionStrip", tier: "block", role: "trial→enroll conversion strip (STATE trial; hidden once purchased)", storyId: "blocks-commerce-trialconversionstrip--price-loading" },
    // ⭐ 2026-07-27 (mentor: "design is only the place for UI/UX"): this node USED TO BE
    // `ContinueCard` at tier `design` — the screen skipped straight over the block tier,
    // and looking at the tree you could see the mismatch right away: the other five
    // nodes were `block`, this one alone was `design`. Now the screen calls the
    // `ContinueLearning` block, and that block is the one that composes the copy before
    // handing it down to design.
    { name: "ContinueLearning", tier: "block", role: "resume where you left off — the block writes the copy from NUMBERS (lessons read · challenges); the design only draws", storyId: "blocks-learn-continuelearning--default" },
    { name: "LearnNudges", tier: "block", role: "what to do today — cards due · mock interview · rank. The screen passes `kind` (ENUM); the block picks the icon (§14b)", storyId: "blocks-learn-learnnudges-base--nudges" },
    { name: "KeepGoingPath", tier: "block", role: "lessons of the current module — bordered SurfaceCard.List; each row: state icon · title · reading time · difficulty chip · lock icon", storyId: "blocks-learn-keepgoingpath-base--path" },
]

/** Empty state — one AsyncContent.Empty node. */
export const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "AsyncContent.Empty", tier: "primitive", role: "course has no lessons yet — icon + title + description", storyId: "layouts-async-asynccontent-asynccontent-empty--basic" },
]

/**
 * The parts tree per scenario. The RESTING state uses the SAME content tree (§11f:
 * change STATE, not STRUCTURE) — 2026-07-27 dropped the skeleton one-node array,
 * since it declared a completely different tree from the real one — exactly the bug
 * that removing it just fixed.
 */
const partsFor = (isEmpty: boolean, viewer: "trial" | "paid"): Array<AnatomyNode> => {
    if (isEmpty) {
        return EMPTY_PARTS
    }
    // ⚠️ 2026-07-27: the old version filtered `CourseTeamGate` OUT ENTIRELY for paid —
    // assuming "paid means no more warnings" was WRONG. That block's own self-hide
    // condition is `!isEnrolled || isInTeam`; paid = ALREADY enrolled and NOT YET in the
    // team ⇒ it STILL SHOWS. Measured: the paid render has `CourseTeamGate` in the DOM
    // while the tree doesn't — meaning the tree was lying. Only `TrialConversionStrip`
    // truly self-hides once purchased.
    return viewer === "paid"
        ? CONTENT_PARTS.filter((p) => p.name !== "TrialConversionStrip")
        : CONTENT_PARTS
}

/** Args for {@link deviceLeaf}. */
export interface DeviceLeafArgs {
    /** Fixed container width (px) → the layout re-lays-out to it via `@app-*`. Omit = full (desktop). */
    width?: number
    /** `true` → renders the whole screen in the RESTING state (the flag flows down into each block). */
    isSkeleton?: boolean
    /** `true` → the course has no lessons yet. */
    isEmpty?: boolean
    /** Content viewer (only meaningful when NOT empty). */
    viewer?: "trial" | "paid"
    /** Story display name = leaf label (e.g. "Default", "Loading"). */
    leaf: string
    /** Optional rationale line. */
    reason?: React.ReactNode
}

/**
 * The Code tab's snippet for one leaf — §12g.3 demands EVERY leaf carry `code`, and
 * teacher confirmed 2026-07-27 that "the 5 layers are identical in form": a screen owes
 * the same two tabs as an atom does.
 *
 * The snippet is built from the very args that produced the render, so it can never drift
 * from what is on screen — hand-writing one snippet per device × state (12 stories) would
 * have gone stale on the first prop rename.
 */
const leafCode = ({ width, isSkeleton, isEmpty, viewer }: Required<Pick<DeviceLeafArgs, "isSkeleton" | "isEmpty" | "viewer">> & { width?: number }) => {
    const props = [
        `viewer="${viewer}"`,
        ...(isSkeleton ? ["isSkeleton"] : []),
        ...(isEmpty ? ["isEmpty"] : []),
    ]
    const call = `<CourseContents ${props.join(" ")} />`
    // The device frame is part of the STORY, not of the screen — show it so a reader
    // knows the width comes from an `@container`, not from the screen itself.
    return width == null
        ? call
        : `<div className="@container" style={{ width: ${width} }}>
    ${call}
</div>`
}

/**
 * Render ONE CourseContents leaf: BlockAnatomy (anatomy is everywhere) wrapping the
 * layout inside its OWN `@container` at the device width, in the given state.
 */
export const deviceLeaf = ({ width, isSkeleton = false, isEmpty = false, viewer = "trial", leaf, reason }: DeviceLeafArgs) => (
    <div className="p-8">
        <BlockAnatomy
            name="CourseContents"
            // `screen`, NOT `block` — it used to lie because the `AnatomyTier` union had
            // no `screen` member (fixed 2026-07-27 together with this).
            tier="screen"
            leaf={leaf}
            parts={partsFor(isEmpty, viewer)}
            reason={reason}
            code={leafCode({ width, isSkeleton, isEmpty, viewer })}
        >
            <div
                className="@container overflow-hidden rounded-none border border-dashed border-accent"
                style={width ? { width, maxWidth: "100%" } : undefined}
            >
                <CourseContents viewer={viewer} isSkeleton={isSkeleton} isEmpty={isEmpty} />
            </div>
        </BlockAnatomy>
    </div>
)
