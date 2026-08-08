import React, { useState } from "react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputTextarea } from "@sb-components/atoms/forms"
import { InputButtonLike } from "@sb-components/composites/buttons/InputButtonLike/InputButtonLike"
import { FillAvailable } from "@sb-components/frames/FillAvailable/FillAvailable"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * BLOCK — `ContentCommentComposer`: the textarea + submit control for new
 * comments, replies, and edits — ONE component, three call shapes, ported
 * verbatim from real `src`'s `CommentComposer`. See the component's own file
 * header for why `variant="primary"` (real `Discussion` is frameless — no
 * card ever wraps this field) and why the avatar-led row is top-level only.
 *
 *  LEAVES by STRUCTURE (§14d.2). Collapsed-pill vs expanded-field is a real
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
}

/**
 * The comment/reply/edit composer. See the file header for the full contract.
 *
 * @param props - {@link ContentCommentComposerProps}
 */
const ContentCommentComposer = ({
    onSubmit: onSubmitAction,
    placeholder = "Ask a question or share your thoughts…",
    submitLabel = "Post",
    onCancel: onCancelAction,
    initialValue,
    isPending = false,
    currentUser,
    collapsible = false,
    ariaLabel,
}: ContentCommentComposerProps) => {
    const [body, setBody] = useState(initialValue ?? "")
    // collapsible composers start closed; reply/edit always render expanded
    const [expanded, setExpanded] = useState(!collapsible)
    const trimmed = body.trim()

    const onSubmit = () => {
        if (!trimmed) {
            return
        }
        onSubmitAction(trimmed)
        setBody("")
        if (collapsible) {
            setExpanded(false)
        }
    }

    const onCancel = () => {
        setBody("")
        if (collapsible) {
            setExpanded(false)
        }
        onCancelAction?.()
    }

    // collapsed pill: avatar + placeholder, the whole row opens the composer
    if (collapsible && !expanded) {
        return (
            <StackH
                identity={{ tier: "block", component: "ContentCommentComposer" }}
                gap={4}
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                align="center"
                items={[
                    ...(currentUser ? [() => (
                        <Avatar src={currentUser.avatarUrl} name={currentUser.username} seed={currentUser.username} size="sm" />
                    )] : []),
                    () => (
                        <FillAvailable
                            at="base"
                            body={() => (
                                <InputButtonLike
                                    placeholder={placeholder}
                                    ariaLabel={ariaLabel}
                                    onPress={() => setExpanded(true)}
                                />
                            )}
                        />
                    ),
                ]}
            />
        )
    }

    return (
        <StackH
            identity={{ tier: "block", component: "ContentCommentComposer" }}
            gap={4}
            principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            align="start"
            items={[
                ...(currentUser ? [() => (
                    <Avatar src={currentUser.avatarUrl} name={currentUser.username} seed={currentUser.username} size="sm" />
                )] : []),
                () => (
                    <FillAvailable
                        at="base"
                        body={() => (
                            <StackV
                                gap={3}
                                principle="sibling-stack"
                                explain="Same-kind peer stack of field then actions — not group-boundary, because these are repeating vertical siblings rather than section groups."
                                items={[
                                    () => (
                                        <InputTextarea
                                            value={body}
                                            onValueChange={setBody}
                                            placeholder={placeholder}
                                            ariaLabel={ariaLabel}
                                            rows={3}
                                            variant="primary"

                                        />
                                    ),
                                    () => (
                                        <StackH
                                            gap={3}
                                            principle="flex-action"
                                            explain="Submit and cancel share one action row — not content-row, because both peers are actions rather than content-plus-meta."
                                            items={[
                                                () => (
                                                    <Button
                                                        label={submitLabel}
                                                        size="sm"
                                                        onPress={onSubmit}
                                                        isDisabled={!trimmed}
                                                        isPending={isPending}

                                                    />
                                                ),
                                                ...(onCancelAction || collapsible ? [() => (
                                                    <Button
                                                        label="Cancel"
                                                        variant="tertiary"
                                                        size="sm"
                                                        onPress={onCancel}
                                                        isDisabled={isPending}

                                                    />
                                                )] : []),
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        )}
                    />
                ),
            ]}
        />
    )
}

export { ContentCommentComposer }
