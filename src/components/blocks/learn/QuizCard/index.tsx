import React from "react"
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Typography,
    cn,
} from "@heroui/react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * How many options the learner may pick at once:
 * - `"single"` → radio semantics (exactly one), rendered with HeroUI `RadioGroup`.
 * - `"multiple"` → checkbox semantics (zero or more), rendered with HeroUI `CheckboxGroup`.
 */
export type QuizSelectionMode = "single" | "multiple"

/**
 * One selectable answer of a {@link QuizCard}.
 */
export interface QuizOption {
    /** Stable identity of the option — the value surfaced through `selectedIds` / `onSelectionChange`. */
    id: string
    /** The answer body shown on the row (plain text or a richer `ReactNode`). */
    label: React.ReactNode
    /**
     * Whether this option is a correct answer. Consumed ONLY after `isSubmitted`
     * to paint the per-option success / danger states — ignored before submit so
     * the answer key never leaks early.
     */
    isCorrect?: boolean
}

/**
 * Props for the {@link QuizCard} block.
 *
 * A multiple-choice question card for graded assessments — a question, a list of
 * selectable option rows, an optional check action, and a post-answer explanation.
 * Tier-3 presentational: selection is fully CONTROLLED by the caller
 * (`selectedIds` + `onSelectionChange`) and every callback may be a no-op.
 */
export interface QuizCardProps extends WithClassNames<undefined> {
    /**
     * The question prompt (plain text or a richer `ReactNode` — e.g. a code
     * snippet). Rendered prominently above the options.
     */
    question: React.ReactNode
    /**
     * The selectable answers, in display order. Each carries an `id`, a `label`,
     * and an optional `isCorrect` flag used only once `isSubmitted` is `true`.
     */
    options: QuizOption[]
    /**
     * Whether the learner may pick one (`"single"`, radio) or several
     * (`"multiple"`, checkbox) options. Defaults to `"single"`.
     */
    selectionMode?: QuizSelectionMode
    /**
     * The currently selected option ids (CONTROLLED). For `"single"` mode this
     * holds at most one id; for `"multiple"` it holds every picked id.
     */
    selectedIds: string[]
    /**
     * Fired when the selection changes, with the NEXT full list of selected ids.
     * A no-op is valid (e.g. a static, read-only preview).
     */
    onSelectionChange: (ids: string[]) => void
    /**
     * Whether the answer has been submitted. When `true` the options lock
     * (read-only) and each row reveals its correct / incorrect state; the submit
     * action and the pre-answer affordances disappear. Defaults to `false`.
     */
    isSubmitted?: boolean
    /**
     * Fired when the learner presses the submit/check button. Omit it (together
     * with driving `isSubmitted` yourself) to hide the built-in action entirely.
     */
    onSubmit?: () => void
    /**
     * Label for the submit/check button. Defaults to `"Kiểm tra đáp án"`. Ignored
     * when `onSubmit` is not provided or once `isSubmitted` is `true`.
     */
    submitLabel?: React.ReactNode
    /**
     * Optional explanation revealed AFTER submit (plain text or a richer
     * `ReactNode`). Shown only while `isSubmitted` is `true`.
     */
    explanation?: React.ReactNode
    /**
     * Optional 1-based position of the question within its quiz. When set, a
     * "Câu {n}" chip is shown above the question.
     */
    questionIndex?: number
}

/** The mutually-exclusive visual state a single option row can be in. */
type OptionVisualState =
    | "default"
    | "selected"
    | "correct"
    | "incorrect"
    | "correctUnselected"

/**
 * Per-state row classes. Tokens only — correct uses `bg-success-soft` /
 * `text-success-soft-foreground`, incorrect uses the danger-soft pairing, and
 * `correctUnselected` is a subtle success OUTLINE (no soft fill) so a missed
 * correct answer reads as a hint, not an achievement.
 */
const ROW_CLASSES: Record<OptionVisualState, string> = {
    default: "border border-default bg-surface",
    selected: "border border-accent bg-accent-soft text-accent-soft-foreground",
    correct: "border border-success-soft-foreground bg-success-soft text-success-soft-foreground",
    incorrect: "border border-danger-soft-foreground bg-danger-soft text-danger-soft-foreground",
    correctUnselected: "border border-success-soft-foreground bg-surface text-success-soft-foreground",
}

/**
 * Resolves the visual state of one option from the current selection + submit
 * status. Before submit only default / selected are possible (the answer key
 * stays hidden); after submit the success / danger states are revealed.
 */
const resolveOptionState = (
    option: QuizOption,
    isSelected: boolean,
    isSubmitted: boolean,
): OptionVisualState => {
    if (!isSubmitted) {
        return isSelected ? "selected" : "default"
    }
    if (option.isCorrect) {
        return isSelected ? "correct" : "correctUnselected"
    }
    return isSelected ? "incorrect" : "default"
}

/**
 * The trailing result glyph for a post-submit row: a success check on correct
 * answers, a danger cross on a wrongly-picked answer, nothing otherwise.
 */
const OptionResultIcon = ({ state }: { state: OptionVisualState }) => {
    if (state === "correct" || state === "correctUnselected") {
        return (
            <CheckCircleIcon
                aria-hidden
                focusable="false"
                weight="fill"
                className="size-5 shrink-0 text-success-soft-foreground"
            />
        )
    }
    if (state === "incorrect") {
        return (
            <XCircleIcon
                aria-hidden
                focusable="false"
                weight="fill"
                className="size-5 shrink-0 text-danger-soft-foreground"
            />
        )
    }
    return null
}

