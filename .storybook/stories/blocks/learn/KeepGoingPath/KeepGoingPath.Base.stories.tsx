import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    KeepGoingPath,
    type KeepGoingContent,
} from "@sb-components/blocks/learn/KeepGoingPath/KeepGoingPath"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `KeepGoingPath.Base`: the continue-learning path for the **current
 * chapter**.
 *
 * Deliberately does NOT redraw the full module tree — that tree lives in the
 * left rail, drawing it twice would be two sources of truth. This block only
 * answers "where am I + what's next".
 *
 * The BLOCK OWNS the shape: state icon (play/check/circle) · difficulty chip ·
 * lock. The caller only supplies DATA — no node, no class.
 *
 * 📐 **ONE LEAF** (§11f + §14d.2): every variant below shares the SAME DOM tree
 * (`SurfaceCard.List` → rows), differing only in content ⇒ they're all
 * **STATE**, rendered inside one leaf. Previously `AllRead`/`AllDifficulties`/
 * `Bordered` were split into separate stories — wrong, since none of them
 * add or remove a node.
 */
const meta: Meta<typeof KeepGoingPath.Base> = {
    title: "Blocks/Learn/KeepGoingPath/KeepGoingPath.Base",
    component: KeepGoingPath.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KeepGoingPath.Base>

const MIXED: Array<KeepGoingContent> = [
    { id: "l1", title: "Docker là gì", minutes: 6, state: "done", difficulty: "beginner", onPress: () => {} },
    { id: "l2", title: "Viết Dockerfile tối ưu", minutes: 12, state: "active", difficulty: "intermediate", onPress: () => {} },
    { id: "l3", title: "Multi-stage build", minutes: 9, state: "todo", difficulty: "advanced", locked: true, onPress: () => {} },
    { id: "l4", title: "Tự viết Operator", minutes: 22, state: "todo", difficulty: "insane", locked: true, onPress: () => {} },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // A FRAME is also a DEP (§11a.1) — this block already declares the frame it uses, kept as-is.
    "SurfaceCard.List": {
        storyId: "layouts-cards-surfacecard-surfacecard-list--default",
        tier: "primitive",
        role: "frame + row rhythm — SHARED with LearnNudges so no second render path is born",
    },
    "VariantChip.Difficulty": {
        storyId: "designs-chips-variantchip-variantchip-difficulty--levels",
        tier: "design",
        role: "difficulty role — a 4-step ramp, not a status token",
    },
}

/**
 * The single leaf — renders **ONE** frame, with every variant inside it: 3
 * lesson states (done · active · todo) · all 4 difficulty steps · a locked
 * lesson.
 *
 * ⛔ Do NOT render two copies to show off `bordered` (teacher's call
 * 2026-07-26): the app has NO surface-in-surface case ⇒ `bordered` would be a
 * MADE-UP case. A block doesn't invent cases just to round out the set.
 */
export const Path: Story = {
    render: () => (
        <div className="mx-auto max-w-3xl p-8">
            <BlockAnatomy
                name="KeepGoingPath.Base"
                tier="block"
                leaf="Path ahead"
                parts={[]}
                annotate={ANNOTATE}
                note="Four difficulty steps + three states + a locked lesson — every variant inside ONE frame."
                code={`<KeepGoingPath.Base
    module={{ index: 2, name: "Container hoá" }}
    contents={contents}
/>`}
            >
                <KeepGoingPath.Base
                    anatPart="SurfaceCard.List"
                    showAnatomy
                    module={{ index: 2, name: "Container hoá" }}
                    contents={MIXED}
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * LEAF prop `isSkeleton` — the tree is IDENTICAL to the `Path` leaf (§12g.0a):
 * same `SurfaceCard.List` frame, same row count, only the content STATE changes
 * (§11f) ⇒ reuses the `ANNOTATE` above, no separate parts array declared for the
 * skeleton state. Empty → assume 3 rows (this pass's convention for a repeated
 * list).
 */
export const Skeleton: Story = {
    render: () => (
        <div className="mx-auto max-w-3xl p-8">
            <BlockAnatomy
                name="KeepGoingPath.Base"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                note="isSkeleton with empty contents → assume 3 rows so the frame keeps its height."
                code={"<KeepGoingPath.Base isSkeleton module={{ index: 2, name: \"Container hoá\" }} contents={[]} />"}
            >
                <KeepGoingPath.Base
                    anatPart="SurfaceCard.List"
                    showAnatomy
                    isSkeleton
                    module={{ index: 2, name: "Container hoá" }}
                    contents={[]}
                />
            </BlockAnatomy>
        </div>
    ),
}
