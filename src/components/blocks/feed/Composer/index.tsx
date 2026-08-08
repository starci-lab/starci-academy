"use client"

import React from "react"
import { PaperPlaneRightIcon } from "@phosphor-icons/react"
import { Avatar } from "@/components/atoms/display/Avatar"
import { Button } from "@/components/atoms/buttons/Button"
import { InputTextarea } from "@/components/atoms/forms"
import { FillAvailable } from "@/components/frames/FillAvailable"
import { StackH } from "@/components/frames/Stack"

/**
 * Props for the {@link Composer} block.
 *
 * A single message-input row: an optional leading avatar, an auto-growing text
 * field, and a trailing action cluster (an optional attach slot + a primary Send
 * button). CONTROLLED — the draft text lives in the parent; the block only mirrors
 * it and fires callbacks. Tier-3 presentational: no store, no fetch.
 */
export interface ComposerProps {
    /** The current draft text (controlled by the parent). */
    value: string
    /** Fired on every keystroke with the next draft text. */
    onChange: (value: string) => void
    /**
     * Fired when the viewer submits — via the Send button or Ctrl/Cmd+Enter. Only
     * fires when the trimmed value is non-empty and not already submitting.
     */
    onSubmit: () => void
    /** Placeholder shown while the field is empty. */
    placeholder?: string
    /**
     * Optional leading avatar image url. When set, a small {@link Avatar} sits
     * at the start of the row; omit to render the field flush to the edge.
     */
    avatarSrc?: string
    /**
     * While a submit is in flight: the Send button shows a spinner and is disabled,
     * and Ctrl/Cmd+Enter is ignored (blocks double-submit).
     */
    isSubmitting?: boolean
    /** Label for the primary Send button. Defaults to "Send". */
    submitLabel?: string
    /**
     * Optional slot placed BEFORE the Send button — e.g. an attach icon-button. The
     * owning feature supplies it so the block stays presentational.
     */
    attachSlot?: React.ReactNode
    /**
     * Nest the row one indent level (reply composers under a thread rail).
     * Replaces the former public `className="pl-9"` door.
     */
    nested?: boolean
}

/**
 * Composer is a controlled message-input row: an optional leading avatar, an
 * {@link InputTextarea} (`variant="secondary"` — the composer always sits on a
 * surface), and a trailing action cluster made of an optional attach slot plus a
 * primary Send button.
 *
 * @param props - {@link ComposerProps}
 */
export const Composer = ({
    value,
    onChange,
    onSubmit,
    placeholder,
    avatarSrc,
    isSubmitting = false,
    submitLabel = "Send",
    attachSlot,
    nested = false,
}: ComposerProps) => {
    // only submit a non-empty draft that is not already in flight
    const canSubmit = value.trim().length > 0 && !isSubmitting
    const ariaLabel = placeholder ?? submitLabel

    return (
        <StackH
            identity={{ tier: "block", component: "Composer" }}
            principle="content-row"
            explain="Keeps the optional avatar, field, and send cluster on one baseline so trailing actions do not drop under the field."
            nested={nested}
            items={[
                ...(avatarSrc ? [() => (
                    <Avatar src={avatarSrc} name="viewer" seed={avatarSrc} size="sm" />
                )] : []),
                () => (
                    <FillAvailable
                        at="base"
                        body={() => (
                            <InputTextarea
                                value={value}
                                onValueChange={onChange}
                                placeholder={placeholder}
                                ariaLabel={ariaLabel}
                                rows={1}
                                variant="secondary"
                            />
                        )}
                    />
                ),
                () => (
                    <StackH
                        principle="flex-action"
                        explain="Attach slot and send share one action row — not content-row, because both peers are actions rather than content-plus-meta."
                        items={[
                            ...(attachSlot ? [() => <>{attachSlot}</>] : []),
                            () => (
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onPress={onSubmit}
                                    isDisabled={!canSubmit}
                                    isPending={isSubmitting}
                                    prefixIcon={PaperPlaneRightIcon}
                                    label={submitLabel}
                                />
                            ),
                        ]}
                    />
                ),
            ]}
        />
    )
}
