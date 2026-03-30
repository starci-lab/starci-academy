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

export const AuthenticationModal = () => {
    const { isOpen, onOpenChange } = useAuthenticationDisclosure()
    const tab = useAppSelector((state) => state.tabs.tab)
    const isSignIn = tab === AuthenticationModalTab.SignIn

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
                            title="Sign In"
                            description="Sign in to your account to continue"
                        />
                        <SignInSection />
                    </>
                ) : (
                    <>
                        <StarCiModalHeader
                            title="Sign Up"
                            description="Create an account to continue"
                        />
                        <SignUpSection />
                    </>
                )}
            </StarCiModalContent>
        </StarCiModal>
    )
}
