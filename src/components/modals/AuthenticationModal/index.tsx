"use client"

import React from "react"
import {
    StarCiModal,
    StarCiModalContent,
    StarCiModalHeader,
} from "../../atomic"
import { useAuthenticationDisclosure } from "@/hooks/singleton"
import { useAppSelector } from "@/redux"
import { AuthenticationModalTab } from "@/redux/slices"
import { SignInSection } from "./SignInSection"
import { SignUpSection } from "./SignUpSection"
import { useTranslations } from "next-intl"

export const AuthenticationModal = () => {
    const { isOpen, onOpenChange } = useAuthenticationDisclosure()
    const tab = useAppSelector((state) => state.tabs.tab)
    const isSignIn = tab === AuthenticationModalTab.SignIn
    const t = useTranslations()

    return (
        <StarCiModal
            isOpen={isOpen}
            size="xs"
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
        >
            <StarCiModalContent>
                {isSignIn ? (
                    <>
                        <StarCiModalHeader
                            title={t("auth.signIn.title")}
                            description={t("auth.signIn.desc")}
                        />
                        <SignInSection />
                    </>
                ) : (
                    <>
                        <StarCiModalHeader
                            title={t("auth.signUp.title")}
                            description={t("auth.signUp.desc")}
                        />
                        <SignUpSection />
                    </>
                )}
            </StarCiModalContent>
        </StarCiModal>
    )
}
