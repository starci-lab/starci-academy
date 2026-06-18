"use client"

import React from "react"
import { Button, Typography, cn } from "@heroui/react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One selectable recall grade in a {@link RatingBar}. */
export interface RatingOption {
    /** SM-2 grade value reported to {@link RatingBarProps.onRate} (0=Again … 3=Easy). */
    grade: number
    /** Localized button label (resolved by the caller — blocks carry no i18n). */
    label: ReactNode
    /** Optional secondary line under the label (e.g. the next-interval preview). */
    hint?: ReactNode
}

/** Props for the {@link RatingBar} block. */
export interface RatingBarProps extends WithClassNames<undefined> {
    /** Ordered grades to offer, weakest recall first (Again → Easy). */
    options: Array<RatingOption>
    /** Called with the chosen grade. */
    onRate: (grade: number) => void
    /** Disables every button while a review is in flight. */
    isPending?: boolean
}

/**
 * HeroUI Button `variant` per recall grade — the block owns this presentation
 * mapping so the gradient reads weakest → strongest without color classNames.
 */
const GRADE_VARIANT: Record<number, "danger" | "outline" | "secondary" | "primary"> = {
    0: "danger",
    1: "outline",
    2: "secondary",
    3: "primary",
}

/**
 * The SM-2 recall-rating bar: a row of grade buttons (Again / Hard / Good / Easy)
 * the learner taps after revealing a flashcard's answer. Each press reports its
 * grade so the caller can reschedule the card. Owns the button layout + the
 * grade→variant gradient; labels arrive localized from the caller.
 *
 * @param props - {@link RatingBarProps}
 */
export const RatingBar = ({ options, onRate, isPending = false, className }: RatingBarProps) => {
    return (
        <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}>
            {options.map((option) => (
                <Button
                    key={option.grade}
                    size="sm"
                    variant={GRADE_VARIANT[option.grade] ?? "secondary"}
                    isDisabled={isPending}
                    onPress={() => onRate(option.grade)}
                >
                    {option.hint !== undefined ? (
                        <span className="flex flex-col items-center">
                            <span>{option.label}</span>
                            <Typography type="body-xs">{option.hint}</Typography>
                        </span>
                    ) : (
                        option.label
                    )}
                </Button>
            ))}
        </div>
    )
}
