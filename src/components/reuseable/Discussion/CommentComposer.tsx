"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@heroui/react"
import { useTranslations } from "next-intl"

/** Props for {@link CommentComposer}. */
export interface CommentComposerProps {
    /** Called with the trimmed body when the user submits a non-empty comment. */
    onSubmit: (body: string) => void
    /** Placeholder text for the textarea. */
    placeholder?: string
    /** Label for the submit button (defaults to a generic "post" copy). */
    submitLabel?: string
    /** Optional cancel handler (renders a cancel button when provided, e.g. for replies/edits). */
    onCancel?: () => void
    /** Initial textarea value (e.g. when editing an existing comment). */
    initialValue?: string
    /** Disables submit while a mutation is in flight. */
    busy?: boolean
}

/**
 * A textarea + submit control used for new comments, replies, and edits.
 *
 * Presentational: owns only the draft text; submitting/cancelling is delegated to callbacks.
 * @param props - {@link CommentComposerProps}
 */
export const CommentComposer = ({
    onSubmit,
    placeholder,
    submitLabel,
    onCancel,
    initialValue,
    busy,
}: CommentComposerProps) => {
    const t = useTranslations()
    // draft body kept local until submit
    const [body, setBody] = useState(initialValue ?? "")
    // sync when the parent passes a new initialValue (e.g. editing a different comment)
    useEffect(() => {
        setBody(initialValue ?? "")
    }, [initialValue])
    const trimmed = body.trim()

    // submit only non-empty drafts, then clear the field
    const handleSubmit = () => {
        if (!trimmed) {
            return
        }
        onSubmit(trimmed)
        setBody("")
    }

    return (
        <div className="flex flex-col gap-1.5">
            <textarea
                rows={3}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder={placeholder ?? t("discussion.placeholder")}
                className="w-full resize-none rounded-2xl border border-default bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
            />
            <div className="flex items-center justify-end gap-1.5">
                {onCancel ? (
                    <Button size="sm" variant="tertiary" onPress={onCancel} isDisabled={busy}>
                        {t("common.cancel")}
                    </Button>
                ) : null}
                <Button
                    size="sm"
                    variant="primary"
                    onPress={handleSubmit}
                    isDisabled={busy || !trimmed}
                >
                    {submitLabel ?? t("discussion.post")}
                </Button>
            </div>
        </div>
    )
}
