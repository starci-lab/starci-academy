"use client"

import React from "react"
import { useAuthenticationOverlayState } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { AuthenticationModalTab } from "@/redux/slices"
import { SignInSection } from "./SignInSection"
import { SignUpSection } from "./SignUpSection"
import { useTranslations } from "next-intl"
import { Modal } from "@heroui/react"

export const AuthenticationModal = () => {
    const { isOpen, onOpenChange } = useAuthenticationOverlayState()
    const authenticationModalTab = useAppSelector((state) => state.tabs.authenticationModalTab)
    const isSignIn = authenticationModalTab === AuthenticationModalTab.SignIn
    const t = useTranslations()
    const heading = isSignIn ? t("auth.signIn.title") : t("auth.signUp.title")
    const description = isSignIn ? t("auth.signIn.desc") : t("auth.signUp.desc")

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <Modal.Backdrop>
                <Modal.Container size="xs">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <div className="text-center">
                                <div className="font-semibold text-lg">{heading}</div>
                                <div className="text-xs text-muted">{description}</div>
                            </div>
                        </Modal.Header>
                        {isSignIn ? <SignInSection className="w-full" /> : <SignUpSection className="w-full" />}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
