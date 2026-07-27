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
 * empty tree ⇒ they're STATES of the same leaf, now two `states[]` entries
 * (thầy chốt bố cục C, 2026-07-27) instead of two renders xếp tay trong `leafShell`.
 */
const meta: Meta<typeof CourseTeamGate.Base> = {
    title: "Blocks/Learn/CourseTeamGate/CourseTeamGate.Base",
    component: CourseTeamGate.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseTeamGate.Base>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // The FRAME is also a DEP (§11a.1) — this block already declared the frame it uses, kept as-is.
    "Alert.Base": { tier: "atom", role: "the resting branch that reaches straight for the atom, since the callout frame has no `isSkeleton` shape of its own yet", storyId: "atoms-feedback-alert-alert-base--action" },
    "Feedback.Callout": {
        storyId: "composites-feedback-feedback-feedback-callout--default",
        tier: "composite",
        role: "every bit of the shape comes from this frame, the block only supplies the content and the hide condition",
    },
}

/** LEAF — PAID + not in the team yet ⇒ shows the warning. The only leaf with a node. */
export const Warning: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="CourseTeamGate.Base"
                tier="block"
                leaf="Paid, not in team yet"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isEnrolled = true, isInTeam = false",
                        why: "The `Feedback.Callout` frame renders with a warning tone, prompting the viewer to join the team. A viewer who paid but never joined the GitHub team is missing part of what they bought, so the block keeps nudging until they act.",
                        code: "<CourseTeamGate.Base isEnrolled isInTeam={false} onJoin={handleJoin} />",
                        render: (
                            <CourseTeamGate.Base
                                anatPart="Feedback.Callout"
                                showAnatomy
                                isEnrolled
                                isInTeam={false}
                                onJoin={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * LEAF prop `isSkeleton` — the tree is IDENTICAL to the `Warning` leaf (§12g.0a):
 * `isSkeleton` only changes STATE (not knowing `isEnrolled`/`isInTeam` yet), it
 * doesn't add/remove a node vs. the "shown" tree (§11f) ⇒ reuses the `ANNOTATE`
 * above, no separate parts array declared.
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="CourseTeamGate.Base"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton",
                        why: "The callout frame keeps its exact shape while it waits on SWR to resolve `isEnrolled`/`isInTeam`. Holding the same frame stops the layout from flashing once the real answer arrives, whichever way it lands.",
                        code: "<CourseTeamGate.Base isSkeleton isEnrolled={false} isInTeam={false} />",
                        render: (
                            // No `anatPart` override here (unlike the `Warning` leaf above): this
                            // branch renders `Alert.Base`, not `Feedback.Callout` — hardcoding the
                            // loaded leaf's name would tag the wrong component (caught while
                            // applying the naming rule, 2026-07-27). Letting `showAnatomy` pick the
                            // name lets the component's own ternary resolve to whichever of the two
                            // it actually renders.
                            <CourseTeamGate.Base
                                showAnatomy
                                isSkeleton
                                isEnrolled={false}
                                isInTeam={false}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * LEAF — **self-hides**, empty tree. Two reasons land on the same result:
 * trial (no purchase, so no team to join) · already in the team (nudging again would be annoying).
 */
export const Hidden: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="CourseTeamGate.Base"
                tier="block"
                leaf="Self-hides"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isEnrolled = false, isInTeam = false",
                        why: "The block renders nothing at all, no callout, no placeholder. A trial viewer never purchased the course, so there is no GitHub team for them to join and nothing honest to nudge them toward.",
                        code: "<CourseTeamGate.Base isEnrolled={false} isInTeam={false} onJoin={handleJoin} />",
                        render: <CourseTeamGate.Base isEnrolled={false} isInTeam={false} onJoin={() => {}} />,
                    },
                    {
                        name: "isEnrolled = true, isInTeam = true",
                        why: "The block again renders nothing, the same empty tree as the trial case above. The viewer already joined the team, so repeating the nudge would only annoy someone who already did what was asked.",
                        code: "<CourseTeamGate.Base isEnrolled isInTeam onJoin={handleJoin} />",
                        render: <CourseTeamGate.Base isEnrolled isInTeam onJoin={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}
