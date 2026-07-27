import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseTeamGate } from "@sb-components/blocks/learn/CourseTeamGate/CourseTeamGate"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `CourseTeamGate.Base`: a nudge to join the course's GitHub team.
 *
 * 🔴 **AUDIENCE = SOMEONE WHO'S PAID.** The backend scopes the team by
 * `is_enrolled = true`, so without a purchase there's no team to join. The block
 * **self-hides** for trial and for someone already in the team — the screen
 * doesn't have to ask (§14b).
 *
 * ⚠️ The screen built 2026-07-25 once had the gate BACKWARDS (`viewer === "trial"`).
 * The two leaves below lock in the correct direction so it doesn't flip back again.
 *
 * 📐 **TWO LEAVES** (§14d.2): "shown" and "hidden" differ in STRUCTURE (a node vs
 * empty). The two reasons for hiding (trial · already-in-team) produce the SAME
 * empty tree ⇒ they're STATES of the same leaf, not split into two stories.
 */
const meta: Meta<typeof CourseTeamGate.Base> = {
    title: "Blocks/Learn/CourseTeamGate.Base",
    component: CourseTeamGate.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseTeamGate.Base>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // The FRAME is also a DEP (§11a.1) — this block already declared the frame it uses, kept as-is.
    "Alert.Base": { tier: "atom", role: "the RESTING branch reaches straight for the atom (the callout frame has no `isSkeleton` yet)", storyId: "atoms-feedback-alert-alert-base--action" },
    "Feedback.Callout": {
        storyId: "layouts-feedback-feedback-feedback-callout--default",
        tier: "primitive",
        role: "every bit of the SHAPE comes from this frame — the block only supplies content and the hide condition",
    },
}

const leafShell = (leaf: string, node: ReactNode, note?: ReactNode, code?: string) => (
    <div className="mx-auto max-w-3xl p-8">
        <BlockAnatomy
            name="CourseTeamGate.Base"
            tier="block"
            leaf={leaf}
            parts={[]}
            annotate={ANNOTATE}
            note={note}
            code={code}
        >
            {node}
        </BlockAnatomy>
    </div>
)

/** LEAF — PAID + not in the team yet ⇒ shows the warning. The only leaf with a node. */
export const Warning: Story = {
    render: () =>
        leafShell(
            "Paid, not in team yet",
            <CourseTeamGate.Base
                anatPart="Feedback.Callout"
                showAnatomy
                isEnrolled
                isInTeam={false}
                onJoin={() => {}}
            />,
            undefined,
            "<CourseTeamGate.Base isEnrolled isInTeam={false} onJoin={handleJoin} />",
        ),
}

/**
 * LEAF prop `isSkeleton` — the tree is IDENTICAL to the `Warning` leaf (§12g.0a):
 * `isSkeleton` only changes STATE (not knowing `isEnrolled`/`isInTeam` yet), it
 * doesn't add/remove a node vs. the "shown" tree (§11f) ⇒ reuses the `ANNOTATE`
 * above, no separate parts array declared.
 */
export const Skeleton: Story = {
    render: () =>
        leafShell(
            "Prop `isSkeleton`",
            <CourseTeamGate.Base
                anatPart="Feedback.Callout"
                showAnatomy
                isSkeleton
                isEnrolled={false}
                isInTeam={false}
            />,
            "While waiting on SWR, the flag keeps the exact callout frame so nothing flashes when the result arrives.",
            `<CourseTeamGate.Base isSkeleton isEnrolled={false} isInTeam={false} />`,
        ),
}

/**
 * LEAF — **self-hides**, empty tree. Two reasons land on the same result:
 * trial (no purchase, so no team to join) · already in the team (nudging again would be annoying).
 */
export const Hidden: Story = {
    render: () =>
        leafShell(
            "Self-hides",
            <div className="flex flex-col gap-2">
                <CourseTeamGate.Base isEnrolled={false} isInTeam={false} onJoin={() => {}} />
                <CourseTeamGate.Base isEnrolled isInTeam onJoin={() => {}} />
            </div>,
            "No part at all — silence is the business contract here, not a bug.",
            "<CourseTeamGate.Base isEnrolled={false} isInTeam={false} onJoin={handleJoin} />",
        ),
}
