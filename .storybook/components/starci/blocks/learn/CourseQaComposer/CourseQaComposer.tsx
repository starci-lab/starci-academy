import React, { useState } from "react"
import { type SkeletonProps } from "@sb-components/composites/_slot"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputTextarea } from "@sb-components/atoms/forms/Input/Input"
import { InputButtonLike } from "@sb-components/composites/buttons/InputButtonLike/InputButtonLike"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * BLOCK — `CourseQaComposer`: the ONE writing shape reused three ways on a
 * course Q&A board — the root "ask the whole course" collapsible pill, an
 * answer's inline edit form, and an inline reply form. See the component file
 * header for the full mode/`initialValue`/fold-back contract and why this is
 * genuinely new rather than a duplicate of `_legacy/blocks/feed/Composer`.
 */

/** Which of the block's two writing shapes to render. */
export type CourseQaComposerMode = "collapsible" | "plain"

/** The signed-in viewer writing this — plain data, the block builds the avatar from it. */
export interface CourseQaComposerUser {
    /** Display name; also seeds the avatar's initials fallback. */
    name: string
    /** Avatar image URL. Omitted → the avatar falls back per its own chain. */
    avatarSrc?: string
}

/** Props for {@link CourseQaComposer}. */
export interface CourseQaComposerProps {
    /**
     * `"collapsible"` — boots as a slim avatar + placeholder pill, opens into the
     * full form on press (the root "ask the whole course" composer). `"plain"` —
     * always the full form (an answer's inline edit, an inline reply, or a
     * bottom "write an answer" box).
     */
    mode: CourseQaComposerMode
    /** The signed-in viewer. Omitted → no leading avatar is drawn (either shape). */
    currentUser?: CourseQaComposerUser
    /**
     * Existing content this composer opened WITH (an edit/reply reopened, not a
     * fresh draft). Read once, only to decide a `"collapsible"` composer's BOOT
     * state — see the file header. Never re-consulted after mount; the live
     * draft is entirely `value`/`onValueChange`.
     */
    initialValue?: string
    /** The current draft text — fully controlled by the caller. */
    value: string
    /** Fired with the next draft text on every keystroke. */
    onValueChange: (value: string) => void
    /** Placeholder for both the collapsed pill and the open textarea. */
    placeholder?: string
    /** Label for the submit button. Defaults to `"Send"`. */
    submitLabel?: string
    /**
     * Fired when the viewer submits. The caller already holds the draft via
     * `value`, so this fires with no argument. A `"collapsible"` composer folds
     * itself back to the pill right after — the caller is still responsible for
     * clearing `value`.
     */
    onSubmit: () => void
    /**
     * Fired when the viewer backs out. Shown whenever `mode === "collapsible"`
     * (folding back to the pill always needs a way out) or whenever the caller
     * supplies this (the edit/reply shapes of `mode === "plain"`).
     */
    onCancel?: () => void
    /** `true` → submit is in flight: the Submit button owns the busy affordance and both buttons lock. */
    isPending?: boolean
    /**
     * `true` → every composed atom mirrors itself. The flag FLOWS DOWN into the
     * real atoms (§12c) rather than a parallel skeleton tree, within whichever
     * leaf (`CollapsedPrompt`/`ExpandedForm`) is currently showing.
     */
    isSkeleton?: boolean
}

/**
 * The Q&A board's one writing shape. See the file header for the mode
 * contract, the controlled-text/`initialValue` split, and the fold-back
 * judgement call.
 *
 * @param props - {@link CourseQaComposerProps}
 */
const CourseQaComposer = ({
    mode,
    currentUser,
    initialValue,
    value,
    onValueChange,
    placeholder,
    submitLabel = "Send",
    onSubmit,
    onCancel,
    isPending = false,
    isSkeleton = false,
}: CourseQaComposerProps) => {
    // Transient UI-only chrome (§ not domain data) — owned here, never lifted to
    // the caller. A "plain" composer has no collapsed shape at all, so it always
    // boots open; a "collapsible" one boots open only when reopened WITH content.
    const [expanded, setExpanded] = useState(() => mode === "plain" || Boolean(initialValue))

    const canSubmit = value.trim().length > 0 && !isPending
    const showCancel = mode === "collapsible" || onCancel != null

    const handleSubmit = () => {
        onSubmit()
        // Folding back is presentational chrome the block owns; the caller still
        // clears `value` itself (it owns the draft) — see file header.
        if (mode === "collapsible") {
            setExpanded(false)
        }
    }

    const handleCancel = () => {
        if (mode === "collapsible") {
            setExpanded(false)
        }
        onCancel?.()
    }

    const avatar = currentUser || isSkeleton ? (
        <Avatar
            name={currentUser?.name}
            src={currentUser?.avatarSrc}
            size="sm"
            isSkeleton={isSkeleton}
            classNames={["shrink-0"]}

        />
    ) : null

    // ── LEAF — CollapsedPrompt: avatar + pill, nothing else composed ──────────
    if (mode === "collapsible" && !expanded) {
        return (
            <div>
                <StackH
                    gap={3}
                    isSkeleton={isSkeleton}
                    items={[
                        () => avatar,
                        () => (
                            <div className="min-w-0 flex-1">
                                <InputButtonLike
                                    placeholder={placeholder ?? "Ask a question about this course…"}
                                    onPress={() => setExpanded(true)}
                                    isSkeleton={isSkeleton}
                                />
                            </div>
                        ),
                    ]}
                />
            </div>
        )
    }

    // ── LEAF — ExpandedForm: avatar + textarea + action row ───────────────────
    const actionRow = (
        <>
            {showCancel ? (
                <Button
                    label="Cancel"
                    variant="tertiary"
                    size="sm"
                    onPress={handleCancel}
                    isDisabled={isPending}
                    isSkeleton={isSkeleton}

                />
            ) : null}
            <Button
                label={submitLabel}
                variant="primary"
                size="sm"
                onPress={handleSubmit}
                isDisabled={!canSubmit}
                isPending={isPending}
                isSkeleton={isSkeleton}

            />
        </>
    )

    const form = (
        <>
            <InputTextarea
                value={value}
                onValueChange={onValueChange}
                placeholder={placeholder}
                ariaLabel={placeholder ?? "Content"}
                rows={3}
                isDisabled={isPending}
                isSkeleton={isSkeleton}

            />
            <StackH gap={3} pattern="flex-action" justify="end" isSkeleton={isSkeleton} items={[() => actionRow]} />
        </>
    )

    return (
        <div>
            <StackH
                gap={3}
                isSkeleton={isSkeleton}
                items={[
                    () => avatar,
                    ({ isSkeleton }: SkeletonProps) => <StackV gap={3} isSkeleton={isSkeleton} classNames={["min-w-0", "flex-1"]} items={[() => form]} />,
                ]}
            />
        </div>
    )
}

export { CourseQaComposer }
