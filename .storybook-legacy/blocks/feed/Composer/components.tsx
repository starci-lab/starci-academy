import { useState } from "react"
import type { ReactNode } from "react"
import { Composer } from "@/components/blocks/feed/Composer"

/** A sample avatar image for the leading slot, fixed so the story doesn't depend on real data. */
export const avatarSrc = "https://i.pravatar.cc/80?img=12"

/**
 * Wrapper that owns the draft's local state, faithfully simulating the controlled flow: the value
 * lives in the parent, and the Composer just reflects it + auto-grows in height + fires callbacks.
 * onSubmit here simply clears the draft.
 */
export const Controlled = ({
    initialValue,
    isSubmitting,
    attachSlot,
}: {
    initialValue: string
    isSubmitting?: boolean
    attachSlot?: ReactNode
}) => {
    const [value, setValue] = useState(initialValue)

    return (
        <Composer
            value={value}
            onChange={setValue}
            onSubmit={() => setValue("")}
            placeholder="Send the teaching assistant a message..."
            avatarSrc={avatarSrc}
            isSubmitting={isSubmitting}
            attachSlot={attachSlot}
        />
    )
}
