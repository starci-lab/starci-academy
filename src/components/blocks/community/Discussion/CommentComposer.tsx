"use client"

import React, { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Avatar } from "@/components/atoms/display/Avatar"
import { Button } from "@/components/atoms/buttons/Button"
import { InputTextarea } from "@/components/atoms/forms"
import { InputButtonLike } from "@/components/composites/buttons/InputButtonLike"
import { FillAvailable } from "@/components/frames/FillAvailable"
import { StackH, StackV } from "@/components/frames/Stack"

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
    /**
     * When set, the composer is avatar-led: a leading {@link Avatar} sits beside the
     * field, and (with `collapsible`) the collapsed pill shows it too.
     */
    currentUser?: { username: string, avatar?: string } | null
    /**
     * Start collapsed as a slim "write a comment" pill (avatar + placeholder) and expand
     * to the full textarea on click — the top-level composer pattern. Reply/edit composers
     * omit this and render expanded.
     */
    collapsible?: boolean
}

/**
 * A textarea + submit control used for new comments, replies, and edits.
 *
 * Mirrors Storybook/src `ContentCommentComposer`: Stack + InputTextarea + house Button,
 * with an optional avatar-led collapsible pill via {@link InputButtonLike}.
 *
 * @param props - {@link CommentComposerProps}
 */
export const CommentComposer = ({
    onSubmit: onSubmitAction,
    placeholder,
    submitLabel,
    onCancel: onCancelAction,
    initialValue,
    busy,
    currentUser,
    collapsible,
}: CommentComposerProps) => {
    const t = useTranslations()
    // draft body kept local until submit
    const [body, setBody] = useState(initialValue ?? "")
    // collapsible composers start closed; everything else is always open
    const [expanded, setExpanded] = useState(!collapsible)
    // sync when the parent passes a new initialValue (e.g. editing a different comment)
    useEffect(() => {
        setBody(initialValue ?? "")
    }, [initialValue])
    const trimmed = body.trim()
    const resolvedPlaceholder = placeholder ?? t("discussion.placeholder")
    const resolvedSubmit = submitLabel ?? t("discussion.post")
    const ariaLabel = resolvedPlaceholder

    // submit only non-empty drafts, then clear (and re-collapse a collapsible composer)
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
                identity={{ tier: "block", component: "CommentComposer" }}
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                items={[
                    ...(currentUser ? [() => (
                        <Avatar
                            src={currentUser.avatar}
                            name={currentUser.username}
                            seed={currentUser.username}
                            size="sm"
                        />
                    )] : []),
                    () => (
                        <FillAvailable
                            at="base"
                            body={() => (
                                <InputButtonLike
                                    placeholder={resolvedPlaceholder}
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
            identity={{ tier: "block", component: "CommentComposer" }}
            principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            items={[
                ...(currentUser ? [() => (
                    <Avatar
                        src={currentUser.avatar}
                        name={currentUser.username}
                        seed={currentUser.username}
                        size="sm"
                    />
                )] : []),
                () => (
                    <FillAvailable
                        at="base"
                        body={() => (
                            <StackV
                                principle="sibling-stack"
                                explain="Same-kind peer stack of field then actions — not group-boundary, because these are repeating vertical siblings rather than section groups."
                                items={[
                                    () => (
                                        <InputTextarea
                                            value={body}
                                            onValueChange={setBody}
                                            placeholder={resolvedPlaceholder}
                                            ariaLabel={ariaLabel}
                                            rows={3}
                                            variant="primary"
                                        />
                                    ),
                                    () => (
                                        <StackH
                                            principle="flex-action"
                                            explain="Submit and cancel share one action row — not content-row, because both peers are actions rather than content-plus-meta."
                                            items={[
                                                () => (
                                                    <Button
                                                        label={resolvedSubmit}
                                                        size="sm"
                                                        onPress={onSubmit}
                                                        isDisabled={!trimmed}
                                                        isPending={Boolean(busy)}
                                                    />
                                                ),
                                                ...(onCancelAction || collapsible ? [() => (
                                                    <Button
                                                        label={t("common.cancel")}
                                                        variant="tertiary"
                                                        size="sm"
                                                        onPress={onCancel}
                                                        isDisabled={Boolean(busy)}
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
