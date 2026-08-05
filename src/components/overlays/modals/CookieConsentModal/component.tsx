import React, { useEffect, useState } from "react"
import { Button } from "@/components/atoms/buttons/Button"
import { ChoiceSwitch } from "@/components/atoms/forms"
import { StackV } from "@/components/frames/Stack"
import { ModalShell } from "@/components/composites/layout/ModalShell"

/**
 * All display text for {@link _CookieConsentModal}, already localized by the connected
 * `CookieConsentModal` — a story passes the bare i18n keys.
 */
export interface CookieConsentModalLabels {
    /** Dialog title. */
    modalTitle: string
    /** Explanatory copy under the title. */
    modalBody: string
    /** Necessary-cookies row label (always-on category). */
    necessaryLabel: string
    /** Necessary-cookies row hint. */
    necessaryHint: string
    /** Analytics-cookies row label (toggleable category). */
    analyticsLabel: string
    /** Analytics-cookies row hint. */
    analyticsHint: string
    /** Save (commit the draft toggle) button label. */
    save: string
    /** Reject-all button label. */
    reject: string
    /** Accept-all button label. */
    acceptAll: string
}

/** Props for {@link _CookieConsentModal} — presentational; all data resolved, no fetch/store/i18n. */
export interface CookieConsentModalProps {
    /** Whether the modal is currently open. Forwarded to {@link ModalShell}. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. Forwarded to {@link ModalShell}. */
    onOpenChange: (open: boolean) => void
    /** The visitor's currently COMMITTED analytics choice — seeds the draft toggle each time the modal opens. */
    analyticsAllowed: boolean
    /** Commits the draft analytics choice (Save was pressed). The caller also closes the modal. */
    onSave: (analyticsAllowed: boolean) => void
    /** Rejects every optional category (Reject was pressed). The caller also closes the modal. */
    onReject: () => void
    /** Accepts every category (Accept-all was pressed). The caller also closes the modal. */
    onAcceptAll: () => void
    /** All display text — see {@link CookieConsentModalLabels}. */
    labels: CookieConsentModalLabels
}

/**
 * Cookie preferences modal — the presentational half of `CookieConsentModal`: the granular
 * "Customize" panel — Necessary (locked on) + Analytics (toggle), via {@link ChoiceSwitch}'s
 * own label+hint composition — with Save / Reject / Accept-all in the dialog footer (a real
 * `ModalShell` footer slot, not a hand-rolled row inside the body). Composes `ModalShell` +
 * `ChoiceSwitch` + `Button`. Holds its OWN draft toggle, re-seeded from
 * {@link CookieConsentModalProps.analyticsAllowed} each time the modal opens — same shape
 * `SubmissionResultHistoryDrawer` uses to reset its own page on open. See `tiers/split.md`.
 *
 * @param props - {@link CookieConsentModalProps}
 */
export const _CookieConsentModal = ({
    isOpen,
    onOpenChange,
    analyticsAllowed,
    onSave,
    onReject,
    onAcceptAll,
    labels,
}: CookieConsentModalProps) => {
    // draft toggle — re-seed from the committed value whenever the modal opens
    const [analyticsDraft, setAnalyticsDraft] = useState(analyticsAllowed)
    useEffect(() => {
        if (isOpen) {
            setAnalyticsDraft(analyticsAllowed)
        }
    }, [isOpen, analyticsAllowed])

    const switchRows = [
        () => (
            <ChoiceSwitch
                isSelected
                isDisabled
                onValueChange={() => { /* locked on — always granted */ }}
                label={labels.necessaryLabel}
                hint={labels.necessaryHint}
            />
        ),
        () => (
            <ChoiceSwitch
                isSelected={analyticsDraft}
                onValueChange={setAnalyticsDraft}
                label={labels.analyticsLabel}
                hint={labels.analyticsHint}
            />
        ),
    ]

    return (
        <ModalShell
            identity={{ tier: "overlay", component: "CookieConsentModal" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={labels.modalTitle}
            description={labels.modalBody}
            body={() => <StackV gap={6} items={switchRows} />}
            footer={() => (
                <>
                    <Button
                        variant="primary"
                        size="sm"
                        label={labels.save}
                        onPress={() => onSave(analyticsDraft)}
                    />
                    <Button
                        variant="secondary"
                        size="sm"
                        label={labels.reject}
                        onPress={onReject}
                    />
                    <Button
                        variant="tertiary"
                        size="sm"
                        label={labels.acceptAll}
                        onPress={onAcceptAll}
                    />
                </>
            )}
        />
    )
}
