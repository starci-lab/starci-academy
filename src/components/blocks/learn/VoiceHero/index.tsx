import { InputTextarea } from "@/components/atoms/forms"
import { useState } from "react"
import { MicrophoneIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"

import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"

/**
 * `VoiceHero` — the voice-first answer composer. A large push-to-talk mic with
 * its live transcript is the hero; a quiet typed textarea is the fallback for
 * browsers without speech-to-text, or lessons that only want typed answers.
 * Two structural leaves — `MicHero` (circular button + transcript) and
 * `TypedFallback` (textarea + switch-back link) — chosen from `sttSupported`
 * and `answerMode`, plus an ephemeral toggle reachable only when both input
 * methods are offered (`answerMode="both"` with STT supported). The
 * "type instead" / "use voice" link is a state inside each leaf, tracking the
 * `canToggle` boolean. No `isSkeleton` — nothing to mirror.
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
            <StackV
                identity={{ tier: "block", component: "VoiceHero" }}
                principle="sibling-stack"
                explain="Typed field and switch-back link are same-kind peers in the fallback column — not group-boundary, because they are repeating vertical siblings rather than nested groups."
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
        )
    }

    // Provisional whenever there is nothing FINAL to show yet: an interim fragment
    // still being recognized, or (while listening) no speech landed in `value` at all.
    const transcriptIsProvisional = listening && (interimTranscript.length > 0 || value.length === 0)
    const transcriptText = listening && interimTranscript
        ? interimTranscript
        : value || (listening ? labels.listening : labels.placeholder)

    return (
        <StackV
            identity={{ tier: "block", component: "VoiceHero" }}
            principle="card-caption"
            explain="Holds caption text under card media so the caption stays attached to the image above it."
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
    )
}

export { VoiceHero }
