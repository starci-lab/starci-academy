"use client"

import React, { useEffect } from "react"
import { SignInSection } from "./SignInSection"
import { SignUpSection } from "./SignUpSection"
import { Modal } from "@heroui/react"
import { useAuthenticationOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { AuthenticationModalTab } from "@/redux/slices/tabs"
import { resetSignInState, resetSignUpState } from "@/redux/slices/state"

export const AuthenticationModal = () => {
    const { isOpen, setOpen } = useAuthenticationOverlayState()
    const dispatch = useAppDispatch()
    const authenticationModalTab = useAppSelector((state) => state.tabs.authenticationModalTab)

    useEffect(() => {
        if (!isOpen) {
            dispatch(resetSignInState())
            dispatch(resetSignUpState())
        }
    }, [dispatch, isOpen])
    const renderSection = () => {
        switch (authenticationModalTab) {
        case AuthenticationModalTab.SignIn:
            return <SignInSection />
        case AuthenticationModalTab.SignUp:
            return <SignUpSection />
        }
    }
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={setOpen}
        >
            <Modal.Backdrop>
                <Modal.Container size="xs">
                    <Modal.Dialog>
                        {renderSection()}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
