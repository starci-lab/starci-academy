"use client"

import React, { useEffect, useState } from "react"
import { Button, Modal, Typography, cn } from "@heroui/react"
import { ArrowSquareOutIcon, CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { StackH, StackV } from "@/components/frames/Stack"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link VoiceUnavailableModal}. */
export interface VoiceUnavailableModalProps extends WithClassNames<undefined> {
    /** Whether the modal is open. */
    isOpen: boolean
    /** Fired on any close (X, backdrop, or the explicit dismiss button) — the caller persists this as "seen" so the nudge doesn't reopen every session. */
    onOpenChange: (open: boolean) => void
    /** Re-read the browser's voice list (after guiding the user to install one) — see `useSpeechSynthesis.recheckVoices`. */
    onRecheck: () => void
    /** Whether a matching voice is NOW installed — re-checked live after `onRecheck`, auto-closes the modal when it flips true. */
    hasLocaleVoice: boolean
}

/**
 * A one-time nudge: the interviewer's TTS speaks Vietnamese, but the Web Speech
 * Synthesis API only pronounces it correctly if the OS/browser has an installed
 * Vietnamese voice — this is an OS-level resource the page CANNOT install for
 * the candidate (no browser API for that); the best the app can do is detect
 * the gap and walk them to their OS's voice-pack settings. Shown once per
 * interview when `locale==="vi"` + TTS enabled + no matching voice found (see
 * `MockInterviewSession`'s gating effect) — dismissing persists so it never
 * nags again, even if the candidate never installs the voice.
 */
export const VoiceUnavailableModal = ({
    isOpen,
    onOpenChange,
    onRecheck: recheckVoices,
    hasLocaleVoice,
    className,
}: VoiceUnavailableModalProps) => {
    const t = useTranslations()
    // tracks "the candidate just pressed Recheck" so the found/not-found
    // hint only shows AFTER an explicit recheck, never on first open
    const [justChecked, setJustChecked] = useState(false)

    // auto-close a beat after a recheck finds a matching voice — gives the
    // candidate a moment to see the success line before the modal disappears
    useEffect(() => {
        if (!justChecked || !hasLocaleVoice) {
            return
        }
        const timer = window.setTimeout(() => onOpenChange(false), 1200)
        return () => window.clearTimeout(timer)
    }, [justChecked, hasLocaleVoice, onOpenChange])

    const onRecheck = () => {
        setJustChecked(true)
        recheckVoices()
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container size="sm">
                    <Modal.Dialog className={cn(className)}>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Typography type="body" weight="semibold" className="pr-8">
                                {t("mockInterview.voiceUnavailable.title")}
                            </Typography>
                        </Modal.Header>
                        <Modal.Body>
                            <StackV
                                gap={6}
                                principle="block-boundary"
                                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                items={[
                                    () => (
                                        <StackV
                                            gap={4}
                                            items={[
                                                () => (
                                                    <Typography type="body-sm" color="muted">
                                                        {t("mockInterview.voiceUnavailable.description")}
                                                    </Typography>
                                                ),
                                                () => (
                                                    <ol className="border-t border-default pt-3">
                                                        <StackV
                                                            gap={3}
                                                            principle="sibling-stack"
                                                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                            as="div"
                                                            items={[
                                                                () => (
                                                                    <li>
                                                                        <StackH
                                                                            gap={3}
                                                                            items={[
                                                                                () => (
                                                                                    <Typography type="body-xs" weight="medium" color="muted" className="w-4 shrink-0">1.</Typography>
                                                                                ),
                                                                                () => (
                                                                                    <Typography type="body-sm">{t("mockInterview.voiceUnavailable.stepWindows1")}</Typography>
                                                                                ),
                                                                            ]}
                                                                        />
                                                                    </li>
                                                                ),
                                                                () => (
                                                                    <li>
                                                                        <StackH
                                                                            gap={3}
                                                                            items={[
                                                                                () => (
                                                                                    <Typography type="body-xs" weight="medium" color="muted" className="w-4 shrink-0">2.</Typography>
                                                                                ),
                                                                                () => (
                                                                                    <Typography type="body-sm">{t("mockInterview.voiceUnavailable.stepWindows2")}</Typography>
                                                                                ),
                                                                            ]}
                                                                        />
                                                                    </li>
                                                                ),
                                                                () => (
                                                                    <li>
                                                                        <StackH
                                                                            gap={3}
                                                                            items={[
                                                                                () => (
                                                                                    <Typography type="body-xs" weight="medium" color="muted" className="w-4 shrink-0">3.</Typography>
                                                                                ),
                                                                                () => (
                                                                                    <Typography type="body-sm">{t("mockInterview.voiceUnavailable.stepWindows3")}</Typography>
                                                                                ),
                                                                            ]}
                                                                        />
                                                                    </li>
                                                                ),
                                                            ]}
                                                        />
                                                    </ol>
                                                ),
                                                () => (
                                                    <Typography type="body-xs" color="muted">
                                                        {t("mockInterview.voiceUnavailable.macNote")}
                                                    </Typography>
                                                ),
                                            ]}
                                        />
                                    ),
                                    () => (
                                        <StackV
                                            gap={4}
                                            items={[
                                                () => (
                                                    <Button
                                                        variant="secondary"
                                                        className="w-full"
                                                        onPress={() => {
                                                            // Windows-only deep link into Settings → Speech; a no-op (harmless)
                                                            // on any other OS/browser — never navigates the app away.
                                                            window.location.href = "ms-settings:speech"
                                                        }}
                                                    >
                                                        {t("mockInterview.voiceUnavailable.openSettings")}
                                                        <ArrowSquareOutIcon className="size-4" aria-hidden focusable="false" />
                                                    </Button>
                                                ),
                                                () => (
                                                    <Button variant="primary" className="w-full" onPress={onRecheck}>
                                                        {t("mockInterview.voiceUnavailable.recheck")}
                                                    </Button>
                                                ),
                                                ...(justChecked
                                                    ? [() => (
                                                        hasLocaleVoice ? (
                                                            <StackH
                                                                gap={3}
                                                                items={[
                                                                    () => (
                                                                        <CheckCircleIcon className="size-4 shrink-0 text-success-soft-foreground" aria-hidden focusable="false" />
                                                                    ),
                                                                    () => (
                                                                        <Typography type="body-xs" className="text-success-soft-foreground">
                                                                            {t("mockInterview.voiceUnavailable.found")}
                                                                        </Typography>
                                                                    ),
                                                                ]}
                                                            />
                                                        ) : (
                                                            <StackH
                                                                gap={3}
                                                                items={[
                                                                    () => (
                                                                        <WarningCircleIcon className="size-4 shrink-0 text-muted" aria-hidden focusable="false" />
                                                                    ),
                                                                    () => (
                                                                        <Typography type="body-xs" color="muted">
                                                                            {t("mockInterview.voiceUnavailable.stillNotFound")}
                                                                        </Typography>
                                                                    ),
                                                                ]}
                                                            />
                                                        )
                                                    )]
                                                    : []),
                                            ]}
                                        />
                                    ),
                                    () => (
                                        <Button variant="tertiary" className="self-start" onPress={() => onOpenChange(false)}>
                                            {t("mockInterview.voiceUnavailable.dismiss")}
                                        </Button>
                                    ),
                                ]}
                            />
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
