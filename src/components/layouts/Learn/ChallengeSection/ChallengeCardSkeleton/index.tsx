"use client"

import { StarCiCard, StarCiCardBody, StarCiSkeleton } from "@/components/atomic"
import { Spacer } from "@heroui/react"
import React from "react"

/**
 * Skeleton placeholder for a single challenge card row.
 */
export const ChallengeCardSkeleton = () => {
    return (
        <StarCiCard>
            <StarCiCardBody>
                <div className="w-full flex flex-col">
                    <StarCiSkeleton className="h-4 w-[55%] my-1" />
                    <Spacer y={3} />
                    <StarCiSkeleton className="h-[14px] w-[90%] my-[3px]" />
                    <StarCiSkeleton className="h-[14px] w-[75%] my-[3px]" />
                    <Spacer y={3} />
                    <div className="flex flex-wrap gap-2">
                        <StarCiSkeleton className="h-6 w-20 rounded-full" />
                        <StarCiSkeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            </StarCiCardBody>
        </StarCiCard>
    )
}

