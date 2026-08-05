import React from "react"
import { AlertDialog } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { Spinner } from "@/components/atoms/display/Spinner"
import { StackH } from "@/components/frames/Stack"
import { resolveIdentity } from "@/components/frames/_identity"

/**
 * `MaintenanceModal` — the app-wide blocking dialog opened by the Apollo `ErrorLink`
 * when the backend keeps returning a 5xx status (persistent, not a one-off —
 * `RetryLink` already exhausted its retries before `ErrorLink` sees it). Uses HeroUI
 * `AlertDialog` directly rather than the `ModalShell` composite: this dialog's whole
 * point is that it cannot be dismissed — no close button, no backdrop-click, no
 * Escape — and no composite in the design system yet exposes a non-dismissable
 * variant (`ModalShell` always renders a dismissable backdrop + close trigger; see
 * this folder's `missingVocabulary` note in the conversion report). It clears
 * itself the moment a probe query succeeds; "Retry" re-probes immediately without
 * waiting for the next poll tick.
 *
 * Presentational: `isOpen`/`onOpenChange` (overlay-store wiring), `isChecking`
 * (a probe in flight), and `onRetry`. Every string arrives already translated via
 * `labels`. See `tiers/split.md` — the connected `index.tsx` owns the poll loop,
 * the probe fetch, and i18n.
 */

/** All display text, already localized by the connected `MaintenanceModal`. */
export interface MaintenanceModalLabels {
    /** Dialog heading. */
    title: string
    /** Dialog body copy. */
    description: string
    /** Status line beside the retry button, shown at rest and while a probe is in flight. */
    pollStatus: string
    /** Retry button label. */
    retry: string
}

/** Props for {@link _MaintenanceModal} — presentational; no fetch/store/i18n. */
export interface MaintenanceModalProps {
    /** Whether the dialog is currently open. */
    isOpen: boolean
    /**
     * Open-state change handler, forwarded to `AlertDialog`. The dialog itself
     * blocks backdrop-click and Escape (see the file header) — this only fires
     * from within the shell's own logic.
     */
    onOpenChange: (open: boolean) => void
    /** `true` while a manual or polled probe request is in flight. */
    isChecking: boolean
    /** Fired when the retry button is pressed. */
    onRetry: () => void
    /** Every string this dialog shows, already translated. */
    labels: MaintenanceModalLabels
}

/**
 * Renders the blocking maintenance dialog. See the file header for the full contract.
 *
 * @param props - {@link MaintenanceModalProps}
 */
export const _MaintenanceModal = ({
    isOpen,
    onOpenChange,
    isChecking,
    onRetry,
    labels,
}: MaintenanceModalProps) => (
    <AlertDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        {...resolveIdentity({ tier: "overlay", component: "MaintenanceModal" })}
    >
        <AlertDialog.Backdrop
            isDismissable={false}
            isKeyboardDismissDisabled
        >
            <AlertDialog.Container size="sm">
                <AlertDialog.Dialog>
                    <AlertDialog.Header>
                        <AlertDialog.Icon status="warning" />
                        <AlertDialog.Heading>
                            {labels.title}
                        </AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                        <Typography text={labels.description} />
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <StackH
                            gap={3}
                            align="center"
                            justify="between"
                            classNames={["w-full"]}
                            items={[
                                () => (
                                    <StackH
                                        gap={2}
                                        principles={["icon-text"]}
                                        align="center"
                                        items={[
                                            ...(isChecking ? [() => <Spinner tone="current" size="sm" />] : []),
                                            () => <Typography size="xs" color="muted" text={labels.pollStatus} />,
                                        ]}
                                    />
                                ),
                                () => (
                                    <Button
                                        variant="primary"
                                        isDisabled={isChecking}
                                        label={labels.retry}
                                        onPress={onRetry}
                                    />
                                ),
                            ]}
                        />
                    </AlertDialog.Footer>
                </AlertDialog.Dialog>
            </AlertDialog.Container>
        </AlertDialog.Backdrop>
    </AlertDialog>
)
