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
 * placeholder pill (à la YouTube/GitHub) and expands to the full field on
 * click, so an empty grey box never dominates the discussion zone. Reply and
 * edit composers omit `collapsible` and render expanded immediately, with no
 * avatar (real `src`'s `CommentItem` never passes `currentUser` for those two
 * calls — the avatar-led row is a TOP-LEVEL-ONLY treatment).
 *
 * ⭐ `variant="primary"` ON PURPOSE (thầy 2026-07-28). Real `Discussion` is
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
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The comment/reply/edit composer. See the file header for the full contract.
 *
 * @param props - {@link ContentCommentComposerProps}
 */
const ContentCommentComposer = ({
    onSubmit,
    placeholder = "Đặt câu hỏi hoặc chia sẻ…",
    submitLabel = "Đăng",
    onCancel,
    initialValue,
    isPending = false,
    currentUser,
    collapsible = false,
    ariaLabel,
    className,
    showAnatomy = false,
    anatPart,
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
            <StackH gap="grouped" align="center" anatPart={anatPart}>
                {currentUser ? (
                    <Avatar src={currentUser.avatarUrl} name={currentUser.username} seed={currentUser.username} size="sm" showAnatomy={showAnatomy} />
                ) : null}
                <div className="min-w-0 flex-1" data-anat-part={showAnatomy ? "InputButtonLike" : undefined}>
                    <InputButtonLike
                        placeholder={placeholder}
                        ariaLabel={ariaLabel}
                        onPress={() => setExpanded(true)}
                    />
                </div>
            </StackH>
        )
    }

    return (
        <StackH gap="grouped" align="start" className={className} anatPart={anatPart ?? (showAnatomy ? "StackH" : undefined)}>
            {currentUser ? (
                <Avatar src={currentUser.avatarUrl} name={currentUser.username} seed={currentUser.username} size="sm" showAnatomy={showAnatomy} />
            ) : null}
            <StackV gap="related" className="min-w-0 flex-1" anatPart={showAnatomy ? "StackV" : undefined}>
                <InputTextarea
                    value={body}
                    onValueChange={setBody}
                    placeholder={placeholder}
                    ariaLabel={ariaLabel}
                    rows={3}
                    variant="primary"
                    showAnatomy={showAnatomy}
                />
                <StackH gap="related" anatPart={showAnatomy ? "StackH" : undefined}>
                    <Button
                        label={submitLabel}
                        size="sm"
                        onPress={handleSubmit}
                        isDisabled={!trimmed}
                        isPending={isPending}
                        anatPart={showAnatomy ? "Button" : undefined}
                    />
                    {onCancel || collapsible ? (
                        <Button
                            label="Hủy"
                            variant="tertiary"
                            size="sm"
                            onPress={handleCancel}
                            isDisabled={isPending}
                            anatPart={showAnatomy ? "Button" : undefined}
                        />
                    ) : null}
                </StackH>
            </StackV>
        </StackH>
    )
}

export { ContentCommentComposer }
