"use client"

import React from "react"
import { Modal } from "@heroui/react"
import { SignInSection } from "./SignInSection"
import { SignUpSection } from "./SignUpSection"
import { AuthenticationModalTab } from "@/redux/slices/tabs"

/** Props for {@link _AuthenticationModal}. */
export interface AuthenticationModalProps {
    /** Whether the dialog is open. Forwarded to HeroUI `Modal`. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. Forwarded to HeroUI `Modal`. */
    onOpenChange: (open: boolean) => void
    /** Active tab — decides which step machine (`SignInSection` / `SignUpSection`) mounts. */
    tab: AuthenticationModalTab
}

/**
 * Sign-in / sign-up dialog shell.
 *
 * Presentational: renders whichever step machine `tab` selects inside the
 * dialog chrome. `SignInSection` / `SignUpSection` are themselves CONNECTED
 * blocks (own redux step + singleton Formik) composed here by reference —
 * OVERLAY-9: the surface is this file's, the entity (the auth flow) belongs
 * to the block inside it — the same way a presentational screen composes
 * connected blocks per `tiers/split.md`.
 *
 * `Modal` stays a direct HeroUI import here rather than `ModalShell`: both
 * sections are ALSO mounted bare on `/login` (`LoginPage`), so they carry
 * their own `Modal.CloseTrigger` + `Modal.Header` + `Modal.Body` chrome
 * (needed so that standalone host still looks like a dialog). `ModalShell`
 * renders that same chrome itself around its `body` slot, so hosting a
 * section through it would nest a second `Modal.Body` inside the first and
 * double the close trigger — a real visual regression, not a style
 * preference. See the migration report's `missingVocabulary` note: a
 * chrome-only modal frame (backdrop/container/dialog, no forced
 * header/body/close-trigger opinion) would let this call go through
 * `ModalShell` without touching the shared sections.
 *
 * @param props - {@link AuthenticationModalProps}
 */
export const _AuthenticationModal = ({ isOpen, onOpenChange, tab }: AuthenticationModalProps) => {
    const renderSection = () => {
        switch (tab) {
        case AuthenticationModalTab.SignIn:
            return <SignInSection />
        case AuthenticationModalTab.SignUp:
            return <SignUpSection />
        }
    }
    return (
        <div data-tier="overlay" data-component="AuthenticationModal">
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <Modal.Backdrop>
                    <Modal.Container size="xs">
                        <Modal.Dialog>
                            {renderSection()}
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </div>
    )
}
