import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { CheckIcon } from "@phosphor-icons/react"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/** Horizontal, mid-flow: done = check, current = accent ring, upcoming = muted. */

/** One step on the {@link Stepper}. */
export interface StepperStep {
    /** Stable identity for the step (used as the React key). */
    id: string
    /** Short step label (e.g. `"Information"`). */
    label: React.ReactNode
    /** Optional one-line description shown under the label. */
    description?: React.ReactNode
}

/** Props for the {@link Stepper} block. */
export interface StepperProps {
    /** Ordered steps rendered along the track. */
    steps: ReadonlyArray<StepperStep>
    /**
     * Zero-based index of the CURRENT step. Steps before it read as done, steps
     * after it as upcoming. Pass `steps.length` to mark the whole flow complete
     * (every step done, no current step). Clamped to `[0, steps.length]`.
     */
    currentIndex: number
    /**
     * Track direction. `"horizontal"` (default) lays steps left → right with
     * connectors between them; `"vertical"` stacks them top → bottom (better on
     * narrow / mobile shells and for long step lists).
     */
    orientation?: "horizontal" | "vertical"
    /**
     * Optional press handler for COMPLETED steps only. When provided, done steps
     * become buttons that fire this with their index (e.g. to jump back and edit).
     * Current and upcoming steps stay inert.
     */
    onStepPress?: (index: number) => void
    /** Layout utilities on the track, from the closed positioning union. */
    /**
     * `true` → each part this block renders carries a ``
     * attribute so a BlockAnatomy panel can badge it on-render. Off in production.
     */
}

/** Visual state of a single step relative to {@link StepperProps.currentIndex}. */
type StepState = "done" | "current" | "upcoming"

/**
 * The circular indicator for one step: a check when done, the 1-based number
 * otherwise, tokened by state — done = filled success, current = filled accent
 * with an emphasis ring, upcoming = muted outline.
 */
interface StepIndicatorProps {
    state: StepState
    index: number
}

const StepIndicator = ({
    state,
    index,
}: StepIndicatorProps) => (
    <span
        aria-hidden
        className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
            state === "done" && "bg-success text-success-foreground",
            state === "current" && "bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2",
            state === "upcoming" && "border-2 border-default text-default",
        )}
    >
        {state === "done" ? <CheckIcon weight="bold" className="size-4" /> : index + 1}
    </span>
)

