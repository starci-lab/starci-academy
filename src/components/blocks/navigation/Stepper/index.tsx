import React from "react"
import { Typography, cn } from "@heroui/react"
import { CheckIcon } from "@phosphor-icons/react"

import type { WithClassNames } from "@/modules/types/base/class-name"

/** One step on the {@link Stepper}. */
export interface StepperStep {
    /** Stable identity for the step (used as the React key). */
    id: string
    /** Short step label (e.g. `"Thông tin"`). */
    label: React.ReactNode
    /** Optional one-line description shown under the label. */
    description?: React.ReactNode
}

/** Props for the {@link Stepper} block. */
export interface StepperProps extends WithClassNames<undefined> {
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
}

/** Visual state of a single step relative to {@link StepperProps.currentIndex}. */
type StepState = "done" | "current" | "upcoming"

/**
 * The circular indicator for one step: a check when done, the 1-based number
 * otherwise, tokened by state — done = filled success, current = filled accent
 * with an emphasis ring, upcoming = muted outline.
 */
const StepIndicator = ({ state, index }: { state: StepState; index: number }) => (
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
 *
 * @example
 * <Stepper
 *   steps={[
 *     { id: "a", label: "Thông tin" },
 *     { id: "b", label: "Xác nhận" },
 *     { id: "c", label: "Hoàn tất" },
 *   ]}
 *   currentIndex={1}
 * />
 */
export const Stepper = ({
    steps,
    currentIndex,
    orientation = "horizontal",
    onStepPress,
    className,
}: StepperProps) => {
    const isVertical = orientation === "vertical"
    const safeIndex = Math.min(Math.max(currentIndex, 0), steps.length)

    const stateOf = (index: number): StepState =>
        index < safeIndex ? "done" : index === safeIndex ? "current" : "upcoming"

    return (
        <div
            className={cn(
                "flex",
                isVertical ? "flex-col" : "items-start",
                className,
            )}
        >
            {steps.map((step, index) => {
                const state = stateOf(index)
                const isFirst = index === 0
                // A connector is "passed" (success) once its LEFT/UPPER step is done.
                const connectorPassed = index <= safeIndex
                const isClickable = state === "done" && onStepPress !== undefined

                const indicatorAndCopy = (
                    <>
                        <StepIndicator state={state} index={index} />
                        <div
                            className={cn(
                                "flex flex-col gap-0",
                                isVertical ? "pt-1" : "mt-2 items-center text-center",
                            )}
                        >
                            <Typography
                                type="body-sm"
                                weight={state === "current" ? "semibold" : "normal"}
                                color={state === "upcoming" ? "muted" : undefined}
                            >
                                {step.label}
                            </Typography>
                            {step.description ? (
                                <Typography type="body-xs" color="muted">
                                    {step.description}
                                </Typography>
                            ) : null}
                        </div>
                    </>
                )

                // Horizontal: each step is a column; a flex-1 connector sits before every
                // step after the first so the line spans the gap between indicators.
                if (!isVertical) {
                    return (
                        <React.Fragment key={step.id}>
                            {!isFirst ? (
                                <span
                                    aria-hidden
                                    className={cn(
                                        "mt-4 h-0.5 min-w-6 flex-1",
                                        connectorPassed ? "bg-success" : "bg-default",
                                    )}
                                />
                            ) : null}
                            {isClickable ? (
                                <button
                                    type="button"
                                    onClick={() => onStepPress(index)}
                                    className="flex flex-col items-center gap-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                >
                                    {indicatorAndCopy}
                                </button>
                            ) : (
                                <div className="flex flex-col items-center gap-0">
                                    {indicatorAndCopy}
                                </div>
                            )}
                        </React.Fragment>
                    )
                }

                // Vertical: indicator + a vertical connector down its left rail, copy on the right.
                return (
                    <div key={step.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <StepIndicator state={state} index={index} />
                            {index < steps.length - 1 ? (
                                <span
                                    aria-hidden
                                    className={cn(
                                        "my-1 w-0.5 flex-1",
                                        index < safeIndex ? "bg-success" : "bg-default",
                                    )}
                                />
                            ) : null}
                        </div>
                        {isClickable ? (
                            <button
                                type="button"
                                onClick={() => onStepPress(index)}
                                className="mb-4 flex flex-col gap-0 pt-1 text-left rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                <Typography
                                    type="body-sm"
                                    weight="normal"
                                >
                                    {step.label}
                                </Typography>
                                {step.description ? (
                                    <Typography type="body-xs" color="muted">
                                        {step.description}
                                    </Typography>
                                ) : null}
                            </button>
                        ) : (
                            <div className="mb-4 flex flex-col gap-0 pt-1">
                                <Typography
                                    type="body-sm"
                                    weight={state === "current" ? "semibold" : "normal"}
                                    color={state === "upcoming" ? "muted" : undefined}
                                >
                                    {step.label}
                                </Typography>
                                {step.description ? (
                                    <Typography type="body-xs" color="muted">
                                        {step.description}
                                    </Typography>
                                ) : null}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
