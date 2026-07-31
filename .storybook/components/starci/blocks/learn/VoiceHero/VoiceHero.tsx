import { useState } from "react"
import { MicrophoneIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputTextarea } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `VoiceHero`: the voice-first answer composer. A big push-to-talk mic
 * with its live transcript is the HERO; a quiet typed textarea is the fallback
 * for browsers that cannot do speech-to-text, or for a lesson that only wants
 * typed answers.
 *
 * TWO LEAVES, NOT ONE LEAF WITH A CONTENT STATE (§14d.2). `MicHero` and
 * `TypedFallback` are different SHAPES — a circular button plus a transcript
 * line vs. a textarea plus a switch-back link — not the same nodes wearing
 * different data. Reusing one leaf and hiding half of it behind a boolean
 * would leave a dead `Button` node sitting in the DOM whenever text mode is
 * forced (no STT, or `answerMode="text"`), which is exactly the kind of
 * present-but-inert node BlockAnatomy exists to catch.
 *
 * WHICH LEAF RENDERS is computed, not asked of the caller:
 *   • no STT support, or `answerMode="text"` → `TypedFallback` is the ONLY
 *     shape offered — no "use voice" link back, because there is nothing to
 *     switch TO.
 *   • STT supported and `answerMode="voice"` → `MicHero` is the ONLY shape —
 *     no "type instead" link, because the caller deliberately asked for a
 *     voice-only answer and a silent escape hatch would undercut that.
 *   • STT supported and `answerMode="both"` → `MicHero` by default, with a
 *     switch link each way. WHICH of the two is on screen right now is
 *     EPHEMERAL UI STATE — which input method you're currently looking at is
 *     not domain data the caller needs to own or persist, the same call
 *     `InputPassword` already makes for its `reveal` toggle. It is
 *     deliberately NOT one of this block's props.
 *
 * THE TRANSCRIPT IS ONE LINE, NOT TWO. While listening, an interim (still
 * being recognized) transcript reads muted + italic to mark it provisional;
 * once it lands in `value` it reads as plain committed text. Splitting these
 * into two permanent DOM nodes would mean the committed line and the live
 * line fight for the same space instead of one settling into the other. A
 * silent mic with nothing recognized yet still needs SOME line, so it falls
 * back to the `listening` label rather than collapsing to empty space.
 *
 * MIC COLOR CARRIES THE STATE, NOT A DIFFERENT ICON. `danger` while listening
 * is the everyday "recording" signal (a red mic) — swapping to a stop-square
 * glyph on top of that would be a second signal for the same fact.
 *
 * NO `isSkeleton`, ON PURPOSE — same reasoning as `ContentModeNav`'s file
 * header: the given prop contract has none. A composer only ever mounts once
 * the caller already knows `sttSupported`, so there is no loading moment this
 * block itself needs to hide behind a shimmer.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
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
            <div data-anat-part={anatPart}>
                <StackV
                    gap="grouped"
                    anatPart={showAnatomy ? "StackV" : undefined}
                    body={
                        <>
                            <InputTextarea
                                value={value}
                                onValueChange={onValueChange}
                                placeholder={labels.placeholder}
                                ariaLabel={labels.placeholder}
                                rows={5}
                                showAnatomy={showAnatomy}
                            />
                            {canToggle ? (
                                <Typography
                                    size="sm"
                                    isLink
                                    text={labels.useVoice}
                                    onPress={() => setManualTyped(false)}
                                    anatPart={showAnatomy ? "Typography" : undefined}
                                />
                            ) : null}
                        </>
                    }
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
        <div data-anat-part={anatPart}>
            <StackV
                gap="grouped"
                align="center"
                anatPart={showAnatomy ? "StackV" : undefined}
                body={
                    <>
                        <Button
                            isIconOnly
                            size="lg"
                            variant={listening ? "danger" : "primary"}
                            prefixIcon={MicrophoneIcon}
                            ariaLabel={listening ? labels.listening : labels.pushToTalk}
                            onPress={onToggleListen}
                            anatPart={showAnatomy ? "Button" : undefined}
                        />
                        {/* src thật (`VoiceHero/index.tsx:136`): `<Typography
 color="default">`
                            KHÔNG khai `type` ⇒ mặc định base (16px), không phải `lg`. */}
                        <Typography
                            size="base"
                            align="center"
                            color={transcriptIsProvisional ? "muted" : "default"}
                            isItalic={transcriptIsProvisional}
                            text={transcriptText}
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                        {canToggle ? (
                            <Typography
                                size="sm"
                                isLink
                                text={labels.typeInstead}
                                onPress={() => setManualTyped(true)}
                                anatPart={showAnatomy ? "Typography" : undefined}
                            />
                        ) : null}
                    </>
                }
            />
        </div>
    )
}

export { VoiceHero }
