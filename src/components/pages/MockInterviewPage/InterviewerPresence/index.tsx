"use client"

import React from "react"
import { Typography, cn } from "@heroui/react"
import { SpeakerHighIcon, SpeakerSlashIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { StackH, StackV } from "@/components/frames/Stack"
import type { MockInterviewPersona } from "../interviewPersona"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link InterviewerPresence}. */
export interface InterviewerPresenceProps extends WithClassNames<undefined> {
    /** The interviewer identity (face photo + name). */
    persona: MockInterviewPersona
    /** Whether the interviewer is currently "speaking" (a question is streaming in). */
    speaking: boolean
    /** Label shown next to the speaking pulse (e.g. "speaking"). */
    speakingLabel: string
    /** Whether the browser supports text-to-speech (hides the toggle when false). */
    ttsSupported: boolean
    /** Whether the interviewer reads questions aloud. */
    ttsEnabled: boolean
    /** Toggle spoken output. */
    onToggleTts: () => void
    /** aria-label for the mute toggle (when currently on). */
    muteLabel: string
    /** aria-label for the unmute toggle (when currently off). */
    unmuteLabel: string
    /** The question body (streaming markdown / current question / pending hint). Omit for a header-only presence (design thread renders turns separately). */
    children?: React.ReactNode
}

/** Props for {@link PulseBar}. */
interface PulseBarProps {
    /** Animation delay in milliseconds. */
    delayMs: number
    /** Tailwind height class for the bar. */
    heightClass: string
}

/** One animated bar of the "speaking" pulse. */
const PulseBar = ({ delayMs, heightClass }: PulseBarProps) => (
    <span
        className={cn("w-[3px] animate-pulse rounded-full bg-accent", heightClass)}
        style={{ animationDelay: `${delayMs}ms` }}
        aria-hidden
    />
)

/**
 * The interviewer's PRESENCE in the room — a monogram avatar + name + role, a
 * "speaking" pulse while a question streams in, and a speaker toggle for
 * text-to-speech. Optionally wraps the question body (`children`) below a
 * divider, turning the old faceless gray question box into "someone is
 * interviewing you". Header-only (no children) for the design thread, where
 * turns render as a separate chat below.
 *
 * @param props - {@link InterviewerPresenceProps}
 */
export const InterviewerPresence = ({
    persona,
    speaking,
    speakingLabel,
    ttsSupported,
    ttsEnabled,
    onToggleTts,
    muteLabel,
    unmuteLabel,
    children,
    className,
}: InterviewerPresenceProps) => {
    return (
        <div className={className}>
            <SurfaceCard
                padding={5}
                body={() => (
                    <>
                        <StackH
                            gap={4}
                            principle="content-row"
                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                            justify="between"
                            classNames={["w-full"]}
                            items={[
                                () => (
                                    <StackH
                                        gap={4}
                                        classNames={["min-w-0", "flex-1"]}
                                        items={[
                                            () => (
                                                <img
                                                    src={persona.avatarSrc}
                                                    alt=""
                                                    className="size-10 shrink-0 rounded-full object-cover"
                                                    aria-hidden
                                                />
                                            ),
                                            () => (
                                                <StackV
                                                    gap={1}
                                                    principle="name-handle"
                                                    explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                                                    classNames={["min-w-0"]}
                                                    items={[
                                                        () => (
                                                            <StackH
                                                                gap={3}
                                                                principle="flex-action"
                                                                explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                                                                items={[
                                                                    () => (
                                                                        <Typography type="body-sm" weight="medium" className="truncate">
                                                                            {persona.name}
                                                                        </Typography>
                                                                    ),
                                                                    ...(speaking
                                                                        ? [() => (
                                                                            // Pulse + label at preserved 8px — no step-3 token fits icon-text (4px).
                                                                            <StackH
                                                                                gap={3}
                                                                                items={[
                                                                                    () => (
                                                                                        <span className="flex items-end gap-[2px]" aria-hidden>
                                                                                            <PulseBar delayMs={0} heightClass="h-2" />
                                                                                            <PulseBar delayMs={150} heightClass="h-3" />
                                                                                            <PulseBar delayMs={300} heightClass="h-1.5" />
                                                                                        </span>
                                                                                    ),
                                                                                    () => (
                                                                                        <Typography type="body-xs" className="text-accent-soft-foreground">
                                                                                            {speakingLabel}
                                                                                        </Typography>
                                                                                    ),
                                                                                ]}
                                                                            />
                                                                        )]
                                                                        : []),
                                                                ]}
                                                            />
                                                        ),
                                                        () => (
                                                            <Typography type="body-xs" color="muted" className="truncate">
                                                                {persona.role}
                                                            </Typography>
                                                        ),
                                                    ]}
                                                />
                                            ),
                                        ]}
                                    />
                                ),
                                ...(ttsSupported
                                    ? [() => (
                                        <button
                                            type="button"
                                            aria-label={ttsEnabled ? muteLabel : unmuteLabel}
                                            aria-pressed={ttsEnabled}
                                            onClick={onToggleTts}
                                            className={cn(
                                                "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
                                                ttsEnabled ? "text-accent-soft-foreground hover:bg-accent-soft" : "text-muted hover:bg-default hover:text-foreground",
                                            )}
                                        >
                                            {ttsEnabled ? (
                                                <SpeakerHighIcon className="size-5" aria-hidden focusable="false" />
                                            ) : (
                                                <SpeakerSlashIcon className="size-5" aria-hidden focusable="false" />
                                            )}
                                        </button>
                                    )]
                                    : []),
                            ]}
                        />
                        {children ? (
                            <div className="mt-3 border-t border-default pt-3">{children}</div>
                        ) : null}
                    </>
                )}
            />
        </div>
    )
}
