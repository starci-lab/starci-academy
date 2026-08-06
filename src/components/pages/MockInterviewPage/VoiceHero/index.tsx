"use client"

import React, { useState } from "react"
import { TextArea, TextField, Typography, cn } from "@heroui/react"
import { MicrophoneIcon } from "@phosphor-icons/react"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** How the candidate answers — mirrors the session's `answerMode` (FE-only). */
export type VoiceHeroAnswerMode = "voice" | "text" | "both"

/** Resolved (i18n'd) labels for {@link VoiceHero}. */
export interface VoiceHeroLabels {
    /** Prompt under the idle mic ("Press to answer"). */
    pushToTalk: string
    /** Prompt while listening ("Listening…"). */
    listening: string
    /** Link to switch from voice to typing ("type instead"). */
    typeInstead: string
    /** Link to switch from typing back to voice ("use voice"). */
    useVoice: string
    /** TextArea placeholder. */
    placeholder: string
}

/** Props for {@link VoiceHero}. */
export interface VoiceHeroProps extends WithClassNames<undefined> {
    /** Whether speech-to-text is available (falls back to typing when false). */
    sttSupported: boolean
    /** Whether the mic is currently capturing. */
    listening: boolean
    /** In-flight (not-yet-final) transcribed words, shown muted after the draft. */
    interimTranscript: string
    /** The answer draft (voice + typing both land here — owned by the parent). */
    value: string
    /** Update the answer draft (typing). */
    onValueChange: (value: string) => void
    /** Start/stop the mic. */
    onToggleListen: () => void
    /** Which input affordances to show (from setup's "How to answer"). */
    answerMode: VoiceHeroAnswerMode
    /** Resolved labels. */
    labels: VoiceHeroLabels
}

/**
 * The VOICE-FIRST answer composer for the interview room — a big circular
 * push-to-talk mic as the hero (wired to the parent's speech-to-text), with the
 * live transcript building below it and a quiet "type instead" fallback to a text
 * box. Speaking is the signature act of an interview, so the mic leads; typing
 * is the secondary affordance (and the automatic one when the browser has no
 * speech recognition, or when setup picked text-only).
 *
 * @param props - {@link VoiceHeroProps}
 */
export const VoiceHero = ({
    sttSupported,
    listening,
    interimTranscript,
    value,
    onValueChange,
    onToggleListen,
    answerMode,
    labels,
    className,
}: VoiceHeroProps) => {
    // voice is the hero unless setup forced text-only or the browser can't do STT
    const textForced = answerMode === "text" || !sttSupported
    const canToggle = answerMode === "both" && sttSupported
    const [showText, setShowText] = useState(textForced)

    // typing box — used when forced (unsupported / text-only) or toggled to via "type instead"
    if (textForced || showText) {
        return (
            <div className={className}>
                <StackV
                    gap={3}
                    principle="sibling-stack"
                    classNames={["w-full"]}
                    items={[
                        () => (
                            <TextField variant="secondary" className="w-full">
                                <TextArea
                                    rows={4}
                                    value={value}
                                    onChange={(event) => onValueChange(event.target.value)}
                                    placeholder={labels.placeholder}
                                    className="resize-none"
                                    aria-label={labels.placeholder}
                                />
                            </TextField>
                        ),
                        ...(canToggle
                            ? [() => (
                                <button
                                    type="button"
                                    onClick={() => setShowText(false)}
                                    className="group w-fit cursor-pointer text-muted hover:text-foreground"
                                >
                                    {/* Icon+label at preserved 8px — icon-text is step 2 (4px). */}
                                    <StackH
                                        gap={3}
                                        items={[
                                            () => <MicrophoneIcon className="size-4" aria-hidden focusable="false" />,
                                            () => <span className="text-xs font-medium">{labels.useVoice}</span>,
                                        ]}
                                    />
                                </button>
                            )]
                            : []),
                    ]}
                />
            </div>
        )
    }

    // voice hero — big push-to-talk mic + live transcript
    return (
        <div className={cn(className)}>
            {/* Mic · prompt · transcript at preserved 12px — no vertical step-4 peer token. */}
            <StackV
                gap={4}
                classNames={["w-full"]}
                items={[
                    () => (
                        <div className="flex w-full flex-col items-center">
                            <button
                                type="button"
                                aria-label={listening ? labels.listening : labels.pushToTalk}
                                aria-pressed={listening}
                                onClick={onToggleListen}
                                className={cn(
                                    "flex size-20 cursor-pointer items-center justify-center rounded-full border-2 transition-colors",
                                    listening
                                        ? "animate-pulse border-danger bg-danger-soft text-danger-soft-foreground"
                                        : "border-accent bg-accent-soft text-accent-soft-foreground hover:bg-accent/15",
                                )}
                            >
                                <MicrophoneIcon className="size-9" aria-hidden focusable="false" />
                            </button>
                        </div>
                    ),
                    () => (
                        <Typography type="body-sm" color="muted" className={cn(listening && "text-danger-soft-foreground")} align="center">
                            {listening ? labels.listening : labels.pushToTalk}
                            {!listening && canToggle ? (
                                <>
                                    {" · "}
                                    <button
                                        type="button"
                                        onClick={() => setShowText(true)}
                                        className="cursor-pointer text-accent-soft-foreground hover:opacity-80"
                                    >
                                        {labels.typeInstead}
                                    </button>
                                </>
                            ) : null}
                        </Typography>
                    ),
                    ...(value || interimTranscript
                        ? [() => (
                            <Box principle="card-padding" className="w-full rounded-2xl bg-default/40 p-4">
                                <Typography className="text-foreground">
                                    {value} <span className="text-muted">{interimTranscript}</span>
                                </Typography>
                            </Box>
                        )]
                        : []),
                ]}
            />
        </div>
    )
}
