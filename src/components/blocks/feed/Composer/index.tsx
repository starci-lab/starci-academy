"use client"

import React, { useEffect, useRef } from "react"
import { Button, Spinner, TextArea, TextField, cn } from "@heroui/react"
import { PaperPlaneRightIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { UserAvatar } from "@/components/reuseable/UserAvatar"

/**
 * Props for the {@link Composer} block.
 *
 * A single message-input row: an optional leading avatar, an auto-growing text
 * field, and a trailing action cluster (an optional attach slot + a primary Send
 * button). CONTROLLED — the draft text lives in the parent; the block only mirrors
 * it, grows the field to fit, and fires callbacks. Tier-3 presentational: no store,
 * no fetch, no side-effects beyond a height-sync effect on the textarea ref.
 */
export interface ComposerProps extends WithClassNames<undefined> {
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
     * Optional leading avatar image url. When set, a small {@link UserAvatar} sits
     * at the start of the row; omit to render the field flush to the edge.
     */
    avatarSrc?: string
    /**
     * While a submit is in flight: the Send button shows a spinner and is disabled,
     * and Ctrl/Cmd+Enter is ignored (blocks double-submit).
     */
    isSubmitting?: boolean
    /** Label for the primary Send button. Defaults to "Gửi". */
    submitLabel?: string
    /**
     * Optional slot placed BEFORE the Send button — e.g. an attach icon-button. The
     * owning feature supplies it so the block stays presentational.
     */
    attachSlot?: React.ReactNode
}

/**
 * Composer is a controlled message-input row: an optional leading avatar, an
 * auto-growing {@link TextArea} (HeroUI compound field, `variant="secondary"` —
 * composer luôn nằm trên surface), and a trailing action
 * cluster made of an optional attach slot plus a primary Send button. The Send
 * button is disabled whenever the trimmed draft is empty OR a submit is in flight;
 * Ctrl/Cmd+Enter submits under the same guard. The field grows with its content
 * (a height-sync effect on the textarea ref) instead of scrolling internally.
 *
 * Tier-3 presentational block: props-only, no store, no SWR. The parent owns the
 * draft text and decides what submit does.
 *
 * @param props - {@link ComposerProps}
 *
 * @example
 * <Composer
 *   value={draft}
 *   onChange={setDraft}
 *   onSubmit={send}
 *   avatarSrc={me.avatar}
 *   placeholder="Nhắn gì đó..."
 * />
 * @see Story: .storybook/stories/blocks/feed/Composer/Composer.stories
 */
export const Composer = ({
    value,
    onChange,
    onSubmit,
    placeholder,
    avatarSrc,
    isSubmitting = false,
    submitLabel = "Gửi",
    attachSlot,
    className,
}: ComposerProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    // only submit a non-empty draft that is not already in flight
    const canSubmit = value.trim().length > 0 && !isSubmitting

    // auto-grow: reset then match the field's height to its content on every change
    useEffect(() => {
        const element = textareaRef.current
        if (!element) {
            return
        }
        element.style.height = "auto"
        element.style.height = `${element.scrollHeight}px`
    }, [value])

    // Ctrl/Cmd+Enter submits (plain Enter keeps inserting newlines)
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault()
            if (canSubmit) {
                onSubmit()
            }
        }
    }

    return (
        <div className={cn("flex items-end gap-3", className)}>
            {/* optional leading avatar — omitted when no src is supplied */}
            {avatarSrc ? (
                <UserAvatar size="sm" avatar={avatarSrc} className="mb-1 shrink-0" />
            ) : null}

            {/* auto-growing field */}
            <TextField variant="secondary" className="min-w-0 flex-1">
                <TextArea
                    ref={textareaRef}
                    rows={1}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="max-h-40 resize-none"
                />
            </TextField>

            {/* trailing action cluster: optional attach slot, then the primary Send */}
            <div className="flex shrink-0 items-center gap-1">
                {attachSlot}
                <Button
                    size="sm"
                    variant="primary"
                    onPress={onSubmit}
                    isDisabled={!canSubmit}
                >
                    {isSubmitting ? (
                        <Spinner size="sm" color="current" />
                    ) : (
                        <PaperPlaneRightIcon aria-hidden focusable="false" className="size-4" />
                    )}
                    {submitLabel}
                </Button>
            </div>
        </div>
    )
}
