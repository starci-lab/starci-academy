"use client"

import React from "react"
import {
    StarCiDrawer,
    StarCiDrawerContent,
    StarCiDrawerHeader,
    StarCiDrawerBody,
} from "../../atomic"
import { useSubmissionAttemptsDisclosure } from "@/hooks/singleton"
import { Spacer } from "@heroui/react"
/**
 * LanguageModal is a modal component that is used to display the language selection.
 */
export const SubmissionAttemptsDrawer = () => {
    const { isOpen, onOpenChange } = useSubmissionAttemptsDisclosure()
    return (
        <StarCiDrawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <StarCiDrawerContent>
                <StarCiDrawerHeader
                    title="Submission Attempts"
                />
                <StarCiDrawerBody>
                    <div>
                        <div className="text-sm text-foreground-500">Submission Attempts</div>
                        <Spacer y={2} />
 
                    </div>
                    <Spacer y={3} />
                    <div>
                    </div>
                </StarCiDrawerBody>
            </StarCiDrawerContent>
        </StarCiDrawer>
    )
}