/** Shared row shell class for every option (spacing + rounded frame + transition). */
const ROW_BASE = "rounded-2xl px-4 py-3 transition-colors"

/**
 * QuizCard is a self-framed, multiple-choice question block built on
 * {@link SectionCard}. It stacks an optional "Câu {n}" chip, the question, a set
 * of selectable option rows, an optional submit action, and a post-answer
 * explanation. `selectionMode` switches between HeroUI `RadioGroup` (single) and
 * `CheckboxGroup` (multiple) — both with proper group + option ARIA.
 *
 * Before submit, rows show only default / selected (accent) styling so the answer
 * key never leaks. Once `isSubmitted` is `true` the group turns read-only and
 * each row reveals its state: correct → success-soft + check, wrongly-picked →
 * danger-soft + cross, missed-correct → a subtle success outline.
 *
 * Tier-3 presentational: props-only, no store, no SWR, no side-effects; selection
 * is CONTROLLED by the caller and every callback may be a no-op.
 *
 * @param props - {@link QuizCardProps}
 *
 * @example
 * <QuizCard
 *   questionIndex={1}
 *   question="HTTP status nào báo tài nguyên không tồn tại?"
 *   options={[
 *     { id: "a", label: "200 OK" },
 *     { id: "b", label: "404 Not Found", isCorrect: true },
 *   ]}
 *   selectedIds={selectedIds}
 *   onSelectionChange={setSelectedIds}
 *   onSubmit={handleSubmit}
 * />
 * @see Story: .storybook/stories/blocks/learn/QuizCard/QuizCard.stories
 */
export const QuizCard = ({
    question,
    options,
    selectionMode = "single",
    selectedIds,
    onSelectionChange,
    isSubmitted = false,
    onSubmit,
    submitLabel = "Kiểm tra đáp án",
    explanation,
    questionIndex,
    className,
}: QuizCardProps) => {
    // The prompt + options + action share one framed surface; SectionCard is
    // left header-less so the question itself is the visual anchor.
    return (
        <SectionCard className={cn(className)}>
            <div className="flex flex-col gap-4">
                {/* Question header: optional index chip + the prompt */}
                <div className="flex flex-col gap-2">
                    {typeof questionIndex === "number" ? (
                        <StatusChip tone="accent">{`Câu ${questionIndex}`}</StatusChip>
                    ) : null}
                    <Typography type="body" weight="semibold">
                        {question}
                    </Typography>
                </div>

                {/* Option rows — RadioGroup (single) or CheckboxGroup (multiple).
                    Locked read-only after submit so the revealed state can't be
                    edited while staying visually un-dimmed (unlike isDisabled). */}
                {selectionMode === "single" ? (
                    <RadioGroup
                        aria-label="Các phương án trả lời"
                        value={selectedIds[0] ?? ""}
                        onChange={(value) => onSelectionChange(value ? [value] : [])}
                        isReadOnly={isSubmitted}
                        className="flex flex-col gap-2"
                    >
                        {options.map((option) => {
                            const isSelected = selectedIds.includes(option.id)
                            const state = resolveOptionState(option, isSelected, isSubmitted)
                            return (
                                <Radio
                                    key={option.id}
                                    value={option.id}
                                    className={cn(ROW_BASE, ROW_CLASSES[state])}
                                >
                                    <Radio.Content className="w-full">
                                        <Radio.Control>
                                            <Radio.Indicator />
                                        </Radio.Control>
                                        <span className="min-w-0 flex-1">{option.label}</span>
                                        <OptionResultIcon state={state} />
                                    </Radio.Content>
                                </Radio>
                            )
                        })}
                    </RadioGroup>
                ) : (
                    <CheckboxGroup
                        aria-label="Các phương án trả lời"
                        value={selectedIds}
                        onChange={onSelectionChange}
                        isReadOnly={isSubmitted}
                        className="flex flex-col gap-2"
                    >
                        {options.map((option) => {
                            const isSelected = selectedIds.includes(option.id)
                            const state = resolveOptionState(option, isSelected, isSubmitted)
                            return (
                                <Checkbox
                                    key={option.id}
                                    value={option.id}
                                    className={cn(ROW_BASE, ROW_CLASSES[state])}
                                >
                                    <Checkbox.Content className="w-full">
                                        <Checkbox.Control>
                                            <Checkbox.Indicator />
                                        </Checkbox.Control>
                                        <span className="min-w-0 flex-1">{option.label}</span>
                                        <OptionResultIcon state={state} />
                                    </Checkbox.Content>
                                </Checkbox>
                            )
                        })}
                    </CheckboxGroup>
                )}

                {/* Submit action — hidden once the answer is in or when no handler */}
                {onSubmit && !isSubmitted ? (
                    <Button
                        variant="primary"
                        size="sm"
                        onPress={onSubmit}
                        isDisabled={selectedIds.length === 0}
                        className="w-fit"
                    >
                        {submitLabel}
                    </Button>
                ) : null}

                {/* Explanation — revealed only after submit */}
                {isSubmitted && explanation ? (
                    <div className="flex flex-col gap-1 rounded-2xl bg-surface-secondary px-4 py-3">
                        <Typography type="body-sm" weight="semibold">
                            Giải thích
                        </Typography>
                        <Typography type="body-sm" color="muted">
                            {explanation}
                        </Typography>
                    </div>
                ) : null}
            </div>
        </SectionCard>
    )
}
