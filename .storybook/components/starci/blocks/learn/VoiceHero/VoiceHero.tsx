import { useState } from "react"
import { MicrophoneIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputTextarea } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `VoiceHero` — the voice-first answer composer: a big push-to-talk mic with its
 * live transcript as the hero, and a quiet typed textarea fallback for browsers
 * without speech-to-text (or text-only lessons). Two leaves by structure,
 * `MicHero` and `TypedFallback`. Which renders is computed from `sttSupported`
 * and `answerMode` (`voice`/`text`/`both`); in `both`, which input is on screen
 * is ephemeral UI state, not a prop. The transcript is one line — interim text
 * reads muted+italic, committed text plain. Mic colour (`danger` while
 * listening) carries the recording state. No `isSkeleton` (the composer mounts
 * once `sttSupported` is known).
 */

/** How the caller wants an answer collected. */
export type VoiceAnswerMode = "voice" | "text" | "both"

/** Wording for both leaves — the block carries no i18n of its own (§14d.1). */
export interface VoiceHeroLabels {
    /** Aria label for the mic button while NOT listening. */
    pushToTalk: string
    /** Aria label for the mic button, and its transcript-line hint, WHILE listening with nothing recognized yet. */
    listening: string
    /** Switch-away link shown in `MicHero` when both input methods are offered. */
    typeInstead: string
    /** Switch-back link shown in `TypedFallback` when both input methods are offered. */
    useVoice: string
    /** Placeholder of the typed field, and `MicHero`'s idle empty-transcript hint. */
    placeholder: string
}

/** Props for {@link VoiceHero}. */
export interface VoiceHeroProps {
    /** `false` → this browser/device cannot do speech-to-text; only `TypedFallback` is ever offered. */
    sttSupported: boolean
    /** `true` → the mic is actively recording. */
    listening: boolean
    /** Live, not-yet-committed transcript while `listening`. Empty once recognized speech lands in `value`. */
    interimTranscript: string
    /** The committed answer — final voice transcript, or whatever the learner typed. */
    value: string
    /** Fired as the typed field changes. Voice never calls this directly; recognized speech lands in `value` upstream. */
    onValueChange: (value: string) => void
    /** Fired when the mic button is pressed, toggling `listening`. */
    onToggleListen: () => void
    /** Which input method(s) this answer accepts. See the file header for how it decides a leaf. */
    answerMode: VoiceAnswerMode
    /** Wording for both leaves. */
    labels: VoiceHeroLabels
}

/**
 * The voice-first answer composer. See the file header for leaf selection and
 * the transcript/mic-color judgement calls.
 *
 * @param props - {@link VoiceHeroProps}
 */
const VoiceHero = ({
    sttSupported,
    listening,
    interimTranscript,
    value,
    onValueChange,
    onToggleListen,
    answerMode,
    labels,
}: VoiceHeroProps) => {
    // Ephemeral UI-only choice — see file header. Only reachable when BOTH leaves
    // are actually on offer, so there is nothing to reset when the caller's props change.
    const [manualTyped, setManualTyped] = useState(false)

    const forcedText = !sttSupported || answerMode === "text"
    const forcedVoice = sttSupported && answerMode === "voice"
    const canToggle = !forcedText && !forcedVoice
    const showTypedFallback = forcedText || (canToggle && manualTyped)

    if (showTypedFallback) {
        return (
            <div>
                <StackV
                    gap={4}

                    items={[
                        () => (
                            <InputTextarea
                                value={value}
                                onValueChange={onValueChange}
                                placeholder={labels.placeholder}
                                ariaLabel={labels.placeholder}
                                rows={5}

                            />
                        ),
                        ...(canToggle ? [() => (
                            <Typography
                                size="sm"
                                isLink
                                text={labels.useVoice}
                                onPress={() => setManualTyped(false)}

                            />
                        )] : []),
                    ]}
                />
            </div>
        )
    }

    // Provisional whenever there is nothing FINAL to show yet: an interim fragment
    // still being recognized, or (while listening) no speech landed in `value` at all.
    const transcriptIsProvisional = listening && (interimTranscript.length > 0 || value.length === 0)
    const transcriptText = listening && interimTranscript
        ? interimTranscript
        : value || (listening ? labels.listening : labels.placeholder)

    return (
        <div>
            <StackV
                gap={4}
                align="center"

                items={[
                    () => (
                        <Button
                            isIconOnly
                            size="lg"
                            variant={listening ? "danger" : "primary"}
                            prefixIcon={MicrophoneIcon}
                            ariaLabel={listening ? labels.listening : labels.pushToTalk}
                            onPress={onToggleListen}

                        />
                    ),
                    // real `src` (`VoiceHero/index.tsx:136`): `<Typography color="default">`
                    // declares NO `type` ⇒ defaults to base (16px), not `lg`.
                    () => (
                        <Typography
                            size="base"
                            align="center"
                            color={transcriptIsProvisional ? "muted" : "default"}
                            isItalic={transcriptIsProvisional}
                            text={transcriptText}

                        />
                    ),
                    ...(canToggle ? [() => (
                        <Typography
                            size="sm"
                            isLink
                            text={labels.typeInstead}
                            onPress={() => setManualTyped(true)}

                        />
                    )] : []),
                ]}
            />
        </div>
    )
}

export { VoiceHero }
