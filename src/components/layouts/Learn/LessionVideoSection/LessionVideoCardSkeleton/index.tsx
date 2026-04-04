import { StarCiCard, StarCiCardBody, StarCiSkeleton } from "@/components/atomic"
import { Spacer } from "@heroui/react"
import React from "react"

export const LessionVideoCardSkeleton = () => {
    return (
        <StarCiCard>
            <StarCiCardBody>
                <div className="grid grid-cols-3 gap-4">
                    <StarCiSkeleton className="aspect-video h-full object-cover rounded-md" />
                    <div className="flex flex-col col-span-2">
                        <StarCiSkeleton className="h-4 my-1 w-[40%]" />
                        <Spacer y={3} />
                        <StarCiSkeleton className="h-[14px] my-[3px] w-[70%]" />
                        <StarCiSkeleton className="h-[14px] my-[3px] w-[60%]" />
                        <Spacer y={3} />
                        <StarCiSkeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            </StarCiCardBody>
        </StarCiCard>
    )
}