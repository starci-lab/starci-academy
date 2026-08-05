import type { ReactNode } from "react"

/**
 * Extra field-frame props inline controls take: `hint` and `errorMessage` render
 * via FieldFrame around the control (the main label stays inline next to the
 * control, not passed into FieldFrame's `label`). `isRequired` attaches a `*`
 * mark to the inline label. Leave them all off and the control renders bare.
 *
 * Exported so `composites/form/ChoiceRadioGroup` can extend the same shape for
 * its own group-level hint/error/required — it moved out of this file (ATOM-8)
 * but still carries the same frame.
 */
export interface InlineFrameProps {
    /** Secondary description (via FieldFrame). */
    hint?: ReactNode
    /** Error line (via FieldFrame → border + text-danger). */
    errorMessage?: ReactNode
    /** Adds a `*` mark to the inline label. */
    isRequired?: boolean
}
