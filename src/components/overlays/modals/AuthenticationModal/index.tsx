"use client"

import React, { useEffect } from "react"
import { _AuthenticationModal } from "./component"
import { useAuthenticationOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useAppDispatch } from "@/redux/hooks"
import { resetSignInState, resetSignUpState } from "@/redux/slices/state"

/**
 * Authentication modal — sign-in / sign-up dialog opened from anywhere in the
 * app. Mounted prop-less by `ModalContainer`.
 *
 * CONNECTED half: owns the overlay open-state (`useAuthenticationOverlayState`,
 * zustand), resets both step machines the moment the modal closes, and hands
 * the resolved shape to the presentational {@link _AuthenticationModal}. Tab
 * selection is owned by {@link AuthenticationPanel} (shared with LoginPage).
 * See `tiers/split.md`.
 */
export const AuthenticationModal = () => {
    const { isOpen, setOpen } = useAuthenticationOverlayState()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isOpen) {
            dispatch(resetSignInState())
            dispatch(resetSignUpState())
        }
    }, [dispatch, isOpen])

    return (
        <_AuthenticationModal
            isOpen={isOpen}
            onOpenChange={setOpen}
        />
    )
}
