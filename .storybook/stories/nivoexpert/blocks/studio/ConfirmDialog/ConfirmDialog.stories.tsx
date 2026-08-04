import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    ConfirmDialog,
    type ConfirmDialogLabels,
} from "@sb-components/nivoexpert/blocks/studio/ConfirmDialog/ConfirmDialog"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ConfirmDialog` — overlay modal for an irreversible delete: names the
 * exact blast radius and keeps the danger action disabled until the operator
 * types the entity's own slug back. One shell for every hard-delete flow in
 * the academy — a course, a lesson, an order — never a bare
 * `window.confirm`.
 */
const meta: Meta<typeof ConfirmDialog> = {
    title: "NivoExpert/Blocks/Studio/ConfirmDialog/ConfirmDialog",
    component: ConfirmDialog,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ConfirmDialog>

const LABELS: ConfirmDialogLabels = {
    matchFieldLabel: "Type the course slug to confirm",
    cancelLabel: "Cancel",
    confirmLabel: "Delete permanently",
}

const MATCH_TEXT = "advanced-state-management"

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "AlertDialog.Heading": { tier: "heroui", role: "the short question — which course/lesson/order is at risk" },
    Alert: { tier: "atom", role: "the danger banner naming the exact blast radius" },
    InputText: { tier: "atom", role: "the type-to-confirm field — must equal `matchText` before the delete unlocks" },
    ButtonGroup: { tier: "composite", role: "cancel (secondary) and delete permanently (danger, disabled until matched)" },
}

const REASON =
    "A non-standard AlertDialog shape (a warning banner plus a confirm-text field, beyond the shared `ConfirmDialog` shell's title/description-only body — architecture.md's documented exception for a shape a shell cannot express). The delete action stays disabled until the typed text equals `matchText` exactly, and never closes itself on press — the caller closes it once the delete mutation resolves, keeping the dialog open (and the field locked) for the duration."

/** Shared controlled wrapper — one `isOpen`/field state feeds every leaf state below. */
const ControlledConfirmDialog = ({ isConfirming = false }: { isConfirming?: boolean }) => {
    const [isOpen, setIsOpen] = useState(true)
    const [matchValue, setMatchValue] = useState("")

    const base = {
        isOpen,
        onOpenChange: setIsOpen,
        title: "Delete this course?",
        warningTitle: "This can't be undone",
        warningDescription: "Deleting \"Advanced State Management\" removes 5 lessons, revokes access for 12 enrolled learners, and deletes its stored video and documents. There is no undo.",
        matchText: MATCH_TEXT,
        matchValue,
        onMatchValueChange: setMatchValue,
        onConfirm: () => setIsOpen(false),
        isConfirming,
        labels: LABELS,
    }

    return (
        <div className="flex flex-col gap-3">
            <Button label="Delete course" variant="danger-soft" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <ConfirmDialog {...base} />
        </div>
    )
}

/** LEAF — one shape; the pictures are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ConfirmDialog"
                tier="block"
                leaf="Delete confirmation"
                annotate={ANNOTATE}
                reason={REASON}
                states={[
                    {
                        name: "matchValue = \"\" (delete disabled)",
                        why: "Nothing typed yet — delete stays disabled so the irreversible action can never fire on an accidental click.",
                        code: `<ConfirmDialog
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  title="Delete this course?"
  warningTitle="This can't be undone"
  warningDescription="…"
  matchText="advanced-state-management"
  matchValue=""
  onMatchValueChange={setMatchValue}
  onConfirm={deleteCourse}
  labels={labels}
/>`,
                        render: <ControlledConfirmDialog />,
                    },
                    {
                        name: "isConfirming = true",
                        why: "The delete mutation is in flight — the field and cancel lock, and the confirm button shows its busy state so a second press can't fire the delete twice.",
                        code: "<ConfirmDialog isConfirming … />",
                        render: <ControlledConfirmDialog isConfirming />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "This dialog only ever opens once the entity it names has resolved — a placeholder state, shown here for completeness rather than an everyday case.",
                        code: "<ConfirmDialog isSkeleton … />",
                        render: (
                            <div className="flex flex-col gap-3">
                                <ConfirmDialog
                                    isOpen
                                    onOpenChange={() => {}}
                                    title="Delete this course?"
                                    warningTitle="This can't be undone"
                                    warningDescription={"Deleting \"Advanced State Management\" removes 5 lessons, revokes access for 12 enrolled learners, and deletes its stored video and documents. There is no undo."}
                                    matchText={MATCH_TEXT}
                                    matchValue=""
                                    onMatchValueChange={() => {}}
                                    onConfirm={() => {}}
                                    labels={LABELS}
                                    isSkeleton
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
