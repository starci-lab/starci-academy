"use client"

import React, { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { CheckIcon, XIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { IOExampleCard } from "@/components/blocks/code/IOExampleCard"

/** One testcase outcome shown as a selectable pill + (sample) IO detail. */
export interface TestCaseResult {
    /** Stable key. */
    key: string
    /** Pill label (e.g. "Case 1"). */
    label: ReactNode
    /** Whether this case passed. */
    passed: boolean
    /** Sample cases carry IO; hidden cases show only the verdict pill. */
    isSample: boolean
    /** Sample-only: the stdin fed to the program. */
    input?: string | null
    /** Sample-only: the expected stdout. */
    expectedOutput?: string | null
    /** Sample-only: the program's actual stdout. */
    got?: string | null
}

/** Localised labels for the selected-case IO rows (caller passes translations). */
export interface TestCaseResultLabels {
    /** Label above the input value. */
    input: ReactNode
    /** Label above the expected value. */
    expected: ReactNode
    /** Label above the actual (got) value. */
    got: ReactNode
    /** Note shown when the selected case is a hidden (non-sample) case. */
    hidden: ReactNode
}

/** Props for the {@link TestCaseResultGrid} block. */
export interface TestCaseResultGridProps extends WithClassNames<undefined> {
    /** The per-case outcomes, in evaluation order. */
    cases: Array<TestCaseResult>
    /** Localised labels for the selected sample case's IO rows. */
    labels: TestCaseResultLabels
}

/** Index of the first failing case, or 0 when all passed / empty. */
const firstFailingIndex = (cases: Array<TestCaseResult>): number => {
    const index = cases.findIndex((testcase) => !testcase.passed)
    return index >= 0 ? index : 0
}

/**
 * Renders a judged submission's PER-CASE outcome: a wrap of selectable pills
 * (Case N with a ✓/✕ glyph, tinted pass/fail) over the selected case's detail.
 * A sample case expands to an {@link IOExampleCard} (input · expected · got, with
 * the mismatch tinted on a failure); a hidden case shows only a muted note (its
 * IO never leaves the server). Selection defaults to the FIRST FAILING case so a
 * learner lands straight on what broke. Feeds off the decoded `perCaseResults`
 * the API already returns — data the old UI discarded.
 *
 * @param props - {@link TestCaseResultGridProps}
 * @see Story: .storybook/stories/blocks/code/TestCaseResultGrid/TestCaseResultGrid.stories
 */
export const TestCaseResultGrid = ({ cases, labels, className }: TestCaseResultGridProps) => {
    const [selected, setSelected] = useState<number>(() => firstFailingIndex(cases))

    // re-home the selection on the first failing case whenever the result set changes
    // (a new submission arrives) so the pane never points at a stale index.
    useEffect(() => {
        setSelected(firstFailingIndex(cases))
    }, [cases])

    if (cases.length === 0) {
        return null
    }

    const active = cases[Math.min(selected, cases.length - 1)]

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className="flex flex-wrap gap-2">
                {cases.map((testcase, index) => {
                    const isActive = index === Math.min(selected, cases.length - 1)
                    return (
                        <button
                            key={testcase.key}
                            type="button"
                            onClick={() => setSelected(index)}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-medium outline-none transition-colors",
                                "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                                testcase.passed
                                    ? "bg-success-soft text-success-soft-foreground"
                                    : "bg-danger-soft text-danger-soft-foreground",
                                isActive && "ring-2 ring-inset ring-accent",
                            )}
                        >
                            {testcase.passed ? (
                                <CheckIcon className="size-4" aria-hidden focusable="false" />
                            ) : (
                                <XIcon className="size-4" aria-hidden focusable="false" />
                            )}
                            {testcase.label}
                        </button>
                    )
                })}
            </div>

            {active.isSample ? (
                <IOExampleCard
                    rows={[
                        ...(active.input != null
                            ? [{ key: "in", label: labels.input, value: active.input }]
                            : []),
                        ...(active.expectedOutput != null
                            ? [{
                                key: "exp",
                                label: labels.expected,
                                value: active.expectedOutput,
                                tone: active.passed ? undefined : ("success" as const),
                            }]
                            : []),
                        ...(!active.passed && active.got != null
                            ? [{ key: "got", label: labels.got, value: active.got, tone: "danger" as const }]
                            : []),
                    ]}
                />
            ) : (
                <p className="text-xs text-muted">{labels.hidden}</p>
            )}
        </div>
    )
}
