import { CheckCircleIcon, PencilSimpleIcon, SparkleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputTextarea } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { KeyValueList, type KeyValueListItem } from "@sb-components/composites/data/KeyValue/KeyValue"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AiSuggestionDrawer` — human-in-loop review for one AI tutor answer: the
 * learner's question, the RAG-grounded suggestion with its sources, and an
 * explicit reminder that the expert is responsible for what ships. Edit or
 * approve before it sends — there is no auto-send path.
 */

/** One lesson the suggestion was grounded in. */
export interface AiSuggestionSourceView {
    /** Stable id. */
    id: string
    /** Already-formatted label (e.g. "Advanced React · Lesson 1"). */
    label: string
}

/** Props for {@link AiSuggestionDrawer}. */
export interface AiSuggestionDrawerProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** What the learner asked, verbatim. */
    learnerQuestion: string
    /** The AI tutor's suggested answer, awaiting review. */
    suggestion: string
    /** Fires as the expert edits the suggestion, once {@link isEditingSuggestion} is true. */
    onSuggestionChange: (value: string) => void
    /** `true` → the suggestion renders as an editable textarea instead of static text. */
    isEditingSuggestion?: boolean
    /** Switches the suggestion into edit mode. */
    onEditSuggestion: () => void
    /** The lessons the suggestion drew from. Empty → the sources line is skipped. */
    sources: Array<AiSuggestionSourceView>
    /** Approves the (possibly edited) suggestion and sends it to the learner. */
    onApproveAndSend: () => void
    /** `true` → the send is in flight: both footer buttons lock, Approve shows a spinner. */
    isSending?: boolean
    /**
     * `true` → the drawer's own first fetch is in flight: the question, the
     * suggestion card, and the sources line all draw their skeleton mirror,
     * threaded straight down.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: AiSuggestionDrawerLabels
}

/** The already-resolved copy the drawer renders. */
export interface AiSuggestionDrawerLabels {
    /** Row label above the learner's question. */
    learnerQuestionLabel: string
    /** AI-answer card title. */
    aiAnswerTitle: string
    /** Prefix before the joined source labels (e.g. "Sources"). */
    sourcesLabel: string
    /** Title of the human-in-loop reminder banner shown above the answer. */
    humanInLoopTitle: string
    /** Supporting line of the human-in-loop reminder banner. */
    humanInLoopReminder: string
    /** "Edit" footer button label. */
    editLabel: string
    /** "Approve & send" footer button label at rest. */
    approveAndSendLabel: string
    /** "Approve & send" footer button label while sending. */
    sendingLabel: string
}

/**
 * The AI-suggestion review drawer. See the file header for the human-in-loop
 * discipline this shell exists to enforce.
 *
 * @param props - {@link AiSuggestionDrawerProps}
 */
const AiSuggestionDrawer = ({
    isOpen,
    onOpenChange,
    learnerQuestion,
    suggestion,
    onSuggestionChange,
    isEditingSuggestion = false,
    onEditSuggestion,
    sources,
    onApproveAndSend,
    isSending = false,
    isSkeleton = false,
    labels,
}: AiSuggestionDrawerProps) => {
    const questionRow: Array<KeyValueListItem> = [
        { key: "question", label: labels.learnerQuestionLabel, value: learnerQuestion },
    ]

    const Body = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <StackV
            gap={4}
            isSkeleton={skeleton}
            items={[
                () => (
                    <Callout
                        status="info"
                        title={labels.humanInLoopTitle}
                        description={labels.humanInLoopReminder}
                        isSkeleton={skeleton}
                    />
                ),
                () => <KeyValueList items={questionRow} isSkeleton={skeleton} />,
                () => (
                    <SurfaceCard
                        variant="nested"
                        padding={3}
                        isSkeleton={skeleton}
                        body={() => (
                            <StackV
                                gap={3}
                                isSkeleton={skeleton}
                                items={[
                                    () => (
                                        <StackH
                                            gap={2}
                                            align="center"
                                            isSkeleton={skeleton}
                                            items={[
                                                () => (
                                                    <SparkleIcon
                                                        aria-hidden
                                                        focusable="false"
                                                        weight="fill"
                                                        className="size-4 shrink-0 text-accent"
                                                    />
                                                ),
                                                () => (
                                                    <Typography
                                                        size="sm"
                                                        weight="semibold"
                                                        isSkeleton={skeleton}
                                                        text={labels.aiAnswerTitle}
                                                    />
                                                ),
                                            ]}
                                        />
                                    ),
                                    () =>
                                        !skeleton && isEditingSuggestion ? (
                                            <InputTextarea
                                                variant="secondary"
                                                ariaLabel={labels.aiAnswerTitle}
                                                value={suggestion}
                                                onValueChange={onSuggestionChange}
                                                rows={5}
                                            />
                                        ) : (
                                            <Typography size="sm" preserveWhitespace isSkeleton={skeleton} text={suggestion} />
                                        ),
                                    ...(!skeleton && sources.length > 0
                                        ? [() => (
                                            <Typography
                                                size="xs"
                                                color="muted"
                                                text={`${labels.sourcesLabel}: ${sources.map((source) => source.label).join(" · ")}`}
                                            />
                                        )]
                                        : []),
                                ]}
                            />
                        )}
                    />
                ),
            ]}
        />
    )

    const Footer = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <>
            <Button
                variant="outline"
                prefixIcon={PencilSimpleIcon}
                label={labels.editLabel}
                onPress={onEditSuggestion}
                isDisabled={isSending}
                isSkeleton={skeleton}
            />
            <Button
                variant="primary"
                prefixIcon={CheckCircleIcon}
                label={isSending ? labels.sendingLabel : labels.approveAndSendLabel}
                onPress={onApproveAndSend}
                isPending={isSending}
                isSkeleton={skeleton}
            />
        </>
    )

    return (
        <div>
            <DrawerShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={labels.aiAnswerTitle}
                isSkeleton={isSkeleton}
                body={Body}
                footer={Footer}
            />
        </div>
    )
}

export { AiSuggestionDrawer }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "overlay", name: "AiSuggestionDrawer" } as const
