import React from "react"
import { SpeakerHighIcon, SpeakerSlashIcon } from "@phosphor-icons/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `InterviewerPresence`: "someone is interviewing you" — the persona
 * reading the current question, a TTS mute toggle, and the question itself.
 *
 * WHY THIS IS ITS OWN BLOCK AND NOT A ROW OF ATOMS. Three domain facts have to
 * agree on one surface: who is talking, whether they are talking RIGHT NOW
 * (audio), and what they just said (text). No composite in the catalog knows
 * any of that — this block owns the vocabulary (`speaking` drives a pulse ring
 * + status line, `isAsking` drives the streaming cursor under the question,
 * `questionMarkdown` decides whether there is a question at all).
 *
 * ⭐ WHY NOT COMPOSE `UserCell` (atoms/display/UserCell) FOR THE IDENTITY ROW.
 * `UserCell` was checked first — it is the catalog's avatar+name row — but its
 * second line is `handle` (an `@username`), and an interviewer's second line is
 * `role` (a static job title): same POSITION, different MEANING, and `UserCell`
 * has no prop that means "job title". It also has no room for the pulse ring
 * this block hangs off the avatar or the speaking-status line beside the role.
 * Bending `handle` into carrying a role would be exactly the "reach past a
 * composite and rebuild a worse version" mistake this run exists to avoid — so
 * the identity row is composed straight from `Avatar` + `Typography` instead,
 * the same primitives `UserCell` itself composes, at the layer this block
 * actually needs (§14d.2: the shape here is not `UserCell`'s shape).
 *
 * ⭐ `speaking` AND `isAsking` ARE TWO DIFFERENT SIGNALS, on purpose:
 *   • `speaking` — TTS AUDIO is voicing the question RIGHT NOW. Drives the
 *     pulse ring around the avatar and the `speakingLabel` status line. A
 *     learner with TTS off never sees this true.
 *   • `isAsking` — this question's TEXT is still streaming in, independent of
 *     audio. Drives the typing-dots cue under the question body. A learner
 *     with TTS off still sees this while the words arrive.
 *   Collapsing them into one flag would force audio-off sessions to either
 *     fake a "speaking" pulse with no sound behind it, or lose the streaming
 *     cue entirely — two real UI states, so two real props.
 *
 * 📐 ONE LEAF (§14d.2), not two. Whether the question region exists at all
 * (idle, between questions) versus is present (asking / delivered) is a
 * PRESENCE/ABSENCE STATE inside this one leaf — it never changes what kind of
 * thing the block is, only whether one of its regions currently has content,
 * exactly the reasoning `QuizQuestion` already uses for its own graded region.
 *
 * ⛔ NO `isSkeleton`. Deliberate, not an oversight (mirrors `ContentModeNav`'s
 * reasoning for the same omission). `questionMarkdown` presence/absence and
 * `isAsking` already model "this hasn't arrived yet" as real domain states;
 * `MarkdownContent` itself has no skeleton contract to delegate to (it never
 * sees its children as nodes, only whatever the parser hands back — see its
 * own file header), so a bolt-on skeleton here would leave the question region
 * out of step with the rest of the block instead of mirroring it.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Who is interviewing — identity only, no session state. */
export interface InterviewerPresencePersona {
    /** Display name, e.g. "Chị Mai". */
    name: string
    /** Static role/title shown under the name, e.g. "Backend Engineer". */
    role: string
    /** Uploaded avatar URL. Missing, or failing to load, falls back through `Avatar`'s own chain. */
    avatarSrc?: string
}

/** Props for {@link InterviewerPresence}. */
export interface InterviewerPresenceProps {
    /** Who is interviewing. */
    persona: InterviewerPresencePersona
    /**
     * `true` while TTS audio is actively voicing the current question. Drives
     * ONLY the pulse ring + status line — see the file header for why this is
     * independent from `isAsking`.
     */
    speaking: boolean
    /** Status text shown beside the pulse while `speaking` is true, e.g. "Đang đọc câu hỏi". Localized by the caller. */
    speakingLabel: string
    /**
     * `true` → this session offers a TTS toggle at all. Omitted/`false` → the
     * toggle is not drawn: a control that cannot do anything is not a control
     * (same reasoning as `ContentModeNav`'s language switcher below two languages).
     */
    ttsSupported?: boolean
    /** Current TTS on/off state. Only read while `ttsSupported` is true. */
    ttsEnabled?: boolean
    /** Fired when the learner presses the toggle. Only read while `ttsSupported` is true. */
    onToggleTts?: () => void
    /** Toggle's accessible label for the moment TTS is ON (pressing it mutes). */
    muteLabel: string
    /** Toggle's accessible label for the moment TTS is OFF (pressing it unmutes). */
    unmuteLabel: string
    /**
     * The current question, as authored/streamed markdown. Absent or blank →
     * no question region at all — the interviewer is between questions.
     */
    questionMarkdown?: string
    /**
     * `true` while this question's TEXT is still arriving. Adds a typing cue
     * under the question; has no effect once `questionMarkdown` is blank —
     * there is nothing yet to attach the cue to.
     */
    isAsking?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The interviewer's presence header: identity, live-speaking cue, TTS toggle,
 * and the question underneath. See the file header for the full contract.
 *
 * @param props - {@link InterviewerPresenceProps}
 */
const InterviewerPresence = ({
    persona,
    speaking,
    speakingLabel,
    ttsSupported = false,
    ttsEnabled,
    onToggleTts,
    muteLabel,
    unmuteLabel,
    questionMarkdown,
    isAsking = false,
    showAnatomy = false,
    anatPart,
}: InterviewerPresenceProps) => {
    const hasQuestion = Boolean(questionMarkdown && questionMarkdown.trim().length > 0)
    // A control that cannot do anything is not drawn — mirrors ContentModeNav's
    // language switcher, which only appears once it has two real options.
    const canToggleTts = ttsSupported && ttsEnabled != null && onToggleTts != null
    const TtsIcon = ttsEnabled ? SpeakerHighIcon : SpeakerSlashIcon
    // The icon shows the CURRENT state; the label names the ACTION the press performs.
    const ttsAriaLabel = ttsEnabled ? muteLabel : unmuteLabel

    // Relative wrapper only to anchor the decorative pulse ring — not a
    // spacing seam, so it stays a plain span rather than a frame.
    const avatarWithPulse = (
        <span className="relative inline-flex shrink-0">
            {speaking ? (
                <span
                    aria-hidden
                    className="absolute -inset-1 animate-ping rounded-full ring-2 ring-accent"
                />
            ) : null}
            <Avatar
                name={persona.name}
                src={persona.avatarSrc}
                seed={persona.name}
                size="lg"
                showAnatomy={showAnatomy}
            />
        </span>
    )

    const speakingStatus = speaking ? (
        <StackH
            gap="tight"
            align="center"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-accent" />
                    <Typography
                        text={speakingLabel}
                        size="sm"
                        color="accent"
                        weight="medium"
                        showAnatomy={showAnatomy}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                </>
            }
        />
    ) : null

    const nameAndRole = (
        <StackV
            gap="flush"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <Typography
                        text={persona.name}
                        weight="medium"
                        showAnatomy={showAnatomy}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                    <StackH
                        gap="related"
                        align="center"
                        anatPart={showAnatomy ? "StackH" : undefined}
                        body={
                            <>
                                <Typography
                                    text={persona.role}
                                    size="sm"
                                    color="muted"
                                    showAnatomy={showAnatomy}
                                    anatPart={showAnatomy ? "Typography" : undefined}
                                />
                                {speakingStatus}
                            </>
                        }
                    />
                </>
            }
        />
    )

    const identity = (
        <StackH
            gap="related"
            align="center"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    {avatarWithPulse}
                    {nameAndRole}
                </>
            }
        />
    )

    const toggleButton = canToggleTts ? (
        <Button
            isIconOnly
            variant="ghost"
            prefixIcon={TtsIcon}
            ariaLabel={ttsAriaLabel}
            onPress={onToggleTts}
            showAnatomy={showAnatomy}
            anatPart={showAnatomy ? "Button" : undefined}
        />
    ) : null

    const headerRow = (
        <StackH
            gap="related"
            align="center"
            justify="between"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    {identity}
                    {toggleButton}
                </>
            }
        />
    )

    const typingDots = isAsking ? (
        <StackH
            gap="tight"
            align="center"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    <span aria-hidden className="size-1.5 animate-bounce rounded-full bg-muted" />
                    <span aria-hidden className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
                    <span aria-hidden className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
                </>
            }
        />
    ) : null

    const questionRegion = hasQuestion ? (
        <StackV
            gap="tight"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <MarkdownContent
                        source={questionMarkdown as string}
                        measure="reading"
                        showAnatomy={showAnatomy}
                        anatPart={showAnatomy ? "MarkdownContent" : undefined}
                    />
                    {typingDots}
                </>
            }
        />
    ) : null

    return (
        <div data-anat-part={anatPart}>
            <StackV
                gap="related"
                anatPart={showAnatomy ? "StackV" : undefined}
                body={
                    <>
                        {headerRow}
                        {questionRegion}
                    </>
                }
            />
        </div>
    )
}

export { InterviewerPresence }
