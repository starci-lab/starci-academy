"use client"

import React from "react"
import { Skeleton, cn } from "@heroui/react"
import { WithClassNames } from "@/modules/types"
import { Card } from "@heroui/react"

type ContentCardSkeletonProps = WithClassNames<undefined>

/**
 * Loading skeleton for one content card slot.
 * @param {ContentCardSkeletonProps} props Skeleton props.
 */
export const ContentCardSkeleton = ({ className }: ContentCardSkeletonProps) => {
    return (
        <Card className={cn(className)}>
            <Card.Content>
                <div>
                    <Skeleton className="h-4 my-1 w-2/3 rounded-full" />
                    <div className="h-2" />
                    <div className="flex flex-col">
                        <Skeleton className="h-[14px] my-[3px] w-full rounded-full" />
                        <Skeleton className="h-[14px] my-[3px] w-5/6 rounded-full" />
                    </div>
                </div>
            </Card.Content>
        </Card>
    )
}
