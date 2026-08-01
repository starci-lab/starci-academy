import React, { useState } from "react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputTextarea } from "@sb-components/atoms/forms/Input/Input"
import { InputButtonLike } from "@sb-components/composites/buttons/InputButtonLike/InputButtonLike"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentCommentComposer`: the textarea + submit control used for new
 * comments, replies, AND edits — one component, three call shapes, ported
 * verbatim from real `src`'s `CommentComposer`.
 *
 * ⭐ `collapsible` — the TOP-LEVEL composer only. Starts as a slim avatar +
 * placeholder pill (in the style of YouTube/GitHub) and expands to the full field on
 * click, so an empty grey box never dominates the discussion zone. Reply and
 * edit composers omit `collapsible` and render expanded immediately, with no
 * avatar (real `src`'s `CommentItem` never passes `currentUser` for those two
 * calls — the avatar-led row is a TOP-LEVEL-ONLY treatment).
 *
 * ⭐ `variant="primary"` ON PURPOSE (instructor 2026-07-28). Real `Discussion` is
 * explicitly FRAMELESS — no card wraps it, it sits directly on the page
 * canvas — so this field never sits "inside a card" the way a modal's fields
 * do (those use `variant="secondary"`, see `ModalShell` stories). A field on
 * the plain page canvas is the "primary" case, exactly what real
 * `CommentComposer` passes to its own `TextField`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Minimal identity for the avatar-led top-level composer. */
export interface ContentCommentComposerViewer {
    username: string
    avatarUrl?: string
}

/** Props for {@link ContentCommentComposer}. */
export interface ContentCommentComposerProps {
    /** Called with the trimmed body when the reader submits a non-empty comment. */
    onSubmit: (body: string) => void
    /** Placeholder text for the field. */
    placeholder?: string
    /** Submit button label. */
    submitLabel?: string
    /** Optional cancel handler — renders a cancel button when provided (reply/edit). */
    onCancel?: () => void
    /** Initial field value (editing an existing comment). */
    initialValue?: string
    /** `true` → submit is disabled and shows its busy affordance. */
    isPending?: boolean
    /**
     * Set → the composer is avatar-led (top-level only; reply/edit omit this).
     * `null` → signed-out top-level composer, no avatar.
     */
    currentUser?: ContentCommentComposerViewer | null
    /**
     * `true` → starts collapsed as a slim avatar + placeholder pill, expands to
     * the full field on click (the top-level composer pattern). Reply/edit
     * composers omit this and render expanded.
     */
    collapsible?: boolean
    /** Accessible name for the field. */
    ariaLabel: string
    /** Extra classes on the root (placement only, e.g. `flex-1` beside a `ThreadConnector`). */
    className?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
}

/**
 * The comment/reply/edit composer. See the file header for the full contract.
 *
 * @param props - {@link ContentCommentComposerProps}
 */
const ContentCommentComposer = ({
    onSubmit,
    placeholder = "Ask a question or share your thoughts…",
    submitLabel = "Post",
    onCancel,
    initialValue,
    isPending = false,
    currentUser,
    collapsible = false,
    ariaLabel,
    className,
}: ContentCommentComposerProps) => {
    const [body, setBody] = useState(initialValue ?? "")
    // collapsible composers start closed; reply/edit always render expanded
    const [expanded, setExpanded] = useState(!collapsible)
    const trimmed = body.trim()

    const handleSubmit = () => {
        if (!trimmed) {
            return
        }
        onSubmit(trimmed)
        setBody("")
        if (collapsible) {
            setExpanded(false)
        }
    }

    const handleCancel = () => {
        setBody("")
        if (collapsible) {
            setExpanded(false)
        }
        onCancel?.()
    }

    // collapsed pill: avatar + placeholder, the whole row opens the composer
    if (collapsible && !expanded) {
        return (
            <StackH
                gap={4}
                align="center"

                body={
                    <>
                        {currentUser ? (
                            <Avatar src={currentUser.avatarUrl} name={currentUser.username} seed={currentUser.username} size="sm" />
                        ) : null}
                        <div className="min-w-0 flex-1">
                            <InputButtonLike
                                placeholder={placeholder}
                                ariaLabel={ariaLabel}
                                onPress={() => setExpanded(true)}
                            />
                        </div>
                    </>
                }
            />
        )
    }

    const buttonRow = (
        <>
            <Button
                label={submitLabel}
                size="sm"
                onPress={handleSubmit}
                isDisabled={!trimmed}
                isPending={isPending}

            />
            {onCancel || collapsible ? (
                <Button
                    label="Cancel"
                    variant="tertiary"
                    size="sm"
                    onPress={handleCancel}
                    isDisabled={isPending}

                />
            ) : null}
        </>
    )

    const fieldColumn = (
        <>
            <InputTextarea
                value={body}
                onValueChange={setBody}
                placeholder={placeholder}
                ariaLabel={ariaLabel}
                rows={3}
                variant="primary"

            />
            <StackH gap={3} body={buttonRow} />
        </>
    )

    const composerRow = (
        <>
            {currentUser ? (
                <Avatar src={currentUser.avatarUrl} name={currentUser.username} seed={currentUser.username} size="sm" />
            ) : null}
            <StackV gap={3} classNames={["min-w-0", "flex-1"]} body={fieldColumn} />
        </>
    )

    return (
        <StackH gap={4} align="start" className={className} body={composerRow} />
    )
}

export { ContentCommentComposer }
