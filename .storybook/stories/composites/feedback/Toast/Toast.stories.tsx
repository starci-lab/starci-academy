import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button as HeroButton } from "@heroui/react"
import { Toast } from "@sb-components/composites/feedback/Toast/Toast"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Toast` — the one notification surface, composed from `Alert` (`tone="plain"` + glyph `sm`);
 * the HeroUI port lives entirely in `Alert`. Leaves: `Statuses` (the full `ToastStatus` union)
 * and `WithAction` (adds `Action`/`Close` nodes).
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
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
