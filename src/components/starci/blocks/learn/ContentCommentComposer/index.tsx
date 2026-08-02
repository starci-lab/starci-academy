import React, { useState } from "react"
import { Avatar } from "@/components/atoms/display/Avatar"
import { Button } from "@/components/atoms/buttons/Button"
import { InputTextarea } from "@/components/atoms/forms/Input"
import { InputButtonLike } from "@/components/composites/buttons/InputButtonLike"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * BLOCK — `ContentCommentComposer`: the textarea + submit control for new
 * comments, replies, and edits — ONE component, three call shapes, ported
 * verbatim from real `src`'s `CommentComposer`. See the component's own file
 * header for why `variant="primary"` (real `Discussion` is frameless — no
 * card ever wraps this field) and why the avatar-led row is top-level only.
 *
 * 📐 LEAVES by STRUCTURE (§14d.2). Collapsed-pill vs expanded-field is a real
 * node swap ⇒ separate leaves. Avatar present/absent is also a node swap
 * (top-level vs reply/edit) ⇒ its own leaf.
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
    /** Where this sits inside its parent (placement only, e.g. `flex-1` beside a `ThreadConnector`). */
    classNames?: Array<AllowedClassName>
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
    classNames,
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
                pattern="content-row"
                align="center"

                items={[
                    ...(currentUser ? [() => (
                        <Avatar src={currentUser.avatarUrl} name={currentUser.username} seed={currentUser.username} size="sm" />
                    )] : []),
                    () => (
                        <div className="min-w-0 flex-1">
                            <InputButtonLike
                                placeholder={placeholder}
                                ariaLabel={ariaLabel}
                                onPress={() => setExpanded(true)}
                            />
                        </div>
                    ),
                ]}
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
            <StackH gap={3} items={[() => buttonRow]} />
        </>
    )

    const composerRow = (
        <>
            {currentUser ? (
                <Avatar src={currentUser.avatarUrl} name={currentUser.username} seed={currentUser.username} size="sm" />
            ) : null}
            <StackV gap={3} classNames={["min-w-0", "flex-1"]} items={[() => fieldColumn]} />
        </>
    )

    return (
        <StackH gap={4} pattern="content-row" align="start" classNames={classNames} items={[() => composerRow]} />
    )
}

export { ContentCommentComposer }
