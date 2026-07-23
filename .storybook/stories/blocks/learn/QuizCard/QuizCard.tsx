import React from "react"
import { Checkbox, CheckboxGroup, Radio, RadioGroup, Typography, cn } from "@heroui/react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { StatusChip } from "../../chips/StatusChip/StatusChip"
import { SectionCard } from "../../cards/SectionCard/SectionCard"
import { Button } from "../../buttons/Button/Button"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (composite) ported faithfully from
 * `@/components/blocks/learn/QuizCard`. Composed from the local primitives
 * `SectionCard` (frame) + `StatusChip` ("Câu N" marker). Synced to `src` later.
 */

export type QuizSelectionMode = "single" | "multiple"

export interface QuizOption {
    id: string
    label: React.ReactNode
    isCorrect?: boolean
}

export interface QuizCardProps {
    question: React.ReactNode
    options: QuizOption[]
    selectionMode?: QuizSelectionMode
    selectedIds: string[]
    onSelectionChange: (ids: string[]) => void
    isSubmitted?: boolean
    onSubmit?: () => void
    submitLabel?: React.ReactNode
    explanation?: React.ReactNode
    questionIndex?: number
    className?: string
}

type OptionVisualState = "default" | "selected" | "correct" | "incorrect" | "correctUnselected"

const ROW_CLASSES: Record<OptionVisualState, string> = {
    default: "border border-default bg-surface",
    selected: "border border-accent bg-accent-soft text-accent-soft-foreground",
    correct: "border border-success-soft-foreground bg-success-soft text-success-soft-foreground",
    incorrect: "border border-danger-soft-foreground bg-danger-soft text-danger-soft-foreground",
    correctUnselected: "border border-success-soft-foreground bg-surface text-success-soft-foreground",
}

const resolveOptionState = (option: QuizOption, isSelected: boolean, isSubmitted: boolean): OptionVisualState => {
    if (!isSubmitted) return isSelected ? "selected" : "default"
    if (option.isCorrect) return isSelected ? "correct" : "correctUnselected"
    return isSelected ? "incorrect" : "default"
}

const OptionResultIcon = ({ state }: { state: OptionVisualState }) => {
    if (state === "correct" || state === "correctUnselected") {
        return <CheckCircleIcon aria-hidden focusable="false" weight="fill" className="size-5 shrink-0 text-success-soft-foreground" />
    }
    if (state === "incorrect") {
        return <XCircleIcon aria-hidden focusable="false" weight="fill" className="size-5 shrink-0 text-danger-soft-foreground" />
    }
    return null
}

const ROW_BASE = "rounded-2xl px-4 py-3 transition-colors"

/**
 * A self-framed multiple-choice question card. Before submit only default/selected
 * styling shows (the answer key never leaks); after `isSubmitted` each row reveals
 * correct/incorrect. `selectionMode` switches RadioGroup (single) ↔ CheckboxGroup
 * (multiple). Controlled — selection lives with the caller.
 *
 * @param props - {@link QuizCardProps}
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
    return (
        <SectionCard className={cn(className)}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    {typeof questionIndex === "number" ? (
                        <StatusChip tone="accent">{`Câu ${questionIndex}`}</StatusChip>
                    ) : null}
                    <Typography type="body" weight="semibold">{question}</Typography>
                </div>

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
                                <Radio key={option.id} value={option.id} className={cn(ROW_BASE, ROW_CLASSES[state])}>
                                    <Radio.Content className="w-full">
                                        <Radio.Control><Radio.Indicator /></Radio.Control>
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
                                <Checkbox key={option.id} value={option.id} className={cn(ROW_BASE, ROW_CLASSES[state])}>
                                    <Checkbox.Content className="w-full">
                                        <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                                        <span className="min-w-0 flex-1">{option.label}</span>
                                        <OptionResultIcon state={state} />
                                    </Checkbox.Content>
                                </Checkbox>
                            )
                        })}
                    </CheckboxGroup>
                )}

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

                {isSubmitted && explanation ? (
                    <div className="flex flex-col gap-1 rounded-2xl bg-surface-secondary px-4 py-3">
                        <Typography type="body-sm" weight="semibold">Giải thích</Typography>
                        <Typography type="body-sm" color="muted">{explanation}</Typography>
                    </div>
                ) : null}
            </div>
        </SectionCard>
    )
}
