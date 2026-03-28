"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import useMeasure from "react-use-measure"
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

    const [contentRef, bounds] = useMeasure()
    const [height, setHeight] = useState(0)

    useEffect(() => {
        if (bounds.height > 0) {
            setHeight(bounds.height)
        }
    }, [bounds.height, tab])

    return (
        <StarCiModal
            isOpen={isOpen}
            size="xs"
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
        >
            <StarCiModalContent>
                {/* ✅ chỉ animate height */}
                <motion.div
                    animate={{ height }}
                    initial={false}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                    }}
                    style={{ overflow: "hidden" }}
                >
                    <div ref={contentRef}>
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
                    </div>
                </motion.div>
            </StarCiModalContent>
        </StarCiModal>
    )
}