/**
 * Stepper is a horizontal (or vertical) step indicator for multi-step flows —
 * onboarding, CV submission, checkout. Each step shows a number (or a check once
 * done), a label, and an optional description; connectors between steps turn
 * success-coloured as the flow advances, and the current step is emphasized with
 * an accent ring. When {@link StepperProps.onStepPress} is supplied, completed
 * steps become clickable so the user can jump back.
 *
 * Tier-3 presentational block: props-only, no store, no SWR, no side-effects.
 *
 * @param props - {@link StepperProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "Stepper" } as const

const StepperBase = ({
    steps,
    currentIndex,
    orientation = "horizontal",
    onStepPress,
    
}: StepperProps) => {
    const isVertical = orientation === "vertical"
    const safeIndex = Math.min(Math.max(currentIndex, 0), steps.length)

    const stateOf = (index: number): StepState =>
        index < safeIndex ? "done" : index === safeIndex ? "current" : "upcoming"

    return (
        <div
            className={cn(
                "flex",
                isVertical ? "flex-col gap-3" : "items-start",
                
            )}
            data-tier="composite"
            data-component="Stepper"
        >
            {steps.map((step, index) => {
                const state = stateOf(index)
                const isFirst = index === 0
                // A connector is "passed" (success) once its LEFT/UPPER step is done.
                const connectorPassed = index <= safeIndex
                const isClickable = state === "done" && onStepPress !== undefined

                const copyBlock = (
                    <div
                        className={cn(
                            "flex flex-col gap-0",
                            isVertical ? "" : "items-center text-center",
                        )}
                    >
                        <span>
                            <Typography size="sm"
                                text={step.label}
                                weight={state === "current" ? "medium" : undefined}
                                color={state === "upcoming" ? "muted" : undefined}
                            />
                        </span>
                        {step.description ? (
                            <span>
                                <Typography size="xs" text={step.description} color="muted" />
                            </span>
                        ) : null}
                    </div>
                )

                const identityItems = [
                    () => <StepIndicator state={state} index={index} />,
                    () => copyBlock,
                ]

                // Horizontal: each step is a column; a flex-1 connector sits before every
                // step after the first so the line spans the gap between indicators.
                if (!isVertical) {
                    return (
                        <React.Fragment key={step.id}>
                            {!isFirst ? (
                                <span aria-hidden className="flex h-8 min-w-6 flex-1 items-center">
                                    <span
                                        className={cn(
                                            "h-0.5 w-full",
                                            connectorPassed ? "bg-success" : "bg-default",
                                        )}
                                    />
                                </span>
                            ) : null}
                            {isClickable ? (
                                <button
                                    type="button"
                                    onClick={() => onStepPress(index)}
                                    className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                >
                                    <StackV
                                        gap={3}
                                        principle="identity"
                                        explain="Step indicator above its label — not title-subtitle, because the upper node is a status glyph rather than a heading line."
                                        align="center"
                                        items={identityItems}
                                    />
                                </button>
                            ) : (
                                <StackV
                                    gap={3}
                                    principle="identity"
                                    explain="Step indicator above its label — not title-subtitle, because the upper node is a status glyph rather than a heading line."
                                    align="center"
                                    items={identityItems}
                                />
                            )}
                        </React.Fragment>
                    )
                }

                // Vertical: indicator + a vertical connector down its left rail, copy on the right.
                // The step's clickable copy vs. static copy are the SAME shape (label
                // + optional description) — one node, only the wrapping tag differs.
                const labelItems = [
                    () => (
                        <span>
                            <Typography
                                size="sm"
                                text={step.label}
                                weight={!isClickable && state === "current" ? "medium" : undefined}
                                color={!isClickable && state === "upcoming" ? "muted" : undefined}
                            />
                        </span>
                    ),
                    ...(step.description ? [() => (
                        <span>
                            <Typography size="xs" text={step.description} color="muted" />
                        </span>
                    )] : []),
                ]
                const railItems = [
                    () => <StepIndicator state={state} index={index} />,
                    ...(index < steps.length - 1 ? [() => (
                        <span
                            aria-hidden
                            className={cn(
                                "w-0.5 flex-1",
                                index < safeIndex ? "bg-success" : "bg-default",
                            )}
                        />
                    )] : []),
                ]
                return (
                    <StackH
                        key={step.id}
                        gap={4}
                        principle="content-row"
                        explain="Rail beside step copy — not identity, because the left column is a progress rail rather than a person/entity cluster."
                        align="stretch"
                        items={[
                            () => (
                                <StackV
                                    gap={2}
                                    principle="icon-text"
                                    explain="Indicator over optional connector — not name-handle, because this pairs a glyph with a rail rather than a name/handle identity."
                                    align="center"
                                    items={railItems}
                                />
                            ),
                            () => isClickable ? (
                                <button
                                    type="button"
                                    onClick={() => onStepPress(index)}
                                    // inset-exception: optical nudge lining the label up with the step dot, not a surface inset
                                    className="pt-1 text-left rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                >
                                    <StackV
                                        gap={1}
                                        principle="title-subtitle"
                                        explain="Step label over optional description — not label-field, because neither line labels a form control."
                                        items={labelItems}
                                    />
                                </button>
                            ) : (
                            // inset-exception: optical nudge lining the label up with the step dot
                                <div className="pt-1">
                                    <StackV
                                        gap={1}
                                        principle="title-subtitle"
                                        explain="Step label over optional description — not label-field, because neither line labels a form control."
                                        items={labelItems}
                                    />
                                </div>
                            ),
                        ]}
                    />
                )
            })}
        </div>
    )
}

/**
 * `Stepper.*` — compound namespace (§13a: group by frame family). Only one
 * shape exists so far, so the namespace has exactly one member, `Base`, the
 * same way `Skeleton.*`/`Chip.*` do while their family has only 1 frame.
 */
export { StepperBase as Stepper }
