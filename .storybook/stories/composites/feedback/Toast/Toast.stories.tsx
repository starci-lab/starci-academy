import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button as HeroButton } from "@heroui/react"
import { Toast } from "@sb-components/composites/feedback/Toast/Toast"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — `Toast`: the ONE notification-surface, composed from `Alert`
 * (`tone="plain"` + glyph `sm`). The HeroUI port lives entirely in `Alert`.
 * Promoted from the atom tier (ATOM-3): a component whose entire body is
 * `<Alert {...} />` is assembling the vocabulary, not being a word in it —
 * moved to `composites/feedback/`, beside `Callout`, the sibling
 * this file's own header already called out ("toast and callout share the
 * same alert primitive and differ only in placement").
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). The previous version split four leaves
 * `Success`/`Warning`/`Danger`/`Info` — exactly the "split leaf by VALUE"
 * anti-pattern (like splitting `Small`/`Medium` instead of merging into
 * `Sizes`). Merged into ONE leaf `Statuses` rendering the full `ToastStatus`
 * union, matching what `Alert.stories.tsx` already does for `status`. The
 * second leaf `WithAction` stays separate because it grows ADDITIONAL real
 * nodes (`Action`/`Close`).
 *
 * ⚠️ NO `annotate`: Toast does not emit its own `data-anat-part` at the
 * `Alert` boundary (it doesn't forward an `anatPart` down — the current
 * `Alert` no longer accepts that prop, the atom names itself per ATOM-10) —
 * every name that shows up (`Icon`/`Content`/`Title`/`Description`/`Action`/
 * `Close`) is an INTERNAL span of `Alert`, with no story of its own to jump
 * to ⇒ not a real dep.
 *
 * MIGRATED TO `states` (2026-07-27): `Statuses` used to map the full `ToastStatus`
 * union into one stacked block with no room to explain any one tone on its own —
 * now each tone is its own `states[]` entry.
 */
const meta: Meta<typeof Toast> = {
    title: "Composites/Feedback/Toast/Toast",
    component: Toast,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Toast>

/** Leaf for prop `status` — renders the FULL union, each value its own state (§12g, merge the leaf, split the state). Migrated 2026-07-27. */
export const Statuses: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-md p-8">
            <BlockAnatomy
                name="Toast"
                tier="composite"
                leaf="Prop `status`"
                reason="The one toast composite, built entirely from Alert. Status picks the tint and the icon together, so a caller can never pair the wrong icon with a tone — it only ever hands over a title and description."
                states={[
                    {
                        name: "status = \"success\"",
                        why: "The surface tints success and mounts a `CheckCircleIcon`, wrapping the given title and description. This tone confirms an action already completed, like a submission that saved.",
                        code: "<Toast status=\"success\" title=\"Submission saved\" description=\"Grading results will be ready in a few minutes.\" />",
                        render: (
                            <Toast
                                status="success"
                                title="Submission saved"
                                description="Grading results will be ready in a few minutes."
                                showAnatomy
                            />
                        ),
                    },
                    {
                        name: "status = \"warning\"",
                        why: "The surface tints warning and mounts a `WarningIcon`, same shape as the success state otherwise. This tone flags something the learner should act on soon but hasn't failed yet, like a quiz about to auto-submit.",
                        code: "<Toast status=\"warning\" title=\"Running out of time\" description=\"The quiz submits itself in 10 minutes.\" />",
                        render: (
                            <Toast
                                status="warning"
                                title="Running out of time"
                                description="The quiz submits itself in 10 minutes."
                            />
                        ),
                    },
                    {
                        name: "status = \"danger\"",
                        why: "The surface tints danger and mounts an `XCircleIcon`, again the same shape as the other tones. This tone reports an action that actually failed, like a submission the server never received.",
                        code: "<Toast status=\"danger\" title=\"Submission failed\" description=\"Could not reach the server — try again.\" />",
                        render: (
                            <Toast
                                status="danger"
                                title="Submission failed"
                                description="Could not reach the server — try again."
                            />
                        ),
                    },
                    {
                        name: "status = \"info\"",
                        why: "The surface folds to the accent tint and mounts an `InfoIcon`, still the identical shape as the other three tones. This tone is for a neutral update that isn't a success or a problem, like new content landing on a lesson already open.",
                        code: "<Toast status=\"info\" title=\"Content just updated\" description=\"This lesson has a new version, reload to see it.\" />",
                        render: (
                            <Toast
                                status="info"
                                title="Content just updated"
                                description="This lesson has a new version, reload to see it."
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** A component REFERENCE (never a built node, COMPOSITE-8) — the composite calls it itself with `isSkeleton` forwarded. */
const UndoAction = ({ isSkeleton }: { isSkeleton?: boolean }) => (
    <HeroButton data-tier="fixture" size="sm" variant="tertiary" isDisabled={isSkeleton}>
        Undo
    </HeroButton>
)

/** Leaf for props `action` / `onClose` — grows an extra Action node + a real × button. Migrated to `states` 2026-07-27. */
export const WithAction: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-md p-8">
            <BlockAnatomy
                name="Toast"
                tier="composite"
                leaf="Props `action` / `onClose`"
                states={[
                    {
                        name: "action set, onClose set",
                        why: "An `Action` node mounts before a real `×` close button, both new nodes that don't exist in the bare toast. `action` sits before the close control because it is content this composite keeps on purpose — unlike `children`, which it never accepts at all.",
                        code: "<Toast status=\"info\" title=\"Card removed\" action={UndoAction} onClose={fn} />",
                        render: (
                            <Toast
                                status="info"
                                title="Flashcard removed"
                                action={UndoAction}
                                onClose={() => {}}
                                closeLabel="Dismiss notification"
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
