import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { CheckIcon } from "@phosphor-icons/react"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/navigation/Stepper`.
 * Authored in Storybook (not `src`); synced to `src` later.
 * ─────────────────────────────────────────────────────────────────────────────
 */

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
    /** Extra classes on the track. */
    className?: string
    /** Layout utilities on the track, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
    /**
     * `true` → each part this block renders carries a `data-anat-part="<name>"`
     * attribute so a BlockAnatomy panel can badge it on-render. Off in production.
     */
    showAnatomy?: boolean
}

/** Visual state of a single step relative to {@link StepperProps.currentIndex}. */
type StepState = "done" | "current" | "upcoming"

/**
 * The circular indicator for one step: a check when done, the 1-based number
 * otherwise, tokened by state — done = filled success, current = filled accent
 * with an emphasis ring, upcoming = muted outline.
 */
const StepIndicator = ({
    state,
    index,
    showAnatomy,
}: {
    state: StepState
    index: number
    showAnatomy?: boolean
}) => (
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
const StepperBase = ({
    steps,
    currentIndex,
    orientation = "horizontal",
    onStepPress,
    className,
    classNames,
    showAnatomy,
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
                className,
                classNames,
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
                        <StepIndicator state={state} index={index} showAnatomy={showAnatomy} />
                        <div
                            className={cn(
                                "flex flex-col gap-0",
                                isVertical ? "" : "items-center text-center",
                            )}
                        >
                            <span data-anat-part={showAnatomy ? "Typography" : undefined}>
                                <Typography size="sm"
                                    text={step.label}
                                    weight={state === "current" ? "medium" : undefined}
                                    color={state === "upcoming" ? "muted" : undefined}
                                />
                            </span>
                            {step.description ? (
                                <span data-anat-part={showAnatomy ? "Typography" : undefined}>
                                    <Typography size="xs" text={step.description} color="muted" />
                                </span>
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
                                    <StackV gap="related" align="center" body={indicatorAndCopy} />
                                </button>
                            ) : (
                                <StackV gap="related" align="center" body={indicatorAndCopy} />
                            )}
                        </React.Fragment>
                    )
                }

                // Vertical: indicator + a vertical connector down its left rail, copy on the right.
                // The step's clickable copy vs. static copy are the SAME shape (label
                // + optional description) — one node, only the wrapping tag differs.
                const clickableCopy = (
                    <>
                        <span data-anat-part={showAnatomy ? "Typography" : undefined}>
                            <Typography size="sm" text={step.label} />
                        </span>
                        {step.description ? (
                            <span data-anat-part={showAnatomy ? "Typography" : undefined}>
                                <Typography size="xs" text={step.description} color="muted" />
                            </span>
                        ) : null}
                    </>
                )
                const staticCopy = (
                    <>
                        <span data-anat-part={showAnatomy ? "Typography" : undefined}>
                            <Typography size="sm"
                                text={step.label}
                                weight={state === "current" ? "medium" : undefined}
                                color={state === "upcoming" ? "muted" : undefined}
                            />
                        </span>
                        {step.description ? (
                            <span data-anat-part={showAnatomy ? "Typography" : undefined}>
                                <Typography size="xs" text={step.description} color="muted" />
                            </span>
                        ) : null}
                    </>
                )
                const railAndConnector = (
                    <>
                        <StepIndicator state={state} index={index} showAnatomy={showAnatomy} />
                        {index < steps.length - 1 ? (
                            <span
                                aria-hidden
                                className={cn(
                                    "w-0.5 flex-1",
                                    index < safeIndex ? "bg-success" : "bg-default",
                                )}
                            />
                        ) : null}
                    </>
                )
                return (
                    <StackH
                        key={step.id}
                        gap="grouped"
                        align="stretch"
                        body={
                            <>
                                <StackV gap="tight" align="center" body={railAndConnector} />
                                {isClickable ? (
                                    <button
                                        type="button"
                                        onClick={() => onStepPress(index)}
                                        // inset-exception: optical nudge lining the label up with the step dot, not a surface inset
                                        className="pt-1 text-left rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                    >
                                        <StackV gap="flush" body={clickableCopy} />
                                    </button>
                                ) : (
                                    // inset-exception: optical nudge lining the label up with the step dot
                                    <StackV gap="flush" className="pt-1" body={staticCopy} />
                                )}
                            </>
                        }
                    />
                )
            })}
        </div>
    )
}

/**
 * `Stepper.*` — compound namespace (§13a: gom theo họ khung). Chỉ một hình
 * thái hiện có nên namespace có đúng một member, `Base`, giống cách
 * `Skeleton.*`/`Chip.*` đã làm khi họ chỉ có 1 khung.
 */
export { StepperBase as Stepper }
