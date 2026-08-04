import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    AiSuggestionDrawer,
    type AiSuggestionDrawerLabels,
    type AiSuggestionSourceView,
} from "@sb-components/nivoexpert/overlays/drawers/AiSuggestionDrawer/AiSuggestionDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AiSuggestionDrawer` — human-in-loop review for one AI tutor answer: the
 * learner's question, the RAG-grounded suggestion with its sources, and an
 * explicit reminder that the expert is responsible for what ships. Edit or
 * approve before it sends — there is no auto-send path.
 */
const meta: Meta<typeof AiSuggestionDrawer> = {
    title: "NivoExpert/Overlays/Drawers/AiSuggestionDrawer/AiSuggestionDrawer",
    component: AiSuggestionDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AiSuggestionDrawer>

const NOOP = () => {}

const LABELS: AiSuggestionDrawerLabels = {
    learnerQuestionLabel: "Learner asked",
    aiAnswerTitle: "AI tutor (RAG)",
    sourcesLabel: "Sources",
    humanInLoopTitle: "You're in the loop",
    humanInLoopReminder: "The model drafted this from your course content — you're responsible for what actually ships. Edit or approve before it sends.",
    editLabel: "Edit",
    approveAndSendLabel: "Approve & send",
    sendingLabel: "Sending…",
}

const SUGGESTION =
    "useReducer is a hook for managing state that changes through well-defined actions rather than ad-hoc setState calls — reach for it once your component's state has more than two or three fields that update together."

const SOURCES: Array<AiSuggestionSourceView> = [
    { id: "src-1", label: "Advanced React · Lesson 1" },
    { id: "src-2", label: "Advanced React · Lesson 3" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    Callout: { tier: "composite", role: "the human-in-loop reminder banner, above the question" },
    KeyValueList: { tier: "composite", role: "the learner's question row", storyId: "composites-data-keyvalue-keyvaluelist--default" },
    SurfaceCard: { tier: "composite", role: "the AI-answer card — title, the suggestion text, and its sources line" },
    InputTextarea: { tier: "atom", role: "the suggestion, only while `isEditingSuggestion` is true" },
}

/** Controlled wrapper — a trigger reopens the drawer after it closes, so the story stays interactive. */
const ControlledAiSuggestionDrawer = ({
    suggestion,
    isEditingSuggestion,
    sources,
    isSending,
    isSkeleton,
}: {
    suggestion: string
    isEditingSuggestion?: boolean
    sources: Array<AiSuggestionSourceView>
    isSending?: boolean
    isSkeleton?: boolean
}) => {
    const [isOpen, setIsOpen] = useState(true)
    const [value, setValue] = useState(suggestion)
    const [editing, setEditing] = useState(isEditingSuggestion ?? false)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Open suggestion" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <AiSuggestionDrawer
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                learnerQuestion="Can you explain useReducer?"
                suggestion={value}
                onSuggestionChange={setValue}
                isEditingSuggestion={editing}
                onEditSuggestion={() => setEditing(true)}
                sources={sources}
                onApproveAndSend={NOOP}
                isSending={isSending}
                isSkeleton={isSkeleton}
                labels={LABELS}
            />
        </div>
    )
}

/** STATE — the resolved drawer: the learner's question, the grounded suggestion, and its two sources, pending review. */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="AiSuggestionDrawer"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            reason="Presentational overlay drawer over one AI tutor turn, handed in as props (the connected layer runs the RAG lookup and hands back the resolved question/suggestion/sources). Human-in-loop is structural, not a hint: the suggestion always renders as static text first, and the reminder banner sits above it every time the drawer opens."
            states={[
                {
                    name: "suggestion pending review, with sources",
                    why: "A grounded answer with two cited lessons — the reminder banner sits above the question, the answer card shows the draft as static text, and the sources line names exactly what it drew from.",
                    code: "<AiSuggestionDrawer isOpen onOpenChange={close} learnerQuestion={question} suggestion={suggestion} sources={sources} onApproveAndSend={approve} labels={labels} />",
                    render: <ControlledAiSuggestionDrawer suggestion={SUGGESTION} sources={SOURCES} />,
                },
                {
                    name: "isEditingSuggestion = true",
                    why: "The expert tapped 'Edit' — the suggestion becomes an editable textarea, so what gets approved is exactly what the expert reviewed and adjusted.",
                    code: "<AiSuggestionDrawer … suggestion={suggestion} onSuggestionChange={setSuggestion} isEditingSuggestion sources={sources} labels={labels} />",
                    render: <ControlledAiSuggestionDrawer suggestion={SUGGESTION} sources={SOURCES} isEditingSuggestion />,
                },
                {
                    name: "sources = [] (no citation found)",
                    why: "The model answered without a matching lesson passage — the sources line is skipped entirely rather than rendering an empty 'Sources:' prefix.",
                    code: "<AiSuggestionDrawer … sources={[]} labels={labels} />",
                    render: <ControlledAiSuggestionDrawer suggestion={SUGGESTION} sources={[]} />,
                },
                {
                    name: "isSending = true",
                    why: "Right after 'Approve & send' is pressed: both footer buttons lock and Approve shows its spinner + 'Sending…' until the mutation resolves.",
                    code: "<AiSuggestionDrawer … onApproveAndSend={approve} isSending labels={labels} />",
                    render: <ControlledAiSuggestionDrawer suggestion={SUGGESTION} sources={SOURCES} isSending />,
                },
                {
                    name: "isSkeleton = true",
                    why: "The drawer's own first fetch is in flight: the reminder, the question row, and the answer card all shimmer together.",
                    code: "<AiSuggestionDrawer … isSkeleton labels={labels} />",
                    render: <ControlledAiSuggestionDrawer suggestion="" sources={[]} isSkeleton />,
                },
            ]}
        />
    ),
}
