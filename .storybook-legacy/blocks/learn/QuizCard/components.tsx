import { useState } from "react"
import { QuizCard } from "@/components/blocks/learn/QuizCard"
import type { QuizCardProps, QuizOption } from "@/components/blocks/learn/QuizCard"

/**
 * Controlled wrapper so the reviewer can actually click options and press submit.
 * Owns the `selectedIds` + `isSubmitted` state and forwards everything else. When
 * `startSubmitted` is set the wrapper opens already graded (for the post-submit
 * stories).
 */
export const ControlledQuizCard = ({
    startSelectedIds = [],
    startSubmitted = false,
    ...props
}: Omit<QuizCardProps, "selectedIds" | "onSelectionChange" | "isSubmitted" | "onSubmit"> & {
    startSelectedIds?: string[]
    startSubmitted?: boolean
}) => {
    const [selectedIds, setSelectedIds] = useState<string[]>(startSelectedIds)
    const [isSubmitted, setIsSubmitted] = useState(startSubmitted)
    return (
        <QuizCard
            {...props}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            isSubmitted={isSubmitted}
            onSubmit={() => setIsSubmitted(true)}
        />
    )
}

export const SINGLE_OPTIONS: QuizOption[] = [
    { id: "opt-cookie", label: "Store the token in a cookie with the HttpOnly flag", isCorrect: true },
    { id: "opt-local", label: "Store the token in localStorage for easy access" },
    { id: "opt-url", label: "Attach the token to the query string of every URL" },
    { id: "opt-global", label: "Assign the token to a global variable on window" },
]

export const MULTIPLE_OPTIONS: QuizOption[] = [
    { id: "idx-where", label: "Columns that often appear in the WHERE clause", isCorrect: true },
    { id: "idx-join", label: "Columns used to join tables in the JOIN clause", isCorrect: true },
    { id: "idx-boolean", label: "Boolean columns with only two values, true or false" },
    { id: "idx-rare", label: "Columns that almost never appear in queries" },
]
