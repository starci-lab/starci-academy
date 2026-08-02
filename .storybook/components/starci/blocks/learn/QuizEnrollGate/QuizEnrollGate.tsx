import React from "react"
import { LockIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"

/**
 * `QuizEnrollGate` — shown in place of the whole quiz pane to a trial learner:
 * drilling is for enrolled learners. Replaces the pane rather than disabling it
 * (a drill has no previewable part). Not a paywall — it asks for enrolment, not
 * money, so there is no price or scarcity line, just one plain action through.
 */

/** Props for {@link QuizEnrollGate}. */
export interface QuizEnrollGateProps {
    /** Headline, localized by the caller — e.g. "Enroll for quick-fire practice". */
    title: string
    /** One sentence on what enrolling opens up. */
    description?: string
    /** Label of the single action, localized by the caller. */
    ctaLabel: string
    /** Fired when the learner takes the way through. */
    onEnroll: () => void
}

/**
 * The gate in front of the quiz pane. See the file header for the full contract.
 *
 * @param props - {@link QuizEnrollGateProps}
 */
const QuizEnrollGate = ({
    title,
    description,
    ctaLabel,
    onEnroll,
}: QuizEnrollGateProps) => (
    <div>
        <EmptyState
            icon={LockIcon}
            title={title}
            description={description}

        >
            <Button
                label={ctaLabel}
                variant="primary"
                onPress={onEnroll}

            />
        </EmptyState>
    </div>
)

export { QuizEnrollGate }
