import React from "react"
import { LockIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `QuizEnrollGate`: drilling is for enrolled learners. Shown in place of
 * the whole quiz pane to someone still on a trial.
 *
 * WHY IT REPLACES THE PANE INSTEAD OF DISABLING IT: there is nothing to preview
 * here. A lesson can fade its tail because the part above the fade is real value
 * already delivered; a drill has no such part — a disabled setup form would show
 * a shape with nothing in it.
 *
 * ⭐ NOT A PAYWALL, AND THE DIFFERENCE IS REAL. `ContentPaywall` asks for money
 * against a price; this asks for ENROLMENT, which a trial learner may already be
 * entitled to. So there is no price, no scarcity line, and one plain action —
 * pricing vocabulary here would answer a question the learner did not ask.
 *
 * ONE ACTION. Someone who came to practise and found a gate needs a way through,
 * not a menu.
 * ─────────────────────────────────────────────────────────────────────────────
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
