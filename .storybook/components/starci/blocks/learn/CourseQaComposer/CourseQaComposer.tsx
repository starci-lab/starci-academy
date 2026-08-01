import React, { useState } from "react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputTextarea } from "@sb-components/atoms/forms/Input/Input"
import { InputButtonLike } from "@sb-components/composites/buttons/InputButtonLike/InputButtonLike"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `CourseQaComposer`: the ONE writing-shape reused three ways inside a
 * course Q&A board — the root "ask the whole course" composer (a collapsible
 * avatar pill that opens into a textarea), an answer's inline EDIT form, and an
 * inline REPLY form.
 *
 * ⭐ GENUINELY NEW, NOT A RE-DUPLICATE. The real app's `CommentComposer`
 * (`src/components/features/community/Discussion/CommentComposer.tsx`) has no
 * Storybook port anywhere, including `_legacy`. The one component that LOOKS
 * related, `_legacy/blocks/feed/Composer`, is a DIFFERENT real-app shape —
 * always-open, no avatar pill, used only for the bottom "write an answer" box
 * in the real `QuestionRow`. This block's `mode="plain"` covers exactly that
 * ground (always-expanded, avatar optional), so `_legacy/blocks/feed/Composer`
 * stays as its own thing rather than being folded in — this is a THIRD,
 * younger sibling that happens to make `_legacy`'s shape reachable through one
 * of its own two modes, not a copy of it.
 *
 * WHY A BLOCK ON TOP OF `Avatar`/`InputTextarea`/`Button`: none of the three
 * knows a course Q&A board has exactly two writing shapes (collapsed
 * invitation vs. open form), that a locked composer must still fire `onCancel`
 * cleanly, or that submitting should fold a collapsible composer back down.
 * `InputButtonLike` (existing composite) is reused for the collapsed pill
 * instead of hand-rolling a field-look `<button>` — the exact "rebuilt a worse
 * version of an existing composite" trap this run's brief warns about.
 *
 * ⭐ TEXT IS STRICTLY CONTROLLED (`value`/`onValueChange`), matching every
 * `Input.*` atom's own §4 contract — the block owns NO copy of the draft.
 * `initialValue` is NOT a second source of truth for the text; it is read
 * EXACTLY ONCE, only to decide how a `mode="collapsible"` composer BOOTS: an
 * edit/reply reopened with existing content must not start visually shut
 * (`useState(() => mode === "plain" || Boolean(initialValue))`). A plain
 * composer never collapses at all, so the flag is irrelevant there.
 *
 * ⭐ THE PILL FOLDS ITSELF BACK; THE DRAFT DOES NOT CLEAR ITSELF. Collapsing
 * to the pill after Submit/Cancel is presentational chrome this block owns
 * (the same way a popover closes itself after a pick) — it does not touch
 * `value`. Clearing the actual draft text is the CALLER's job (it owns
 * `value`), so rule 7 stays intact: the block never decides what submitting
 * or cancelling MEANS, only how its own shell reacts.
 *
 * ⭐ CANCEL SHOWS WHEN `mode === "collapsible"` (always — a way back to the
 * pill must exist) OR when the caller passes `onCancel` (the edit/reply
 * shapes of `mode === "plain"`) — 1:1 with the real `CommentComposer`'s
 * `{onCancel || collapsible ? …}` check.
 *
 * 📐 TWO LEAVES BY STRUCTURE (§14d.2): `CollapsedPrompt` (avatar + pill,
 * nothing else composed) and `ExpandedForm` (avatar + textarea + action row).
 * `isSkeleton` only swaps each composed atom's own shimmer within whichever
 * leaf is showing — it never changes what is composed, so it stays a STATE.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
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

                    body={
                        <>
                            {avatar}
                            <div className="min-w-0 flex-1">
                                <InputButtonLike
                                    placeholder={placeholder ?? "Ask a question about this course…"}
                                    onPress={() => setExpanded(true)}
                                    isSkeleton={isSkeleton}
                                />
                            </div>
                        </>
                    }
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
            <StackH gap={3} justify="end" body={actionRow} />
        </>
    )

    return (
        <div>
            <StackH
                gap={3}

                body={
                    <>
                        {avatar}
                        <StackV gap={3} classNames={["min-w-0", "flex-1"]} body={form} />
                    </>
                }
            />
        </div>
    )
}

export { CourseQaComposer }
