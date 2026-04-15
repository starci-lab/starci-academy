import { StarCiCard, StarCiCardBody, StarCiSkeleton } from "@/components/atomic"
import { Spacer } from "@/components/reuseable"
import React from "react"

/**
 * Skeleton placeholder for a single challenge card row.
 */
export const ChallengeCardSkeleton = () => {
    return (
        <StarCiCard>
            <StarCiCardBody>
                <div className="w-full flex flex-col">
                    <StarCiSkeleton className="h-4 my-1 w-[40%]" />
                    <Spacer y={3} />
                    <StarCiSkeleton className="h-[14px] my-[3px] w-[70%]" />
                    <StarCiSkeleton className="h-[14px] my-[3px] w-[60%]" />
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