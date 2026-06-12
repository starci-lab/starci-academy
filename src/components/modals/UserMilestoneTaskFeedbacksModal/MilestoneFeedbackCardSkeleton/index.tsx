"use client"

import { Card, Skeleton } from "@heroui/react"
import React from "react"

/**
 * Skeleton placeholder for {@link MilestoneFeedbackCard} while feedback rows load.
 */
export const MilestoneFeedbackCardSkeleton = () => {
    return (
        <Card className="bg-background p-0">
            <Card.Content>
                <div className="p-3">
                    <div className="flex items-center justify-between gap-1.5">
                        <Skeleton className="h-[14px] flex-1 max-w-[70%] rounded-sm" />
                        <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
                    </div>
                    <div className="h-3" />
                    <Skeleton className="h-[14px] w-1/2 rounded-sm" />
                    <div className="h-3" />
                    <Skeleton className="h-[14px] w-full rounded-sm" />
                    <Skeleton className="mt-2 h-[14px] w-3/4 rounded-sm" />
                </div>
            </Card.Content>
        </Card>
    )
}
