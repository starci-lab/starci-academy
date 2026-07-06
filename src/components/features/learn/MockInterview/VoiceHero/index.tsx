"use client"

import React, { useState } from "react"
import { TextArea, TextField, Typography, cn } from "@heroui/react"
import { MicrophoneIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** How the candidate answers — mirrors the session's `answerMode` (FE-only). */
export type VoiceHeroAnswerMode = "voice" | "text" | "both"

/** Resolved (i18n'd) labels for {@link VoiceHero}. */
export interface VoiceHeroLabels {
    /** Prompt under the idle mic ("Nhấn để trả lời"). */
    pushToTalk: string
    /** Prompt while listening ("Đang nghe…"). */
    listening: string
    /** Link to switch from voice to typing ("gõ thay"). */
    typeInstead: string
    /** Link to switch from typing back to voice ("dùng giọng"). */
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
    /** Which input affordances to show (from setup's "Cách trả lời"). */
    answerMode: VoiceHeroAnswerMode
    /** Resolved labels. */
    labels: VoiceHeroLabels
}

/**
 * The VOICE-FIRST answer composer for the interview room — a big circular
 * push-to-talk mic as the hero (wired to the parent's speech-to-text), with the
 * live transcript building below it and a quiet "gõ thay" fallback to a text
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

    // typing box — used when forced (unsupported / text-only) or toggled to via "gõ thay"
    if (textForced || showText) {
        return (
            <div className={cn("flex flex-col gap-2", className)}>
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
                {canToggle ? (
                    <button
                        type="button"
                        onClick={() => setShowText(false)}
                        className="group flex w-fit cursor-pointer items-center gap-1.5 text-muted hover:text-foreground"
                    >
                        <MicrophoneIcon className="size-4" aria-hidden focusable="false" />
                        <Typography type="body-xs" className="group-hover:underline">{labels.useVoice}</Typography>
                    </button>
                ) : null}
            </div>
        )
    }

    // voice hero — big push-to-talk mic + live transcript
    return (
        <div className={cn("flex flex-col items-center gap-3", className)}>
            <button
                type="button"
                aria-label={listening ? labels.listening : labels.pushToTalk}
                aria-pressed={listening}
                onClick={onToggleListen}
                className={cn(
                    "flex size-20 cursor-pointer items-center justify-center rounded-full border-2 transition-colors",
                    listening
                        ? "animate-pulse border-danger bg-danger/10 text-danger"
                        : "border-accent bg-accent/10 text-accent hover:bg-accent/15",
                )}
            >
                <MicrophoneIcon className="size-9" aria-hidden focusable="false" />
            </button>
            <Typography type="body-sm" color="muted" className={cn(listening && "text-danger")} align="center">
                {listening ? labels.listening : labels.pushToTalk}
                {!listening && canToggle ? (
                    <>
                        {" · "}
                        <button
                            type="button"
                            onClick={() => setShowText(true)}
                            className="cursor-pointer text-accent hover:underline"
                        >
                            {labels.typeInstead}
                        </button>
                    </>
                ) : null}
            </Typography>
            {value || interimTranscript ? (
                <div className="w-full rounded-2xl bg-default/40 p-4">
                    <Typography className="text-foreground">
                        {value} <span className="text-muted">{interimTranscript}</span>
                    </Typography>
                </div>
            ) : null}
        </div>
    )
}
