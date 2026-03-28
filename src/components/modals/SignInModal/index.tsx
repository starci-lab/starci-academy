"use client"
import React from "react"
import {
    StarCiModal,
    StarCiModalContent,
    StarCiModalHeader,
    StarCiModalBody,
    StarCiInput,
    StarCiDivider,
    StarCiButton
} from "../../atomic"
import { 
    useSignInDisclosure 
} from "@/hooks/singleton"
import { Spacer } from "@heroui/react"

export const SignInModal = () => {
    const { isOpen, onOpenChange } = useSignInDisclosure()
    return (
        <StarCiModal size="xs" isOpen={isOpen} onOpenChange={onOpenChange}>
            <StarCiModalContent>
                <StarCiModalHeader
                    title="Sign In"
                    description="Sign in to your account to continue"
                />
                <StarCiModalBody>
                    <StarCiInput isRequired type="email" label="Email" placeholder="Enter your email" />
                    <Spacer y={3} />
                    <StarCiInput isRequired type="password" label="Password" placeholder="Enter your password" />
                    <Spacer y={3} />
                    <StarCiDivider/>
                    <Spacer y={3} />
                    <StarCiButton color="primary" size="lg" className="w-full">Sign In</StarCiButton>
                </StarCiModalBody>
            </StarCiModalContent>
        </StarCiModal>
    )
}
