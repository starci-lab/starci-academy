import React from "react"
import { SpeakerHighIcon, SpeakerSlashIcon } from "@phosphor-icons/react"
import { Avatar } from "@/components/atoms/display/Avatar"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { MarkdownContent } from "@/components/composites/viewers/MarkdownContent"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * `InterviewerPresence` — "someone is interviewing you": persona, live-speaking
 * cue, TTS toggle, and the question underneath. Whether the question region
 * exists is presence/absence data on the same shape — an idle and a mid-question
 * interviewer are one block with different data. `speaking` (audio) and `isAsking`
 * (text still streaming) are independent props; the identity row composes `Avatar`
 * + `Typography` directly (role, not a handle, plus a pulse ring).
 */

/** Who is interviewing — identity only, no session state. */
export interface InterviewerPresencePersona {
    /** Display name, e.g. "Ms. Mai". */
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
    /** Status text shown beside the pulse while `speaking` is true, e.g. "Reading the question". Localized by the caller. */
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

            />
        </span>
    )

    const speakingStatus = speaking ? (
        <StackH
            gap={2}
            principle="icon-text"
            align="center"

            items={[
                () => <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-accent" />,
                () => (
                    <Typography
                        text={speakingLabel}
                        size="sm"
                        color="accent"
                        weight="medium"

                    />
                ),
            ]}
        />
    ) : null

    const nameAndRole = (
        <StackV
            gap={1}
            principle="name-handle"

            items={[
                () => (
                    <Typography
                        text={persona.name}
                        weight="medium"

                    />
                ),
                () => (
                    <StackH
                        gap={3}
                        principle="identity"
                        align="center"

                        items={[
                            () => (
                                <Typography
                                    text={persona.role}
                                    size="sm"
                                    color="muted"

                                />
                            ),
                            () => speakingStatus,
                        ]}
                    />
                ),
            ]}
        />
    )

    const identity = (
        <StackH
            gap={3}
            principle="identity"
            align="center"

            items={[
                () => avatarWithPulse,
                () => nameAndRole,
            ]}
        />
    )

    const toggleButton = canToggleTts ? (
        <Button
            isIconOnly
            variant="ghost"
            prefixIcon={TtsIcon}
            ariaLabel={ttsAriaLabel}
            onPress={onToggleTts}

        />
    ) : null

    const headerRow = (
        <StackH
            gap={3}
            principle="flex-action"
            align="center"
            justify="between"

            items={[
                () => identity,
                () => toggleButton,
            ]}
        />
    )

    const typingDots = isAsking ? (
        <StackH
            gap={2}
            principle="separator-dot"
            align="center"

            items={[
                () => <span aria-hidden className="size-1.5 animate-bounce rounded-full bg-muted" />,
                () => <span aria-hidden className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />,
                () => <span aria-hidden className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />,
            ]}
        />
    ) : null

    const questionRegion = hasQuestion ? (
        <StackV
            gap={2}

            items={[
                () => (
                    <MarkdownContent
                        source={questionMarkdown as string}
                        measure="reading"


                    />
                ),
                () => typingDots,
            ]}
        />
    ) : null

    return (
        <div>
            <StackV
                gap={3}

                items={[
                    () => headerRow,
                    () => questionRegion,
                ]}
            />
        </div>
    )
}

export { InterviewerPresence }
