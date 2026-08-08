"use client"

import React from "react"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { AuthenticationPanel } from "@/components/blocks/auth/AuthenticationPanel"

/** Props for {@link _AuthenticationModal}. */
export interface AuthenticationModalProps {
    /** Whether the dialog is open. Forwarded to {@link ModalShell}. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. Forwarded to {@link ModalShell}. */
    onOpenChange: (open: boolean) => void
}

/**
 * Sign-in / sign-up dialog shell.
 *
 * Presentational: existing {@link ModalShell} owns chrome (backdrop, container,
 * dialog, close trigger, body region). Auth content lives in
 * {@link AuthenticationPanel} — the same body {@link LoginPage} mounts inside
 * its page-owned card. No chrome-only ModalShell variant; no duplicate
 * CloseTrigger / Header / Body inside the panel.
 *
 * @param props - {@link AuthenticationModalProps}
 */
export const _AuthenticationModal = ({ isOpen, onOpenChange }: AuthenticationModalProps) => (
    <ModalShell
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xs"
        body={AuthenticationPanel}
        identity={{ tier: "overlay", component: "AuthenticationModal" }}
    />
)
