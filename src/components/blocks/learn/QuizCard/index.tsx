import React from "react"
import {
    Checkbox as HeroCheckbox,
    CheckboxGroup as HeroCheckboxGroup,
    Radio as HeroRadio,
    RadioGroup as HeroRadioGroup,
} from "@heroui/react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { StackV } from "@/components/frames/Stack"

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
 *
 * Does not take `className` (BLOCK-4) — no live call site forwards one today; a
 * caller that needs a specific placement composes a frame (`StackV`/`StackH`/…)
 * around the card, or passes `classNames` for POSITION only (closed union, same
 * vocabulary `SectionCard`/`MetricCard` already take).
 */
export interface QuizCardProps {
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
     * Label for the submit/check button. Defaults to `"Check answer"`. Ignored
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
     * "Question {n}" chip is shown above the question.
     */
    questionIndex?: number
    /**
     * Where this card sits inside its parent. Appearance is not passable — it
     * is already a prop.
     */
    classNames?: Array<AllowedClassName>
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

/** Row shell + its per-state skin. Two static strings — no `cn()` needed to join them. */
const rowClassName = (state: OptionVisualState) => `${ROW_BASE} ${ROW_CLASSES[state]}`

/**
 * QuizCard is a self-framed, multiple-choice question block built on
 * {@link SectionCard}. It stacks an optional "Question {n}" chip, the question, a set
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
 * `missingVocabulary` — the option group stays on raw HeroUI `Radio` /
 * `RadioGroup` / `Checkbox` / `CheckboxGroup` rather than the design system's own
 * `Choice.Radio` / `Choice.Checkbox` (`atoms/forms/Choice`) or `ChoiceRadioGroup`
 * (`composites/form/ChoiceRadioGroup`): neither takes a `ReactNode` option label,
 * neither carries a per-option CORRECTNESS skin (selected / correct / incorrect /
 * correct-but-unselected) with a trailing result glyph, and there is no checkbox
 * equivalent of `ChoiceRadioGroup` at all. Same documented gap
 * `SurfaceCard.SelectableGroup` already carries (`composites/cards/SurfaceCard`:
 * "Calls HeroUI Radio/RadioGroup directly … known drift"). This is a MINIMAL
 * local wrapper for that gap, not a new shared component — the leaves themselves
 * are untouched. Likewise the post-submit explanation panel stays a local
 * `rounded-2xl bg-surface-secondary` surface: no atom/composite renders a
 * neutral panel without alert semantics (`blocks/feedback/Callout` forces a
 * status tint + a required title).
 *
 * @param props - {@link QuizCardProps}
 *
 * @example
 * <QuizCard
 *   questionIndex={1}
 *   question="Which HTTP status reports a resource that doesn't exist?"
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
    submitLabel = "Check answer",
    explanation,
    questionIndex,
    classNames,
}: QuizCardProps) => {
    // Option rows — RadioGroup (single) or CheckboxGroup (multiple). Locked
    // read-only after submit so the revealed state can't be edited while staying
    // visually un-dimmed (unlike isDisabled). See the file header's
    // `missingVocabulary` note for why this stays on raw HeroUI components.
    const optionsGroup = selectionMode === "single" ? (
        <HeroRadioGroup
            aria-label="Answer options"
            value={selectedIds[0] ?? ""}
            onChange={(value) => onSelectionChange(value ? [value] : [])}
            isReadOnly={isSubmitted}
            className="flex flex-col gap-2"
        >
            {options.map((option) => {
                const isSelected = selectedIds.includes(option.id)
                const state = resolveOptionState(option, isSelected, isSubmitted)
                return (
                    <HeroRadio key={option.id} value={option.id} className={rowClassName(state)}>
                        <HeroRadio.Content className="w-full">
                            <HeroRadio.Control>
                                <HeroRadio.Indicator />
                            </HeroRadio.Control>
                            <span className="min-w-0 flex-1">{option.label}</span>
                            <OptionResultIcon state={state} />
                        </HeroRadio.Content>
                    </HeroRadio>
                )
            })}
        </HeroRadioGroup>
    ) : (
        <HeroCheckboxGroup
            aria-label="Answer options"
            value={selectedIds}
            onChange={onSelectionChange}
            isReadOnly={isSubmitted}
            className="flex flex-col gap-2"
        >
            {options.map((option) => {
                const isSelected = selectedIds.includes(option.id)
                const state = resolveOptionState(option, isSelected, isSubmitted)
                return (
                    <HeroCheckbox key={option.id} value={option.id} className={rowClassName(state)}>
                        <HeroCheckbox.Content className="w-full">
                            <HeroCheckbox.Control>
                                <HeroCheckbox.Indicator />
                            </HeroCheckbox.Control>
                            <span className="min-w-0 flex-1">{option.label}</span>
                            <OptionResultIcon state={state} />
                        </HeroCheckbox.Content>
                    </HeroCheckbox>
                )
            })}
        </HeroCheckboxGroup>
    )

    return (
        <SectionCard classNames={classNames}>
            <StackV
                gap={5}
                items={[
                    // Question header: optional index chip + the prompt
                    () => (
                        <StackV
                            gap={3}
                            items={[
                                ...(typeof questionIndex === "number"
                                    ? [() => <StatusChip tone="accent">{`Question ${questionIndex}`}</StatusChip>]
                                    : []),
                                () => <Typography size="base" weight="semibold" text={question} />,
                            ]}
                        />
                    ),
                    () => optionsGroup,
                    // Submit action — hidden once the answer is in or when no handler
                    ...(onSubmit && !isSubmitted
                        ? [() => (
                            <Button
                                label={submitLabel}
                                variant="primary"
                                size="sm"
                                onPress={onSubmit}
                                isDisabled={selectedIds.length === 0}
                                classNames={["w-fit"]}
                            />
                        )]
                        : []),
                    // Explanation — revealed only after submit
                    ...(isSubmitted && explanation
                        ? [() => (
                            <div className="rounded-2xl bg-surface-secondary">
                                <StackV
                                    gap={2}
                                    padding={{ x: 5, y: 4 }}
                                    items={[
                                        () => <Typography size="sm" weight="semibold" text="Explanation" />,
                                        () => <Typography size="sm" color="muted" text={explanation} />,
                                    ]}
                                />
                            </div>
                        )]
                        : []),
                ]}
            />
        </SectionCard>
    )
}
