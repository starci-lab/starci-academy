import React from "react"
import { WarningIcon } from "@phosphor-icons/react"
import {
    AlertDialogRoot,
    AlertDialogBackdrop,
    AlertDialogContainer,
    AlertDialogDialog,
    AlertDialogHeader,
    AlertDialogHeading,
    AlertDialogBody,
    AlertDialogFooter,
} from "@/components/atoms/feedback/AlertDialog"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { Spinner } from "@/components/atoms/display/Spinner"
import { StackH, StackV } from "@/components/frames/Stack"
import { Split } from "@/components/frames/Split"

/**
 * `MaintenanceModal` — the app-wide blocking dialog opened by the Apollo `ErrorLink`
 * when the backend keeps returning a 5xx status (persistent, not a one-off —
 * `RetryLink` already exhausted its retries before `ErrorLink` sees it). Uses the
 * house `AlertDialog*` atoms rather than the `ModalShell` composite: this dialog's
 * whole point is that it cannot be dismissed — no close button, no backdrop-click,
 * no Escape — and no composite in the design system yet exposes a non-dismissable
 * variant (`ModalShell` always renders a dismissable backdrop + close trigger).
 * It clears itself the moment a probe query succeeds; "Retry" re-probes immediately
 * without waiting for the next poll tick.
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
     * Open-state change handler, forwarded to `AlertDialogRoot`. The dialog itself
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
    <StackV
        principle="block-boundary"
        explain="Blocking maintenance dialog is the overlay's sole major seam — not group-boundary, because there is no mid-sized group of peers, and not sibling-stack, because the dialog is not a repeating row."
        identity={{ tier: "overlay", component: "MaintenanceModal" }}
        items={[
            () => (
                <AlertDialogRoot
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                >
                    <AlertDialogBackdrop
                        isDismissable={false}
                        isKeyboardDismissDisabled
                    >
                        <AlertDialogContainer size="sm">
                            <AlertDialogDialog>
                                <AlertDialogHeader>
                                    <WarningIcon
                                        aria-hidden
                                        focusable="false"
                                        weight="fill"
                                        className="size-5 shrink-0 text-warning"
                                    />
                                    <AlertDialogHeading>
                                        {labels.title}
                                    </AlertDialogHeading>
                                </AlertDialogHeader>
                                <AlertDialogBody>
                                    <Typography text={labels.description} />
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                    <Split
                                        gap={3}
                                        principle="flex-action-between"
                                        explain="Poll status on the left, retry CTA on the right — not sibling-stack, because the sides are asymmetric roles pushed apart."
                                        start={() => (
                                            <StackH
                                                gap={2}
                                                principle="icon-text"
                                                explain="Spinner beside its status label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                                                align="center"
                                                items={[
                                                    ...(isChecking ? [() => <Spinner tone="current" size="sm" />] : []),
                                                    () => <Typography size="xs" color="muted" text={labels.pollStatus} />,
                                                ]}
                                            />
                                        )}
                                        end={() => (
                                            <Button
                                                variant="primary"
                                                isDisabled={isChecking}
                                                label={labels.retry}
                                                onPress={onRetry}
                                            />
                                        )}
                                    />
                                </AlertDialogFooter>
                            </AlertDialogDialog>
                        </AlertDialogContainer>
                    </AlertDialogBackdrop>
                </AlertDialogRoot>
            ),
        ]}
    />
)
