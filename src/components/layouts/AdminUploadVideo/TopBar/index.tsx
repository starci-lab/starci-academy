"use client"

import React, {
    useCallback,
} from "react"
import {
    Button,
} from "@heroui/react"
import {
    ArrowLeftIcon,
} from "@phosphor-icons/react"
import {
    useRouter,
} from "next/navigation"

/**
 * Top navigation bar holding the "Back to admin" button.
 *
 * Self-contained section (single-use): owns its own back-navigation handler via
 * the router, so the container renders `<TopBar />` with no props. "use client"
 * for the HeroUI interactive Button and the router.
 */
export const TopBar = () => {
    const router = useRouter()

    /** Navigate back to the admin page. */
    const onBack = useCallback(
        () => {
            router.push("../../admin")
        },
        [router],
    )

    return (
        <div className="flex items-center gap-3 pt-4">
            <Button
                id="admin-back-button"
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                onPress={onBack}
            >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
            </Button>
        </div>
    )
}
