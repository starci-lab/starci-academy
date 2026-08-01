import type { Meta, StoryObj } from "@storybook/nextjs"
import { BellIcon } from "@phosphor-icons/react"
import { Badge } from "@sb-components/atoms/display/Badge/Badge"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Badge`: wraps HeroUI `Badge` directly (+ `Badge.Anchor` when it has `children`).
 * Leaf atom — it doesn't compose any of our own atoms that have their own story ⇒ no atom-tier deps.
 * `Content` is an INTERNAL span holding free-form `children` (a slot, with nowhere of its own to jump to),
 * not a dep.
 *
 * ⚠️ 2026-07-28 (naming pass): `Badge`/`Badge.Anchor`/`Skeleton` are ALL a direct
 * `@heroui/react` import rendered straight through ⇒ declare `tier: "heroui"` (no `storyId`) —
 * previously this was missed entirely (empty annotate), the tree lying by omission.
 * `Anchor` was actually renamed to `Badge.Anchor` to match the HeroUI compound.
 *
 * `Badge` is a valid atom-WRAPPER holding `children` (§12b) — the anchor needs to wrap the
 * element it hangs off, this is not a children-forbidden loophole.
 *
 * MIGRATED TO the `states[]` API (teacher's call on 2026-07-27, canon §8): each prop value
 * (`count`/`dot`/`max` for `Anchored` · each tone for `Colors` · each size for
 * `Sizes` · each corner for `Placement`) used to be laid out side by side in the SAME
 * `children`, with only ONE element getting `showAnatomy`. Now each value is its own STATE,
 * and the panel mounts only the currently selected state, so the deps tree and code snippet
 * belong to it alone instead of being mixed together across the whole row.
 */
/** Every node this atom renders is a direct HeroUI import — all `tier: "heroui"`, no `storyId`. */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Badge": {
        tier: "heroui",
        role: "the coloured pill itself — the count, the dot, or the capped label",
    },
    "Badge.Anchor": {
        tier: "heroui",
        role: "wraps the anchor content so the pill can hang off one of its corners",
    },
    "Skeleton": {
        tier: "heroui",
        role: "the resting shimmer, drawn in place of the pill while isSkeleton is on",
    },
}

const meta: Meta<typeof Badge> = {
    title: "Atoms/Display/Badge/Badge",
    component: Badge,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Badge>

// A small anchor host for the badge (bell icon) — the badge hangs off a corner of this element.
// Phosphor icon (§5⃣0, a single set); `size-6` > `size-5` ⇒ keep the default
// `regular` weight, do NOT pass a weight (§5⃣0a — only icons smaller than size-5 need bold).
const BellHost = () => <BellIcon data-tier="fixture" className="text-muted size-6" aria-hidden />

/**
 * Leaf props `count` / `dot` / `max` — the badge hangs off an anchor element (`Badge.Anchor`).
 * All THREE states build the SAME tree (Anchor › Content + Badge), differing only in the LABEL
 * inside ⇒ they are values of the same prop-family, not three separate leaves.
 */
export const Anchored: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Badge"
                tier="atom"
                leaf="Props `count` / `dot` / `max`"
                annotate={ANNOTATE}
                reason="The one badge atom over HeroUI Badge covers count, dot, and cap through a single component, distinguished only by which prop the caller passes."
                states={[
                    {
                        name: "count = 3",
                        why: "The anchor badge renders the plain number 3, since nothing here caps or hides it. A raw count under any cap is shown verbatim so the anchored icon carries an honest unread total.",
                        code: "<Badge count={3}>{<BellIcon/>}</Badge>",
                        render: (
                            <Badge count={3} showAnatomy>
                                <BellHost />
                            </Badge>
                        ),
                    },
                    {
                        name: "dot = true",
                        why: "The badge drops to a bare dot with no number, since `dot` overrides `count` entirely. This is the presence signal to reach for when a raw count would look like more detail than the anchor needs.",
                        code: "<Badge dot>{<BellIcon/>}</Badge>",
                        render: (
                            <Badge dot showAnatomy>
                                <BellHost />
                            </Badge>
                        ),
                    },
                    {
                        name: "count = 128, max = 99",
                        why: "The label switches from the raw number to `99+`, because `count` exceeds `max`. The atom owns the cap itself so the caller never has to format the overflow string.",
                        code: "<Badge count={128} max={99}>{<BellIcon/>}</Badge>",
                        render: (
                            <Badge count={128} max={99} showAnatomy>
                                <BellHost />
                            </Badge>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `color` — FULL union of tones (danger · accent · success · warning · default). */
export const Colors: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Badge"
                tier="atom"
                leaf="Prop `color`"
                annotate={ANNOTATE}
                reason="The badge renders standalone since no anchor child is passed, and each of the five tones carries a specific meaning, such as alert, new, or done, rather than acting as decoration."
                states={[
                    {
                        name: "color = danger",
                        why: "Only the badge's tint changes to the danger red, and the tree stays the identical single node as every other tone in this family. Red marks something needing immediate attention, such as an unread alert.",
                        code: "<Badge count={5} color=\"danger\" />",
                        render: <Badge count={5} color="danger" showAnatomy />,
                    },
                    {
                        name: "color = accent",
                        why: "The badge tint switches to the accent tone with no other change to its shape. Accent flags a fresh or newly arrived item rather than a problem to act on.",
                        code: "<Badge count={5} color=\"accent\" />",
                        render: <Badge count={5} color="accent" showAnatomy />,
                    },
                    {
                        name: "color = success",
                        why: "The badge tint switches to the success green, again with an identical node tree to the other tones. Green marks a completed or resolved state, the opposite signal from danger.",
                        code: "<Badge count={5} color=\"success\" />",
                        render: <Badge count={5} color="success" showAnatomy />,
                    },
                    {
                        name: "color = warning",
                        why: "The badge tint switches to the warning amber, still the same single badge node as every other tone. Amber sits between danger and success, for something that needs attention but is not yet critical.",
                        code: "<Badge count={5} color=\"warning\" />",
                        render: <Badge count={5} color="warning" showAnatomy />,
                    },
                    {
                        name: "color = default",
                        why: "The badge tint falls back to the neutral default tone, again changing nothing but the fill colour. This tone suits a plain count with no urgency or status attached to it.",
                        code: "<Badge count={5} color=\"default\" />",
                        render: <Badge count={5} color="default" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — FULL union of sizes (sm · md · lg), changing pixels even standing alone. */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Badge"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="The badge renders standalone with no anchor, since size is easiest to compare without an icon attached, and the pill itself grows from small to large while the count value stays the same across every state."
                states={[
                    {
                        name: "size = sm",
                        why: "The badge pill renders at its smallest footprint, with no other node added to or removed from the tree. A small size fits next to a compact icon or a dense row where a bigger marker would crowd its neighbours.",
                        code: "<Badge count={5} size=\"sm\" />",
                        render: <Badge count={5} size="sm" showAnatomy />,
                    },
                    {
                        name: "size = md",
                        why: "The badge pill grows to the default footprint, the standard mid-size, and still the same single node as every other size. This is the size used when the badge sits without a tighter or larger visual context around it.",
                        code: "<Badge count={5} size=\"md\" />",
                        render: <Badge count={5} size="md" showAnatomy />,
                    },
                    {
                        name: "size = lg",
                        why: "The badge pill grows to its largest footprint, still just the one node with no children added. A large size suits a bigger anchor, or wherever the badge needs to stay legible from further away.",
                        code: "<Badge count={5} size=\"lg\" />",
                        render: <Badge count={5} size="lg" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `placement` — FULL four corners, using the same real anchor to see which corner the badge hangs off. */
export const Placement: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Badge"
                tier="atom"
                leaf="Prop `placement`"
                annotate={ANNOTATE}
                reason="This prop is only meaningful with an anchor, since the badge hangs off a corner of whatever it decorates, so the corner has to be a caller choice; the same bell host and the same count are reused across every state, and only the anchor corner itself changes."
                states={[
                    {
                        name: "placement = top-right",
                        why: "The badge anchors to the top-right corner of the bell icon, with the same Anchor/Content/Badge tree as every other corner. Top-right is the default corner, matching where most native badges commonly sit.",
                        code: "<Badge count={3} placement=\"top-right\">{<BellIcon/>}</Badge>",
                        render: (
                            <Badge count={3} placement="top-right" showAnatomy>
                                <BellHost />
                            </Badge>
                        ),
                    },
                    {
                        name: "placement = top-left",
                        why: "The badge moves to the top-left corner instead, changing only the anchor position and nothing about the tree shape. A left-side badge suits an anchor whose top-right corner is already claimed by something else.",
                        code: "<Badge count={3} placement=\"top-left\">{<BellIcon/>}</Badge>",
                        render: (
                            <Badge count={3} placement="top-left" showAnatomy>
                                <BellHost />
                            </Badge>
                        ),
                    },
                    {
                        name: "placement = bottom-right",
                        why: "The badge moves down to the bottom-right corner, again with no structural change to the tree. A bottom placement suits an anchor whose top edge already carries another marker or label.",
                        code: "<Badge count={3} placement=\"bottom-right\">{<BellIcon/>}</Badge>",
                        render: (
                            <Badge count={3} placement="bottom-right" showAnatomy>
                                <BellHost />
                            </Badge>
                        ),
                    },
                    {
                        name: "placement = bottom-left",
                        why: "The badge moves to the bottom-left corner, the last of the four positions and still the identical tree shape. This corner is picked when both top corners are already occupied by other UI on the anchor.",
                        code: "<Badge count={3} placement=\"bottom-left\">{<BellIcon/>}</Badge>",
                        render: (
                            <Badge count={3} placement="bottom-left" showAnatomy>
                                <BellHost />
                            </Badge>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `isSkeleton` — CO-LOCATED shimmer (§12c), not using a shared Skeleton.*. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Badge"
                tier="atom"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The badge swaps to a small pill or dot shimmer that mirrors its own resting footprint, instead of the real numbered badge. The shimmer is drawn by the atom itself, so there is no shared skeleton component to keep in sync when the badge's shape changes.",
                        code: "<Badge isSkeleton count={3} />",
                        render: <Badge isSkeleton count={3} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
