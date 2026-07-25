import React from "react"
import { Checkbox, CheckboxGroup, Radio, RadioGroup, cn } from "@heroui/react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StatusChip } from "@sb-components/atoms/chips/StatusChip/StatusChip"
import { SectionCard } from "@sb-components/_designs/cards/SectionCard/SectionCard"
import { Button } from "@sb-components/_designs/buttons/Button/Button"

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
    /** Dev/spec: emit `data-anat-part` on each part so a BlockAnatomy panel can badge it on-render. */
    showAnatomy?: boolean
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

// The ✓/✗ result icon is Radio/Checkbox's OWN reveal-state marker (rendered as
// a row's children, like CrossListItem's `mark`) — not a separately tracked
// anatomy part; the row (Radio/Checkbox) is the node.
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
    showAnatomy = false,
}: QuizCardProps) => {
    return (
        <SectionCard anatPart={showAnatomy ? "SectionCard" : undefined} className={cn(className)}>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    {typeof questionIndex === "number" ? (
                        <StatusChip.Base anatPart={showAnatomy ? "StatusChip" : undefined} tone="accent" text={`Câu ${questionIndex}`} />
                    ) : null}
                    <Typography.Base weight="medium" showAnatomy={showAnatomy} text={question} />
                </div>

                {selectionMode === "single" ? (
                    <RadioGroup
                        data-anat-part={showAnatomy ? "RadioGroup" : undefined}
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
                                <Radio data-anat-part={showAnatomy ? "Radio" : undefined} key={option.id} value={option.id} className={cn(ROW_BASE, ROW_CLASSES[state])}>
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
                        data-anat-part={showAnatomy ? "CheckboxGroup" : undefined}
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
                                <Checkbox data-anat-part={showAnatomy ? "Checkbox" : undefined} key={option.id} value={option.id} className={cn(ROW_BASE, ROW_CLASSES[state])}>
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
                        anatPart={showAnatomy ? "Button" : undefined}
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
                        <Typography.Base size="sm" weight="medium" showAnatomy={showAnatomy} text="Giải thích" />
                        <Typography.Base size="sm" color="muted" showAnatomy={showAnatomy} text={explanation} />
                    </div>
                ) : null}
            </div>
        </SectionCard>
    )
}
