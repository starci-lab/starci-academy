"use client"

import React, { useEffect } from "react"
import { _AuthenticationModal } from "./component"
import { useAuthenticationOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { resetSignInState, resetSignUpState } from "@/redux/slices/state"

/**
 * Authentication modal — sign-in / sign-up dialog opened from anywhere in the
 * app. Mounted prop-less by `ModalContainer`.
 *
 * CONNECTED half: owns the overlay open-state (`useAuthenticationOverlayState`,
 * zustand) and the active tab (redux `tabs.authenticationModalTab`), resets
 * both step machines the moment the modal closes, and hands the resolved
 * shape to the presentational {@link _AuthenticationModal}. See
 * `tiers/split.md`.
 */
export const AuthenticationModal = () => {
    const { isOpen, setOpen } = useAuthenticationOverlayState()
    const dispatch = useAppDispatch()
    const tab = useAppSelector((state) => state.tabs.authenticationModalTab)

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
            tab={tab}
        />
    )
}
