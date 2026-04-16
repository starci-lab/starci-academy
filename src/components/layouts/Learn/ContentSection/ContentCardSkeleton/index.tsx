import { Card, Skeleton } from "@heroui/react"
import React from "react"

export const ContentCardSkeleton = () => {
    return (
        <Card>
            <Card.Content>
                <div className="w-full flex flex-col gap-3">
                    <Skeleton className="h-4 my-1 w-[40%]" />
                    <Skeleton className="h-[14px] my-[3px] w-[70%]" />
                    <Skeleton className="h-[14px] my-[3px] w-[60%]" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </Card.Content>
        </Card>
    )
}
