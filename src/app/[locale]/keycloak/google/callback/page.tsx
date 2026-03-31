"use client"

import React from "react"
import { Spacer } from "@heroui/react"
import { StarCiSpinner } from "@/components/atomic"
/**
 * OAuth redirect target after Google via Keycloak. Waits for adapter `init`, then sends the user home.
 */
const Page = () => {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
            <div
                className="flex flex-col items-center gap-1"
            >
                <StarCiSpinner 
                    size="lg" 
                    color="primary" 
                    variant="wave" 
                />
                <Spacer y={3} />
                <div
                    className="text-sm"
                >
                    Authentication successful. Redirecting...
                </div>
            </div>
        </div>
    )
}

export default Page